import { Component, OnInit, Input } from "@angular/core";

@Component({
    selector: "app-card-list",
    templateUrl: "./card-list.component.html",
    styleUrls: ["./card-list.component.css"],
})
export class CardListComponent implements OnInit {
    @Input() cardList: {
        [rarity: string]: { name: string; img: string }[];
    };
    @Input() listType: string;
    cardCount: number;
    viewCardImg: string = "";
    viewCardName: string = "";
    viewCard: boolean = false;

    constructor() {}

    ngOnInit() {
        this.cardCount =
            this.cardList["Common"].length +
            this.cardList["Uncommon"].length +
            this.cardList["Rare"].length;
    }

    onClickCard(index: number, rarity: string) {
        this.viewCardImg = this.cardList[rarity][index].img;
        this.viewCardName = this.cardList[rarity][index].name;
        this.viewCard = true;
    }

    onClearView() {
        this.viewCard = false;
        this.viewCardImg = "";
        this.viewCardName = "";
    }
}
