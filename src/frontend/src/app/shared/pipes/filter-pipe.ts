/**
 * Created by simon41 on 12/7/2016.
 */
import {PipeTransform, Pipe} from "@angular/core";

// Tell Angular2 we're creating a Pipe with TypeScript decorators
@Pipe({
    name: 'programFilter',
    pure: false
})
export class ProgramFilterPipe implements PipeTransform{
    //Filters a list of Programs after the name
    transform(value: any, ...args: any[]): any {
        //if (!args[0] || !value || !value.hasOwnProperty("name")){
        if (!args[0]){
            return value;
        }

        let [searchTerm] = args[0];
        //check if the program name contains the search term
        return value.filter(program => {
            return program['name'].toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0;
        });


    }
}