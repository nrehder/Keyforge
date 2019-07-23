import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { map, take } from 'rxjs/operators';
import { tournament } from '../shared/tournament.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(
    private db:AngularFirestore,
    private route:Router
    ){}

    addNewTournament(newTourn:tournament){
        //takes 1 snapshot of current database
        this.db.collection('testing').doc('tournaments').collection('current')
        .get()
        .pipe(
            take(1),
            map((item:firebase.firestore.QuerySnapshot) => {
                //maps DocumentData[] to tournament[]
                return item.docs
                .map((dataItem: firebase.firestore.QueryDocumentSnapshot) => {
                    return <tournament>dataItem.data()
                });
            })
        )
        .subscribe(tourns=>{
            tourns.push(newTourn)

            //adds a doc for each tournament
            for(let i=0;i<tourns.length;i++){
                this.db.collection('testing').doc('tournaments').collection("current").doc(tourns[i].name)
                .set(tourns[i])
            }
            this.route.navigate(["/tournaments",tourns.length-1])
        })
    }

    //returns an observable that will 'next' each time the database updates
    loadCurrentTournaments(){
        return this.db.collection('testing').doc('tournaments').collection('current')
        .valueChanges()
    }
}
