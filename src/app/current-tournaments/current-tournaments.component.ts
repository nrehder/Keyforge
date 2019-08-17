import { Component, OnInit } from "@angular/core";
import { DocumentData } from "@angular/fire/firestore";
import {
    style,
    state,
    trigger,
    transition,
    animate,
} from "@angular/animations";
import { Observable } from "rxjs";

import { DatabaseService } from "../shared/database.service";

@Component({
    selector: "app-current-tournaments",
    templateUrl: "./current-tournaments.component.html",
    styleUrls: ["./current-tournaments.component.css"],
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
export class CurrentTournamentsComponent implements OnInit {
    constructor(private db: DatabaseService) {}

    currentTournaments: Observable<DocumentData[]>;
    sidebarVisible: boolean;

    ngOnInit() {
        this.currentTournaments = this.db.loadCurrentTournaments();
        if (window.innerWidth < 700) {
            this.sidebarVisible = false;
        } else {
            this.sidebarVisible = true;
        }
    }
}
