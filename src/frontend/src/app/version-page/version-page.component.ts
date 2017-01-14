/**
 * Created by simon41 on 12/7/2016.
 */
import {Component} from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router';
import {ProgramService} from "../program-search/services/program.service";
import {Program} from "../entities/programs";
import {ProgramVersion} from "../entities/programVersions";
import {ProgramSummary} from "../entities/programSummary";
import {isNullOrUndefined} from "util";
import {OsTypes} from "../entities/osTypes";
import {ProgramSummaryVersionEntry} from "../entities/programSummaryVersionEntry";

//https://coryrylan.com/blog/introduction-to-angular-2-routing
//https://angular.io/docs/ts/latest/guide/router.html
@Component({
    selector: 'version-page',
    templateUrl: "./version-page.component.html"
    //, providers: [ProgramService]

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

    loadProgram(){
        this.programService.getProgramFromServer(this.programName)
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

    deleteVersion(version:ProgramVersion){ //ToDo: version is here of type ProgramSummaryVersionEntry, change the function. The below functions work however.
        console.log(version);
        // switch (version.osType){
        //     case OsTypes.windows:
        //         console.log("osType windows");
        //         console.log(this.programSummary.versions.windows);
        //         this.deleteVersionFromSummaryVersionEntry(this.programSummary.versions.windows, version.id);
        //         break;
        //     case OsTypes.linux:
        //         console.log("osType linux");
        //         console.log(this.programSummary.versions.linux);
        //         this.deleteVersionFromSummaryVersionEntry(this.programSummary.versions.linux, version.id);
        //         break;
        //     case OsTypes.osx:
        //         console.log("osType osx");
        //         console.log(this.programSummary.versions.osx);
        //         this.deleteVersionFromSummaryVersionEntry(this.programSummary.versions.osx, version.id);
        //         break;
        //     default:
        //         break;
        // }

        //this.programService.deleteVersion(version);




        this.programService.deleteVersionOnlineAndFromArray(version, this.programVersions);
        this.deleteVersionFromSummaryVersionEntry(this.programSummary.versions.osx, version.id);
        this.deleteVersionFromSummaryVersionEntry(this.programSummary.versions.linux, version.id);
        this.deleteVersionFromSummaryVersionEntry(this.programSummary.versions.windows, version.id);

        console.log("router url: " + this.router.url);
        //if the current route is the route of the deleted version, change the route:
        //if (this.router.url.indexOf(this.programName.replace(" ", "%20") + "/version/" + version.id.toString()) >= 0){
        if(this.router.url.indexOf(this.programName.replace(" ", "%20")) >= 0 && this.router.url.endsWith(version.id.toString())){
            this.router.navigate(['/app', this.programName.replace(" ", "%20")]);
        }

    }

    deleteVersionFromSummaryVersionEntry(arr:ProgramSummaryVersionEntry[], id:number){
        let indexToDelete = arr.findIndex((entry:ProgramSummaryVersionEntry)=> entry.id == id);
        if (indexToDelete >= 0){
            arr.splice(indexToDelete, 1);
        }
    }

    createProgramSummary(){
        if (this.program!=null){
            console.log("program[_links][self][href]");
            //console.log(this.program["_links"]["self"]["href"]);
            //let SummarySubsription:Subscription = this.programService.createProgramSummaryForProgramUrl(program["_links"]["self"]["href"]);
            let programSummary = {};
            var callbackSuccess = (summaryObject)=>{this.programSummary = <ProgramSummary> summaryObject;};
            //this.programService.assignProgramSummaryForProgramUrl(this.selectedProgram["_links"]["self"]["href"], programSummary, callbackSuccess);
            this.programService.assignProgramSummaryForProgram(this.program, programSummary, callbackSuccess);
            console.log("select function program summary:");
            console.log(programSummary);
            //this.selectedProgramSummary = <ProgramSummary> programSummary;
        }


    }

    ngOnInitOld() {
        this.programName = this.route.snapshot.params['name']; //Snapshot approach. programName will not change if route param changes
        //this.paramsSub = this.route.params.subscribe(params => this.programName = params['name'].toString()); //Observable Approach
        console.log("ngOnInit programName: " + this.programName);
        this.loadProgram();
    }

    ngOnInit(){
        this.paramsSub = this.route.params.subscribe(params => this.loadProgramWithNameAndStoreName(params['name'].toString())); //Observable Approach
        
    }

    ngOnDestroy() {
        this.paramsSub.unsubscribe();
    }

}
