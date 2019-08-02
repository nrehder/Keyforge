import { Component, OnInit, Input } from "@angular/core";

@Component({
    selector: "app-tourn-list",
    templateUrl: "./tourn-list.component.html",
    styleUrls: ["./tourn-list.component.css"],
})
export class TournListComponent implements OnInit {
    @Input() tourns: {
        byes: number;
        losses: number;
        name: string;
        wins: number;
    }[];

    constructor() {}

    ngOnInit() {}
}
