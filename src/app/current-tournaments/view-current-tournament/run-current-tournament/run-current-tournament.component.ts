import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { SwissStyleService } from '../../services/swiss-style.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-run-current-tournament',
  templateUrl: './run-current-tournament.component.html',
  styleUrls: ['./run-current-tournament.component.css']
})
export class RunCurrentTournamentComponent implements OnInit, OnDestroy {

  tournSub:Subscription;
  tournType:string;
  tournId:number;
  tournName:string;
  round:number;
  pairings:{
    deck1:{name:string,winner:boolean},
    deck2:{name:string,winner:boolean}
  }[]=[];

  constructor(private swiss:SwissStyleService, private route:ActivatedRoute) { }

  ngOnInit() {

    this.route.params.subscribe((params:Params)=>{
      this.tournId = +params['id'];
    })

    // if(this.curTournService.currentTournaments){
    //   this.tournName = this.curTournService.currentTournaments[this.tournId].name;
    //   this.round = this.curTournService.currentTournaments[this.tournId].curRound;
    //   this.tournType = this.curTournService.currentTournaments[this.tournId].type;
    // } else{
    //   this.tournSub = this.curTournService.currentTournChanged
    //   .subscribe((tourns:tournament[])=>{
    //     console.log(tourns[this.tournId])
    //     this.tournName = tourns[this.tournId].name;
    //     this.round = tourns[this.tournId].curRound;
    //     this.tournType = tourns[this.tournId].type;
    //   })
    // }
    

    // let tempPairings = this.swiss.getPairings();
    // for(let i=0;i<tempPairings.length;i++){
    //   this.pairings.push({
    //     deck1:{
    //       name:tempPairings[i].deck1,
    //       winner:false
    //     },
    //     deck2:{
    //       name:tempPairings[i].deck2,
    //       winner:false
    //     }
    //   })
    // }
  }

  updateData(){
    let results = [
      {
        name:"a",
        opponent:"b",
        result:"won"
      }
    ]
    // this.swiss.updateStandings(results)
  }

  onClickPlayer(index:number,winner:string){
    if(this.pairings[index].deck1.name===winner){
      this.pairings[index].deck1.winner = true;
      this.pairings[index].deck2.winner = false;
    } else {
      this.pairings[index].deck2.winner = true;
      this.pairings[index].deck1.winner = false;
    }
  }

  onSave(){

  }

  onFinish(){

  }

  ngOnDestroy(){
    if(this.tournSub){
      this.tournSub.unsubscribe();
    }
  }

}
