import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { tournament, CurrentTournamentsService } from "./services/current-tournaments.service";
import { DatabaseService } from '../shared/database.service';


@Injectable({providedIn:'root'})
export class CurrentTournamentsResolver implements Resolve<tournament[]> {

    constructor(private db:DatabaseService,private currentTourns:CurrentTournamentsService){}

    resolve(route:ActivatedRouteSnapshot, state:RouterStateSnapshot){
        const tournaments = this.currentTourns.getTournaments();
        if(!this.currentTourns.isLoaded){
            this.db.loadCurrentTournaments();
            return null;
        } else {
            return tournaments;
        }
    }

}