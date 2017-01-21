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
          <div class="form-group">
            <label>Short Description:</label>
            <input [(ngModel)]="shortcut.descriptionShort" required class="form-control">
          </div>
          <div class="form-group">
            <label>Key Combination:</label>
            <input [(ngModel)]="shortcut.keyCode" required class="form-control">
          </div>
          <div class="form-group">
            <label>Long Description:</label>
            <input [(ngModel)]="shortcut.description" required class="form-control">
          </div>
          <div>
          <p>Average Rating:</p>
          <p>{{(shortcut.ratingNr / shortcut.ratingCount) | decimal: 2}}</p>
          </div>
          <div class="form-group">
            <button (click)="resetRating()" class="btn btn-default">Reset Ratings</button>
          </div>
          <div class="form-group">
            <button (click)="saveV2()" class="btn btn-default">Save</button>
          </div>
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
