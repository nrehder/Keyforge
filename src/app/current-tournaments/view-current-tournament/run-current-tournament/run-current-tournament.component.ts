import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";

import { SwissStyleService } from "../../services/swiss-style.service";
import { Subscription, Observable } from "rxjs";
import { tournament } from "../../../shared/tournament.model";
import { DatabaseService } from "src/app/shared/database.service";
import { DocumentData } from "angularfire2/firestore";
import { take, map } from "rxjs/operators";

@Component({
    selector: "app-run-current-tournament",
    templateUrl: "./run-current-tournament.component.html",
    styleUrls: ["./run-current-tournament.component.css"],
})
export class RunCurrentTournamentComponent implements OnInit, OnDestroy {
    tournId: number;
    currentTournaments: Observable<DocumentData[]>;

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
    }

    onClickPlayer(index: number, winner: string) {
        this.db
            .loadCurrentTournaments()
            .pipe(take(1))
            .subscribe((tourns: tournament[]) => {
                const curTourn = tourns[this.tournId];
                const curPairing =
                    curTourn.rounds[curTourn.curRound - 1].pairings[index];

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
            });
    }

    onNextRound() {
        this.swiss.onNextRound(this.tournId);
    }

    onFinish() {
        this.swiss.onFinish(this.tournId);
    }

    ngOnDestroy() {}
}
