/**
 * Created by simon41 on 11/30/2016.
 */

import {Injectable, Inject} from "@angular/core";
import {Http, URLSearchParams, Headers, RequestOptions} from "@angular/http";
import {PROGRAMS_URL, VERSIONS_URL, SHORTCUTS_URL} from "../../app.tokens";
import {ProgramSummary} from "../../entities/programSummary";
import {Program} from "../../entities/programs";
import {ProgramVersion} from "../../entities/programVersions";
import {OsTypes} from "../../entities/osTypes";
import {ProgramSummaryVersionEntry} from "../../entities/programSummaryVersionEntry";
import {Observable} from "rxjs";
import {Shortcut} from "../../entities/shortcuts";
import {Router} from "@angular/router";

@Injectable()
export class ProgramService {

  programSummaries:ProgramSummary[];
  programs:Program[] = [];
  programNames:string[] = [];
  programVersions:ProgramVersion[] = [];
    shortcuts:Shortcut[] = [];

    currentProgramDetailUrl:string;
    versionIdForNewlyCreatedShortcut:number;
    programNameForNewlyCreatedVersion:string;

  constructor(
    @Inject(PROGRAMS_URL) private programUrl: string,
    @Inject(VERSIONS_URL) private versionsUrl: string,
    @Inject(SHORTCUTS_URL) private shortcutsUrl: string,
    private http: Http,
    private router:Router) {

  }

    public navigateToRoute(args:any[]){
        this.router.navigate(args);
    }

    public updateProgramLocally(program:Program){
        this.updateLocally<Program>(program, "name", this.programs);
    }

    public updateProgramByAttributesLocally(program:Program){
        this.updateLocallyV2<Program>(program, "name", this.programs);
    }

    public updateVersionLocally(version:ProgramVersion){
        this.updateLocally<ProgramVersion>(version, "id", this.programVersions);
    }

    public updateVersionByAttributesLocally(version:ProgramVersion){
        this.updateLocallyV2<ProgramVersion>(version, "id", this.programVersions);
    }

    public updateShortcutLocally(shortcut:Shortcut){
        this.updateLocally<Shortcut>(shortcut, "id", this.shortcuts);
    }

    public updateShortcutByAttributesLocally(shortcut:Shortcut){
        this.updateLocallyV2<Shortcut>(shortcut, "id", this.shortcuts);
    }

    private updateLocally<T>(obj:T, idAttribute:string, localArray:T[]){
        let objIndex = localArray.findIndex((elem:T)=>elem[idAttribute] == obj[idAttribute]);
        if (objIndex>=0){
            localArray[objIndex] = obj;
            console.log("Local Object updated successfully");
        } else {
            console.log("Object not found in local array");
        }
    }

    //only replace attributes of a existing value:
    private updateLocallyV2<T>(obj:any, idAttribute:string, localArray:T[]){
        let objIndex = localArray.findIndex((elem:T)=>elem[idAttribute] == obj[idAttribute]);
        if (objIndex>=0){
            for (var key in obj){
                if (obj.hasOwnProperty(key) && obj[key] != null){
                    if (localArray[objIndex].hasOwnProperty(key)){
                        if (obj[key] != localArray[objIndex][key]){
                            localArray[objIndex][key] = obj[key];
                        }
                    }
                }

            }
            localArray[objIndex] = obj;
            console.log("Local Object updated successfully");
        } else {
            console.log("Object not found in local array");
        }
    }

    //retrives the foreign key referenced Url for the Shortcut, maybe better as static function in Shortcut
    public retrieveAssociatedVersionForShortcut(shortcut:Shortcut): Observable<ProgramVersion>{
        //This is the most exhausting pathing to a foreign key reference of All Time
        let url = shortcut["_links"]["programVersion"]["href"];

        return this.getUrlContentAsJson(url);
    }

    //retrives the foreign key referenced Url for the Version, maybe better as static function in ProgramVersion
    public retrieveAssociatedProgramForVersion(version:ProgramVersion): Observable<Program>{
        //This is the most exhausting pathing to a foreign key reference of All Time
        let url = version["_links"]["program"]["href"];

        return this.getUrlContentAsJson(url);
    }

