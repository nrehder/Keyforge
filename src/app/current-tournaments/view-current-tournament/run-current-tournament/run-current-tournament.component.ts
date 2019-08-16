import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { DocumentData } from "@angular/fire/firestore";
import { Observable, Subscription } from "rxjs";
import { take } from "rxjs/operators";

import { tournament } from "../../../shared/tournament.model";
import { DatabaseService } from "../../../shared/database.service";
import { SwissStyleService } from "../../services/swiss-style.service";
import { RoundRobinService } from "../../services/round-robin.service";
import { SingleElimService } from "../../services/single-elim.service";
import { VariableConfirmationService } from "src/app/shared/variable-confirmation/variable-confirmation.service";

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

    displayStats: boolean = false;

    constructor(
        private swiss: SwissStyleService,
        private roundRobin: RoundRobinService,
        private singleElim: SingleElimService,
        private route: ActivatedRoute,
        private router: Router,
        private db: DatabaseService,
        private vcService: VariableConfirmationService
    ) {}

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            this.tournId = +params["id"];
        });

        this.currentTournaments = this.db.loadCurrentTournaments();

        this.tournSub = this.currentTournaments.subscribe(
            (tourns: tournament[]) => {
                if (!tourns[this.tournId]) {
                    this.router.navigate(["/tournaments"]);
                } else if (tourns.length > 0) {
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
        this.vcService.message = "end round " + this.curRound;
        this.vcService.choice.pipe(take(1)).subscribe(res => {
            this.onConfirmNextRound(res);
        });
    }

    onFinish() {
        this.vcService.message = "end the tournament";
        this.vcService.choice.pipe(take(1)).subscribe(res => {
            this.onConfirmEndTourn(res);
        });
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
        this.vcService.message = "";
        if (choice === "confirm") {
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
        this.vcService.message = "";
        if (choice === "confirm") {
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
