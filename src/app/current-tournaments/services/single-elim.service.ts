import { Injectable } from "@angular/core";
import { take } from "rxjs/operators";

import { DatabaseService } from "../../shared/database.service";
import { tournament, round, player } from "../../shared/tournament.model";

@Injectable({
    providedIn: "root",
})
export class SingleElimService {
    //functionality to run a single elimination service
    constructor(private db: DatabaseService) {}

    curTourn: tournament;
    curRound: round;
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
        this.curRound = {
            pairings: [],
            players: [],
            singleElim: [],
        };
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
        for (let i = 0; i < originalRound.singleElim.length; i++) {
            this.curRound.singleElim.push({
                ...originalRound.singleElim[i],
            });
        }
        this.updateStats();
    }

    private updateStats() {
        for (let i = 0; i < this.curRound.pairings.length; i++) {
            //Updates the wins/loses/byes
            for (let j = 0; j < this.curRound.players.length; j++) {
                this.curRound.players[j].games += 1;
                //checks if current round player matches first player in pairing
                if (
                    this.curRound.players[j].playername ===
                    this.curRound.pairings[i].player1.name
                ) {
                    if (this.curRound.pairings[i].player2.name === "BYE") {
                        this.curRound.players[j].byes += 1;
                    } else {
                        this.curRound.players[j].opponents.push(
                            this.curRound.pairings[i].player2.name
                        );
                        //updates wins, losses and byes
                        if (this.curRound.pairings[i].player1.winner) {
                            this.curRound.players[j].wins += 1;
                        } else {
                            this.curRound.players[j].losses += 1;
                        }
                    }
                } else if (
                    this.curRound.players[j].playername ===
                    this.curRound.pairings[i].player2.name
                ) {
                    if (this.curRound.pairings[i].player1.name === "BYE") {
                        this.curRound.players[j].byes += 1;
                    } else {
                        this.curRound.players[j].opponents.push(
                            this.curRound.pairings[i].player1.name
                        );
                        //updates wins, losses and byes
                        if (this.curRound.pairings[i].player2.winner) {
                            this.curRound.players[j].wins += 1;
                        } else {
                            this.curRound.players[j].losses += 1;
                        }
                    }
                }
                //removes the loser from the single elimination array
                if (this.curRound.players[j].losses > 0) {
                    for (let k = 0; k < this.curRound.singleElim.length; k++) {
                        if (
                            this.curRound.singleElim[k].name ===
                            this.curRound.players[j].playername
                        ) {
                            let a = this.curRound.singleElim.splice(k, 1);
                        }
                    }
                }
            }
        }
        //removes all BYEs after first round
        if (this.curTourn.curRound === 1) {
            this.curRound.singleElim = this.curRound.singleElim.filter(ele => {
                if (ele.name === "BYE") {
                    return false;
                }
                return true;
            });
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
        this.curRound.pairings = [];
        for (let i = 0; i < this.curRound.singleElim.length / 2; i++) {
            this.curRound.pairings.push({
                player1: {
                    name: this.curRound.singleElim[2 * i].name,
                    deck: this.curRound.singleElim[2 * i].deck,
                    winner: false,
                },
                player2: {
                    name: this.curRound.singleElim[2 * i + 1].name,
                    deck: this.curRound.singleElim[2 * i + 1].deck,
                    winner: false,
                },
            });
            if (
                typeof this.curRound.singleElim[2 * i].chains === "number" &&
                typeof this.curRound.singleElim[2 * i + 1].chains === "number"
            ) {
                this.curRound.pairings[
                    i
                ].player1.chains = this.curRound.singleElim[2 * i].chains;
                this.curRound.pairings[
                    i
                ].player2.chains = this.curRound.singleElim[2 * i + 1].chains;
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