    public static getSelfLinkFromObject<T>(prog:T){
        return prog["_links"]["self"]["href"];
    }

    public addNewProgramLocally(program:Program){
        this.addLocally<Program>(program, "name", this.programs);
    }

    public addNewVersionLocally(version:ProgramVersion){
        this.addLocally<ProgramVersion>(version, "id", this.programVersions);
    }

    public addNewShortcutLocally(shortcut:Shortcut){
        this.addLocally<Shortcut>(shortcut, "id", this.shortcuts);
    }

    private addLocally<T>(obj:T, idAttribute:string, localArray:T[]){
        let objIndex = localArray.findIndex((elem:T)=>elem[idAttribute] == obj[idAttribute]);
        //There must be no object in the local array having the same id value as the new object!
        if (objIndex<0){
            localArray.push(obj);
            console.log("Local Object was added successfully");
        } else {
            console.log("Error: There is already an object with the same id as the new object in the local array");
        }
    }

  //Access the Program Array from the JSON object we get from the server
  public accessProgramsFromJson(programObject){
      return programObject["_embedded"]["programs"];

  }
    //Access the ProgramVersions Array from the JSON object we get from the server
    public accessVersionsFromJson(versionObject){
        return versionObject["_embedded"]["programVersions"];

    }

    public accessShortcutsFromJson(shortcutObject){
        return shortcutObject["_embedded"]["shortcuts"];

    }

    //ToDo: If authorization via Tokens is implemented, set them only in this function:
    private generateHttpHeader():Headers{
        let headers = new Headers();
        headers.set('Accept', 'application/json');
        return headers;
    }

    public createProgramV2(program:Program): Observable<Program>{
        let url = this.buildUrlForProgram(program);
        return this.create<Program>(program, url);
    }

    private buildUrlForProgram(program:Program):string{
        return this.programUrl + "/" + program.name.replace(" ", "%20");// + "/";
    }

    public buildUrlForProgramByName(name:string):string{
        return this.programUrl + "/" + name.replace(" ", "%20");
    }

    public buildUrlForVersionById(id:number):string{
        return this.versionsUrl + "/" + id.toString();
    }

    public buildUrlForShortcutById(id:number):string{
        return this.shortcutsUrl + "/" + id.toString();
    }

    public buildRelativeUrlForProgram(name:string):string{
        return "/programs/" + name.replace(" ", "%20");
    }

    public buildRelativeUrlForVersion(id:number):string{
        return "/programVersions/" + id.toString();
    }

    public buildRelativeUrlForShortcut(id:number):string{
        return "/shortcuts/" + id.toString();
    }

    public createVersionV3(programVersion): Observable<ProgramVersion>{
        return this.save(programVersion, this.versionsUrl);
    }

    private buildUrlForVersion(version:ProgramVersion):string{
        return this.versionsUrl + "/" + version.id;// + "/";
    }

    public createShortcutV3(shortcut): Observable<Shortcut>{
        return this.save(shortcut, this.shortcutsUrl);
    }

    private buildUrlForShortcut(shortcut:Shortcut):string{
        return this.shortcutsUrl + "/" + shortcut.id;// + "/";
    }

    public create<T>(createObj:T, url:string):Observable<T>{
        let headers = this.generateHttpHeader();

        return this
            .http
            .put(url, createObj, {headers})
            .map(resp => resp.json());
    }

    public save<T>(saveObj:T, url:string):Observable<T>{
        let headers = this.generateHttpHeader();

        return this
            .http
            .post(url, saveObj, { headers })
            .map(resp => resp.json());
    }

    //patching requres the exact url for the object (/programs/Blender), while post only needs the base url for the entity: /programs/
    public putSave(saveObj:any, url:string){
        let headers = this.generateHttpHeader();

        return this
            .http
            .patch(url, saveObj, { headers })
            .map(resp => resp.json());
    }

    public saveProgramByPut(program:any, programName:string):Observable<Program>{
        return this.putSave(program, this.programUrl + "/" + programName);
    }

