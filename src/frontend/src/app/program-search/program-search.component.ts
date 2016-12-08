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
  templateUrl: './program-search.component.html',
  providers: [ProgramService]
})
export class ProgramSearchComponent {

  public name: string;
  public programs: Array<Program> = [];
  public selectedProgram: Program;
    public selectedProgramSummary: ProgramSummary;

  constructor(private programService: ProgramService,
              private router:Router) {

  }

    ngOnInit() {
        this.programService.getAllPrograms().subscribe(
            (programsJson)=>{
                this.programs = this.programService.accessProgramsFromJson(programsJson);
            },
            (err)=>{
                console.log("Could not load programs");
            }
        )
    }

  search(): void {
    this.programService.find(this.name).subscribe(
      (programs: Program[]) => {
        console.log(programs.toString());
        this.programs = programs;
      },
      (err) => {
        console.error('Fehler beim Laden', err);
      }
    )
  }

  searchTest(): void {
      this.programService.find(this.name).subscribe(
        (programs) => {
          console.log(programs);
        },
        (err) => {
          console.error('Fehler beim Laden', err);
        }
    )
  }

  searchV3(): void {
    this.programService.find(this.name).subscribe(
        (programs) => {
          console.log(programs["_embedded"]["programs"]);
          this.programs = this.programService.accessProgramsFromJson(programs);
        },
        (err) => {
          console.error('Fehler beim Laden', err);
        }
    )
  }

  getAllPrograms():void {
    this.programService.getAllPrograms().subscribe(
        (programs: Program[]) => {
          console.log(programs.toString());
          this.programs = programs;
        },
        (err) => {
          console.error('Fehler beim Laden', err);
        }

    );
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

  goToPageForVersionWithId(versionEntry:ProgramSummaryVersionEntry){
      console.log("goToPageForVersionWithId() shortcut links: " + versionEntry.shortcutLink);

  }

  goToProgramPageWithVersionId(versionEntry:ProgramSummaryVersionEntry){
      //this.router.navigate(['/app', this.selectedProgram.name, '/version' ,versionEntry.id]);
      this.router.navigate(['/app/' + this.selectedProgram.name]);
  }

}
