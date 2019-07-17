import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(
    private db:AngularFirestore
    ){}

saveTournament(tourn){
    this.db.collection('testing').doc('tournaments').collection("current").doc(tourn.name).set(tourn)
}

loadTournament(name:string){
    return this.db.collection('testing').doc('tournaments').collection("current").doc(name).get()
    // .subscribe((doc)=>{
    //     console.log(doc.data())
    // })
}

loadTournaments(type:string){
    return this.db.collection('testing').doc('tournaments').collection(type).get()
    .pipe(
        map((item:firebase.firestore.QuerySnapshot) => {
            return item.docs
            .map((dataItem: firebase.firestore.QueryDocumentSnapshot) => dataItem.data());
        })
    )
    // .subscribe(doc=>{
    //     console.log(doc)
    // })
}
}
