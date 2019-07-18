import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { map, take } from 'rxjs/operators';
import { CurrentTournamentsService, tournament } from '../current-tournaments/services/current-tournaments.service';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(
    private db:AngularFirestore,
    private currentTourns:CurrentTournamentsService
    ){}

    saveTournament(tourn:tournament){
        this.db.collection('testing').doc('tournaments').collection("current").doc(tourn.name).set(tourn)
    }

    loadTournament(name:string){
        return this.db.collection('testing').doc('tournaments').collection("current").doc(name).get()
        // .subscribe((doc)=>{
        //     console.log(doc.data())
        // })
    }

    loadTournaments(type:string){
        let tournaments=this.db.collection('testing').doc('tournaments').collection(type).get()
        .pipe(
            take(1),
            map((item:firebase.firestore.QuerySnapshot) => {
                return item.docs
                .map((dataItem: firebase.firestore.QueryDocumentSnapshot) => {
                    return <tournament>dataItem.data()
                });
            })
        )

        return tournaments;
    }

    //Here or below is new

    saveCurrentTournaments(){
        const tourns = this.currentTourns.getTournaments();
        for(let i=0;i<tourns.length;i++){
            this.db.collection('testing').doc('tournaments').collection("current").doc(tourns[i].name).set(tourns[i])
        }
    }

    loadCurrentTournaments(){
        this.db.collection('testing').doc('tournaments').collection('current').get()
        .pipe(
            take(1),
            map((item:firebase.firestore.QuerySnapshot) => {
                return item.docs
                .map((dataItem: firebase.firestore.QueryDocumentSnapshot) => {
                    return <tournament>dataItem.data()
                });
            })
        )
        .subscribe(tourns=>{
            this.currentTourns.setTournaments(tourns)
        })
    }
}
