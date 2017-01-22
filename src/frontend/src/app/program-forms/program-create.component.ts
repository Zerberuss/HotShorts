import {Component} from '@angular/core';
import {Program} from "../entities/programs";
import {ProgramService} from "../program-search/services/program.service";
import {FormsModule} from "@angular/forms";

@Component({
    template: `
        <h1>Create new program:</h1>
        <div>
          {{ message }}
        </div>
        <form #f="ngForm" novalidate>
          <div class="form-group">
            <label>Program Name (cannot be changed later): </label>
            <input  
                [(ngModel)]="programName" 
                name="programName"
                required  
                minlength="3"
                maxlength="50"
                pattern="[.\\+\\- 0-9a-zA-ZÃ¶Ã¤Ã¼ÃŸÃ–Ã„Ãœ]*"
                class="form-control"
             />
            
            <span *ngIf="!f?.controls?.programName?.valid"> Check your input! </span>
            
            <span *ngIf="f?.controls?.programName?.hasError('minlength')"> Requires min. 3 chars.  </span>
        
            <span *ngIf="f?.controls?.programName?.hasError('pattern')"> Invald chars. </span>
        
            <span *ngIf="f?.controls?.programName?.hasError('maxlength')"> Max. 60 chars! </span>
         </div>

          
          <div class="form-group">
            <label>Description: </label>
            <input [(ngModel)]="description" 
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
            <input [(ngModel)]="website" 
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
          
        <br>       
          
          <div>
            <button (click)="create()" [disabled]="!f?.controls?.programName?.valid || !f?.controls?.description?.valid || !f?.controls?.website?.valid"  class="btn btn-default">Create Program</button>
          </div>
        </form>
    `

})
//There should be no possibility to set a rating sum or a rating count when creating the Program, because they should be 0!


export class ProgramCreateComponent {

    private programName: string = "";
    private description: string = "";
    private website: string = "";

    program: Program;
    message: string;

    constructor(private programService: ProgramService) {
    }

    resetComponentMembers() {
        this.programName = "";
        this.description = "";
        this.website = "";
    }


    createEmptyProgram(): Program {
        return <Program> {
            name: "",
            description: "",
            website: "",
            ratingNr: 0,
            ratingCount: 0,
        }
    }

    create() {
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
