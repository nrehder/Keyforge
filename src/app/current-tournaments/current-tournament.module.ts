import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RxReactiveFormsModule } from "@rxweb/reactive-form-validators";

import { TableModule } from "../shared/table.module";
import { SharedModule } from "../shared/shared.module";

import { CurrentTournamentsComponent } from "./current-tournaments.component";
import { ViewCurrentTournamentComponent } from "./view-current-tournament/view-current-tournament.component";
import { RunCurrentTournamentComponent } from "./view-current-tournament/run-current-tournament/run-current-tournament.component";
import { CreateTournamentComponent } from "./create-tournament/create-tournament.component";
import { NoTournamentComponent } from "./no-tournament/no-tournament.component";

@NgModule({
    declarations: [
        CurrentTournamentsComponent,
        ViewCurrentTournamentComponent,
        RunCurrentTournamentComponent,
        CreateTournamentComponent,
        NoTournamentComponent,
    ],
    imports: [
        ReactiveFormsModule,
        RxReactiveFormsModule,
        TableModule,
        SharedModule,
    ],
})
export class CurrentTournamentModule {}
