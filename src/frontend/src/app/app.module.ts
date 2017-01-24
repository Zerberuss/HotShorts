import { NgModule } from '@angular/core'
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import {AppRouterModule, APP_ROUTES_MODULE_PROVIDER} from "./app.routes";
import {HomeComponent} from "./home/home.component";
import {ProgramCreateComponent} from "./program-forms/program-create.component";
import {SharedModule} from "./shared/shared.module";


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    SharedModule,
    AppRouterModule
  ],
  declarations: [
    AppComponent, HomeComponent, ProgramCreateComponent
  ],
  providers: [
    APP_ROUTES_MODULE_PROVIDER
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {

}
