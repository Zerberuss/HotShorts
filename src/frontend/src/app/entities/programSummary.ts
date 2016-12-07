import {ProgramSummaryVersionEntry} from "./programSummaryVersionEntry";
/**
 * Created by simon41 on 11/30/2016.
 */
export interface ProgramSummary {
  name: string;
  description: string;
  website: string;
  versions:{
    linux:ProgramSummaryVersionEntry[];
    windows:ProgramSummaryVersionEntry[];
    osx:ProgramSummaryVersionEntry[];
  }
  ratingNr:number;
  ratingCount:number;
}
