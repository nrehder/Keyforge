import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Observable } from "rxjs";
import { DatabaseService } from "src/app/shared/database.service";
import { DocumentData } from "@angular/fire/firestore";
import { take } from "rxjs/operators";
import { tournament } from "src/app/shared/tournament.model";

@Component({
    selector: "app-view-current-tournament",
    templateUrl: "./view-current-tournament.component.html",
    styleUrls: ["./view-current-tournament.component.css"],
})
export class ViewCurrentTournamentComponent implements OnInit, OnDestroy {
    tournName: string;
    tournId: number;
    currentTournaments: Observable<DocumentData[]>;
    deleting: boolean = false;
    loading: boolean = false;

    constructor(private route: ActivatedRoute, private db: DatabaseService) {}

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            this.tournId = +params["id"];
        });

        this.currentTournaments = this.db.loadCurrentTournaments();
        this.currentTournaments
            .pipe(take(1))
            .subscribe((tourns: tournament[]) => {
                this.tournName = tourns[this.tournId].name;
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
            this.db
                .loadCurrentTournaments()
                .pipe(take(1))
                .subscribe((tourns: tournament[]) => {
                    this.db.deleteTournament(
                        "currentTournament",
                        tourns[this.tournId].name
                    );
                });
        }
    }

    ngOnDestroy() {}
}
