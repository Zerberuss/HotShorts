/**
 * Created by simon41 on 11/30/2016.
 */
import {NgModule} from "@angular/core";
import { CommonModule} from '@angular/common';
import {OSVersionPipe} from "./pipes/os-version.pipe";
import {BASE_URL, PROGRAMS_URL, VERSIONS_URL, SHORTCUTS_URL} from '../app.tokens';
import {DecimalPipe} from "./pipes/decimal-pipe";
import {ProgramFilterPipe} from "./pipes/filter-pipe";
import {UniversalFilterPipe} from "./pipes/universal-filter.pipe";

const BASE_URL_FOR_PRODUCTION = "http://localhost:8080/";
const PROGRAM_URL_DEV = "http://localhost:8080/programs";
const VERSION_URL_DEV = "http://localhost:8080/programVersions";
const SHORTCUT_URL_DEV = "http://localhost:8080/shortcuts";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    OSVersionPipe, DecimalPipe, ProgramFilterPipe, UniversalFilterPipe
  ],
  providers: [
    { provide: BASE_URL, useValue: BASE_URL_FOR_PRODUCTION},
    { provide: PROGRAMS_URL, useValue: PROGRAM_URL_DEV},
    { provide: VERSIONS_URL, useValue: VERSION_URL_DEV},
    { provide: SHORTCUTS_URL, useValue: SHORTCUT_URL_DEV}
  ],
  exports: [
    OSVersionPipe, DecimalPipe, ProgramFilterPipe, UniversalFilterPipe
  ]

})
export class SharedModule {

}
