import { Component, OnInit } from "@angular/core";
import { DatabaseService } from "../shared/database.service";
import { Observable } from "rxjs";
import { DocumentData } from "@angular/fire/firestore";

@Component({
    selector: "app-finished-tournaments",
    templateUrl: "./finished-tournaments.component.html",
    styleUrls: ["./finished-tournaments.component.css"],
})
export class FinishedTournamentsComponent implements OnInit {
    constructor(private db: DatabaseService) {}

    finishedTournaments: Observable<DocumentData[]>;

    ngOnInit() {
        this.finishedTournaments = this.db.loadFinishedTournaments();
    }
}
