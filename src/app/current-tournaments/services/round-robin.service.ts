import { Injectable } from "@angular/core";
import { take } from "rxjs/operators";

import { tournament, round, player } from "../../shared/tournament.model";
import { DatabaseService } from "../../shared/database.service";

@Injectable({
    providedIn: "root",
})
export class RoundRobinService {
    //functionality to run a round robin service

    constructor(private db: DatabaseService) {}

    curTourn: tournament;
    curRound: round = {
        pairings: [],
        players: [],
    };
    type: string;

    onNextRound(tournId: number) {
        this.db
            .loadCurrentTournaments()
            .pipe(take(1))
            .subscribe((tourns: tournament[]) => {
                this.type = "next";
                this.copyTournament(tournId, tourns);
            });
    }

    onFinish(tournId: number) {
        this.db
            .loadCurrentTournaments()
            .pipe(take(1))
            .subscribe((tourns: tournament[]) => {
                this.type = "end";
                this.copyTournament(tournId, tourns);
            });
    }

    private copyTournament(tournId: number, tourns: tournament[]) {
        this.curTourn = tourns[tournId];

        //makes a copy of the current round and gets new arrays/objects
        //prevents editing previous round while making new round
        let originalRound = this.curTourn.rounds[this.curTourn.curRound - 1];
        for (let i = 0; i < originalRound.pairings.length; i++) {
            this.curRound.pairings.push({
                ...originalRound.pairings[i],
            });
        }
        for (let i = 0; i < originalRound.players.length; i++) {
            this.curRound.players.push({
                ...originalRound.players[i],
                opponents: [...originalRound.players[i].opponents],
            });
        }
        this.updateStats();
    }

    private updateStats() {
        for (let i = 0; i < this.curRound.pairings.length; i++) {
            for (let j = 0; j < this.curRound.players.length; j++) {
                //checks if current round player matches first player in pairing
                if (
                    this.curRound.players[j].playername ===
                    this.curRound.pairings[i].player1.name
                ) {
                    this.curRound.players[j].games += 1;
                    //adds player 2's name to player 1's opponent list IF not a BYE
                    if (this.curRound.pairings[i].player2.name !== "BYE") {
                        this.curRound.players[j].opponents.push(
                            this.curRound.pairings[i].player2.name
                        );
                        //updates wins, losses and byes
                        if (this.curRound.pairings[i].player1.winner) {
                            this.curRound.players[j].wins += 1;
                            this.curTourn.roundRobinArray[i].wins += 1;
                        } else {
                            this.curRound.players[j].losses += 1;
                            this.curTourn.roundRobinArray[i].losses += 1;
                        }
                    } else {
                        this.curRound.players[j].byes += 1;
                        this.curTourn.roundRobinArray[i].byes += 1;
                    }
                } else if (
                    this.curRound.players[j].playername ===
                    this.curRound.pairings[i].player2.name
                ) {
                    //adds player 1's name to player 1's opponent list IF not a BYE
                    if (this.curRound.pairings[i].player1.name !== "BYE") {
                        this.curRound.players[j].opponents.push(
                            this.curRound.pairings[i].player1.name
                        );
                        //updates wins, losses and byes
                        if (this.curRound.pairings[i].player2.winner) {
                            this.curRound.players[j].wins += 1;
                            this.curTourn.roundRobinArray[
                                this.curTourn.roundRobinArray.length - i - 1
                            ].wins += 1;
                        } else {
                            this.curRound.players[j].losses += 1;
                            this.curTourn.roundRobinArray[
                                this.curTourn.roundRobinArray.length - i - 1
                            ].losses += 1;
                        }
                    } else {
                        this.curRound.players[j].byes += 1;
                        this.curTourn.roundRobinArray[
                            this.curTourn.roundRobinArray.length - i - 1
                        ].byes += 1;
                    }
                }
            }
        }

        this.updateStandings();
    }

    private updateStandings() {
        this.curRound.players.sort((a: player, b: player) => {
            if (a.wins > b.wins) {
                return -1;
            } else {
                return 1;
            }
        });

        if (this.type === "next") {
            this.updatePairings();
        } else {
            this.finishTournament();
        }
    }

    private updatePairings() {
        //updates the order
        this.curTourn.roundRobinArray.push(
            this.curTourn.roundRobinArray.splice(1, 1)[0]
        );

        //updates the pairings based on new order
        this.curRound.pairings = [];
        for (let i = 0; i < this.curTourn.roundRobinArray.length / 2; i++) {
            if (this.curTourn.roundRobinArray[i].name !== "BYE") {
                this.curRound.pairings.push({
                    player1: {
                        ...this.curTourn.roundRobinArray[i],
                        winner: false,
                    },
                    player2: {
                        ...this.curTourn.roundRobinArray[
                            this.curTourn.roundRobinArray.length - i - 1
                        ],
                        winner: false,
                    },
                });
            } else {
                this.curRound.pairings.push({
                    player1: {
                        ...this.curTourn.roundRobinArray[i],
                        winner: false,
                    },
                    player2: {
                        ...this.curTourn.roundRobinArray[
                            this.curTourn.roundRobinArray.length - i - 1
                        ],
                        winner: true,
                    },
                });
            }
        }
        this.updateTournament();
    }

    private updateTournament() {
        this.curTourn.curRound += 1;
        this.curTourn.rounds.push(this.curRound);
        this.db.updateTournament(this.curTourn);
        this.curRound = {
            pairings: [],
            players: [],
        };
    }

    private finishTournament() {
        this.curTourn.rounds.push(this.curRound);
        this.db.finishCurrentTournament(this.curTourn);
        this.curRound = {
            pairings: [],
            players: [],
        };
    }
}
