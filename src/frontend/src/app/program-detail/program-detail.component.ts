/**
 * Created by simon41 on 12/7/2016.
 */
import {Component} from "@angular/core";
import {ProgramService} from "../program-search/services/program.service";
import {ActivatedRoute, Router, Params} from "@angular/router";
import {Shortcut} from "../entities/shortcuts";
import {ProgramVersion} from "../entities/programVersions";

@Component({
    selector:'program-detail',
    templateUrl:'./program-detail.component.html'
    //,providers: [ProgramService]

})

export class ProgramDetailComponent{

    shortcuts:Shortcut[];
    shortcutsLink:string;
    versionInfo:ProgramVersion;
    id: any;
    paramsSub: any;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private programService:ProgramService) {


    }

    ngOnInitOld() {
        this.paramsSub = this.route.params.subscribe(params => this.id = +params['id']); //+ for turning the id string into a number
        this.loadVersion();
    }

    ngOnInit() {
        //if we subscribe the the route params, every time the params change, the function inside subscribe is called
        this.paramsSub = this.route.params.subscribe(params => this.loadVersionWithIdAndStoreId(+params['id'])); //+ for turning the id string into a number
    }

    ngOnDestroy() {
        this.paramsSub.unsubscribe();
    }

    delete(shortcut:Shortcut){
        this.programService.deleteShortcut(shortcut);
    }

    goToShortcutCreate(){
        //store the current program version, so that the create page knows for what verion the new shortcut is created!
        this.programService.versionIdForNewlyCreatedShortcut = this.versionInfo.id;
        this.router.navigate(['/shortcut-create']);
    }

    //Used for saving the current site inside a variable, so that we can return to it, after we finished editing a shortcut etc.
    storeCurrentUrlInProgramService(){
        this.programService.currentProgramDetailUrl = this.router.url;
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

    loadVersionWithIdAndStoreId(versionId:number){
        this.storeCurrentUrlInProgramService();
        this.id = versionId;
        this.programService.getVersionFromServer(versionId)
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