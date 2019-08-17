import { Component, OnInit } from "@angular/core";
import { DocumentData } from "@angular/fire/firestore";
import {
    trigger,
    state,
    style,
    transition,
    animate,
} from "@angular/animations";
import { Observable } from "rxjs";

import { DatabaseService } from "../shared/database.service";

@Component({
    selector: "app-finished-tournaments",
    templateUrl: "./finished-tournaments.component.html",
    styleUrls: ["./finished-tournaments.component.css"],
    animations: [
        trigger("fadeInOut", [
            state(
                "void",
                style({
                    opacity: 0,
                })
            ),
            transition("void<=>*", animate("0.5s ease-in")),
        ]),
    ],
})
export class FinishedTournamentsComponent implements OnInit {
    constructor(private db: DatabaseService) {}

    finishedTournaments: Observable<DocumentData[]>;
    sidebarVisible: boolean = true;

    ngOnInit() {
        this.finishedTournaments = this.db.loadFinishedTournaments();
        if (window.innerWidth < 700) {
            this.sidebarVisible = false;
        } else {
            this.sidebarVisible = true;
        }
    }
}
