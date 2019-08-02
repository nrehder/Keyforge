import { Injectable } from "@angular/core";
import { take, map } from "rxjs/operators";

import { DatabaseService } from "../../shared/database.service";
import { tournament, round, player } from "../../shared/tournament.model";

export interface swissDeck {
    name: string;
    wins: number;
    losses: number;
    byes: number;
    games: number;
    opponents: string[];
    SoS: number;
    ESoS: number;
    chains?: number;
}

@Injectable({
    providedIn: "root",
})
export class SwissStyleService {
    //functionality to run a swiss style tournament

    constructor(private db: DatabaseService) {}

    curTourn: tournament;
    curRound: round = {
        pairings: [],
        players: [],
    };

    onNextRound(tournId: number) {
        this.db
            .loadCurrentTournaments()
            .pipe(take(1))
            .subscribe((tourns: tournament[]) => {
                this.copyTournament(tournId, tourns);
                this.updateStats();
                this.getPairings();
                this.updateTournament();
            });
    }

    onFinish(tournId: number) {
        this.db
            .loadCurrentTournaments()
            .pipe(take(1))
            .subscribe((tourns: tournament[]) => {
                this.copyTournament(tournId, tourns);
                this.updateStats();
                this.finishTournament();
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
                        } else {
                            this.curRound.players[j].losses += 1;
                        }
                    } else {
                        this.curRound.players[j].byes += 1;
                    }
                } else if (
                    this.curRound.players[j].playername ===
                    this.curRound.pairings[i].player2.name
                ) {
                    //adds player 1's name to player 2's opponent list
                    this.curRound.players[j].opponents.push(
                        this.curRound.pairings[i].player1.name
                    );

                    //updates wins, losses and games
                    if (this.curRound.pairings[i].player2.winner) {
                        this.curRound.players[j].wins += 1;
                        this.curRound.players[j].games += 1;
                    } else {
                        this.curRound.players[j].losses += 1;
                        this.curRound.players[j].games += 1;
                    }
                }
            }
        }
        this.calculateSoS();
    }

    private calculateSoS() {
        //does calculation for each player in the game
        for (let i = 0; i < this.curRound.players.length; i++) {
            //checks if player had BYE the first round (SOS=0 in that case)
            if (this.curRound.players[i].opponents.length !== 0) {
                //Adds all of the win+bye / total games of opponents
                let sum = 0;
                for (
                    let j = 0;
                    j < this.curRound.players[i].opponents.length;
                    j++
                ) {
                    let opponent: string = this.curRound.players[i].opponents[
                        j
                    ];

                    //finds their opponent in the main array and gets their wins/byes
                    for (let k = 0; k < this.curRound.players.length; k++) {
                        if (this.curRound.players[k].playername === opponent) {
                            sum +=
                                (this.curRound.players[k].wins +
                                    this.curRound.players[k].byes) /
                                this.curRound.players[k].games;
                        }
                    }
                }
                this.curRound.players[i].SoS =
                    sum / this.curRound.players[i].opponents.length;
            } else {
                this.curRound.players[i].SoS = 0;
            }
        }
        this.calculateESoS();
    }

    private calculateESoS() {
        //does calculation for each player in the game
        for (let i = 0; i < this.curRound.players.length; i++) {
            //checks if player had BYE the first round (SOS=0 in that case)
            if (this.curRound.players[i].opponents.length !== 0) {
                //Adds all of the SOS of opponents
                let sum = 0;
                for (
                    let j = 0;
                    j < this.curRound.players[i].opponents.length;
                    j++
                ) {
                    let opponent: string = this.curRound.players[i].opponents[
                        j
                    ];
                    //finds their opponent in the main array and gets their SOS
                    for (let k = 0; k < this.curRound.players.length; k++) {
                        if (this.curRound.players[k].playername === opponent) {
                            sum += this.curRound.players[k].SoS;
                        }
                    }
                }
                this.curRound.players[i].ESoS =
                    sum / this.curRound.players[i].opponents.length;
            } else {
                /*
				Ensures that the BYE player appears to have the same record as
				a winner.  Otherwise, BYE player would always get paired down
				*/
                this.curRound.players[i].ESoS = 1;
            }
        }

        this.sortStandings();
    }

    private sortStandings() {
        //randomizes before sorting
        for (let i = 0; i < this.curRound.players.length; i++) {
            let rand = Math.floor(Math.random() * this.curRound.players.length);
            let temp = this.curRound.players[i];
            this.curRound.players[i] = this.curRound.players[rand];
            this.curRound.players[rand] = temp;
        }

        this.curRound.players.sort((a, b) => {
            let a_wins = a.wins + a.byes;
            let b_wins = b.wins + b.byes;
            if (a_wins > b_wins) {
                return -1;
            } else if (a_wins < b_wins) {
                return 1;
            } else {
                if (a.SoS > b.SoS) {
                    return -1;
                } else if (a.SoS < b.SoS) {
                    return 1;
                } else {
                    if (a.ESoS > b.ESoS) {
                        return -1;
                    } else {
                        return 1;
                    }
                }
            }
        });
    }

    private getPairings() {
        this.curRound.pairings = [];
        //pairs up players starting with the 1st and 2nd place, then 3rd vs 4th, etc
        for (let i = 0; i < Math.floor(this.curRound.players.length / 2); i++) {
            this.curRound.pairings.push({
                player1: {
                    name: this.curRound.players[2 * i].playername,
                    deck: this.curRound.players[2 * i].deckname,
                    winner: false,
                },
                player2: {
                    name: this.curRound.players[2 * i + 1].playername,
                    deck: this.curRound.players[2 * i + 1].deckname,
                    winner: false,
                },
            });
            if (
                typeof this.curRound.players[2 * i].chains === "number" &&
                typeof this.curRound.players[2 * i + 1].chains === "number"
            ) {
                this.curRound.pairings[
                    i
                ].player1.chains = this.curRound.players[2 * i].chains;
                this.curRound.pairings[
                    i
                ].player2.chains = this.curRound.players[2 * i + 1].chains;
            }
        }
        //gives a BYE to the last player in the case of an odd number of players
        if (this.curRound.players.length % 2 === 1) {
            this.curRound.pairings.push({
                player1: {
                    name: this.curRound.players[
                        this.curRound.players.length - 1
                    ].playername,
                    deck: this.curRound.players[
                        this.curRound.players.length - 1
                    ].deckname,
                    winner: true,
                },
                player2: {
                    name: "BYE",
                    deck: "",
                    winner: false,
                },
            });
        }
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
