/**
 * Created by simon41 on 12/9/2016.
 */
import {PipeTransform, Pipe} from "@angular/core";

@Pipe({
    name: 'universalFilter',
    pure: false
})
//first argument is the attribute which is to filter of the object,
//second attribute is the searchstring. Both values will turned into a string toLowerCase
export class UniversalFilterPipe implements PipeTransform{

    //http://stackoverflow.com/questions/8834126/how-to-efficiently-check-if-variable-is-array-or-object-in-nodejs-v8
    // isArray = function(a) {
    //     return (!!a) && (a.constructor === Array);
    // };
    //
    ////fastest solution:
    // isArray = function (obj){
    //     return !!obj && Array === obj.constructor;
    // }
    
    isObject = function(a) {
        return (!!a) && (a.constructor === Object);
    };

    transform(value: any, ...args: any[]): any {
        //if (!args[0] || !value || !value.hasOwnProperty("name")){

        if (!args[0]||!args[1]){
            return value;
        }

        let filterAttribute = args[0];
        let [searchTerm] = args[1];

        //check if the program name contains the search term. Would only work if the attribute is of type string
        return value.filter(program => {
            if (this.isObject(value) && value.hasOwnProperty(searchTerm)){
                return program[searchTerm].toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0;
            } else {
                return value;
            }
        });


    }
}