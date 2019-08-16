import { Component, OnInit } from "@angular/core";
import { DocumentData } from "@angular/fire/firestore";
import { Observable } from "rxjs";

import { DatabaseService } from "../shared/database.service";

@Component({
    selector: "app-current-tournaments",
    templateUrl: "./current-tournaments.component.html",
    styleUrls: ["./current-tournaments.component.css"],
})
export class CurrentTournamentsComponent implements OnInit {
    constructor(private db: DatabaseService) {}

    currentTournaments: Observable<DocumentData[]>;
    sidebarVisible: boolean = true;

    ngOnInit() {
        this.currentTournaments = this.db.loadCurrentTournaments();
    }
}