    public saveVersionByPut(version:any, versionId:number):Observable<ProgramVersion>{
        return this.putSave(version, this.versionsUrl + "/" + versionId);
    }

    //the shortcut object does not necessarily have the id attribute we need for creating the url, so we have to pass the id separately
    public saveShortcutByPut(shortcut:any, shortcutId:number):Observable<Shortcut>{
        return this.putSave(shortcut, this.shortcutsUrl + "/" + shortcutId);
    }

    //Seems like we only have to access the baseUrl, not the concrete Url to the object for the update.
    public saveProgram(program:Program):Observable<Program>{
        return this.save<Program>(program, this.programUrl + "/");
    }

    public saveVersion(version:ProgramVersion):Observable<ProgramVersion>{
        return this.save<ProgramVersion>(version, this.versionsUrl + "/");
    }

    public saveShortcut(shortcut:Shortcut):Observable<Shortcut>{
        return this.save<Shortcut>(shortcut, this.shortcutsUrl + "/");
    }

    //probably not even a Observable of Type T as return value, because the delete method returns no body of the deleted object, only a successcode
    public delete<T>(obj:T, url:string):Observable<T>{
        let headers = this.generateHttpHeader();

        return this
            .http
            .delete(url, { headers })
            .map(resp => resp.json());
    }

    public deleteOnBackendAndFrontend<T>(obj:T, url:string, array:T[]){
        let headers = this.generateHttpHeader();

        return this
            .http
            .delete(url, { headers })
            .map(resp => resp.json())
            .subscribe(
                (ok) => {
                    //delete the program also locally if server delete is successful
                    if (array){
                        let localIndex = array.indexOf(obj);
                        if (localIndex >= 0){
                            array.splice(localIndex, 1);
                            console.log("Object " + typeof(obj) + " deleted successfully");
                        } else {
                            console.log("Object " + typeof(obj)+ " deleted successfully only on server side");
                        }
                    }
                },
                (err) => {
                    console.error('Delete Error for Object', err);
                }
            )
    }

    public deleteProgram(program:Program){
        this.deleteOnBackendAndFrontend<Program>(program, this.buildUrlForProgram(program), this.programs);
    }

    public deleteVersion(version:ProgramVersion){
        this.deleteOnBackendAndFrontend<ProgramVersion>(version, this.buildUrlForVersion(version), this.programVersions);
    }

    public deleteVersionOnlineAndFromArray(version:ProgramVersion, arrayToDelete:ProgramVersion[]){
        this.deleteOnBackendAndFrontend<ProgramVersion>(version, this.buildUrlForVersion(version),arrayToDelete);
    }

    public deleteShortcut(shortcut:Shortcut){
        this.deleteOnBackendAndFrontend<Shortcut>(shortcut, this.buildUrlForShortcut(shortcut), this.shortcuts);
    }

    public deleteShortcutOnlineAndFromArray(shortcut:Shortcut, arrayToDelete:Shortcut[]){
        this.deleteOnBackendAndFrontend<Shortcut>(shortcut, this.buildUrlForShortcut(shortcut), arrayToDelete);
    }

    applyApplicationRating(applicationName:string, rating:number){
        let programToChange:Program = this.programs.find((prog:Program)=>prog.name == applicationName);
        if (programToChange){
            console.log("programToChange");
            console.log(programToChange);
            programToChange.ratingCount+=1;
            programToChange.ratingNr+=rating;

            let saveObj = {
                ratingCount: programToChange.ratingCount,
                ratingNr: programToChange.ratingNr
            };

            this.saveProgramByPut(saveObj, applicationName)
                .subscribe(
                    (program) => {
                        programToChange = program;
                        this.updateProgramLocally(program);

                        console.log(program);
                    },
                (err) => {
                    console.error('Fehler beim Laden', err);
                }

            );
        }
    }

