import { Component, OnInit } from '@angular/core';
import { SwissStyleService } from '../../services/swiss-style.service';

@Component({
  selector: 'app-run-current-tournament',
  templateUrl: './run-current-tournament.component.html',
  styleUrls: ['./run-current-tournament.component.css']
})
export class RunCurrentTournamentComponent implements OnInit {

  tournName:string;
  round:number;
  //:{deck1:string,deck2:string,winner?:string}[]
  pairings:{
    deck1:{name:string,winner:boolean},
    deck2:{name:string,winner:boolean}
  }[]=[];

  constructor(private swiss:SwissStyleService) { }

  ngOnInit() {
    this.tournName = this.swiss.tournament.name;
    this.round = this.swiss.round;
    let tempPairings = this.swiss.getPairings();
    for(let i=0;i<tempPairings.length;i++){
      this.pairings.push({
        deck1:{
          name:tempPairings[i].deck1,
          winner:false
        },
        deck2:{
          name:tempPairings[i].deck2,
          winner:false
        }
      })
    }
  }

  updateData(){
    let results = [
      {
        name:"a",
        opponent:"b",
        result:"won"
      }
    ]
    this.swiss.updateStandings(results)
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

}
