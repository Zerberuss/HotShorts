/**
 * Created by simon41 on 11/30/2016.
 */
/**
 * Created by simon41 on 11/24/2016.
 */
import {Injectable, Inject} from "@angular/core";
import {Http, URLSearchParams, Headers, RequestOptions} from "@angular/http";
import {PROGRAMS_URL, VERSIONS_URL} from "../../app.tokens";
import {ProgramSummary} from "../../entities/programSummary";
import {Program} from "../../entities/programs";
import {ProgramVersion} from "../../entities/programVersions";
import {OsTypes} from "../../entities/osTypes";
import {ProgramSummaryVersionEntry} from "../../entities/programSummaryVersionEntry";

@Injectable()
export class ProgramService {

  programSummaries:ProgramSummary[];
  programs:Program[];
  programNames:string[];
  programVersions:ProgramVersion[];

  constructor(
    @Inject(PROGRAMS_URL) private programUrl: string,
    @Inject(VERSIONS_URL) private versionsUrl: string,
    private http: Http ) {

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


    getPrgramByNameLocally(programName:string){
        if (!this.programs){
            console.error("No programs were loaded from the server")
            return {};
            //throw Error;
        }
        let programMatches = this.programs.find(prog => prog.name == programName.trim());
        if (programMatches != null){
            return programMatches;
        } else {
            return {};
        }
    }


  private getAuthorizationHeader(){
    var headers = new Headers();
    //headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', 'Basic ' +
        btoa('user:hotshortsdb'));
    return headers;
  }

  public getProgramFromServer(programName:string){
      return this.getUrlContentAsJson(this.programUrl + programName.replace(" ", "%20").trim());
  }

    public getVersionFromServer(programVersionId:number){
        return this.getUrlContentAsJson(this.versionsUrl + programVersionId.toString());
    }


  public find(name: string) {
    let url = this.programUrl;
    let search = new URLSearchParams();
    search.set('name', name);
    //ToDo: query after the primary key if possible, else try to find a way to include the primary key in the JSON data we get from the server

    //let headers = new Headers();
    let headers = this.getAuthorizationHeader();
    headers.append('Accept', 'application/json');

    return this
      .http
      .get(url, { headers, search })
      .map(resp => resp.json());
  }

  public getUrlContentAsJson(url:string){
    let headers = this.getAuthorizationHeader();
      //let headers = new Headers();
    headers.append('Accept', 'application/json');

    return this
        .http.get(url, {headers})
        .map(resp => resp.json());
  }


  public getAllPrograms(){
    return this.getUrlContentAsJson(this.programUrl);
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
      return this.programUrl + programName.replace(" ", "%20") + "/";
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