    applyShortcutRating(shortcutId:number, rating:number){
        let shortcutToChange:Shortcut = this.shortcuts.find((shct:Shortcut)=>shct.id == shortcutId);
        if (shortcutToChange){
            shortcutToChange.ratingCount+=1;
            shortcutToChange.ratingNr+=rating;

            let saveObj = {
                ratingCount: shortcutToChange.ratingCount,
                ratingNr: shortcutToChange.ratingNr
            };

            this.saveShortcutByPut(saveObj, shortcutToChange.id)
                .subscribe(
                    (shortcut) => {
                        shortcutToChange = shortcut;
                        this.updateShortcutLocally(shortcut);

                        console.log(shortcut);
                },
                (err) => {
                    console.error('Fehler beim Laden', err);
                }

            );
        }else{
            console.error('Fehler beim Finden des Shortcuts ' + shortcutId + ', alle shorts: ' + this.shortcuts.length);
        }
    }

    getPrgramByNameLocally(programName:string){
        if (!this.programs){
            console.error("No programs were loaded from the server")
            return {};
            //throw Error;
        }
        let programMatches = this.programs.find(prog => prog.name == programName.trim());
        if (programMatches != undefined){
            return programMatches;
        } else {
            return {};
        }
    }

  public getProgramFromServer(programName:string):Observable<Program>{
      return this.getUrlContentAsJson(this.programUrl + "/" + programName.replace(" ", "%20").trim());
  }

    public getVersionFromServer(programVersionId:number):Observable<ProgramVersion>{
        return this.getUrlContentAsJson(this.versionsUrl + "/" + programVersionId.toString());
    }

    public getShortcutFromServer(shortcutId:number):Observable<Shortcut>{
        return this.getUrlContentAsJson(this.shortcutsUrl + "/" + shortcutId.toString());
    }


  public getUrlContentAsJson(url:string){
        let headers = this.generateHttpHeader();

    return this
        .http.get(url, {headers})
        .map(resp => resp.json());
  }


  public getAllPrograms(){
    return this.getUrlContentAsJson(this.programUrl);
  }

  public loadAllProgramsFromServer(){
      let headers = this.generateHttpHeader();

      this
          .http
          .get(this.programUrl, { headers })
          .map(resp => resp.json())
          .subscribe(
              (programs) => {
                  this.programs = this.accessProgramsFromJson(programs);
              },
              (err) => {
                  console.error('Fehler beim Laden', err);
              }
          );
  }

  public getAllVersions(){
    return this.getUrlContentAsJson(this.versionsUrl);

  }

  private createEmptyProgramSummariesFromPrograms(programList:Program[]){
      let programSummaries = {};
      for (let p of programList){
          if (!programSummaries.hasOwnProperty(p.name) || programSummaries[p.name]==null){
              programSummaries[p.name] = {
                  name: p.name,
                  description: p.description,
                  website: p.website,
                  ratingNr: p.ratingNr,
                  ratingCount: p.ratingCount,
                  versions: {
                      linux:[],
                      windows:[],
                      osx:[]
                  }
              }
          }
      }
      return programSummaries;
  }


  public createProgramUrlFromProgramName(programName:string){
      return this.programUrl + "/" + programName.replace(" ", "%20") + "/";
  }

  //example url: http://localhost:8080/programs/Visual%20Studio/
  public createProgramSummaryForProgramUrl(programUrl){
      this.getUrlContentAsJson(programUrl).subscribe(
          (program)=>{
              let versionLink = program["_links"]["programVersions"]["href"];
              //Typescript "cast" - not a real cast of course, precompile check only
              let p:Program = <Program> program;
              let programSummary:ProgramSummary = {
                  name: p.name,
                  description: p.description,
                  website: p.website,
                  ratingNr: p.ratingNr,
                  ratingCount: p.ratingCount,
                  versions: {
                      linux:[],
                      windows:[],
                      osx:[]
                  }
              };
              this.getUrlContentAsJson(versionLink).subscribe(
                  (versions)=>{
                      let versionList:ProgramVersion[] = this.accessVersionsFromJson(versions);
                      this.assignVersionsToProgramSummary(programSummary, versionList);
                      console.log("programSummary:");
                      console.log(programSummary);
                      return programSummary;

                  },
                  (err)=>{
                      console.error('Fehler beim Laden der Versionen', err);
                      return {};
                  }
              );
          },
          (err)=>{
              console.error('Fehler beim Laden des Programmlinks', err);
              return {};
          }

      );

  }

