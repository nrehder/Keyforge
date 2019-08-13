import { NgModule } from "@angular/core";

import { DecksComponent } from "./decks.component";
import { ViewDeckComponent } from "./view-deck/view-deck.component";
import { CardListComponent } from "./view-deck/card-list/card-list.component";
import { TournListComponent } from "./view-deck/tourn-list/tourn-list.component";

import { SharedModule } from "../shared/shared.module";
import { RouterModule } from "@angular/router";
import { AuthGuard } from "../shared/auth.guard";
import { NoDeckComponent } from "./no-deck/no-deck.component";

@NgModule({
    declarations: [
        DecksComponent,
        ViewDeckComponent,
        CardListComponent,
        TournListComponent,
        NoDeckComponent,
    ],
    imports: [
        SharedModule,
        RouterModule.forChild([
            {
                path: "",
                component: DecksComponent,
                canActivate: [AuthGuard],
                children: [
                    {
                        path: "",
                        component: NoDeckComponent,
                        pathMatch: "full",
                    },
                    { path: ":id", component: ViewDeckComponent },
                ],
            },
        ]),
    ],
})
export class DeckModule {}
