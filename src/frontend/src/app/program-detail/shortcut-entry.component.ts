/**
 * Created by simon41 on 12/7/2016.
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';
import {Shortcut} from "../entities/shortcuts";

@Component({
    selector:'shortcut-entry',
    templateUrl:'./shortcut-entry.component.html'

})

export class ShortcutEntryComponent {

    @Input() item: Shortcut;
    @Input() selectedItem: Shortcut;
    @Output() selectedItemChange = new EventEmitter();

    select() {
        this.selectedItemChange.next(this.item);
    }


}