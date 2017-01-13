import { NgModule } from '@angular/core'
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import {ProgramModule} from "./program-search/program-module";
import {DetailModule} from "./program-detail/detail-module";
import {AppRouterModule} from "./app.routes";
import {HomeComponent} from "./home/home.component";


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ProgramModule,
    DetailModule,
    AppRouterModule
  ],
  declarations: [
    AppComponent, HomeComponent
  ],
  providers: [

  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {

}
