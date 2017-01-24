/**
 * Created by simon41 on 12/4/2016.
 */

import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../shared/shared.module";
import {CommonModule} from "@angular/common";
import {ProgramSearchComponent} from "./program-search.component";
import {ProgramEntryComponent} from "./program-entry.component";
import {ProgramService} from "./services/program.service";
import {ProgramEditComponent} from "../program-forms/program-edit.component";
import {VersionCreateComponent} from "../program-forms/version-create.component";
import {VersionEditComponent} from "../program-forms/version-edit.component";
import {ShortcutCreateComponent} from "../program-forms/shortcut-create.component";
import {ShortcutEditComponent} from "../program-forms/shortcut-edit.component";
import {ProgramsRouterModule} from "./program.routes";
import {DetailModule} from "../program-detail/detail-module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        DetailModule,
        ProgramsRouterModule
    ],
    declarations: [
        ProgramSearchComponent,
        ProgramEntryComponent,
        ProgramEditComponent,
        VersionCreateComponent,
        VersionEditComponent,
        ShortcutCreateComponent,
        ShortcutEditComponent
    ],
    providers: [
        ProgramService
    ],
    exports: [

    ]
})
export class ProgramModule {

}

