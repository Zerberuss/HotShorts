/**
 * Created by simon41 on 12/7/2016.
 */
import {Component} from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router';
import {ProgramService} from "../shared/services/program.service";
import {Program} from "../entities/programs";
import {ProgramVersion} from "../entities/programVersions";
import {ProgramSummary} from "../entities/programSummary";
import {OsTypes} from "../entities/osTypes";
import {ProgramSummaryVersionEntry} from "../entities/programSummaryVersionEntry";

@Component({
    selector: 'version-page',
    templateUrl: "./version-page.component.html"
})
export class VersionPageComponent{

    paramsSub:any;
    programName:string;
    program:Program;
    programVersions:ProgramVersion[];
    programVersionsLink:string;
    programSummary:ProgramSummary;

    //inject the necessary services:
    constructor(private route: ActivatedRoute,
                private router: Router,
                private programService:ProgramService) {


        }

    storeCurrentUrlInProgramService(){
        this.programService.currentProgramDetailUrl = this.router.url;
    }

    loadProgramWithNameAndStoreName(progName:string){
        this.storeCurrentUrlInProgramService();
        this.programService.programNameForNewlyCreatedVersion = progName;
        this.programName = progName;
        console.log("loadProgramWithNameAndStoreName programName: " + this.programName);
        this.programService.getProgramFromServer(progName)
            .subscribe(
                (program:Program) => {
                    console.log("got program successfully");
                    this.programVersionsLink = program["_links"]["programVersions"]["href"];
                    this.program = program;
                    this.createProgramSummary();
                },
                (err) => {
                    console.error('Fehler beim Laden des Programmes in ngOnInit', err);
                    this.program = <Program> this.programService.getPrgramByNameLocally(this.programName);
                    if (this.program.hasOwnProperty("_links")){
                        this.programVersionsLink = this.program["_links"]["programVersions"]["href"];
                        this.createProgramSummary();
                    } else {
                        console.error("could not retrieve programVersionsLink from program");
                    }
                }
            );
    }

    loadVersions(){
        console.log("loadVersions,this.programVersionsLink: "+ this.programVersionsLink);
        this.programService.getUrlContentAsJson(this.programVersionsLink).subscribe(
            (versions) => {
                this.programVersions = this.programService.accessVersionsFromJson(versions);
            },
            (err) => {
                console.error('Fehler beim Laden der Programmversionen', err);
            }
        );
    }

    deleteVersion(version:ProgramVersion){
        //version is of type ProgramSummaryVersionEntry, but deleteVersionOnlineAndFromArray needs a ProgramVersion.
        // to satisfy the compiler, declare version as type ProgramVersion (all necessary attributes for deleteVersionOnlineAndFromArray are present in version!
        console.log(version);

        this.programService.deleteVersionOnlineAndFromArray(version, this.programVersions);
        this.deleteVersionFromSummaryVersionEntry(this.programSummary.versions.osx, version.id);
        this.deleteVersionFromSummaryVersionEntry(this.programSummary.versions.linux, version.id);
        this.deleteVersionFromSummaryVersionEntry(this.programSummary.versions.windows, version.id);

        console.log("router url: " + this.router.url);
        //if the current route is the route of the deleted version, change the route:
        //if (this.router.url.indexOf(this.programName.replace(" ", "%20") + "/version/" + version.id.toString()) >= 0){
        if(this.router.url.indexOf(this.programName.replace(" ", "%20")) >= 0 && this.router.url.endsWith(version.id.toString())){
            this.router.navigate(['/programs/app', this.programName.replace(" ", "%20")]);
        }

    }

    deleteVersionFromSummaryVersionEntry(arr:ProgramSummaryVersionEntry[], id:number){
        let indexToDelete = arr.findIndex((entry:ProgramSummaryVersionEntry)=> entry.id == id);
        if (indexToDelete >= 0){
            arr.splice(indexToDelete, 1);
        }
    }

    createProgramSummary() {
        if (this.program != null) {
            console.log("program[_links][self][href]");
            let programSummary = {};
            var callbackSuccess = (summaryObject) => {
                this.programSummary = <ProgramSummary> summaryObject;
            };
            //this.programService.assignProgramSummaryForProgramUrl(this.selectedProgram["_links"]["self"]["href"], programSummary, callbackSuccess);
            this.programService.assignProgramSummaryForProgram(this.program, programSummary, callbackSuccess);
            console.log("select function program summary:");
            console.log(programSummary);
            //this.selectedProgramSummary = <ProgramSummary> programSummary;
        }


    }

    ngOnInit(){
        this.paramsSub = this.route.params.subscribe(params => this.loadProgramWithNameAndStoreName(params['name'].toString())); //Observable Approach
        
    }

    ngOnDestroy() {
        this.paramsSub.unsubscribe();
    }


    getStars(num:any):any {
        if((num>0.49)){
            return new Array(Math.round(num));
        }else
            return Array();
    }


}
