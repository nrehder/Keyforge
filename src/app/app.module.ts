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

import { CreatetournComponent } from './tournaments/createtourn/createtourn.component';
import { TournamentsComponent } from './tournaments/tournaments.component';
import { ManagetournComponent } from './tournaments/managetourn/managetourn.component';
import { FinishedTournamentsComponent } from './tournaments/finished-tournaments/finished-tournaments.component';
import { ManageviewComponent } from './tournaments/managetourn/manageview/manageview.component';
import { ManagelistComponent } from './tournaments/managetourn/managelist/managelist.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    CreatetournComponent,
    TournamentsComponent,
    ManagetournComponent,
    UserComponent,
    FinishedTournamentsComponent,
    ManageviewComponent,
    ManagelistComponent
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
