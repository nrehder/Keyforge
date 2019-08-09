import { NgModule } from "@angular/core";
import { Routes, RouterModule, PreloadAllModules } from "@angular/router";

import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { AuthGuard } from "./shared/auth.guard";
import { LoginGuard } from "./shared/login.guard";

import { UsernameComponent } from "./login/username/username.component";
import { UserManageLinkComponent } from "./login/user-manage-link/user-manage-link.component";
import { UserComponent } from "./user/user.component";

const routes: Routes = [
    { path: "", component: HomeComponent },
    {
        path: "tournaments",
        loadChildren:
            "./current-tournaments/current-tournament.module#CurrentTournamentModule",
    },
    {
        path: "finished",
        loadChildren: "./finished-tournaments/finished.module#FinishedModule",
    },
    {
        path: "decks",
        loadChildren: "./decks/deck.module#DeckModule",
    },
    { path: "user", canActivate: [AuthGuard], component: UserComponent },
    { path: "username", component: UsernameComponent },
    { path: "login", canActivate: [LoginGuard], component: LoginComponent },
    { path: "userManageLink", component: UserManageLinkComponent },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
