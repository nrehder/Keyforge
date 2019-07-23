import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { DatabaseService } from 'src/app/shared/database.service';
import { DocumentData } from 'angularfire2/firestore';

@Component({
  selector: 'app-view-current-tournament',
  templateUrl: './view-current-tournament.component.html',
  styleUrls: ['./view-current-tournament.component.css']
})
export class ViewCurrentTournamentComponent implements OnInit, OnDestroy {

  tournId:number;
  currentTournaments:Observable<DocumentData[]>;

  constructor(private route:ActivatedRoute, private db:DatabaseService) { }

  ngOnInit() {
    this.route.params.subscribe((params:Params)=>{
      this.tournId = +params['id'];
    })

    this.currentTournaments = this.db.loadCurrentTournaments();

  }

  ngOnDestroy(){

  }

}
