import { Component } from '@angular/core';
import {Program} from "../entities/programs";
import {ActivatedRoute} from "@angular/router";
import {ProgramService} from "../program-search/services/program.service";

@Component({
    template:`
        <h1>Edit program:</h1>
        <div>
          {{ message }}
        </div>
        <div  *ngIf="program">
          <div class="form-group">
            <label>Program Name: </label>
            <input [(ngModel)]="program.name" required class="form-control">
          </div>
          <div class="form-group">
            <label>Description: </label>
            <input [(ngModel)]="program.description" required class="form-control">
          </div>
          <div class="form-group">
            <label>Website URL: </label>
            <input [(ngModel)]="program.website" required class="form-control">
          </div>
          <div>
          <p>Average Rating:</p>
          <p>{{(program.ratingNr / program.ratingCount) | decimal: 2}}</p>
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
            <button (click)="resetRating()" class="btn btn-default">Reset Ratings</button>
          </div>
          <div class="form-group">
            <button (click)="save()" class="btn btn-default">Save Changes</button>
          </div>
        </div>
        <div *ngIf="!program">
          <p>Loading Program...</p>
        </div>
    `

})

export class ProgramEditComponent {
    programName:string;
    program:Program;
    message:string;

    constructor(
        private programService: ProgramService,
        route: ActivatedRoute) {

        route.params.subscribe(
            p => {
                console.log("Program Name: " + p['id']);
                this.programName = p['id'].replace("%20", " ");
                this.load(this.programName);
            }
        )

    }

    load(progName: string): void {
        this
            .programService
            .getProgramFromServer(progName)
            .subscribe(
                programObject => {
                    console.log(programObject);
                    this.program = programObject;
                    this.message = "";
                },
                (err) => {
                    this.message = "Fehler beim Laden: " + err.text();
                }
            )
    }

    save(): void {
        this
            .programService
            .saveProgram(this.program)
            .subscribe(
                programObject => {
                    this.program = programObject;
                    this.message = "Daten wurden gespeichert!";
                    //either reload all programs or just update the program locally: We update it locally:
                    //this.programService.loadAllProgramsFromServer();
                    this.programService.updateProgramLocally(this.program)
                    //redirect to the Program Search page:
                    this.programService.navigateToRoute(['/program-search']);

                },
                (err) => {
                    this.message = "Fehler beim Speichern: " + err.text();
                }
            )

    }

    resetRating(): void{
        this.program.ratingNr = 0;
        this.program.ratingCount = 0;
    }

}