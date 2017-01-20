import { Component } from '@angular/core';
import {Program} from "../entities/programs";
import {ProgramVersion} from "../entities/programVersions";
import {ProgramService} from "../program-search/services/program.service";

//IMPORTANT - for storing the foreign key reference to the program, we have to provide the PROGRAM URL as value for the program column in ProgramVersion

@Component({
    template:`
    <div *ngIf="programName">
        <h1>Create new program version:</h1>
        <p>For the Application {{programName}}</p>
        <div>
          {{ message }}
        </div>
        <div class="form-group">
            <label>Version: </label>
            <input [(ngModel)]="versionText" required class="form-control">
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
            <button (click)="create()" class="btn btn-default">Create Version</button>
          </div>
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
        // let newVersion:ProgramVersion = <ProgramVersion>{
        //     id:null,
        //     osType: this.osType,
        //     versionText: this.versionText,
        //     program: this.programService.programNameForNewlyCreatedVersion
        // };
        let newVersion = {
            osType: this.osType,
            versionText: this.versionText,
            //foreign key has to be the program URL!!
            program: this.programService.buildUrlForProgramByName(this.programService.programNameForNewlyCreatedVersion)
            //program: this.programService.getLocalProgramByName(this.programService.programNameForNewlyCreatedVersion)

        };

        console.log(newVersion);
        this
            .programService
            //.createVersionV4(newVersion, this.programService.programNameForNewlyCreatedVersion)
            .createVersionV3(newVersion)
            .subscribe(
                version => {
                    console.log("create() response object");
                    console.log(version);
                    //this.person = person;
                    this.message = "version was created successfully!";
                    //ad the person to the local people array, but only if the index does not exist yet:
                    // if (this.programService.shortcuts.findIndex((shct:Shortcut)=>shct.id == shortcut.id) < 0){
                    //     this.programService.shortcuts.push(shortcut);
                    // }
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