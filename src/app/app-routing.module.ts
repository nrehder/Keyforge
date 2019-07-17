import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import { UserComponent } from './user/user.component';
// import { TournamentsComponent } from './tournaments/tournaments.component';
// import { CreatetournComponent } from './tournaments/createtourn/createtourn.component';
// import { ManagetournComponent } from './tournaments/managetourn/managetourn.component';

const routes: Routes = [
  // {path:"",redirectTo:"/tournaments",pathMatch:"full"},
  // {path:"tournaments",component:TournamentsComponent,children:[
  //   {path:"create",component:CreatetournComponent},
  //   {path:"manage",component:ManagetournComponent}
  // ]},
  // {path:"login",component:UserComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
