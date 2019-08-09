import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";

import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";

import { environment } from "../environments/environment";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { HeaderComponent } from "./header/header.component";
import { UserComponent } from "./user/user.component";
import { HomeComponent } from "./home/home.component";

import { LoginComponent } from "./login/login.component";
import { UsernameComponent } from "./login/username/username.component";
import { UserManageLinkComponent } from "./login/user-manage-link/user-manage-link.component";

import { CurrentTournamentModule } from "./current-tournaments/current-tournament.module";
import { FinishedModule } from "./finished-tournaments/finished.module";
import { DeckModule } from "./decks/deck.module";
import { TableModule } from "./shared/table.module";
import { SharedModule } from "./shared/shared.module";

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        HomeComponent,
        UserComponent,
        LoginComponent,
        UsernameComponent,
        UserManageLinkComponent,
    ],
    imports: [
        BrowserModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        AngularFireAuthModule,
        AppRoutingModule,
        HttpClientModule,
        CurrentTournamentModule,
        FinishedModule,
        DeckModule,
        TableModule,
        SharedModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
