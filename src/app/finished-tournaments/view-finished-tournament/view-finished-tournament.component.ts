import { Component, OnInit } from "@angular/core";
import { DocumentData } from "@angular/fire/firestore";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Observable } from "rxjs";
import { take } from "rxjs/operators";

import { DatabaseService } from "../../shared/database.service";
import { tournament } from "../../shared/tournament.model";

@Component({
    selector: "app-view-finished-tournament",
    templateUrl: "./view-finished-tournament.component.html",
    styleUrls: ["./view-finished-tournament.component.css"],
})
export class ViewFinishedTournamentComponent implements OnInit {
    tournName: string;
    tournId: number;
    finishedTournaments: Observable<DocumentData[]>;
    deleting: boolean = false;
    loading: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private db: DatabaseService,
        private router: Router
    ) {}

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            this.tournId = +params["id"];
        });

        this.finishedTournaments = this.db.loadFinishedTournaments();
        this.finishedTournaments
            .pipe(take(1))
            .subscribe((tourns: tournament[]) => {
                if (tourns[this.tournId]) {
                    this.tournName = tourns[this.tournId].name;
                } else {
                    this.router.navigate(["/finished"]);
                }
            });
    }

    onDelete() {
        this.deleting = true;
    }

    onConfirmation(choice: string) {
        if (choice === "cancel") {
            this.deleting = false;
        } else if (choice === "confirm") {
            this.deleting = false;
            this.loading = true;
            this.db.deleteTournament("finishedTournaments", this.tournName);
        }
    }

    ngOnDestroy() {}
}
