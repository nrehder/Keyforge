import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DatabaseService } from 'src/app/shared/database.service';

export interface tournament {
  name:string,
  type:string,
  curRound:number,
  maxRounds:number,
  [roundNumber:number]:{
    standings:string[],
    players:{
      [name:string]:{
        playername:string,
        deckname:string,
        wins:number,
        losses:number,
        byes:number,
        games:number,
        opponents:string[],
        chains?:number,
        SoS?:number,
        ESoS?:number,
        eliminated?:boolean
      }
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class CurrentTournamentsService {

  //stores all current tournaments and functionality to load/save/update

  currentTournChanged = new Subject<tournament[]>();
  currentTournaments:tournament[];
  isLoaded = false;

  constructor() { }

  setTournaments(tourns:tournament[]){
    this.currentTournaments = tourns;
    this.isLoaded = true;
    this.currentTournChanged.next(this.currentTournaments)
  }

  getTournaments(){
    return this.currentTournaments;
  }
  
  newTournament(name:string,type:string,decks:{player:string,deckName:string,chains?:number}[]){

    let newTourn:tournament = {
      name:name,
      type:type,
      curRound:1,
      maxRounds:Math.ceil(Math.log2(decks.length)),
      1:{
        players:{},
        standings:[]
      }
    };

    //creates all player stats and places player names into standings array
    for(let i=0;i<decks.length;i++){
      newTourn[1].players[decks[i].player] = {
        playername:decks[i].player,
        deckname:decks[i].deckName,
        wins:0,
        losses:0,
        byes:0,
        games:0,
        opponents:[]
      }
      newTourn[1].standings.push(decks[i].player)

      if(typeof decks[i].chains === "number"){
        newTourn[1].players[decks[i].player].chains = decks[i].chains;
      }

      if(newTourn.type === "swiss"){
        newTourn[1].players[decks[i].player].SoS=0;
        newTourn[1].players[decks[i].player].ESoS=0;
      } else if(newTourn.type === "singleElim") {
        newTourn[1].players[decks[i].player].eliminated = false;
      }
    }

    //randomizes initial standings to give random pairings round 1
    for (let i=0; i<decks.length;i++){
      let rand = Math.floor(Math.random()*decks.length);
      let temp = newTourn[1].standings[i];
      newTourn[1].standings[i]=newTourn[1].standings[rand];
      newTourn[1].standings[rand]=temp;
    }

    //adds the new tournament to the list and updates the list
    this.currentTournaments.push(newTourn);
    this.currentTournChanged.next(this.currentTournaments);
  }
}
