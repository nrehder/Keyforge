import { Component, OnInit, OnDestroy } from '@angular/core';
import { CurrentTournamentsService, tournament } from './services/current-tournaments.service';
import { DatabaseService } from '../shared/database.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-current-tournaments',
  templateUrl: './current-tournaments.component.html',
  styleUrls: ['./current-tournaments.component.css']
})
export class CurrentTournamentsComponent implements OnInit, OnDestroy {

  constructor(private db:DatabaseService, private currentTournsService:CurrentTournamentsService) { }

  currentTournSub:Subscription;
  currentTournaments:tournament[];

  ngOnInit() {
    this.currentTournSub = this.currentTournsService.currentTournChanged
    .subscribe((tourns:tournament[])=>{
      this.currentTournaments = tourns;
    })
    this.currentTournaments = this.currentTournsService.getTournaments();
  }

  ngOnDestroy(){
    this.currentTournSub.unsubscribe;
  }

}
