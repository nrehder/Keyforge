import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";

import { RxReactiveFormsModule } from "@rxweb/reactive-form-validators";

import { environment } from "../environments/environment";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HeaderComponent } from "./header/header.component";
import { UserComponent } from "./user/user.component";
import { HomeComponent } from "./home/home.component";

import { CurrentTournamentsComponent } from "./current-tournaments/current-tournaments.component";
import { ViewCurrentTournamentComponent } from "./current-tournaments/view-current-tournament/view-current-tournament.component";
import { RunCurrentTournamentComponent } from "./current-tournaments/view-current-tournament/run-current-tournament/run-current-tournament.component";
import { CreateTournamentComponent } from "./current-tournaments/create-tournament/create-tournament.component";
import { NoTournamentComponent } from "./current-tournaments/no-tournament/no-tournament.component";

import { FinishedTournamentsComponent } from "./finished-tournaments/finished-tournaments.component";
import { ViewFinishedTournamentComponent } from "./finished-tournaments/view-finished-tournament/view-finished-tournament.component";
import { FullFinishedTournamentComponent } from "./finished-tournaments/view-finished-tournament/full-finished-tournament/full-finished-tournament.component";

import { LoadingSpinnerComponent } from "./shared/loading-spinner/loading-spinner.component";
import { VariableConfirmationComponent } from "./shared/variable-confirmation/variable-confirmation.component";
import { DeckNamePipe } from "./shared/deck-name.pipe";
import { AlertComponent } from "./shared/alert/alert.component";

import { LoginComponent } from "./login/login.component";

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        UserComponent,
        CurrentTournamentsComponent,
        ViewCurrentTournamentComponent,
        RunCurrentTournamentComponent,
        CreateTournamentComponent,
        ViewFinishedTournamentComponent,
        FullFinishedTournamentComponent,
        FinishedTournamentsComponent,
        HomeComponent,
        NoTournamentComponent,
        LoadingSpinnerComponent,
        VariableConfirmationComponent,
        DeckNamePipe,
        LoginComponent,
        AlertComponent,
    ],
    imports: [
        BrowserModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        AngularFireAuthModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RxReactiveFormsModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
