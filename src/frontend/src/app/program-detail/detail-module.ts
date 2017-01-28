/**
 * Created by simon41 on 12/7/2016.
 */
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../shared/shared.module";
import {CommonModule} from "@angular/common";
import {ProgramDetailComponent} from "./program-detail.component";
import {VersionPageComponent} from "./version-page.component";
import {ProgramDetailEmptyComponent} from "./program-detail-empty.component";
import {RouterModule} from "@angular/router";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        RouterModule
    ],
    declarations: [
        ProgramDetailComponent,
        VersionPageComponent,
        ProgramDetailEmptyComponent
    ],
    providers: [
    ],
    exports: [
        ProgramDetailComponent,
        ProgramDetailEmptyComponent,
        VersionPageComponent
    ]
})
export class DetailModule {

}