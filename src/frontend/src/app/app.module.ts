import { NgModule } from '@angular/core'
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import {ProgramModule} from "./program-search/program-module";
import {RouterModule, Routes} from "@angular/router";
import {DetailModule} from "./program-detail/detail-module";
import {ProgramDetailComponent} from "./program-detail/program-detail.component";
//import {PassengerSearchComponent} from "./program-search/passenger-search.component";
//import {OSVersionPipe} from "./shared/pipes/os-version.pipe";
//import {SharedModule} from "./shared/shared.module";

//https://angular.io/docs/ts/latest/guide/router.html
const appRoutes: Routes = [
  { path: 'detail/:id',
    component: ProgramDetailComponent }
  ,
  { path: '', component: AppComponent }
  //, { path: '**', component: PageNotFoundComponent }
];



@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ProgramModule,
    DetailModule,
    RouterModule.forRoot(appRoutes)
  ],
  declarations: [
    AppComponent
  ],
  providers: [
    // { provide: FlightService, useClass: FlightService }
    // FlightService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {

}
