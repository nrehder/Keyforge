import { Component, OnInit, Input } from "@angular/core";

import { tournament } from "../tournament.model";

@Component({
    selector: "app-standings-table",
    templateUrl: "./standings-table.component.html",
    styleUrls: ["./standings-table.component.css"],
})
export class StandingsTableComponent implements OnInit {
    @Input() tourn: tournament;
    @Input() round: number;

    constructor() {}

    ngOnInit() {}
}
