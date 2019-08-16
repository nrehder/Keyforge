import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";

import { AuthGuard } from "../shared/auth.guard";

import { FinishedTournamentsComponent } from "./finished-tournaments.component";
import { ViewFinishedTournamentComponent } from "./view-finished-tournament/view-finished-tournament.component";
import { FullFinishedTournamentComponent } from "./view-finished-tournament/full-finished-tournament/full-finished-tournament.component";

import { NoTournamentComponent } from "../shared/no-tournament/no-tournament.component";

const routes: Routes = [
    {
        path: "",
        component: FinishedTournamentsComponent,
        canActivate: [AuthGuard],
        children: [
            { path: "", component: NoTournamentComponent, pathMatch: "full" },
            { path: ":id", component: ViewFinishedTournamentComponent },
            { path: ":id/history", component: FullFinishedTournamentComponent },
        ],
    },
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class FinishedTournamentsRoutingModule {}
