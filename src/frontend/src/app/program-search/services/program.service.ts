/**
 * Created by simon41 on 11/30/2016.
 */
/**
 * Created by simon41 on 11/24/2016.
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


    public static combinePaths(path1:string, path2:string):string{
        var path_1:string;
        var path_2:string;

        if (path2.startsWith("/")){
            path_2 = path2.substring(1);
        } else {
            path_2 = path2;
        }

        if (path1.endsWith("/")){
            path_1 = path1.substring(0, path1.length - 1);
        } else {
            path_1 = path1;
        }

        return path_1 + "/" + path_2;
    }

    public static cloneObject<T>(obj:T):T{
        return <T> JSON.parse(JSON.stringify(obj));
    }

    public navigateToRoute(args:any[]){
        this.router.navigate(args);
    }

    public getLocalProgramByName(progName:string):Program{
        return this.programs.find((prog:Program)=>prog.name == progName);
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

    public updateShortcutInArray(shortcut:Shortcut, arr:Shortcut[]){
        this.updateLocally<Shortcut>(shortcut, "id", arr);
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

        //return shortcut["_links"]["programVersion"]["href"];
    }

    //retrives the foreign key referenced Url for the Version, maybe better as static function in ProgramVersion
    public retrieveAssociatedProgramForVersion(version:ProgramVersion): Observable<Program>{
        //This is the most exhausting pathing to a foreign key reference of All Time
        let url = version["_links"]["program"]["href"];

        return this.getUrlContentAsJson(url);
        //return version["_links"]["program"]["href"];
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
        this.updateLocally<Shortcut>(shortcut, "id", this.shortcuts);
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

    public createProgram(program:Program): Observable<Program>{
        let url = this.buildUrlForProgram(program);

        let headers = this.generateHttpHeader();

        return this
            .http
            .put(url, program, {headers})
            .map(resp => resp.json());
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

    //ToDo: The primary key has to be generated on the server side, so how do we know how we can create the new version?
    public createVersion(programVersion:ProgramVersion): Observable<ProgramVersion>{
        //let url = this.buildUrlForVersion(programVersion);
        let url = this.versionsUrl;

        let headers = this.generateHttpHeader();

        return this
            .http
            .put(url, programVersion, {headers})
            .map(resp => resp.json());
    }

    public createVersionV2(programVersion:ProgramVersion): Observable<ProgramVersion>{
        return this.create<ProgramVersion>(programVersion, this.versionsUrl);
    }

    public createVersionV3(programVersion): Observable<ProgramVersion>{
        //return this.create(programVersion, this.versionsUrl);
        //return this.save(programVersion, this.versionsUrl + "/");
        return this.save(programVersion, this.versionsUrl);
    }

    public createVersionV4(programVersion, programName:string): Observable<ProgramVersion>{
        //return this.create(programVersion, this.versionsUrl);
        //return this.save(programVersion, this.versionsUrl + "/");
        return this.save(programVersion, this.programUrl + "/" + programName + "/" + "programVersions");
    }


    private buildUrlForVersion(version:ProgramVersion):string{
        return this.versionsUrl + "/" + version.id;// + "/";
    }

    //ToDo: Do not send the id, but let the server create the shortcut id.
    public createShortcut(shortcut:Shortcut): Observable<Shortcut>{
        //let url = this.buildUrlForShortcut(shortcut);
        let url = this.shortcutsUrl;

        let headers = this.generateHttpHeader();

        return this
            .http
            .put(url, shortcut, {headers})
            .map(resp => resp.json());
    }

    public createShortcutV2(shortcut:Shortcut): Observable<Shortcut>{
        return this.create<Shortcut>(shortcut, this.shortcutsUrl);
    }

    public createShortcutV3(shortcut): Observable<Shortcut>{
        //return this.create(shortcut, this.shortcutsUrl);
        //return this.save(shortcut, this.shortcutsUrl + "/");
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
        //return this.save<Program>(program, this.buildUrlForProgram(program));
        return this.putSave(program, this.programUrl + "/" + programName);
    }

    public saveVersionByPut(version:any, versionId:number):Observable<ProgramVersion>{
        //return this.save<ProgramVersion>(version, this.buildUrlForVersion(version));
        return this.putSave(version, this.versionsUrl + "/" + versionId);
    }

    //the shortcut object does not necessarily have the id attribute we need for creating the url, so we have to pass the id separately
    public saveShortcutByPut(shortcut:any, shortcutId:number):Observable<Shortcut>{
        //return this.save<Shortcut>(shortcut, this.buildUrlForShortcut(shortcut));
        return this.putSave(shortcut, this.shortcutsUrl + "/" + shortcutId);
    }

    //Seems like we only have to access the baseUrl, not the concrete Url to the object for the update.
    public saveProgram(program:Program):Observable<Program>{
        //return this.save<Program>(program, this.buildUrlForProgram(program));
        return this.save<Program>(program, this.programUrl + "/");
    }

    public saveVersion(version:ProgramVersion):Observable<ProgramVersion>{
        //return this.save<ProgramVersion>(version, this.buildUrlForVersion(version));
        return this.save<ProgramVersion>(version, this.versionsUrl + "/");
    }

    public saveShortcut(shortcut:Shortcut):Observable<Shortcut>{
        //return this.save<Shortcut>(shortcut, this.buildUrlForShortcut(shortcut));
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

    // public deleteProgramOld(program:Program){
    //     this.delete<Program>(program, this.buildUrlForProgram(program))
    //         .subscribe(
    //             (ok) => {
    //                 //delete the program also locally if server delete is successful
    //                 let localProgIndex = this.programs.indexOf(program);
    //                 if (localProgIndex >= 0){
    //                     this.programs.splice(localProgIndex, 1);
    //                     console.log("Program deleted successfully");
    //                 } else {
    //                     console.log("Program deleted successfully only on server side");
    //                 }
    //             },
    //             (err) => {
    //                 console.error('Delete Error for Program', err);
    //             }
    //         )
    // }



    // public deleteVersionOld(version:ProgramVersion){
    //     this.delete<ProgramVersion>(version, this.buildUrlForVersion(version))
    //         .subscribe(
    //             (ok) => {
    //                 //delete the program also locally if server delete is successful
    //                 let localVersionIndex = this.programVersions.indexOf(version);
    //                 if (localVersionIndex >= 0){
    //                     this.programVersions.splice(localVersionIndex, 1);
    //                     console.log("ProgramVersion deleted successfully");
    //                 } else {
    //                     console.log("ProgramVersion deleted successfully only on server side");
    //                 }
    //             },
    //             (err) => {
    //                 console.error('Delete Error for ProgramVersion', err);
    //             }
    //         )
    // }



    // public deleteShortcutOld(shortcut:Shortcut){
    //     this.delete<Shortcut>(shortcut, this.buildUrlForShortcut(shortcut))
    //         .subscribe(
    //             (ok) => {
    //                 //delete the program also locally if server delete is successful
    //                 let localShortcutIndex = this.shortcuts.indexOf(shortcut);
    //                 if (localShortcutIndex >= 0){
    //                     this.shortcuts.splice(localShortcutIndex, 1);
    //                     console.log("Shortcut deleted successfully");
    //                 } else {
    //                     console.log("Shortcut deleted successfully only on server side");
    //                 }
    //             },
    //             (err) => {
    //                 console.error('Delete Error for Shortcut', err);
    //             }
    //         )
    // }


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

    //ToDo: only increase the ratingNr by rating and the ratingCount by 1 for the given Version
    applyApplicationRating(applicationName:string, rating:number){
        let programToChange:Program = this.programs.find((prog:Program)=>prog.name == applicationName);
        if (programToChange){
            console.log("programToChange");
            console.log(programToChange);
            programToChange.ratingCount+=1;
            programToChange.ratingNr+=rating;

            //let url = this.buildUrlForProgram(programToChange);

            this.saveProgram(programToChange).subscribe(
                (program) => {
                     console.log(program);
                    // let localProgramIndex = this.programs.findIndex((prog:Program)=>prog.name == program.name);
                    // if (localProgramIndex>=0){
                    //     this.programs[localProgramIndex] = program;
                    //     console.log('Rating Update successful');
                    // } else {
                    //     console.log('Rating Update successful on Server Side, but failed in program list locally');
                    // }
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


            //let url = this.buildUrlForShortcut(shortcutToChange);

            this.saveShortcut(shortcutToChange).subscribe(
                (shortcut) => {
                    console.log(shortcut);
                    let localShortcutIndex = this.shortcuts.findIndex((shct:Shortcut)=>shct.id == shortcutId);
                    if (localShortcutIndex>=0){
                        this.shortcuts[localShortcutIndex] = shortcut;
                        console.log('Rating Update successful');
                    } else {
                        console.log('Rating Update successful on Server Side, but failed in program list locally');
                    }

                },
                (err) => {
                    console.error('Fehler beim Laden', err);
                }

            );
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


    //ToDo:Delete following authorization method:
    /*
  private getAuthorizationHeader(){
    var headers = new Headers();
    //headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', 'Basic ' +
        btoa('user:hotshortsdb'));
    return headers;
  }

    private appendAuthorizationHeader(headers:Headers){
        //headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Authorization', 'Basic ' +
            btoa('user:hotshortsdb'));
        //return headers;
    }
    */

  public getProgramFromServer(programName:string):Observable<Program>{
      return this.getUrlContentAsJson(this.programUrl + "/" + programName.replace(" ", "%20").trim());
  }

    public getVersionFromServer(programVersionId:number):Observable<ProgramVersion>{
        return this.getUrlContentAsJson(this.versionsUrl + "/" + programVersionId.toString());
    }

    public getShortcutFromServer(shortcutId:number):Observable<Shortcut>{
        return this.getUrlContentAsJson(this.shortcutsUrl + "/" + shortcutId.toString());
    }

    //ToDo: only retrieve single program:
    /*
    public findSingleProgramByName(name:string):Observable<Program> {
        let url = this.programUrl;
        let search = new URLSearchParams();
        search.set('name', name);

        let headers = this.generateHttpHeader();

        return this
            .http
            .get(url, { headers, search })
            .map(resp => resp.json());

    }
    */

    //Most generic and reuseable find method:
    public findObject<T>(serverAttribute:string, attributeValue:string, url):Observable<T>{

        let search = new URLSearchParams();
        search.set(serverAttribute, attributeValue);

        let headers = this.generateHttpHeader();

        return this
            .http
            .get(url, { headers, search })
            .map(resp => resp.json());
    }

    //For Shortcut and ProgramVersion:
    public findById<T>(id:number, url):Observable<T>{

        let search = new URLSearchParams();
        search.set('id', id.toString());

        let headers = this.generateHttpHeader();

        return this
            .http
            .get(url, { headers, search })
            .map(resp => resp.json());
    }

    public findSingleProgramByName(name:string):Observable<Program> {
        return this.findObject<Program>('name', name, this.programUrl);

    }

    public findSingleShortcutById(id:number):Observable<Shortcut>{
        //return this.findById<Shortcut>(id, this.shortcutsUrl);
        return this.findObject<Shortcut>('id', id.toString(), this.shortcutsUrl);
    }

    public findSingleVersionById(id:number):Observable<ProgramVersion>{
        //return this.findById<ProgramVersion>(id, this.versionsUrl);
        return this.findObject<ProgramVersion>('id', id.toString(), this.versionsUrl);
    }

    //ToDo: no search function implemented on server side as of now
    /*
  public findProgram(name: string) {
    let url = this.programUrl;
    let search = new URLSearchParams();
    search.set('name', name);
    //ToDo: query after the primary key if possible, else try to findProgram a way to include the primary key in the JSON data we get from the server

    let headers = this.generateHttpHeader();

      this
          .http
          .get(url, { headers, search })
          .map(resp => resp.json())
          .subscribe(
              (programs) => {
                  console.log(programs["_embedded"]["programs"]);
                  this.programs = this.accessProgramsFromJson(programs);
              },
              (err) => {
                  console.error('Fehler beim Laden', err);
              }
          );
  }

*/


    // public findVersionById(name: string):Observable<ProgramVersion> {
    //     let versionToStore: ProgramVersion;
    //     let url = this.versionsUrl;
    //     let search = new URLSearchParams();
    //     search.set('name', name);
    //     //ToDo: query after the primary key if possible, else try to findProgram a way to include the primary key in the JSON data we get from the server
    //
    //     let headers = new Headers();
    //     //let headers = this.getAuthorizationHeader();
    //     headers.append('Accept', 'application/json');
    //
    //     return this
    //         .http
    //         .post(url, { headers, search })
    //         .map(resp => resp.json());
    // }

  //ToDo: sending authorization header information in every request can cause problems such as 403 response status to preflight option requests
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

  /*
  private getAllVersionInformation(callbackFunc:(versionList)=>{}, errorFunc:(error)=>{}){
    var programSummaries = {};

    this.getAllVersions().subscribe(
        (versionList: ProgramVersion[]) => {
          //this.programVersions = versionList;
          return callbackFunc(versionList);
        },
        (err) => {
          return errorFunc(err);
        }
    )
  }
  */

  public getAllVersionInformation(){
    var versionInformation = [];

    this.getAllVersions().subscribe(
        (programList: Program[]) => {
          //this.programs = programList;
          return programList;
        },
        (err) => {
          console.error('Fehler beim Laden der Versionsinformationen', err);
          return [];
        }
    )
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

  public createProgramSummaryForProgram(){
      let programSummeries = {};
      // this.getAllPrograms().subscribe(
      //     (programJson)=>{
      //       let programCurrent = this.accessProgramsFromJson(programJson);
      //     },
      //     (err)=>{
      //         console.error('Fehler beim Laden', err);
      //     }
      //
      // )
      this.getAllPrograms().map((prog)=>{
          let programs = this.accessProgramsFromJson(prog);
          let versionLinks:string = programs["_links"]["programVersions"]["href"];
          programSummeries = this.createEmptyProgramSummariesFromPrograms(<Program[]> programs);
          return this.getUrlContentAsJson(versionLinks);
      });
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
    public assignProgramSummaryForProgramUrl(programUrl:string, programSummary, callbackSuccess?, callbackFailure?){
        if (!callbackSuccess){
            callbackSuccess = (summaryObject)=>{console.log("callbackSuccess")};
        }
        if (!callbackFailure){
            callbackFailure = ()=>{console.log("callbackFailure")};
        }
        this.getUrlContentAsJson(programUrl).subscribe(
            (program)=>{
                let versionLink = program["_links"]["programVersions"]["href"];
                //Typescript "cast" - not a real cast of course, precompile check only
                let p:Program = <Program> program;
                programSummary = {
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
                        callbackSuccess(programSummary);
                        //return programSummary;

                    },
                    (err)=>{
                        console.error('Fehler beim Laden der Versionen', err);
                        callbackFailure();
                        //return {};
                    }
                );
            },
            (err)=>{
                console.error('Fehler beim Laden des Programmlinks', err);
                callbackFailure();
                //return {};
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



    public createProgramSummaries(){
        let programSummaries = {};
        this.getAllPrograms().subscribe(
            (programJson) => {
                let programList = this.accessProgramsFromJson(programJson);
                console.log(programList);
                programSummaries = this.createEmptyProgramSummariesFromPrograms(<Program[]> programList);

                for (let p of programList){

                }
                let versionLinks:string = programList["_links"]["programVersions"]["href"];
                console.log(versionLinks);
                this.getUrlContentAsJson(versionLinks).subscribe(
                    (versionsJson)=>{

                    },
                    (err)=>{
                        console.error('Fehler beim Laden der Versionen', err);
                        return {};
                    }
                )
            },
            (err) => {
                console.error('Fehler beim Laden der Programme', err);
                return {};
            }
        )
/*
        this.http.get('./customer.json').map((res: Response) => {
            this.customer = res.json();
            return this.customer;
        })
            .flatMap((customer) => this.http.get(customer.contractUrl)).map((res: Response) => res.json())
            .subscribe(res => this.contract = res);
*/
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


  public getProgramNamesList(){
      if (this.programs.length > 0){
        this.programNames = this.createProgramNameList();
      } else {
          this.getAllPrograms().subscribe(
              (programList: Program[]) => {
                  this.programNames = this.createProgramNameList();
              },
              (err) => {
                  console.error('Fehler beim Laden von Programinformationen', err);
                  return [];
              }
          )
      }

  }


  private createProgramNameList():string[]{
      let programNames = [];
      for (let p of this.programs){
          programNames.push(p.name);
      }
        programNames.sort();
      return programNames;
  }

  public getProgramSummaries(){
    var programSummaries = {};

    this.getAllPrograms().subscribe(
        (programList: Program[]) => {
            //this.programs = programList;
            this.getAllVersions().subscribe(
                (versionList: ProgramVersion[]) => {
                    //this.programs = programList;
                    return this.createProgramSummariesFromJsonList(programList, versionList);
                },
                (err2) => {
                    console.error('Fehler beim Laden der Versionsinformationen', err2);
                    return programSummaries;
                }
            )
        },
        (err) => {
            console.error('Fehler beim Laden von Programinformationen', err);
            return programSummaries;
        }
    )
  }

}
