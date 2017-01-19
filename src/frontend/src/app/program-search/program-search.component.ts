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

@Component({
  selector: 'program-search', // <flight-search></...>
  templateUrl: './program-search.component.html'
})
export class ProgramSearchComponent {

  public name: string;
  public selectedProgram: Program;
  public selectedProgramSummary: ProgramSummary;

  constructor(private programService: ProgramService,
              private router:Router) {

  }

    ngOnInit() {
        this.storeProgramsLocally();
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
      this.programService.applyApplicationRating(program.name, rating);
      alert("You rated " + program.name + " with " + rating + " stars!");
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
        }
    }

  goToProgramPageWithVersionId(versionEntry:ProgramSummaryVersionEntry){
      this.router.navigate(['/app', this.selectedProgram.name, 'version' ,versionEntry.id]);
  }

}
