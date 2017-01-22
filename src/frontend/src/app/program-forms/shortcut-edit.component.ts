import { Component } from '@angular/core';
import {Program} from "../entities/programs"
import {Shortcut} from "../entities/shortcuts";
import {ProgramService} from "../program-search/services/program.service";
import {ActivatedRoute} from "@angular/router";
import {ProgramVersion} from "../entities/programVersions";

@Component({
    template:`
        <h1>Edit Shortcut:</h1>
        <h3>For {{programName}} version {{programVersion}}</h3>
        <div *ngIf="shortcut">
        <form #f="ngForm" novalidate>
        
        <div class="form-group">
            <label>Short Key:</label>
            <input [(ngModel)]="shortcut.keyCode" 
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
            <input [(ngModel)]="shortcut.descriptionShort" 
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
            <label>Description: </label>
            <input [(ngModel)]="shortcut.description" 
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
                   

      
          <div>
          <p>Average Rating:</p>
          <p>{{(shortcut.ratingNr / shortcut.ratingCount) | decimal: 2}}</p>
          </div>
          
          <div class="form-group">
            <button (click)="resetRating()" class="btn btn-default">Reset Ratings</button>
          </div>
          <div class="form-group">
            <button (click)="saveV2()" [disabled]="!f?.controls?.description?.valid || !f?.controls?.keyCode?.valid || !f?.controls?.descriptionShort?.valid"  class="btn btn-default">Save Changes</button>
          </div>
          </form>
        </div>
        <div *ngIf="!shortcut">
          <p>Loading Shortcut...</p>
        </div>
    `

})

export class ShortcutEditComponent {
    shortcutId:number;
    shortcut:Shortcut;
    message:string;

    constructor(
        private programService: ProgramService,
        route: ActivatedRoute) {

        route.params.subscribe(
            p => {
                console.log("shortcut Id: " + p['id']);
                this.shortcutId = +p['id']; //the + saves the parameter as number
                this.load(this.shortcutId);
            }
        )

    }

    public get programVersion(): number {
        return this.programService.versionIdForNewlyCreatedShortcut;
    }

    public get programName(): string {
        return this.programService.programNameForNewlyCreatedVersion;
    }

    appendForeignKeyToShortcut(shortcut:Shortcut, callbackFunc:()=>void = function(){}){
        try {
            this.programService.retrieveAssociatedVersionForShortcut(shortcut)
                .subscribe(
                    versionObject => {
                        shortcut.programVersion = ProgramService.getSelfLinkFromObject<ProgramVersion>(versionObject);
                        callbackFunc();

                    },
                    (err) => {
                        console.log("correct link for foreign key reference could not be retrieved for shortcut");
                        shortcut.programVersion = this.programService.buildUrlForVersionById(this.programService.versionIdForNewlyCreatedShortcut);
                        callbackFunc();
                    }
                )
        } catch (e) {
            console.log("correct link for foreign key reference could not be retrieved for shortcut");
            shortcut.programVersion = this.programService.buildUrlForVersionById(this.programService.versionIdForNewlyCreatedShortcut);
            callbackFunc();
        }
    }

    load(id: number): void {
        this
            .programService
            .getShortcutFromServer(id)
            .subscribe(
                shortcutObject => {
                    //this.appendForeignKeyToShortcut(shortcutObject);
                    console.log(shortcutObject);
                    this.shortcut = shortcutObject;
                    //this.appendForeignKeyToShortcut(this.shortcut);
                    this.message = "";
                },
                (err) => {
                    this.message = "Fehler beim Laden: " + err.text();
                }
            )
    }

    saveV2():void{
        let saveObj = {
            description: this.shortcut.description,
            descriptionShort: this.shortcut.descriptionShort,
            keyCode: this.shortcut.keyCode,
            ratingCount: this.shortcut.ratingCount,
            ratingNr: this.shortcut.ratingNr
        };

        this
            .programService
            .saveShortcutByPut(saveObj, this.shortcut.id)
            .subscribe(
                shortcutObject => {
                    this.shortcut = shortcutObject;
                    this.programService.updateShortcutByAttributesLocally(this.shortcut);
                    this.message = "Daten wurden gespeichert!";
                    //redirect to the Program Detail page:
                    this.programService.navigateToRoute([this.programService.currentProgramDetailUrl]);
                },
                (err) => {
                    this.message = "Fehler beim Speichern: " + err.text();
                }
            )

    }

    save(): void {
        this
            .programService
            .saveShortcut(this.shortcut)
            .subscribe(
                shortcutObject => {
                    //this.appendForeignKeyToShortcut(shortcutObject);
                    this.shortcut = shortcutObject;
                    let self = this;
                    this.appendForeignKeyToShortcut(this.shortcut, function(){
                        self.programService.updateShortcutLocally(self.shortcut);
                        self.message = "Daten wurden gespeichert!";
                        //redirect to the Program Detail page:
                        self.programService.navigateToRoute([self.programService.currentProgramDetailUrl]);
                    });
                    //this.message = "Daten wurden gespeichert!";
                    //redirect to the Program Detail page:
                    //this.programService.navigateToRoute([this.programService.currentProgramDetailUrl]);

                },
                (err) => {
                    this.message = "Fehler beim Speichern: " + err.text();
                }
            )
    }

    resetRating(): void{
        this.shortcut.ratingNr = 0;
        this.shortcut.ratingCount = 0;
    }

}
