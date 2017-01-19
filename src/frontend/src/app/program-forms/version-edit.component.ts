import { Component } from '@angular/core';
import {Program} from "../entities/programs";
import {ProgramVersion} from "../entities/programVersions";
import {ActivatedRoute} from "@angular/router";
import {ProgramService} from "../program-search/services/program.service";

@Component({
    template:`
        <h1>Edit program version:</h1>
        <h3>For the Application {{programName}}</h3>
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
            <!-- 
            <input type="radio" name="os-type-1" (click)="version.osType = 0" 
             [checked]="version.osType === 0">Windows
              -->
            <form>
              <input type="radio" name="os-type" [(ngModel)]="version.osType" [value]="0"> Windows <br>
              <input type="radio" name="os-type" [(ngModel)]="version.osType" [value]="1"> Linux <br>
              <input type="radio" name="os-type" [(ngModel)]="version.osType" [value]="2"> OSX 
            </form>
          </div>
          <div class="form-group">
            <button (click)="save()" class="btn btn-default">Save</button>
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

    load(id: number): void {
        this
            .programService
            .getVersionFromServer(id)
            .subscribe(
                versionObject => {
                    console.log(versionObject);
                    this.version = versionObject;
                    this.message = "";
                },
                (err) => {
                    this.message = "Fehler beim Laden: " + err.text();
                }
            )
    }

    save(): void {
        this.version.program = this.programService.buildUrlForProgramByName(this.programService.programNameForNewlyCreatedVersion);
        this
            .programService
            .saveVersion(this.version)
            .subscribe(
                versionObject => {
                    this.version = versionObject;
                    this.programService.updateVersionLocally(this.version);
                    this.message = "Daten wurden gespeichert!";
                    //redirect to the Program Detail page:
                    this.programService.navigateToRoute([this.programService.currentProgramDetailUrl]);

                },
                (err) => {
                    this.message = "Fehler beim Speichern: " + err.text();
                }
            )

    }

}