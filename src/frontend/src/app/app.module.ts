import { NgModule } from '@angular/core'
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import {ProgramModule} from "./program-search/program-module";
//import {PassengerSearchComponent} from "./program-search/passenger-search.component";
//import {OSVersionPipe} from "./shared/pipes/os-version.pipe";
//import {SharedModule} from "./shared/shared.module";


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ProgramModule
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
