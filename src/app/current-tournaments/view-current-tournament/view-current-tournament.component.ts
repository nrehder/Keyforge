import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { DatabaseService } from 'src/app/shared/database.service';
import { DocumentData } from 'angularfire2/firestore';
import { take } from 'rxjs/operators';
import { tournament } from 'src/app/shared/tournament.model';

@Component({
  selector: 'app-view-current-tournament',
  templateUrl: './view-current-tournament.component.html',
  styleUrls: ['./view-current-tournament.component.css']
})
export class ViewCurrentTournamentComponent implements OnInit, OnDestroy {

  tournId:number;
  currentTournaments:Observable<DocumentData[]>;
  deleting:boolean = false;
  loading:boolean = false;

  constructor(private route:ActivatedRoute, private db:DatabaseService) { }

  ngOnInit() {
    this.route.params.subscribe((params:Params)=>{
      this.tournId = +params['id'];
    })

    this.currentTournaments = this.db.loadCurrentTournaments();

  }

  onDelete(){
    this.deleting = true;
  }

  onConfirmation(choice:string){
    if(choice === "close"){
      this.deleting = false;
    } else if(choice === "delete"){
      this.deleting = false;
      this.loading = true;
      this.db.loadCurrentTournaments()
      .pipe(take(1))
      .subscribe((tourns:tournament[])=>{
        this.db.deleteTournament("current",tourns[this.tournId].name)
      })
    }
  }

  ngOnDestroy(){

  }

}
