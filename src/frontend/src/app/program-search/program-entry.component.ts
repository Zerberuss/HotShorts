/**
 * Created by simon41 on 11/30/2016.
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';
import {Program} from "../entities/programs"

@Component({
  // selector:'program-entry',
  // templateUrl:'./program-list-entry.component.html'
  selector:'program-entry',
  templateUrl:'./program-entry.component.html'
})

export class ProgramEntryComponent {

  @Input() item: Program;
  @Input() selectedItem: Program;
  @Output() selectedItemChange = new EventEmitter();
  @Output() createProgramSummary = new EventEmitter();
  @Output() deleteProgram = new EventEmitter();

  select() {
    this.selectedItemChange.next(this.item);
  }

  showSummary(){
    //send the event to the parent with .next   The parameters we give the following line, will be the values available for $event for the parent of this component
    this.createProgramSummary.next(this.item);
  }

  delete() {
    this.deleteProgram.next(this.item);
  }


}
