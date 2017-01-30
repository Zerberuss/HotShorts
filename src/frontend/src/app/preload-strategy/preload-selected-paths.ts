import {PreloadingStrategy, Route} from "@angular/router";
import {Observable} from "rxjs";
import {of} from "rxjs/observable/of";


export class PreloadSelectedPaths implements PreloadingStrategy {

    preload(route: Route, fn: () => Observable<any>): Observable<any> {

        if (route.data['preload']) {
            return fn();
        }
        else {
            return Observable.of(null);
        }
    }
}
