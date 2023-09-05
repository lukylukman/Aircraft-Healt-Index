import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OptionTitleDTO } from '../button-toggle/interfaces/options-dto';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.css']
})
export class RadioButtonComponent {
  @Input() label : string = '';
  @Input() labelValue1 : string = '';
  @Input() labelValue2 : string = '';
  @Input() value : boolean = <boolean>{};
  @Input() control = new FormControl();
  @Input() isDisabled : boolean = false;
  @Output() selectedRadio = new EventEmitter<boolean>();
}
