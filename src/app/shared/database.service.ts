import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Router } from "@angular/router";
import { map, take } from "rxjs/operators";

import { tournament } from "../shared/tournament.model";
import { AuthService } from "./auth.service";
import { deck } from "./deck.model";

@Injectable({
    providedIn: "root",
})
export class DatabaseService {
    constructor(
        private db: AngularFirestore,
        private router: Router,
        private authService: AuthService
    ) {}

    //returns an observable that will 'next' each time the database updates
    loadCurrentTournaments() {
        return this.db
            .collection("storage")
            .doc(this.authService.username)
            .collection("currentTournaments")
            .valueChanges();
    }
    loadFinishedTournaments() {
        return this.db
            .collection("storage")
            .doc(this.authService.username)
            .collection("finishedTournaments")
            .valueChanges();
    }
    loadDecks() {
        return this.db
            .collection("storage")
            .doc(this.authService.username)
            .collection("decks")
            .valueChanges();
    }

    /*
		Adds the provided new tournament to the collection
		Gets a new copy of the tournaments and maps the DocumentData[]
			to tournament[] then to an array of the tournament names
		Finds the tournament that was just added and navigates to the
			'view current tournament' that corresponds to it
	*/
    addNewTournament(newTourn: tournament) {
        this.db
            .collection("storage")
            .doc(this.authService.username)
            .collection("currentTournaments")
            .doc(newTourn.name)
            .set(newTourn)
            .then(() => {
                this.navigate(newTourn.name, "currentTournaments");
            })
            .catch(err => {
                console.log(err);
            });
    }

    /*
	takes in either 'finished' or 'current' for collection
	document is the tournament name
	*/
    deleteTournament(collection: string, document: string) {
        if (collection === "finishedTournaments") {
            this.router.navigate(["/finished"]);
        } else if (collection === "currentTournaments") {
            this.router.navigate(["/tournaments"]);
        } else {
            this.router.navigate(["/"]);
        }
        this.db
            .collection("storage")
            .doc(this.authService.username)
            .collection(collection)
            .doc(document)
            .delete()
            .catch(error => {
                console.log(error);
            });
    }

    //takes in updated tournament and saves it to database
    updateTournament(upTourn: tournament) {
        this.db
            .collection("storage")
            .doc(this.authService.username)
            .collection("currentTournaments")
            .doc(upTourn.name)
            .set(upTourn)
            .catch(err => {
                console.log(err);
            });
    }

    /*
		takes in the finalized tournament from swiss/etc service
		Adds it to the finished collection in the database
		Deletes the tournament from the current section of the database
		Navigates to the 'view finished' component
	*/
    finishCurrentTournament(tourn: tournament) {
        this.db
            .collection("storage")
            .doc(this.authService.username)
            .collection("finishedTournaments")
            .doc(tourn.name)
            .set(tourn)
            .then(() => {
                this.db
                    .collection("storage")
                    .doc(this.authService.username)
                    .collection("currentTournaments")
                    .doc(tourn.name)
                    .delete()
                    .catch(err => {
                        console.log(err);
                    });
                this.updateDeckStats(tourn);
                this.navigate(tourn.name, "finishedTournaments");
            })
            .catch(err => {
                console.log(err);
            });
    }

    saveNewDeck(deck: deck) {
        this.db
            .collection("storage")
            .doc(this.authService.username)
            .collection("decks")
            .doc(deck.deckName)
            .set(deck);
    }

    updateDeckStats(tourn: tournament) {
        const finalStats = tourn.rounds[tourn.curRound].players;
        const deckRef = this.db
            .collection("storage")
            .doc(this.authService.username)
            .collection("decks");

        for (let i = 0; i < finalStats.length; i++) {
            deckRef
                .doc(finalStats[i].deckname)
                .get()
                .pipe(take(1))
                .subscribe((data: any) => {
                    let deck = {};
                    deck = { ...data.data() };
                    deck["wins"] += finalStats[i].wins;
                    deck["losses"] += finalStats[i].losses;
                    deck["byes"] += finalStats[i].byes;

                    if (!deck["tournament"]) {
                        deck["tournament"] = [];
                    }
                    deck["tournament"].push({
                        name: tourn.name,
                        wins: finalStats[i].wins,
                        losses: finalStats[i].losses,
                        byes: finalStats[i].byes,
                    });

                    //determines chains as chainbound event
                    if (
                        tourn.chainType === "unofficial" &&
                        (tourn.type === "swiss" || tourn.type === "singleElim")
                    ) {
                        deck["chains"] = Math.max(
                            deck["chains"] +
                                this.swissElimChains(
                                    finalStats.length,
                                    finalStats[i].wins
                                ),
                            0
                        );
                    } else if (
                        tourn.chainType === "unofficial" &&
                        tourn.type === "roundRobin"
                    ) {
                        deck["chains"] = Math.max(
                            deck["chains"] +
                                this.robinChains(
                                    finalStats.length,
                                    finalStats[i].wins /
                                        (finalStats[i].wins +
                                            finalStats[i].losses)
                                ),
                            0
                        );
                    }

                    deckRef
                        .doc(finalStats[i].deckname)
                        .set(deck, { merge: true });
                });
        }
    }

    private navigate(tournName: string, collection: string) {
        this.db
            .collection("storage")
            .doc(this.authService.username)
            .collection(collection)
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
                    //converts the tournament[] to string[]
                    return tournArray.map(element => {
                        return element.name;
                    });
                })
            )
            .subscribe(tourns => {
                //navigates to the tournament that was just added or finished
                if (collection === "currentTournaments") {
                    this.router.navigate([
                        "/tournaments",
                        tourns.indexOf(tournName),
                    ]);
                } else {
                    this.router.navigate([
                        "/finished",
                        tourns.indexOf(tournName),
                    ]);
                }
            });
    }

    private swissElimChains(numPlayers, wins) {
        if (numPlayers < 9) {
            switch (wins) {
                case 3:
                    return 3;
                case 2:
                    return 2;
                default:
                    return -1;
            }
        } else {
            if (wins >= 4) {
                return 4;
            } else {
                switch (wins) {
                    case 3:
                        return 3;
                    case 2:
                        return 0;
                    default:
                        return -1;
                }
            }
        }
    }

    private robinChains(numPlayers, winPercent) {
        //0->25% win
        if (winPercent < 0.26) {
            return -1;
        }
        //26->50% wins
        if (winPercent < 0.51) {
            return 0;
        }
        // 51->75% wins
        if (winPercent < 0.76) {
            if (numPlayers < 9) {
                return 2;
            } else {
                return 3;
            }
        }
        //76->100% wins
        if (numPlayers < 9) {
            return 3;
        } else {
            return 4;
        }
    }
}
