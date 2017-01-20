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
            decimalDigits = Math.round(parseFloat(args[0]));
        } else {
            decimalDigits = 2;
        }

        if (this.isNumeric(value)){
            console.log("Decimal Pipe Value: " + value);
            return Math.round(parseFloat(value) * Math.pow(10, decimalDigits)) / Math.pow(10, decimalDigits);
        } else {
            return 0;
        }


    }

}
