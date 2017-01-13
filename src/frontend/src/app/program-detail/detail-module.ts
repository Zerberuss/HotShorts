/**
 * Created by simon41 on 12/7/2016.
 */
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../shared/shared.module";
import {CommonModule} from "@angular/common";
import {ProgramDetailComponent} from "./program-detail.component";
import {ShortcutEntryComponent} from "./shortcut-entry.component";
import {VersionPageComponent} from "../version-page/version-page.component";
import {ProgramDetailEmptyComponent} from "./program-detail-empty.component";
import {ProgramService} from "../program-search/services/program.service";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SharedModule
    ],
    declarations: [
        ProgramDetailComponent,
        ShortcutEntryComponent,
        VersionPageComponent,
        ProgramDetailEmptyComponent
    ],
    providers: [
        ProgramService
    ],
    exports: [
        ProgramDetailComponent,
        VersionPageComponent,
        ProgramDetailEmptyComponent
    ]
})
export class DetailModule {

}