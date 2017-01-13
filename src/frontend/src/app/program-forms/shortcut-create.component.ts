import { Component } from '@angular/core';
import {Program} from "../entities/programs";
import {Shortcut} from "../entities/shortcuts";
import {ProgramService} from "../program-search/services/program.service";

@Component({
    template:`
        <h1>Create new shortcut:</h1>
        <h3>For {{programName}} version {{programVersion}}</h3>
        <div>
          {{ message }}
        </div>
        <div class="form-group">
            <label>Short Description:</label>
            <input [(ngModel)]="descriptionShort" required class="form-control">
          </div>
          <div class="form-group">
            <label>Key Combination:</label>
            <input [(ngModel)]="keyCode" required class="form-control">
          </div>
          <div class="form-group">
            <label>Long Description:</label>
            <input [(ngModel)]="description" required class="form-control">
          </div>
          <div class="form-group">
            <button (click)="create()" class="btn btn-default">Create Shortcut</button>
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
            desciptionShort: "",
            keyCode: "",
            ratingCount: 0,
            ratingNr: 0,
            programVersion: 0
        };
    }

    //!!! When persisting, when the ID is autocreated by hibernate, we have to leave it null/0 in the object
    create(): void {
        let newShortcut:Shortcut = <Shortcut>{
            id:null,
            description: this.description,
            desciptionShort: this.descriptionShort,
            keyCode: this.keyCode,
            ratingCount: 0,
            ratingNr: 0,
            programVersion: this.programService.versionIdForNewlyCreatedShortcut
        };
        this
            .programService
            .createShortcutV2(newShortcut)
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