import { Component } from '@angular/core';
import {Program} from "../entities/programs";
import {ProgramService} from "../program-search/services/program.service";

@Component({
    template:`
        <h1>Create new program:</h1>
        <div>
          {{ message }}
        </div>
        <div>
          <div class="form-group">
            <label>Program Name: </label>
            <input [(ngModel)]="programName" required class="form-control">
          </div>
          <div class="form-group">
            <label>Description: </label>
            <input [(ngModel)]="description" required class="form-control">
          </div>
          <div class="form-group">
            <label>Website URL: </label>
            <input [(ngModel)]="website" required class="form-control">
          </div>
          <!--div class="form-group">
            <label>Sum of Rating Scores: </label>
            <input [(ngModel)]="program.ratingCount" type="number" required class="form-control">
          </div>
          <div class="form-group">
            <label>Sum of Ratings: </label>
            <input [(ngModel)]="program.ratingCount" type="number" required class="form-control">
          </div-->
          <div class="form-group">
            <button (click)="create()" class="btn btn-default">Create Program</button>
          </div>
        </div>
    `

})
//There should be no possibility to set a rating sum or a rating count when creating the Program, because they should be 0!
export class ProgramCreateComponent {

    private programName:string = "";
    private description:string = "";
    private website:string = "";

    program:Program;
    message:string;

    constructor(private programService: ProgramService){
    }

    resetComponentMembers(){
        this.programName = "";
        this.description = "";
        this.website = "";
    }



    createEmptyProgram():Program{
        return <Program> {
            name: "",
            description: "",
            website: "",
            ratingNr: 0,
            ratingCount:0,
        }
    }

    create(){
        //ToDo: check here if all values in the forms are correct!
        let newProgram = <Program> {
            name: this.programName,
            description: this.description,
            website: this.website,
            ratingNr: 0,
            ratingCount: 0
        };

        this
            .programService
            .createProgramV2(newProgram)
            .subscribe(
                program => {
                    console.log(program);
                    this.message = "Daten wurden gespeichert!";
                    //reload all programs from server:
                    this.programService.loadAllProgramsFromServer();
                    //alternatively, just add program to local array:
                    // if (this.programService.programs.findIndex((prog:Program)=>prog.name == program.name) < 0){
                    //     this.programService.programs.push(program);
                    // }
                    //this.programService.updateProgramLocally(program);

                    this.resetComponentMembers();
                    //redirect to the Program Search page:
                    this.programService.navigateToRoute(['/program-search']);
                },
                (err) => {
                    this.message = "Fehler beim Speichern: " + err.text();
                }
            )

    }

}
