/**
 * Created by simon41 on 11/30/2016.
 */
/**
 * Created by simon41 on 11/24/2016.
 */
import {Injectable, Inject} from "@angular/core";
import {Http, URLSearchParams, Headers} from "@angular/http";
import {PROGRAMS_URL, VERSIONS_URL} from "../../app.tokens";
import {ProgramSummary} from "../../entities/programSummary";
import {Program} from "../../entities/programs";
import {ProgramVersion} from "../../entities/programVersions";
import {OsTypes} from "../../entities/osTypes";

@Injectable()
export class ProgramService {

  programSummaries:ProgramSummary[];
  programs:Program[];
  programVersions:ProgramVersion[];

  constructor(
    @Inject(PROGRAMS_URL) private programUrl: string,
    @Inject(VERSIONS_URL) private versionsUrl: string,
    private http: Http ) {

  }

  private getAuthorizationHeader(){
    var headers = new Headers();
    //headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', 'Basic ' +
        btoa('user:hotshortsdb'));
    return headers;
  }

  public find(name: string) {
    let url = this.programUrl;
    let search = new URLSearchParams();
    search.set('name', name);
    //ToDo: query after the primary key if possible, else try to find a way to include the primary key in the JSON data we get from the server

    let headers = new Headers();
    //let headers = this.getAuthorizationHeader();
    headers.set('Accept', 'text/json');

    return this
      .http
      .get(url, { headers, search })
      .map(resp => resp.json());
  }


  private getUrlContentAsJson(url:string){
    let headers = new Headers();
    headers.set('Accept', 'text/json');

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
      switch (v.osType){
        case OsTypes.windows:
          programSummaries[v.program].versions.windows.push(v.versionText);
          break;
        case OsTypes.linux:
          programSummaries[v.program].versions.linux.push(v.versionText);
          break;
        case OsTypes.osx:
          programSummaries[v.program].versions.osx.push(v.versionText);
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
