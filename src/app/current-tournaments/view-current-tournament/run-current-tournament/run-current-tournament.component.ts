import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";

import { SwissStyleService } from "../../services/swiss-style.service";
import { Subscription, Observable } from "rxjs";
import { tournament } from "../../../shared/tournament.model";
import { DatabaseService } from "src/app/shared/database.service";
import { DocumentData } from "@angular/fire/firestore";
import { take, map } from "rxjs/operators";

@Component({
    selector: "app-run-current-tournament",
    templateUrl: "./run-current-tournament.component.html",
    styleUrls: ["./run-current-tournament.component.css"],
})
export class RunCurrentTournamentComponent implements OnInit, OnDestroy {
    curRound: number;
    tournId: number;
    tournType: string;
    currentTournaments: Observable<DocumentData[]>;
    finishedPairings: boolean[] = [];
    numPlayers: number;
    allFinished: boolean;
    endingRound: boolean;
    endingTourn: boolean;

    displayStats: boolean = false;

    constructor(
        private swiss: SwissStyleService,
        private route: ActivatedRoute,
        private db: DatabaseService
    ) {}

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            this.tournId = +params["id"];
        });

        this.currentTournaments = this.db.loadCurrentTournaments();

        this.currentTournaments
            .pipe(take(1))
            .subscribe((tourns: tournament[]) => {
                this.curRound = tourns[this.tournId].curRound;
                this.tournType = tourns[this.tournId].type;
                this.numPlayers =
                    tourns[this.tournId].rounds[
                        tourns[this.tournId].curRound - 1
                    ].players.length;
                const curPairings =
                    tourns[this.tournId].rounds[
                        tourns[this.tournId].curRound - 1
                    ].pairings;
                for (let i = 0; i < curPairings.length; i++) {
                    if (
                        curPairings[i].player1.winner ||
                        curPairings[i].player2.winner
                    ) {
                        this.finishedPairings.push(true);
                    } else {
                        this.finishedPairings.push(false);
                    }
                }
                this.checkFinished();
            });
    }

    onChangeDisplay() {
        this.displayStats = !this.displayStats;
    }
    onClickPlayer(event: { index: number; winner: string }) {
        let index = event.index;
        let winner = event.winner;
        this.db
            .loadCurrentTournaments()
            .pipe(take(1))
            .subscribe((tourns: tournament[]) => {
                const curTourn = tourns[this.tournId];
                const curPairing =
                    curTourn.rounds[curTourn.curRound - 1].pairings[index];

                this.finishedPairings[index] = true;

                if (
                    (!curPairing.player1.winner &&
                        curPairing.player1.name === winner) ||
                    (!curPairing.player2.winner &&
                        curPairing.player2.name === winner &&
                        curPairing.player2.name !== "BYE")
                ) {
                    if (
                        curPairing.player1.name === winner &&
                        !curPairing.player1.winner
                    ) {
                        curPairing.player1.winner = true;
                        curPairing.player2.winner = false;
                    } else if (curPairing.player2.name === winner) {
                        curPairing.player1.winner = false;
                        curPairing.player2.winner = true;
                    }

                    curTourn.rounds[curTourn.curRound - 1].pairings[
                        index
                    ] = curPairing;

                    this.db.updateTournament(curTourn);
                }
                this.checkFinished();
            });
    }

    onNextRound() {
        this.endingRound = true;
    }

    onConfirmNextRound(choice: string) {
        if (choice === "cancel") {
            this.endingRound = false;
        } else if (choice === "confirm") {
            this.endingRound = false;
            this.curRound += 1;
            if (this.tournType === "swiss") {
                this.swiss.onNextRound(this.tournId);
            }
            this.clearFinished();
        }
    }

    onFinish() {
        this.endingTourn = true;
    }

    onConfirmEndTourn(choice: string) {
        if (choice === "cancel") {
            this.endingTourn = false;
        } else if (choice === "confirm") {
            this.endingTourn = false;
            this.swiss.onFinish(this.tournId);
            this.clearFinished();
        }
    }

    private clearFinished() {
        for (let i = 0; i < this.finishedPairings.length; i++) {
            this.finishedPairings[i] = false;
        }
        if (this.numPlayers % 2 === 1) {
            this.finishedPairings[this.finishedPairings.length - 1] = true;
        }
        this.allFinished = false;
    }

    private checkFinished() {
        let unfinished = 0;
        for (let element of this.finishedPairings) {
            if (!element) {
                unfinished += 1;
            }
        }
        if (unfinished === 0) {
            this.allFinished = true;
        }
    }

    ngOnDestroy() {}
}
