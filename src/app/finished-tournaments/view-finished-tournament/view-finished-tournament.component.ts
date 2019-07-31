import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { DocumentData } from "@angular/fire/firestore";
import { ActivatedRoute, Params } from "@angular/router";
import { DatabaseService } from "src/app/shared/database.service";
import { take } from "rxjs/operators";
import { tournament } from "src/app/shared/tournament.model";

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
                        "finished",
                        tourns[this.tournId].name
                    );
                });
        }
    }

    ngOnDestroy() {}
}
