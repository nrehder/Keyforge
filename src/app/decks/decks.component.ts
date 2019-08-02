import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { DocumentData } from "@angular/fire/firestore";

import { DatabaseService } from "../shared/database.service";

@Component({
    selector: "app-decks",
    templateUrl: "./decks.component.html",
    styleUrls: ["./decks.component.css"],
})
export class DecksComponent implements OnInit {
    decks: Observable<DocumentData[]>;

    constructor(private db: DatabaseService) {}

    ngOnInit() {
        this.decks = this.db.loadDecks();
    }
}
