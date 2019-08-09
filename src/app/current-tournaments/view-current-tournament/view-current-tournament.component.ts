import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { DocumentData } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { take } from "rxjs/operators";

import { DatabaseService } from "../../shared/database.service";
import { tournament } from "../../shared/tournament.model";

@Component({
    selector: "app-view-current-tournament",
    templateUrl: "./view-current-tournament.component.html",
    styleUrls: ["./view-current-tournament.component.css"],
})
export class ViewCurrentTournamentComponent implements OnInit, OnDestroy {
    deleteName: string;
    tournId: number;
    currentTournaments: Observable<DocumentData[]>;
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

        this.currentTournaments = this.db.loadCurrentTournaments();
        this.currentTournaments
            .pipe(take(1))
            .subscribe((tourns: tournament[]) => {
                if (!tourns[this.tournId]) {
                    this.router.navigate(["/tournaments"]);
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
            this.db.deleteTournament("currentTournaments", this.deleteName);
        }
    }

    ngOnDestroy() {}
}
