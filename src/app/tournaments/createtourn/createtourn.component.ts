import { Component } from '@angular/core';
import { FormGroup, Validators, FormArray, FormControl } from '@angular/forms';

import { DecksService, DeckData } from '../../shared/decks.service';
import { SwissService } from '../swisstourn.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-createtourn',
  templateUrl: './createtourn.component.html',
  styleUrls: ['./createtourn.component.css']
})
export class CreatetournComponent {

  createForm:FormGroup;
  isloading:boolean;

  constructor(
    private deckService:DecksService,
    private swiss:SwissService,
    private route:Router
    ){}

  ngOnInit(){
    this.createForm = new FormGroup({
      "tournamentName":new FormControl(null,Validators.required),
      "tournamentType": new FormControl("swiss",Validators.required),
      "chains": new FormControl("no",Validators.required),
      "decks": new FormArray([
        new FormControl("https://www.keyforgegame.com/deck-details/18374c28-ad98-4d1f-9a61-938fdeed0d4c",[Validators.required,this.validateDeckUrl]),
        new FormControl("https://www.keyforgegame.com/deck-details/facb832f-e76d-4295-bc78-d59d7e5886bc",[Validators.required,this.validateDeckUrl]),
        new FormControl("https://www.keyforgegame.com/deck-details/4556dbec-3af7-4da2-8dea-53c56e28dfda",[Validators.required,this.validateDeckUrl]),
        new FormControl("https://www.keyforgegame.com/deck-details/04c802a6-0428-44d1-81a6-e0bb9a0ea76d",[Validators.required,this.validateDeckUrl])
      ])
    })
  }

  onAddDeck(){
    const control = new FormControl(null,[Validators.required,this.validateDeckUrl]);
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
  
  onSubmit(){
    const decks = [];
    const formArray = this.createForm.get('decks').value

    this.isloading = true;
    this.deckService.getTournamentDecks(formArray)
    .subscribe((decksData:DeckData[])=>{
      let decks = [];
      for(let i=0; i<decksData.length;i++){
        if(this.createForm.get("chains").value === "no"){
          decks.push({
            name:decksData[i].data.name
          })
        } else if(this.createForm.get("chains").value === "official") {
          decks.push({
            name:decksData[i].data.name,
            chains:decksData[i].data.chains
          })
        } else {
          decks.push({
            name:decksData[i].data.name
          })
        }
      }
      this.swiss.createSwiss(this.createForm.get("tournamentName").value,decks)

      
      this.isloading = false;
      this.route.navigate(["/tournaments","manage"])
    })
  }

}
