import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface tournament {
  name:string,
  type:string,
  [round:number]:{
    standings:string[],
    players:{
      [name:string]:{
        playername:string,
        deckname:string,
        wins:number,
        losses:number,
        buys:number,
        games:number,
        opponents:string[],
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
  
}
