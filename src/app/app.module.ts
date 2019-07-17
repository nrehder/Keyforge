import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireModule } from 'angularfire2'

import { environment } from '../environments/environment'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { UserComponent } from './user/user.component';

import { CurrentTournamentsComponent } from './current-tournaments/current-tournaments.component';
import { ViewCurrentTournamentComponent } from './current-tournaments/view-current-tournament/view-current-tournament.component';
import { RunCurrentTournamentComponent } from './current-tournaments/view-current-tournament/run-current-tournament/run-current-tournament.component';
import { CreateTournamentComponent } from './current-tournaments/create-tournament/create-tournament.component';
import { ViewFinishedTournamentComponent } from './finished-tournaments/view-finished-tournament/view-finished-tournament.component';
import { FullFinishedTournamentComponent } from './finished-tournaments/view-finished-tournament/full-finished-tournament/full-finished-tournament.component';

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
    FullFinishedTournamentComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