    //example url: http://localhost:8080/programs/Visual%20Studio/
    //Parameters:
    //programSummary - this is the object where the created programSummary is written into
    //callbackSuccess - the callback function that is called if this function is successful. The created ProgramSummary will be passed to this callback function
    //callbackFailure - the callback function that is called if this function fails. Not argument is passed for this function.
    public assignProgramSummaryForProgram(program:Program, programSummary, callbackSuccess?, callbackFailure?){
        if (!callbackSuccess){
            callbackSuccess = (summaryObject)=>{console.log("callbackSuccess")};
        }
        if (!callbackFailure){
            callbackFailure = ()=>{console.log("callbackFailure")};
        }
        let versionLink = program["_links"]["programVersions"]["href"];
        //Typescript "cast" - not a real cast of course, precompile check only
        programSummary = {
            name: program.name,
            description: program.description,
            website: program.website,
            ratingNr: program.ratingNr,
            ratingCount: program.ratingCount,
            versions: {
                linux:[],
                windows:[],
                osx:[]
            }
        };
        this.getUrlContentAsJson(versionLink).subscribe(
            (versions)=>{
                let versionList:ProgramVersion[] = this.accessVersionsFromJson(versions);
                this.assignVersionsToProgramSummary(programSummary, versionList);
                console.log("programSummary:");
                console.log(programSummary);
                callbackSuccess(programSummary);
                //return programSummary;

            },
            (err)=>{
                console.error('Fehler beim Laden der Versionen', err);
                callbackFailure();
                //return {};
            }
        );
    }

  //creating a list of programSummaries: (programinfo + according versions to each program)
  //private createProgramSummariesFromJsonList(programList: Program[]):{string:ProgramSummary}{
  private createProgramSummariesFromJsonList(programList: Program[], versionList:ProgramVersion[]){
    //ToDo: if the function doesnt work with a synchronous approach, we have to handle this via a callback function
    //var programs: {string: ProgramSummary};
    var programSummaries = {};
    for (let p of programList){
      if (!programSummaries.hasOwnProperty(p.name) || programSummaries[p.name]==null){
        programSummaries[p.name] = {
          name: p.name,
          description: p.description,
          website: p.website,
          ratingNr: p.ratingNr,
          ratingCount: p.ratingCount,
          versions: {
            linux:[],
            windows:[],
            osx:[]
          }
        }
      }
    }

    for (let v of versionList){
        let entry:ProgramSummaryVersionEntry = {"id": v.id, "shortcutLink":v["_links"]["shortcuts"]["href"], "versionText":v.versionText};
          switch (v.osType){
              case OsTypes.windows:
                  programSummaries[v.program].versions.windows.push(entry);
                  break;
              case OsTypes.linux:
                  programSummaries[v.program].versions.linux.push(entry);
                  break;
              case OsTypes.osx:
                  programSummaries[v.program].versions.osx.push(entry);
                  break;
              default:
                  break;
          }
      }

    //sort the versions:
    for (var x in programSummaries){
      if (programSummaries.hasOwnProperty(x) && programSummaries[x]!=null){
        programSummaries[x].versions.windows.sort();
        programSummaries[x].versions.linux.sort();
        programSummaries[x].versions.osx.sort();
      }
    }
    return programSummaries;
  }

  private assignVersionsToProgramSummary(summary:ProgramSummary, versionList:ProgramVersion[]){
      console.log("assignVersionsToProgramSummary");
      for (let v of versionList){
          console.log("version id: "+v.id);
          let entry:ProgramSummaryVersionEntry = {"id": v.id, "shortcutLink":v["_links"]["shortcuts"]["href"], "versionText":v.versionText};
          switch (v.osType){
              case OsTypes.windows:
                  summary.versions.windows.push(entry);
                  break;
              case OsTypes.linux:
                  summary.versions.linux.push(entry);
                  break;
              case OsTypes.osx:
                  summary.versions.osx.push(entry);
                  break;
              default:
                  break;
          }
      }
      return summary;

  }

}
