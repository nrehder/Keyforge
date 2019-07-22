import { Injectable } from "@angular/core";
import { Effect, Actions, ofType } from "@ngrx/effects";

import * as CurrentTournamentsActions from "./current-tournaments.actions";
import { switchMap, take, map } from 'rxjs/operators';
import { AngularFirestore } from 'angularfire2/firestore';
import { tournament } from '../current-tournament.model';


@Injectable()
export class CurrentTournamentsEffects {
    constructor(
        private actions$:Actions,
        private db:AngularFirestore
    ){}

    @Effect()
    loadTournaments = this.actions$.pipe(
        ofType(CurrentTournamentsActions.LOAD_TOURNAMENTS),
        switchMap((loadAction:CurrentTournamentsActions.LoadTournaments)=>{
            return this.db.collection("testing").doc("tournaments").collection("current").get()
            .pipe(
                take(1),
                map((item:firebase.firestore.QuerySnapshot) => {
                    return item.docs
                    .map((dataItem: firebase.firestore.QueryDocumentSnapshot) => {
                        return <tournament>dataItem.data()
                    });
                })
            )
        }),
        map(tournaments=>{
            return new CurrentTournamentsActions.SetRecipes(tournaments)
        })
    )
}