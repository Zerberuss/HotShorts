import { Routes, RouterModule } from '@angular/router';
import {ProgramDetailComponent} from "../program-detail/program-detail.component";
import {ProgramDetailEmptyComponent} from "../program-detail/program-detail-empty.component";
import {VersionPageComponent} from "../program-detail/version-page.component";
import {ProgramEditComponent} from "../program-forms/program-edit.component";
import {VersionCreateComponent} from "../program-forms/version-create.component";
import {VersionEditComponent} from "../program-forms/version-edit.component";
import {ShortcutCreateComponent} from "../program-forms/shortcut-create.component";
import {ShortcutEditComponent} from "../program-forms/shortcut-edit.component";
import {ProgramSearchComponent} from "../program-search/program-search.component";
import {ProgramCreateComponent} from "../program-forms/program-create.component";


const PROGRAM_ROUTES: Routes = [
    {
        path: '',
        redirectTo: 'program-search',
        pathMatch: 'full'
    },
    { path: 'app/:name',
        component: VersionPageComponent,
        children: [
            {path:'',component: ProgramDetailEmptyComponent},
            {path:'version/:id',component: ProgramDetailComponent}
        ]
    },
    {
        path: 'program-search',
        component: ProgramSearchComponent
    },
    {
        path: 'program-create',
        component: ProgramCreateComponent
    },
    {
        path: 'program-edit/:id',
        component: ProgramEditComponent
    },
    {
        //the foreign key referencing the program name has to be predefined and cannot be edited! Version can only be created for an existing application
        path: 'version-create',
        component: VersionCreateComponent
    },
    {
        path: 'version-edit/:id',
        component: VersionEditComponent
    },
    {
    //the foreign key referencing the version id has to be predefined and cannot be edited! Shortcut can only be created for an existing Version
        path: 'shortcut-create',
        component: ShortcutCreateComponent
    },
    {
        path: 'shortcut-edit/:id',
        component: ShortcutEditComponent
    }

];
//All Modules that use Routing should import RouterModule. Do not forget
export const ProgramsRouterModule
    = RouterModule.forChild(PROGRAM_ROUTES);

