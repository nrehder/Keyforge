import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { DocumentData } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { take } from "rxjs/operators";

import { DatabaseService } from "../../shared/database.service";
import { tournament } from "../../shared/tournament.model";
import { VariableConfirmationService } from "src/app/shared/variable-confirmation/variable-confirmation.service";

@Component({
    selector: "app-view-current-tournament",
    templateUrl: "./view-current-tournament.component.html",
    styleUrls: ["./view-current-tournament.component.css"],
})
export class ViewCurrentTournamentComponent implements OnInit {
    deleteName: string;
    tournId: number;
    currentTournaments: Observable<DocumentData[]>;
    loading: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private db: DatabaseService,
        private router: Router,
        private vcService: VariableConfirmationService
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
        this.vcService.message = "delete " + tournName;
        this.vcService.choice.pipe(take(1)).subscribe(res => {
            this.onConfirmation(res);
        });
    }

    onConfirmation(choice: string) {
        this.vcService.message = "";
        if (choice === "confirm") {
            this.loading = true;
            this.db.deleteTournament("currentTournaments", this.deleteName);
        }
        this.deleteName = "";
    }
}
