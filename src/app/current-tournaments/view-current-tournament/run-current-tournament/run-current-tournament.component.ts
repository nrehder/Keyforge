import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";

import { SwissStyleService } from "../../services/swiss-style.service";
import { Observable, Subscription } from "rxjs";
import { tournament } from "../../../shared/tournament.model";
import { DatabaseService } from "src/app/shared/database.service";
import { DocumentData } from "@angular/fire/firestore";
import { take } from "rxjs/operators";
import { RoundRobinService } from "../../services/round-robin.service";
import { SingleElimService } from "../../services/single-elim.service";

@Component({
    selector: "app-run-current-tournament",
    templateUrl: "./run-current-tournament.component.html",
    styleUrls: ["./run-current-tournament.component.css"],
})
export class RunCurrentTournamentComponent implements OnInit, OnDestroy {
    curRound: number;

    tournSub: Subscription;
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
        private roundRobin: RoundRobinService,
        private singleElim: SingleElimService,
        private route: ActivatedRoute,
        private db: DatabaseService
    ) {}

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            this.tournId = +params["id"];
        });

        this.currentTournaments = this.db.loadCurrentTournaments();

        this.tournSub = this.currentTournaments.subscribe(
            (tourns: tournament[]) => {
                if (tourns.length > 0) {
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
                    this.finishedPairings = [];
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
                }
            }
        );
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

    onFinish() {
        this.endingTourn = true;
    }

    private clearFinished() {
        this.finishedPairings = [];
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

    onConfirmNextRound(choice: string) {
        if (choice === "cancel") {
            this.endingRound = false;
        } else if (choice === "confirm") {
            this.endingRound = false;
            // this.curRound += 1;
            switch (this.tournType) {
                case "swiss":
                    this.swiss.onNextRound(this.tournId);
                    break;
                case "roundRobin":
                    this.roundRobin.onNextRound(this.tournId);
                    break;
                case "singleElim":
                    this.singleElim.onNextRound(this.tournId);
                    break;
            }
            this.clearFinished();
        }
    }

    onConfirmEndTourn(choice: string) {
        if (choice === "cancel") {
            this.endingTourn = false;
        } else if (choice === "confirm") {
            this.endingTourn = false;
            switch (this.tournType) {
                case "swiss":
                    this.swiss.onFinish(this.tournId);
                    break;
                case "roundRobin":
                    this.roundRobin.onFinish(this.tournId);
                    break;
                case "singleElim":
                    this.singleElim.onFinish(this.tournId);
                    break;
            }
            this.clearFinished();
        }
    }

    ngOnDestroy() {
        this.tournSub.unsubscribe();
    }
}
