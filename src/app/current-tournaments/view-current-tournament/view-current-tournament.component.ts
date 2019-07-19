import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { CurrentTournamentsService, tournament, player, players } from '../services/current-tournaments.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-current-tournament',
  templateUrl: './view-current-tournament.component.html',
  styleUrls: ['./view-current-tournament.component.css']
})
export class ViewCurrentTournamentComponent implements OnInit, OnDestroy {

  tournId:number;
  tournName:string;
  round:number;
  maxRound:number;
  tournSub:Subscription;
  tournType:string;
  players:player[] = [];
  constructor(private route:ActivatedRoute, private curTournService:CurrentTournamentsService) { }

  ngOnInit() {
    this.route.params.subscribe((params:Params)=>{
      this.tournId = +params['id'];
    })

    if(this.curTournService.currentTournaments){
      this.assignVariables(this.curTournService.currentTournaments[this.tournId]);
    } else {
      this.tournSub = this.curTournService.currentTournChanged
      .subscribe((tourns:tournament[])=>{
        this.assignVariables(tourns[this.tournId]);
      })
    }

  }

  assignVariables(tourn:tournament){
    this.tournName = tourn.name;
    this.round = tourn.curRound;
    this.maxRound = tourn.maxRounds;
    this.tournType = tourn.type;

    let playerObject:players = tourn[this.round].players;
    for(let player in playerObject){
      if(playerObject.hasOwnProperty(player)){
        this.players.push(playerObject.player)
      }
    }
  }

  ngOnDestroy(){
    if(this.tournSub){
      this.tournSub.unsubscribe();
    }
  }

}
