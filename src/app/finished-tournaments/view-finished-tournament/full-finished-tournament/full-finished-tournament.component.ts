import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { DocumentData } from "@angular/fire/firestore";
import { ActivatedRoute, Params } from "@angular/router";
import { DatabaseService } from "src/app/shared/database.service";
import { take } from "rxjs/operators";
import { tournament } from "src/app/shared/tournament.model";

@Component({
    selector: "app-full-finished-tournament",
    templateUrl: "./full-finished-tournament.component.html",
    styleUrls: ["./full-finished-tournament.component.css"],
})
export class FullFinishedTournamentComponent implements OnInit {
    tournName: string;
    tournId: number;
    finishedTournaments: Observable<DocumentData[]>;
    results: boolean[] = [];
    pairings: boolean[] = [];

    constructor(private route: ActivatedRoute, private db: DatabaseService) {}

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            this.tournId = +params["id"];
        });

        this.finishedTournaments = this.db.loadFinishedTournaments();
        this.finishedTournaments
            .pipe(take(1))
            .subscribe((tourns: tournament[]) => {
                this.tournName = tourns[this.tournId].name;
                for (let i = 0; i < tourns[this.tournId].rounds.length; i++) {
                    this.results.push(true);
                    this.pairings.push(true);
                }
            });
    }

    onToggleResults(index: number) {
        this.results[index] = !this.results[index];
    }

    onTogglePairings(index: number) {
        this.pairings[index] = !this.pairings[index];
    }

    ngOnDestroy() {}
}
