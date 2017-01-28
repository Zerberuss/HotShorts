/**
 * Created by simon41 on 12/7/2016.
 */
import {Component} from "@angular/core";
import {ProgramService} from "../shared/services/program.service";
import {ActivatedRoute, Router, Params} from "@angular/router";
import {Shortcut} from "../entities/shortcuts";
import {ProgramVersion} from "../entities/programVersions";
import {isNullOrUndefined} from "util";

@Component({
    selector:'program-detail',
    templateUrl:'./program-detail.component.html',
    styleUrls: ['../styles/hotshorts-main.css']
    //,providers: [ProgramService]

})

export class ProgramDetailComponent{

    shortcuts:Shortcut[];
    shortcutsLink:string;
    versionInfo:ProgramVersion;
    id: any;
    paramsSub: any;
    alreadyRated: { [key:number]:number; };


    constructor(private route: ActivatedRoute,
                private router: Router,
                private programService:ProgramService) {
    }

    ngOnInit() {
        //if we subscribe the the route params, every time the params change, the function inside subscribe is called
        this.paramsSub = this.route.params.subscribe(params => this.loadVersionWithIdAndStoreId(+params['id'])); //+ for turning the id string into a number
        this.alreadyRated= {};
    }

    ngOnDestroy() {
        this.paramsSub.unsubscribe();
    }

    delete(shortcut:Shortcut){
        //this.programService.deleteShortcut(shortcut);
        this.programService.deleteShortcutOnlineAndFromArray(shortcut, this.shortcuts);
    }

    goToShortcutCreate(){
        //store the current program version, so that the create page knows for what verion the new shortcut is created!
        this.programService.versionIdForNewlyCreatedShortcut = this.versionInfo.id;
        this.router.navigate(['/programs/shortcut-create']);
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
        this.programService.versionIdForNewlyCreatedShortcut = versionId;
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
                this.programService.shortcuts = this.shortcuts;
            },
            (err) => {
                console.error('Fehler beim Laden der Shortcuts in loadShortcuts', err);
            }
        );
    }

    rateProgram(shortcut:Shortcut, rating:number){

        if(this.alreadyRated[shortcut.id]!=null){
            alert("Error! You already rated this shortcut!");
        }
        else{
            this.alreadyRated[shortcut.id] = rating;
            this.programService.applyShortcutRating(shortcut.id, rating);
            //alert("You rated the shortcut with " + rating + " stars!");
        }
    }

    checkRatingValueForCorrectnes(value:any):Boolean{
        if(isNullOrUndefined(value) || isNaN(value)){
            return false;
        }
        if(value == 0){
            return false;
        }
        return true;
    }

    //return an array of a number for the ngFor method
     getStars(num:any):any {
        if(this.checkRatingValueForCorrectnes(num)){
            return new Array(Math.round(num));
        }
        return Array();
    }
}