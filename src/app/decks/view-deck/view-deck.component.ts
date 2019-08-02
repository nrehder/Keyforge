import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { DocumentData } from "@angular/fire/firestore";
import { Observable } from "rxjs";

import { DatabaseService } from "../../shared/database.service";
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
    unofficial = true;

    constructor(private db: DatabaseService, private route: ActivatedRoute) {}

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            this.deckId = +params["id"];
        });

        this.decks = this.db.loadDecks();
    }

    onUnofficial() {
        this.unofficial = true;
    }

    onOfficial() {
        this.unofficial = false;
    }
}
