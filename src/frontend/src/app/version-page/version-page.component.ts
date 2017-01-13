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
