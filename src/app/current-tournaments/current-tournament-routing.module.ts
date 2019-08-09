import { Routes, RouterModule } from "@angular/router";
import { CurrentTournamentsComponent } from "./current-tournaments.component";
import { AuthGuard } from "../shared/auth.guard";
import { NoTournamentComponent } from "./no-tournament/no-tournament.component";
import { CreateTournamentComponent } from "./create-tournament/create-tournament.component";
import { ViewCurrentTournamentComponent } from "./view-current-tournament/view-current-tournament.component";
import { RunCurrentTournamentComponent } from "./view-current-tournament/run-current-tournament/run-current-tournament.component";
import { NgModule } from "@angular/core";

const routes: Routes = [
    {
        path: "",
        component: CurrentTournamentsComponent,
        canActivate: [AuthGuard],
        children: [
            { path: "", component: NoTournamentComponent, pathMatch: "full" },
            { path: "create", component: CreateTournamentComponent },
            { path: ":id", component: ViewCurrentTournamentComponent },
            { path: ":id/run", component: RunCurrentTournamentComponent },
        ],
    },
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CurrentTournamentsRoutingModule {}
