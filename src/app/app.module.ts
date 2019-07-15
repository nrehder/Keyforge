import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { CreatetournComponent } from './tournaments/createtourn/createtourn.component';
import { TournamentsComponent } from './tournaments/tournaments.component';
import { ManagetournComponent } from './tournaments/managetourn/managetourn.component';
import { ViewtournComponent } from './tournaments/viewtourn/viewtourn.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    CreatetournComponent,
    TournamentsComponent,
    ManagetournComponent,
    ViewtournComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
