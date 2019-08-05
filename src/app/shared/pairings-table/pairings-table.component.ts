import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { tournament } from "../tournament.model";

@Component({
    selector: "app-pairings-table",
    templateUrl: "./pairings-table.component.html",
    styleUrls: ["./pairings-table.component.css"],
})
export class PairingsTableComponent implements OnInit {
    @Input() tourn: tournament;
    @Input() tournType: string;
    @Input() round: number;
    @Input() running: boolean;
    @Input() displayStats: boolean;
    @Output() clickPlayer: EventEmitter<{
        index: number;
        winner: string;
    }> = new EventEmitter();

    constructor() {}

    ngOnInit() {}

    onClickPlayer(index: number, winner: string) {
        if (this.running && winner !== "BYE") {
            this.clickPlayer.emit({
                index,
                winner,
            });
        }
    }
}
