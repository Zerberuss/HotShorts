/**
 * Created by simon41 on 12/5/2016.
 */
/**
 * Created by simon41 on 11/24/2016.
 */
import {PipeTransform, Pipe} from "@angular/core";
@Pipe({
    name: 'decimal',
    pure: true
})
export class DecimalPipe implements PipeTransform {

    isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    transform(value: any, ...args: any[]): any {
        let decimalDigits:number;

        if (!args[0]){
            decimalDigits = 2;
        } else if (this.isNumeric(args[0])) {
            decimalDigits = parseFloat(args[0]);
        } else {
            decimalDigits = 2;
        }

        if (this.isNumeric(value)){
            return Math.round(parseFloat(value) * 10^decimalDigits) / 10^decimalDigits;
        } else {
            return 0;
        }


    }

}
