import { Component, OnInit } from '@angular/core';
import { SwissService } from '../swisstourn.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-managetourn',
  templateUrl: './managetourn.component.html',
  styleUrls: ['./managetourn.component.css']
})
export class ManagetournComponent implements OnInit {

  tournName:string="default";
  round:number=1;
  //:{deck1:string,deck2:string,winner?:string}[]
  pairings = [
    {deck1:{name:'test1',winner:false},deck2:{name:'test2',winner:false}},
    {deck1:{name:'test3',winner:false},deck2:{name:'test4',winner:false}},
    {deck1:{name:'test5',winner:false},deck2:{name:'test6',winner:false}}
  ];

  constructor(private swiss:SwissService) { }

  ngOnInit() {
    // this.tournName = this.swiss.name;
    // this.round = this.swiss.round;
    // this.pairings = this.swiss.getPairings();
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

}
