/**
 * Created by simon41 on 12/7/2016.
 */
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
export class VersionService {

    programSummaries:ProgramSummary[];
    programs:Program[];
    programNames:string[];
    programVersions:ProgramVersion[];

    constructor(
        @Inject(PROGRAMS_URL) private programUrl: string,
        @Inject(VERSIONS_URL) private versionsUrl: string,
        private http: Http ) {

    }



}
