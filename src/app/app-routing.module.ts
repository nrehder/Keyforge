import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { AuthGuard } from "./shared/auth.guard";
import { LoginGuard } from "./shared/login.guard";

import { CurrentTournamentsComponent } from "./current-tournaments/current-tournaments.component";
import { CreateTournamentComponent } from "./current-tournaments/create-tournament/create-tournament.component";
import { ViewCurrentTournamentComponent } from "./current-tournaments/view-current-tournament/view-current-tournament.component";
import { RunCurrentTournamentComponent } from "./current-tournaments/view-current-tournament/run-current-tournament/run-current-tournament.component";
import { NoTournamentComponent } from "./current-tournaments/no-tournament/no-tournament.component";

import { FinishedTournamentsComponent } from "./finished-tournaments/finished-tournaments.component";
import { ViewFinishedTournamentComponent } from "./finished-tournaments/view-finished-tournament/view-finished-tournament.component";
import { FullFinishedTournamentComponent } from "./finished-tournaments/view-finished-tournament/full-finished-tournament/full-finished-tournament.component";
import { DecksComponent } from "./decks/decks.component";
import { ViewDeckComponent } from "./decks/view-deck/view-deck.component";
import { UsernameComponent } from "./login/username/username.component";
import { UserManageLinkComponent } from "./login/user-manage-link/user-manage-link.component";

const routes: Routes = [
    { path: "", component: HomeComponent },
    {
        path: "tournaments",
        component: CurrentTournamentsComponent,
        canActivate: [AuthGuard],
        children: [
            { path: "", component: NoTournamentComponent, pathMatch: "full" },
            { path: "create", component: CreateTournamentComponent },
            { path: ":id", component: ViewCurrentTournamentComponent },
            { path: ":id/run", component: RunCurrentTournamentComponent },
        ],
    },
    {
        path: "finished",
        component: FinishedTournamentsComponent,
        canActivate: [AuthGuard],
        children: [
            { path: ":id", component: ViewFinishedTournamentComponent },
            { path: ":id/history", component: FullFinishedTournamentComponent },
        ],
    },
    {
        path: "decks",
        component: DecksComponent,
        canActivate: [AuthGuard],
        children: [{ path: ":id", component: ViewDeckComponent }],
    },
    { path: "username", component: UsernameComponent },
    { path: "login", canActivate: [LoginGuard], component: LoginComponent },
    { path: "userManageLink", component: UserManageLinkComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
