/**
 * Created by simon41 on 11/30/2016.
 */
import {Component} from "@angular/core";
import {ProgramService} from "./services/program.service";
import {Program} from "../entities/programs";

@Component({
  selector: 'passenger-search', // <flight-search></...>
  templateUrl: './program-search.component.html',
  providers: [ProgramService]
})
export class ProgramSearchComponent {

  public name: string;
  public programs: Array<Program> = [];
  public selectedProgram: Program;

  constructor(private programService: ProgramService) {
  }

  getAll():void {


  }

  search(): void {
    this.programService.find(this.name).subscribe(
      (programs: Program[]) => {
        this.programs = programs;
      },
      (err) => {
        console.error('Fehler beim Laden', err);
      }
    )
  }

  select(program: Program): void {
    this.selectedProgram = program;
  }

}
