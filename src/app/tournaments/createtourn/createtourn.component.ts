import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DecksService } from '../../shared/decks.service';

@Component({
  selector: 'app-createtourn',
  templateUrl: './createtourn.component.html',
  styleUrls: ['./createtourn.component.css']
})
export class CreatetournComponent {

  createForm:FormGroup;

  constructor(private http:HttpClient,private deckService:DecksService){}

  ngOnInit(){
    this.createForm = new FormGroup({
      "tournamentName":new FormControl(null,Validators.required),
      "tournamentType": new FormControl("swiss",Validators.required),
      "decks": new FormArray([
        new FormControl(null,[Validators.required,this.validateDeckUrl]),
        new FormControl(null,[Validators.required,this.validateDeckUrl]),
        new FormControl(null,[Validators.required,this.validateDeckUrl]),
        new FormControl(null,[Validators.required,this.validateDeckUrl])
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
    console.log(this.createForm)
    // let deck:string = form.form.value.Deck;
    // console.log(deck)
    // if( deck.search('keyforgegame.com')===-1 || deck.search('deck-details')===-1 ){
    //   console.log('please enter the whole url')
    // } else {
    //   let key = deck.substr(deck.search('deck-details')+13,36);
    //   console.log(deck.substr(deck.search('deck-details')+13,36));
      
    //   this.deckService.getDeckName(key)
    //   .subscribe(resData=>{
    //     console.log(resData)
    //   })
    // }
  }

}
