import { Injectable } from "@angular/core";
import { AngularFirestore } from "angularfire2/firestore";
import { map, take } from "rxjs/operators";
import { tournament } from "../shared/tournament.model";
import { Router } from "@angular/router";

@Injectable({
    providedIn: "root",
})
export class DatabaseService {
    constructor(private db: AngularFirestore, private route: Router) {}

    updateTournament(upTourn: tournament) {
        this.db
            .collection("testing")
            .doc("tournaments")
            .collection("current")
            .doc(upTourn.name)
            .set(upTourn)
            .catch(err => {
                console.log(err);
            });
    }

    addNewTournament(newTourn: tournament) {
        this.db
            .collection("testing")
            .doc("tournaments")
            .collection("current")
            .doc(newTourn.name)
            .set(newTourn)
            .then(() => {
                //gets new list of tournament names
                this.db
                    .collection("testing")
                    .doc("tournaments")
                    .collection("current")
                    .get()
                    .pipe(
                        take(1),
                        map((item: firebase.firestore.QuerySnapshot) => {
                            //maps DocumentData[] to tournament[]
                            return item.docs.map(
                                (
                                    dataItem: firebase.firestore.QueryDocumentSnapshot
                                ) => {
                                    return <tournament>dataItem.data();
                                }
                            );
                        }),
                        map(tournArray => {
                            return tournArray.map(element => {
                                return element.name;
                            });
                        })
                    )
                    .subscribe(tourns => {
                        //navigates to the tournament that was just added
                        this.route.navigate([
                            "/tournaments",
                            tourns.indexOf(newTourn.name),
                        ]);
                    });
            })
            .catch(err => {
                console.log(err);
            });
    }

    //returns an observable that will 'next' each time the database updates
    loadCurrentTournaments() {
        return this.db
            .collection("testing")
            .doc("tournaments")
            .collection("current")
            .valueChanges();
    }

    deleteTournament(collection: string, document: string) {
        this.db
            .collection("testing")
            .doc("tournaments")
            .collection(collection)
            .doc(document)
            .delete()
            .then(() => {
                console.log("Deleted Successfully");
            })
            .catch(error => {
                console.log("error");
                console.log(error);
            });
    }

    finishCurrentTournament(tourn: tournament) {
        this.db
            .collection("testing")
            .doc("tournaments")
            .collection("finished")
            .doc(tourn.name)
            .set(tourn)
            .then(() => {
                this.db
                    .collection("testing")
                    .doc("tournaments")
                    .collection("current")
                    .doc(tourn.name)
                    .delete()
                    .catch(err => {
                        console.log(err);
                    });

                //add navigation to finished version
            })
            .catch(err => {
                console.log(err);
            });
    }
}
