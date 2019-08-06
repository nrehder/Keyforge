import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { DocumentData } from "@angular/fire/firestore";
import { Observable } from "rxjs";

import { DatabaseService } from "../../shared/database.service";
import {
    DeckData,
    DeckRetrievalService,
} from "../../shared/deck-retrieval.service";
import { take } from "rxjs/operators";

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

    constructor(
        private db: DatabaseService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            this.deckId = +params["id"];
        });

        this.decks = this.db.loadDecks();
        this.decks.pipe(take(1)).subscribe(decks => {
            if (!decks[this.deckId]) {
                this.router.navigate(["decks"]);
            }
        });
    }

    onUnofficial() {
        this.unofficial = true;
    }

    onOfficial() {
        this.unofficial = false;
    }
}
