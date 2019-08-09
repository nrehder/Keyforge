import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

import { tournament } from "../tournament.model";
import { debounceTime } from "rxjs/operators";
import { Subject } from "rxjs";

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
    debouncer: Subject<{ index: number; winner: string }> = new Subject();

    constructor() {}

    ngOnInit() {
        this.debouncer.pipe(debounceTime(150)).subscribe(value => {
            this.clickPlayer.emit(value);
        });
    }

    onClickPlayer(index: number, winner: string) {
        if (this.running && winner !== "BYE") {
            this.debouncer.next({
                index: index,
                winner: winner,
            });
        }
    }
}
