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

        // if(this.curTournService.currentTournaments){
        //   this.tournName = this.curTournService.currentTournaments[this.tournId].name;
        //   this.round = this.curTournService.currentTournaments[this.tournId].curRound;
        //   this.tournType = this.curTournService.currentTournaments[this.tournId].type;
        // } else{
        //   this.tournSub = this.curTournService.currentTournChanged
        //   .subscribe((tourns:tournament[])=>{
        //     console.log(tourns[this.tournId])
        //     this.tournName = tourns[this.tournId].name;
        //     this.round = tourns[this.tournId].curRound;
        //     this.tournType = tourns[this.tournId].type;
        //   })
        // }

        // let tempPairings = this.swiss.getPairings();
        // for(let i=0;i<tempPairings.length;i++){
        //   this.pairings.push({
        //     deck1:{
        //       name:tempPairings[i].deck1,
        //       winner:false
        //     },
        //     deck2:{
        //       name:tempPairings[i].deck2,
        //       winner:false
        //     }
        //   })
        // }
    }

    updateData() {
        let results = [
            {
                name: "a",
                opponent: "b",
                result: "won",
            },
        ];
        // this.swiss.updateStandings(results)
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
                        curPairing.player2.name === winner)
                ) {
                    console.log("switching");
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

    onFinish() {}

    ngOnDestroy() {}
}
