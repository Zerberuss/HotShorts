/**
 * Created by simon41 on 11/24/2016.
 */
import {PipeTransform, Pipe} from "@angular/core";
@Pipe({
  name: 'osVersion',
  pure: true
})
export class OSVersionPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {

    let long, short;
    let fmt = args[0]; // 'short', 'long'

    switch(value) {
      case OsTypes.windows:
        long = "Windows";
        short = "Win";
        break;
      case OsTypes.linux:
        long = "Linux";
        short = "Lin";
        break;
      case OsTypes.osx:
        long = "Macintosh";
        short = "OS X";
        break;
      default:
        long = short = "No operating system info";
    }

    if (fmt == 'short') return short;
    return long;


  }

}
