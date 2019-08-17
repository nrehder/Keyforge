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
    selector: "app-decks",
    templateUrl: "./decks.component.html",
    styleUrls: ["./decks.component.css"],
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
export class DecksComponent implements OnInit {
    decks: Observable<DocumentData[]>;
    sidebarVisible: boolean = true;

    constructor(private db: DatabaseService) {}

    ngOnInit() {
        this.decks = this.db.loadDecks();
        if (window.innerWidth < 700) {
            this.sidebarVisible = false;
        } else {
            this.sidebarVisible = true;
        }
    }
}
