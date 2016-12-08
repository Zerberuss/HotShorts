/**
 * Created by simon41 on 12/7/2016.
 */
import { NgModule } from '@angular/core';
import {AppComponent} from "./app.component";
import {ProgramDetailComponent} from "./program-detail/program-detail.component";
import {RouterModule, Routes} from "@angular/router";
import {VersionPageComponent} from "./version-page/version-page.component";
import {ProgramModule} from "./program-search/program-module";
import {DetailModule} from "./program-detail/detail-module";
import {ProgramDetailEmptyComponent} from "./program-detail/program-detail-empty.component";
import {ProgramSearchComponent} from "./program-search/program-search.component";

//https://angular.io/docs/ts/latest/guide/router.html
const appRoutes: Routes = [
    { path: 'app/:name',
        component: VersionPageComponent,
        children: [
            {path:'',component: ProgramDetailEmptyComponent},
            {path:'version/:id',component: ProgramDetailComponent}
        ]
    }
    ,
    // { path: 'versions/:id',
    //     component: VersionPageComponent }
    // ,
    { path: '', component: ProgramSearchComponent }
    //, { path: '**', component: PageNotFoundComponent }
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {}