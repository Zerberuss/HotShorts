/**
 * Created by simon41 on 11/30/2016.
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';
import {Program} from "../entities/programs"

@Component({
  selector:'program-entry',
  templateUrl:'./program-entry.component.html'

})

export class ProgramEntryComponent {

  @Input() item: Program;
  @Input() selectedItem: Program;
  @Output() selectedItemChange = new EventEmitter();

  select() {
    this.selectedItemChange.next(this.item);
  }


}
