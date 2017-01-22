import { Component } from '@angular/core';
import {Program} from "../entities/programs";
import {ActivatedRoute} from "@angular/router";
import {ProgramService} from "../program-search/services/program.service";

//It is not allowed to modify the program name, since it is the primary key!!! The program has to be deleted and created again for a new name
@Component({
    template:`
        <h1>Edit program:</h1>
        <div>
          {{ message }}
        </div>
        <div  *ngIf="program">
        <form #f="ngForm" novalidate>
          <div>
            <p>Program Name: {{program.name}}</p>
          </div>
          
           <div class="form-group">
            <label>Description: </label>
            <input [(ngModel)]="program.description" 
                name="description"
                required  
                minlength="10"
                maxlength="100"
                pattern="[.\\+\\- 0-9a-zA-ZÃ¶Ã¤Ã¼ÃŸÃ–Ã„Ãœ]*"
                class="form-control"
                />                
            <span *ngIf="!f?.controls?.description?.valid"> Check your input! </span>
            
            <span *ngIf="f?.controls?.description?.hasError('minlength')"> Requires min. 10 chars.  </span>
        
            <span *ngIf="f?.controls?.description?.hasError('pattern')"> Invald chars. </span>
        
            <span *ngIf="f?.controls?.description?.hasError('maxlength')"> Max. 100 chars! </span>
          </div>
          
          <div class="form-group">
            <label>Website URL: (starting with http)</label>
            <input [(ngModel)]="program.website" 
                name="website"
                required  
                minlength="7"
                maxlength="100"
                pattern= "(http:|ftp:|https:).*"
                class="form-control"
            />
            <span *ngIf="!f?.controls?.website?.valid"> Check your input!  </span>
            
            <span *ngIf="f?.controls?.website?.hasError('minlength')"> Requires min. 7 chars.  </span>
        
            <span *ngIf="f?.controls?.website?.hasError('pattern')"> Invald chars. </span>
        
            <span *ngIf="f?.controls?.website?.hasError('maxlength')"> Max. 100 chars! </span>    
          </div>
          
          <div>
          <p>Average Rating:</p>
          <p>{{(program.ratingNr / program.ratingCount) | decimal: 2}}</p>
          <div class="form-group">
            <button (click)="resetRating()" class="btn btn-default">Reset Ratings</button>
          </div>
          <div class="form-group">
              <button (click)="saveV2()" [disabled]="!f?.controls?.description?.valid || !f?.controls?.website?.valid"  class="btn btn-default">Save Changes</button>
          </div>
          </div>
          </form>
         
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

    //old
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



    saveV2():void{
        let saveObj = {
            description: this.program.description,
            website: this.program.website,
            ratingCount: this.program.ratingCount,
            ratingNr: this.program.ratingNr
        };

        this
            .programService
            .saveProgramByPut(saveObj, this.program.name)
            .subscribe(
                programObject => {

                    this.program = programObject;
                    this.message = "Daten wurden gespeichert!";
                    //either reload all programs or just update the program locally: We update it locally:
                    //this.programService.loadAllProgramsFromServer();
                    this.programService.updateProgramLocally(this.program);
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
