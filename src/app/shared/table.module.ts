import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { StandingsTableComponent } from "./standings-table/standings-table.component";
import { PairingsTableComponent } from "./pairings-table/pairings-table.component";
import { SingleElimTableComponent } from "./single-elim-table/single-elim-table.component";
import { DeckNamePipe } from "./deck-name.pipe";

@NgModule({
    declarations: [
        StandingsTableComponent,
        PairingsTableComponent,
        SingleElimTableComponent,
        DeckNamePipe,
    ],
    imports: [CommonModule],
    exports: [
        StandingsTableComponent,
        PairingsTableComponent,
        SingleElimTableComponent,
        DeckNamePipe,
    ],
})
export class TableModule {}
