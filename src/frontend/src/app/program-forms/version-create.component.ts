import { Component } from '@angular/core';
import {Program} from "../entities/programs";
import {ProgramVersion} from "../entities/programVersions";
import {ProgramService} from "../shared/services/program.service";

//IMPORTANT - for storing the foreign key reference to the program, we have to provide the PROGRAM URL as value for the program column in ProgramVersion

@Component({
    template:`
    <div *ngIf="programName">
        <h1>Create new program version:</h1>
        <p>For the Application {{programName}}</p>
        <div>
          {{ message }}
        </div>
         <form #f="ngForm" novalidate>
         <div class="form-group">
            <label>Version:</label>
            <input [(ngModel)]="versionText" 
                name="versionText"
                required  
                minlength="1"
                maxlength="20"
                pattern="[.\\-\\+ 0-9a-zA-ZÃ¶Ã¤Ã¼ÃŸÃ–Ã„Ãœ]*"
                class="form-control"
                />                
            <span *ngIf="!f?.controls?.versionText?.valid"> Check your input! </span>
            
            <span *ngIf="f?.controls?.versionText?.hasError('minlength')"> Requires min. one char.  </span>
        
            <span *ngIf="f?.controls?.versionText?.hasError('pattern')"> Invald chars. </span>
        
            <span *ngIf="f?.controls?.versionText?.hasError('maxlength')"> Max. 20 chars! </span>
          </div>
        
        <div class="form-group">
        <p>Operating System: </p>
        <form>
          <input type="radio" name="os-type" [(ngModel)]="osType" [value]="0"> <img alt="" style="width: 35px; height: 35px;" src="images/win-icon.png"> Windows <br>
          <input type="radio" name="os-type" [(ngModel)]="osType" [value]="1"> <img alt="" style="width: 35px; height: 35px;" src="images/linux-icon.png"> Linux <br>
          <input type="radio" name="os-type" [(ngModel)]="osType" [value]="2"> <img alt="" style="width: 35px; height: 35px;" src="images/macOS-icon.png"> macOS 
        </form>
        </div>
        <div class="form-group">
            <button (click)="create()" [disabled]="!f?.controls?.versionText?.valid"  class="btn btn-default">Save Program Version</button>
          </div>
          
          </form>
        </div>
        <div *ngIf="!programName">
            <h2>Illegal Access!</h2>
            <p>New Version cannot be associated with existing Program</p>
            <p>If you want to create a new version, please go into a program detail page and click on the button 'Create new Version'</p>
            <p>Do not try to go to this page directly by entering the version-create Url in the Browser</p>
        </div>
    `

})

export class VersionCreateComponent {

    //id: number;
    osType: number = 0;
    versionText: string = "";

    message:string = "";

    constructor(
        private programService:ProgramService){

    }

    public get programName(): string {
        return this.programService.programNameForNewlyCreatedVersion;
    }

    createEmptyVersion():ProgramVersion{
        return <ProgramVersion> {
            id: 0,
            osType: 0,
            versionText: "",
            program: ""
        };
    }

    resetComponentMembers(){
        this.osType = 0;
        this.versionText = "";
    }

    //!!! When persisting, when the ID is autocreated by hibernate, we have to leave it null/0 in the object
    create(): void {

        let newVersion = {
            osType: this.osType,
            versionText: this.versionText,
            //foreign key has to be the program URL!!
            program: this.programService.buildUrlForProgramByName(this.programService.programNameForNewlyCreatedVersion)

        };

        console.log(newVersion);
        this
            .programService
            .createVersionV3(newVersion)
            .subscribe(
                version => {
                    console.log("create() response object");
                    console.log(version);
                    //this.person = person;
                    this.message = "version was created successfully!";
                    //add the person to the local people array, but only if the index does not exist yet:
                    this.programService.addNewVersionLocally(version);
                    //reset the form entries:
                    this.resetComponentMembers();
                    //redirect to the Program Detail page:
                    this.programService.navigateToRoute([this.programService.currentProgramDetailUrl]);
                },
                (err) => {
                    this.message = "Fehler beim Speichern: " + err.text();
                }
            )

    }
}