import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DecksService } from '../../shared/decks.service';

@Component({
  selector: 'app-createtourn',
  templateUrl: './createtourn.component.html',
  styleUrls: ['./createtourn.component.css']
})
export class CreatetournComponent {

  constructor(private http:HttpClient,private deckService:DecksService){}
  onSubmit(form:NgForm){
    let deck:string = form.form.value.Deck;
    console.log(deck)
    if( deck.search('keyforgegame.com')===-1 || deck.search('deck-details')===-1 ){
      console.log('please enter the whole url')
    } else {
      let key = deck.substr(deck.search('deck-details')+13,36);
      console.log(deck.substr(deck.search('deck-details')+13,36));
      
      this.deckService.getDeckName(key)
      .subscribe(resData=>{
        console.log(resData)
      })
    }
    form.reset();
  }

}
