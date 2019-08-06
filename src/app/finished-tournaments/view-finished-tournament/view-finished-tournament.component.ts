import { Component, OnInit, OnChanges, AfterContentInit } from "@angular/core";
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
    tournId: number;
    finishedTournaments: Observable<DocumentData[]>;
    deleting: boolean = false;
    loading: boolean = false;
    deleteName: string = "";

    constructor(
        private route: ActivatedRoute,
        private db: DatabaseService,
        private router: Router
    ) {}

    ngOnInit() {
        this.finishedTournaments = this.db.loadFinishedTournaments();
        this.route.params.subscribe((params: Params) => {
            this.tournId = +params["id"];
        });
        this.finishedTournaments
            .pipe(take(1))
            .subscribe((tourns: tournament[]) => {
                if (!tourns[this.tournId]) {
                    this.router.navigate(["/finished"]);
                }
            });
    }

    onDelete(tournName: string) {
        this.deleteName = tournName;
        this.deleting = true;
    }

    onConfirmation(choice: string) {
        if (choice === "cancel") {
            this.deleting = false;
            this.deleteName = "";
        } else if (choice === "confirm") {
            this.deleting = false;
            this.loading = true;
            this.db.deleteTournament("finishedTournaments", this.deleteName);
        }
    }

    ngOnDestroy() {}
}
