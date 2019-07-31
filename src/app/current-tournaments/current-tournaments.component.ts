import { Component, OnInit, OnDestroy } from "@angular/core";
import { Observable } from "rxjs";
import { DocumentData } from "angularfire2/firestore";

import { DatabaseService } from "../shared/database.service";

@Component({
    selector: "app-current-tournaments",
    templateUrl: "./current-tournaments.component.html",
    styleUrls: ["./current-tournaments.component.css"],
})
export class CurrentTournamentsComponent implements OnInit, OnDestroy {
    constructor(private db: DatabaseService) {}

    currentTournaments: Observable<DocumentData[]>;

    ngOnInit() {
        this.currentTournaments = this.db.loadCurrentTournaments();
    }

    ngOnDestroy() {}
}
