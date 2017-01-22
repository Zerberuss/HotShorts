/**
 * Created by simon41 on 11/30/2016.
 */
import {Component} from "@angular/core";
import {ProgramService} from "./services/program.service";
import {Program} from "../entities/programs";
import {ProgramSummary} from "../entities/programSummary";
import {Subscription} from "rxjs";
import {ProgramSummaryVersionEntry} from "../entities/programSummaryVersionEntry";
import {Router} from "@angular/router";
import {concatMap} from "rxjs/operator/concatMap";
import {isNullOrUndefined} from "util";

@Component({
  selector: 'program-search', // <flight-search></...>
  templateUrl: './program-search.component.html'
})
export class ProgramSearchComponent {

  public name: string;
  public selectedProgram: Program;
  public selectedProgramSummary: ProgramSummary;
  alreadyRated: { [key:number]:number; };


  constructor(private programService: ProgramService,
              private router:Router) {

  }

    ngOnInit() {
        this.storeProgramsLocally();
        this.alreadyRated= {};
    }

    // {{ programs }}
    public get programs(): Array<Program> {
        return this.programService.programs;
    }

  // searchV3(): void {
  //   this.programService.findProgram(this.name);
  // }

  storeProgramsLocally():void {
      this.programService.loadAllProgramsFromServer();
  }

  rateProgram(program:Program, rating:number){
      if(this.alreadyRated[program.name]!=null){
          alert("Error! You already rated this program!");
      }
      else{
          this.alreadyRated[program.name] = rating;
          this.programService.applyApplicationRating(program.name, rating);
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

  select(program: Program): void {
      console.log("select"); //this function does not get called?
    this.selectedProgram = program;
  }

  getSummaryFromSelectedProgram(){
      if (this.selectedProgram!=null){
          console.log("program[_links][self][href]");
          console.log(this.selectedProgram["_links"]["self"]["href"]);
          //let SummarySubsription:Subscription = this.programService.createProgramSummaryForProgramUrl(program["_links"]["self"]["href"]);
          let programSummary = {};
          var callbackSuccess = (summaryObject)=>{this.selectedProgramSummary = <ProgramSummary> summaryObject;};
          //this.programService.assignProgramSummaryForProgramUrl(this.selectedProgram["_links"]["self"]["href"], programSummary, callbackSuccess);
          this.programService.assignProgramSummaryForProgram(this.selectedProgram, programSummary, callbackSuccess);
          console.log("select function program summary:");
          console.log(programSummary);
          //this.selectedProgramSummary = <ProgramSummary> programSummary;
      }

  }

  delete(prog:Program){
      this.programService.deleteProgram(prog);
  }

  getSummaryFromProgram(prog:Program){
        if (prog!=null){
            console.log("program[_links][self][href]");
            console.log(prog["_links"]["self"]["href"]);
            let programSummary = {};
            var callbackSuccess = (summaryObject)=>{this.selectedProgramSummary = <ProgramSummary> summaryObject;};
            this.programService.assignProgramSummaryForProgram(prog, programSummary, callbackSuccess);
            console.log("select function program summary:");
            console.log(programSummary);
            this.select(prog);

            return callbackSuccess;
        }else{
            console.log("can't load summary: no program defined!")
            return null;
        }

    }

  goToProgramPageWithVersionId(versionEntry:ProgramSummaryVersionEntry){
      this.router.navigate(['/app', this.selectedProgram.name, 'version' ,versionEntry.id]);
  }

}
