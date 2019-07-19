import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { DeckRetrievalService, DeckData } from '../../shared/deck-retrieval.service';
import { CurrentTournamentsService, tournament } from '../services/current-tournaments.service';
import { DatabaseService } from 'src/app/shared/database.service';
import { RxwebValidators } from '@rxweb/reactive-form-validators';

@Component({
  selector: 'app-create-tournament',
  templateUrl: './create-tournament.component.html',
  styleUrls: ['./create-tournament.component.css']
})
export class CreateTournamentComponent implements OnInit, OnDestroy {

  currentTournSub:Subscription;
  createForm:FormGroup;
  isloading:boolean;
  tournamentNames:string[] = [];

  constructor(
    private deckService:DeckRetrievalService,
    private route:Router,
    private currentTournsService:CurrentTournamentsService,
    private db:DatabaseService
    ){}

  ngOnInit(){
    this.currentTournSub = this.currentTournsService.currentTournChanged
    .subscribe((tourns:tournament[])=>{
      let tournNames = [];
      for(let i=0; i<tourns.length;i++){
        tournNames.push(tourns[i].name)
      }
      this.tournamentNames = tournNames;
    });

    this.createForm = new FormGroup({
      "tournamentName":new FormControl(null,[Validators.required, this.validateTournamentName.bind(this)]),
      "tournamentType": new FormControl("swiss",Validators.required),
      "chains": new FormControl("no",Validators.required),
      "decks": new FormArray([
        new FormGroup({
          "name": new FormControl(null,[Validators.required,RxwebValidators.unique()]),
          "deck": new FormControl("https://www.keyforgegame.com/deck-details/18374c28-ad98-4d1f-9a61-938fdeed0d4c",[Validators.required,this.validateDeckUrl])
        }),
        new FormGroup({
          "name": new FormControl(null,[Validators.required,RxwebValidators.unique()]),
          "deck": new FormControl("https://www.keyforgegame.com/deck-details/289a7505-141b-4ab9-9963-4dd83c657126",[Validators.required,this.validateDeckUrl])
        }),
        new FormGroup({
          "name": new FormControl(null,[Validators.required,RxwebValidators.unique()]),
          "deck": new FormControl("https://www.keyforgegame.com/deck-details/b2d1936e-7b6a-48db-a9f0-cd951e7ba79f",[Validators.required,this.validateDeckUrl])
        }),
        new FormGroup({
          "name": new FormControl(null,[Validators.required,RxwebValidators.unique()]),
          "deck": new FormControl("https://www.keyforgegame.com/deck-details/a27134ae-523f-4954-ab1b-675b4ed72709",[Validators.required,this.validateDeckUrl])
        })
      ])
    })
  }

  onAddDeck(){
    const control = new FormGroup({
      "name": new FormControl(null,[Validators.required,RxwebValidators.unique()]),
      "deck": new FormControl("https://www.keyforgegame.com/deck-details/a27134ae-523f-4954-ab1b-675b4ed72709",[Validators.required,this.validateDeckUrl])
    });
    (<FormArray>this.createForm.get("decks")).push(control);
  }

  onDeleteDeck(index:number){
    (<FormArray>this.createForm.get('decks')).removeAt(index);
  }

  validateDeckUrl(control:FormControl):{[s:string]:boolean}{
    if(control.value !== null){
      if(control.value.length != 78 || control.value.search('keyforgegame.com')===-1 || control.value.search('deck-details')===-1){
        return {'Invalid URL':true}
      }
    }
    return null;
  }

  validateTournamentName(control:FormControl):{[s:string]:boolean}{
    if(this.tournamentNames.indexOf(control.value)>=0){
      return {'Tournament Name In Use!':true}
    }
    return null;
  }
  
  onSubmit(){
    const formArray = this.createForm.get('decks').value
    const getArray = [];
    for(let i=0; i<formArray.length;i++){
      getArray.push(formArray[i].deck)
    }
    console.log(formArray)

    this.isloading = true;
    this.deckService.getTournamentDecks(getArray)
    .subscribe((decksData:DeckData[])=>{
      let decks = [];
      for(let i=0; i<decksData.length;i++){
        if(this.createForm.get("chains").value === "no"){
          decks.push({
            player:formArray[i].name,
            deckName:decksData[i].data.name
          })
        } else if(this.createForm.get("chains").value === "official") {
          decks.push({
            player:formArray[i].name,
            deckName:decksData[i].data.name,
            chains:decksData[i].data.chains
          })
        } else {
          decks.push({
            player:formArray[i].name,
            deckName:decksData[i].data.name
          })
        }
      }

      console.log(this.createForm.get("tournamentName").value)
      console.log(this.createForm.get("tournamentType").value)
      console.log(decks)

      this.currentTournsService.newTournament(this.createForm.get("tournamentName").value,this.createForm.get("tournamentType").value,decks)
      this.isloading = false;
      console.log(this.currentTournsService.getTournaments())
      this.db.saveCurrentTournaments();
      this.route.navigate(["/tournaments",this.currentTournsService.currentTournaments.length-1])
    })
  }

  ngOnDestroy(){
    this.currentTournSub.unsubscribe();
  }

}
