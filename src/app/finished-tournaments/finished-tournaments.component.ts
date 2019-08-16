import { Component, OnInit } from "@angular/core";
import { DocumentData } from "@angular/fire/firestore";
import { Observable } from "rxjs";

import { DatabaseService } from "../shared/database.service";

@Component({
    selector: "app-finished-tournaments",
    templateUrl: "./finished-tournaments.component.html",
    styleUrls: ["./finished-tournaments.component.css"],
})
export class FinishedTournamentsComponent implements OnInit {
    constructor(private db: DatabaseService) {}

    finishedTournaments: Observable<DocumentData[]>;
    sidebarVisible: boolean = true;
    innerWidth;

    ngOnInit() {
        this.finishedTournaments = this.db.loadFinishedTournaments();
        this.innerWidth = window.innerWidth;
        if (this.innerWidth < 600) {
            this.sidebarVisible = false;
        } else {
            this.sidebarVisible = true;
        }
    }
}
