import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";

import { TableModule } from "../shared/table.module";
import { SharedModule } from "../shared/shared.module";

import { CurrentTournamentsComponent } from "./current-tournaments.component";
import { ViewCurrentTournamentComponent } from "./view-current-tournament/view-current-tournament.component";
import { RunCurrentTournamentComponent } from "./view-current-tournament/run-current-tournament/run-current-tournament.component";
import { CreateTournamentComponent } from "./create-tournament/create-tournament.component";
import { CurrentTournamentsRoutingModule } from "./current-tournament-routing.module";
import { AddDeckComponent } from './create-tournament/add-deck/add-deck.component';

@NgModule({
    declarations: [
        CurrentTournamentsComponent,
        ViewCurrentTournamentComponent,
        RunCurrentTournamentComponent,
        CreateTournamentComponent,
        AddDeckComponent,
    ],
    imports: [
        CurrentTournamentsRoutingModule,
        ReactiveFormsModule,
        TableModule,
        SharedModule,
    ],
})
export class CurrentTournamentModule {}
