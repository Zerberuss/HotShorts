/**
 * Created by simon41 on 12/4/2016.
 */

import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../shared/shared.module";
import {CommonModule} from "@angular/common";
import {ProgramSearchComponent} from "./program-search.component";
import {ProgramEntryComponent} from "./program-entry.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SharedModule
    ],
    declarations: [
        ProgramSearchComponent, ProgramEntryComponent
    ],
    exports: [
        ProgramSearchComponent
    ]
})
export class ProgramModule {

}

