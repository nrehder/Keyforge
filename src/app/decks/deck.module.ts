import { NgModule } from "@angular/core";

import { DecksComponent } from "./decks.component";
import { ViewDeckComponent } from "./view-deck/view-deck.component";
import { CardListComponent } from "./view-deck/card-list/card-list.component";
import { TournListComponent } from "./view-deck/tourn-list/tourn-list.component";

import { SharedModule } from "../shared/shared.module";
import { RouterModule } from "@angular/router";
import { AuthGuard } from "../shared/auth.guard";

@NgModule({
    declarations: [
        DecksComponent,
        ViewDeckComponent,
        CardListComponent,
        TournListComponent,
    ],
    imports: [
        SharedModule,
        RouterModule.forChild([
            {
                path: "",
                component: DecksComponent,
                canActivate: [AuthGuard],
                children: [{ path: ":id", component: ViewDeckComponent }],
            },
        ]),
    ],
})
export class DeckModule {}
