/**
 * Created by simon41 on 11/30/2016.
 */
export interface ProgramSummary {
  name: string;
  description: string;
  website: string;
  versions:{
    linux:string[];
    windows:string[];
    osx:string[];
  }
  ratingNr:number;
  ratingCount:number;
}
