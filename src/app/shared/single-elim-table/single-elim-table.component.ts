import { Component, OnInit, Input } from "@angular/core";

import { tournament } from "../tournament.model";

@Component({
    selector: "app-single-elim-table",
    templateUrl: "./single-elim-table.component.html",
    styleUrls: ["./single-elim-table.component.css"],
})
export class SingleElimTableComponent implements OnInit {
    @Input() tourn: tournament;
    @Input() round: number;
    @Input() running: boolean;
    rounds = [];
    showDecks = false;
    showChains = false;

    constructor() {}

    ngOnInit() {
        let numPlayers = this.tourn.rounds[0].singleElim.length;
        for (let i = 0; i < this.tourn.maxRounds + 1; i++) {
            let round = [];
            if (numPlayers > 1) {
                for (let j = 0; j < numPlayers / 2; j++) {
                    round.push({
                        space1: "a",
                        space2: "a",
                    });
                }
            } else {
                round.push({
                    space1: "a",
                });
            }

            this.rounds.push(round);
            numPlayers /= 2;
        }
    }

    onShowDecks() {
        this.showDecks = !this.showDecks;
    }
    onShowChains() {
        this.showChains = !this.showChains;
    }
}
