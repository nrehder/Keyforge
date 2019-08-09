import { NgModule } from "@angular/core";

import { DecksComponent } from "./decks.component";
import { ViewDeckComponent } from "./view-deck/view-deck.component";
import { CardListComponent } from "./view-deck/card-list/card-list.component";
import { TournListComponent } from "./view-deck/tourn-list/tourn-list.component";

import { SharedModule } from "../shared/shared.module";

@NgModule({
    declarations: [
        DecksComponent,
        ViewDeckComponent,
        CardListComponent,
        TournListComponent,
    ],
    imports: [SharedModule],
})
export class DeckModule {}
