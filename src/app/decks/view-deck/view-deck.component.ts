import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { DocumentData } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { take } from "rxjs/operators";

import { DatabaseService } from "../../shared/database.service";
import { deck } from "../../shared/deck.model";
import {
    DeckData,
    DeckRetrievalService,
} from "../../shared/deck-retrieval.service";

@Component({
    selector: "app-view-deck",
    templateUrl: "./view-deck.component.html",
    styleUrls: ["./view-deck.component.css"],
})
export class ViewDeckComponent implements OnInit {
    deckId: number;
    decks: Observable<DocumentData[]>;
    keyforgeDeck: DeckData;

    constructor(
        private db: DatabaseService,
        private route: ActivatedRoute,
        private router: Router,
        private deckRetrieval: DeckRetrievalService
    ) {}

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            this.deckId = +params["id"];
        });

        this.decks = this.db.loadDecks();
    }
}
