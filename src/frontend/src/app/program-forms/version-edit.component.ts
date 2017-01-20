import { Component } from '@angular/core';
import {Program} from "../entities/programs";
import {ProgramVersion} from "../entities/programVersions";
import {ActivatedRoute} from "@angular/router";
import {ProgramService} from "../program-search/services/program.service";

@Component({
    template:`
        <h1>Edit Program Version:</h1>
        <h3>Application: {{programName}}</h3>
        <div>
          {{ message }}
        </div>
        <div *ngIf="version">
          <div class="form-group">
            <label>Version: </label>
            <input [(ngModel)]="version.versionText" required class="form-control">
          </div>
        <div class="form-group">
            <p>Operating System: </p>
            <form>
              <input type="radio" name="os-type" [(ngModel)]="version.osType" [value]="0" (click)="version.osType = 0"> <img alt="" style="width: 35px; height: 35px;" src="images/win-icon.png"> Windows <br>
              <input type="radio" name="os-type" [(ngModel)]="version.osType" [value]="1" (click)="version.osType = 1"> <img alt="" style="width: 35px; height: 35px;" src="images/linux-icon.png"> Linux <br>
              <input type="radio" name="os-type" [(ngModel)]="version.osType" [value]="2" (click)="version.osType = 2"> <img alt="" style="width: 35px; height: 35px;" src="images/macOS-icon.png"> macOS 
            </form>
          </div>
          <div class="form-group">
            <button (click)="saveV2()" class="btn btn-default">Save</button>
          </div>
        </div>
        <div *ngIf="!version">
          <p>Loading Version...</p>
        </div>
        
      
      `

})

export class VersionEditComponent {
    versionId:number;
    version:ProgramVersion;
    message:string;

    constructor(
        private programService: ProgramService,
        route: ActivatedRoute) {

        route.params.subscribe(
            p => {
                console.log("version Id: " + p['id']);
                this.versionId = +p['id']; //the + saves the parameter as number
                this.load(this.versionId);
            }
        )
    }

    public get programName(): string {
        return this.programService.programNameForNewlyCreatedVersion;
    }


    appendForeignKeyToVersion(version:ProgramVersion, callbackFunc:()=>void = function(){}){
        try {
            this.programService.retrieveAssociatedProgramForVersion(version)
                .subscribe(
                    prog => {
                        version.program = ProgramService.getSelfLinkFromObject<Program>(prog);
                        callbackFunc();

                    },
                    (err) => {
                        console.log("correct link for foreign key reference could not be retrieved for version");
                        version.program = this.programService.buildUrlForProgramByName(this.programService.programNameForNewlyCreatedVersion);
                        callbackFunc();
                    }
                )
        } catch (e) {
            console.log("correct link for foreign key reference could not be retrieved for version");
            version.program = this.programService.buildUrlForProgramByName(this.programService.programNameForNewlyCreatedVersion);
            callbackFunc();
        }
    }

    load(id: number): void {
        this
            .programService
            .getVersionFromServer(id)
            .subscribe(
                versionObject => {
                    console.log(versionObject);
                    this.version = versionObject;
                    //this.appendForeignKeyToVersion(this.version);
                    this.message = "";
                },
                (err) => {
                    this.message = "Fehler beim Laden: " + err.text();
                }
            )
    }

    saveV2():void{
        let saveObj = {
            osType: this.version.osType,
            versionText: this.version.versionText
        };
        this
            .programService
            .saveVersionByPut(saveObj, this.version.id)
            .subscribe(
                versionObject => {
                    this.version = versionObject;
                    this.programService.updateVersionByAttributesLocally(this.version);
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
            .saveVersion(this.version)
            .subscribe(
                versionObject => {
                    this.version = versionObject;
                    let self = this;
                    this.appendForeignKeyToVersion(this.version, function(){
                        self.programService.updateVersionLocally(self.version);
                        self.message = "Daten wurden gespeichert!";
                        //redirect to the Program Detail page:
                        self.programService.navigateToRoute([self.programService.currentProgramDetailUrl]);
                    });
                },
                (err) => {
                    this.message = "Fehler beim Speichern: " + err.text();
                }
            )

    }

}