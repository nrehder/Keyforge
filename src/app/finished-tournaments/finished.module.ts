import { NgModule } from "@angular/core";

import { ViewFinishedTournamentComponent } from "./view-finished-tournament/view-finished-tournament.component";
import { FullFinishedTournamentComponent } from "./view-finished-tournament/full-finished-tournament/full-finished-tournament.component";
import { FinishedTournamentsComponent } from "./finished-tournaments.component";

import { SharedModule } from "../shared/shared.module";
import { TableModule } from "../shared/table.module";

@NgModule({
    declarations: [
        ViewFinishedTournamentComponent,
        FullFinishedTournamentComponent,
        FinishedTournamentsComponent,
    ],
    imports: [SharedModule, TableModule],
})
export class FinishedModule {}
