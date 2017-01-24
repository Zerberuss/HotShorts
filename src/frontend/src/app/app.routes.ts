import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import {PreloadSelectedPaths} from "./preload-strategy/preload-selected-paths";
import {ProgramCreateComponent} from "./program-forms/program-create.component";

const APP_ROUTES: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        //lazy loading module
        path: 'programs',
        loadChildren: './program-search/program-module#ProgramModule',
        data: {preload:true}
    },
    {
        path: 'program-create',
        component: ProgramCreateComponent
    }
    /*,
    {
        path: '**',
        redirectTo: 'home'
    }*/


];

export const AppRouterModule
    = RouterModule.forRoot(APP_ROUTES, { preloadingStrategy: PreloadSelectedPaths });

export const APP_ROUTES_MODULE_PROVIDER = [PreloadSelectedPaths];