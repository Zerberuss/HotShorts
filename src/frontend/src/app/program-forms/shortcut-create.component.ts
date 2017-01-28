import { Component } from '@angular/core';
import {Program} from "../entities/programs";
import {Shortcut} from "../entities/shortcuts";
import {ProgramService} from "../shared/services/program.service";

//IMPORTANT - for storing the foreign key reference to the version, we have to provide the VERSION URL as value for the programVersion column in ProgramVersion

@Component({
    template:`
      <div *ngIf="programName && programVersion">
        <h1>Create new shortcut:</h1>
        <h3>For {{programName}} version {{programVersion}}</h3>
        <div>
          {{ message }}
        </div>
        
        <form #f="ngForm" novalidate>
        
        <div class="form-group">
            <label>Short Key:</label>
            <input [(ngModel)]="keyCode" 
                name="keyCode"
                required  
                minlength="1"
                maxlength="30"
                class="form-control"
                />                
            <span *ngIf="!f?.controls?.keyCode?.valid"> Check your input! </span>
            
            <span *ngIf="f?.controls?.keyCode?.hasError('minlength')"> Requires min. one char.  </span>
        
            <span *ngIf="f?.controls?.keyCode?.hasError('maxlength')"> Max. 30 chars! </span>
         </div>
          
        <div class="form-group">
            <label>Short Description:</label>
            <input [(ngModel)]="descriptionShort" 
                name="descriptionShort"
                required  
                minlength="4"
                maxlength="50"
                pattern="[.\\-\\+ 0-9a-zA-ZÃ¶Ã¤Ã¼ÃŸÃ–Ã„Ãœ]*"
                class="form-control"
                />                
            <span *ngIf="!f?.controls?.descriptionShort?.valid"> Check your input! </span>
            
            <span *ngIf="f?.controls?.descriptionShort?.hasError('minlength')"> Requires min. 4 chars.  </span>
        
            <span *ngIf="f?.controls?.descriptionShort?.hasError('pattern')"> Invald chars. </span>
        
            <span *ngIf="f?.controls?.descriptionShort?.hasError('maxlength')"> Max. 30 chars! </span>
          </div>
          
          <div class="form-group">
            <label>Long Description: </label>
            <input [(ngModel)]="description" 
                name="description"
                required  
                minlength="10"
                maxlength="100"
                pattern="[.\\-\\+ 0-9a-zA-ZÃ¶Ã¤Ã¼ÃŸÃ–Ã„Ãœ]*"
                class="form-control"
                />                
            <span *ngIf="!f?.controls?.description?.valid"> Check your input! </span>
            
            <span *ngIf="f?.controls?.description?.hasError('minlength')"> Requires min. 10 chars.  </span>
        
            <span *ngIf="f?.controls?.description?.hasError('pattern')"> Invald chars. </span>
        
            <span *ngIf="f?.controls?.description?.hasError('maxlength')"> Max. 100 chars! </span>
          </div>

          
           <br>          

          <div class="form-group">
            <button (click)="create()" [disabled]="!f?.controls?.description?.valid || !f?.controls?.keyCode?.valid || !f?.controls?.descriptionShort?.valid"  class="btn btn-default">Save Changes</button>
          </div>
          </form>
        </div>        
        <div *ngIf="!programName || !programVersion">
        <h2>Illegal Access!</h2>
            <p>New Shortcut cannot be associated with existing Application Version</p>
            <p>If you want to create a new shortcut, please go into a program detail page, select a version and then add a shortcut</p>
            <p>Do not try to go to this page directly by entering the shortcut-create Url in the Browser</p>
        </div>
        
    `

})

export class ShortcutCreateComponent {

    message:string;

    //id:number = 0;
    description:string = "";
    descriptionShort:string = "";
    keyCode:string = "";
    //programVersion:number = 0;

    constructor(
        private programService:ProgramService){

    }

    //for accessing {{programVersion}} in the html template
    public get programVersion(): number {
        return this.programService.versionIdForNewlyCreatedShortcut;
    }

    public get programName(): string {
        return this.programService.programNameForNewlyCreatedVersion;
    }

    resetComponentMembers(){
        //this.id = 0;
        this.description = "";
        this.descriptionShort = "";
        this.keyCode = "";
        //this.programVersion = 0;
    }

    createEmptyShortcut():Shortcut{
        return <Shortcut> {
            id: 0,
            description: "",
            descriptionShort: "",
            keyCode: "",
            ratingCount: 0,
            ratingNr: 0,
            programVersion: ""
        };
    }

    //!!! When persisting, when the ID is autocreated by hibernate, we have to leave it null/0 in the object
    create(): void {

        let newShortcut = {
            description: this.description,
            descriptionShort: this.descriptionShort,
            keyCode: this.keyCode,
            ratingCount: 0,
            ratingNr: 0,
            //foreign key has to be the version URL!!
            programVersion: this.programService.buildUrlForVersionById(this.programService.versionIdForNewlyCreatedShortcut)

        };
        this
            .programService
            .createShortcutV3(newShortcut)
            .subscribe(
                shortcut => {
                    console.log("create() response object");
                    console.log(shortcut);
                    //this.person = person;
                    this.message = "Shortcut was created successfully!";
                    //ad the person to the local people array, but only if the index does not exist yet:
                    // if (this.programService.shortcuts.findIndex((shct:Shortcut)=>shct.id == shortcut.id) < 0){
                    //     this.programService.shortcuts.push(shortcut);
                    // }
                    this.programService.addNewShortcutLocally(shortcut);
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