/**
 * Created by simon41 on 12/7/2016.
 */
import {Component} from "@angular/core";
import {ProgramService} from "../program-search/services/program.service";
import {VersionService} from "../version-page/services/version.service";
import {ActivatedRoute, Router, Params} from "@angular/router";
import {Shortcut} from "../entities/shortcuts";
import {ProgramVersion} from "../entities/programVersions";

@Component({
    selector:'program-detail',
    templateUrl:'./program-detail.component.html',
    providers: [ProgramService, VersionService]

})

export class ProgramDetailComponent{

    shortcuts:Shortcut[];
    shortcutsLink:string;
    versionInfo:ProgramVersion;
    id: any;
    paramsSub: any;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private service: VersionService,
                private programService:ProgramService) {


    }

    ngOnInit() {
        this.paramsSub = this.route.params.subscribe(params => this.id = +params['id']); //+ for turning the id string into a number
        this.loadVersion();
    }

    ngOnDestroy() {
        this.paramsSub.unsubscribe();
    }

    loadVersion(){
        this.programService.getVersionFromServer(this.id)
            .subscribe(
                (version:ProgramVersion) => {
                    this.shortcutsLink = version["_links"]["shortcuts"]["href"];
                    this.versionInfo = version;
                    this.loadShortcuts();
                },
                (err) => {
                    console.error('Fehler beim Laden der Version in ngOnInit', err);
                }
            );
    }

    loadShortcuts(){
        this.programService.getUrlContentAsJson(this.shortcutsLink).subscribe(
            (shortcutsJson) => {
                this.shortcuts = this.programService.accessShortcutsFromJson(shortcutsJson);
            },
            (err) => {
                console.error('Fehler beim Laden der Shortcuts in loadShortcuts', err);
            }

        );
    }
}