import { Component, OnInit } from "@angular/core";
import { DocumentData } from "@angular/fire/firestore";
import { Observable } from "rxjs";

import { DatabaseService } from "../shared/database.service";

@Component({
    selector: "app-decks",
    templateUrl: "./decks.component.html",
    styleUrls: ["./decks.component.css"],
})
export class DecksComponent implements OnInit {
    decks: Observable<DocumentData[]>;
    sidebarVisible: boolean = true;
    innerWidth;

    constructor(private db: DatabaseService) {}

    ngOnInit() {
        this.decks = this.db.loadDecks();
        this.innerWidth = window.innerWidth;
        if (this.innerWidth < 600) {
            this.sidebarVisible = false;
        } else {
            this.sidebarVisible = true;
        }
    }
}
