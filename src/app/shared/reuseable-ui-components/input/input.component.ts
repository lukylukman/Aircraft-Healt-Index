import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
})
export class InputComponent implements OnInit {
  // input setting
  @Input() inputId: string = '';
  @Input() style: string = '';
  @Input() size: string = 'p-2';
  @Input() oninput: any;
  @Input() description: string = '';
  @Input() tooltip: string = '';
  @Input() validatorIcon: boolean = true;
  @Input() control = new FormControl();
  @Input() label: string = '';
  @Input() isDisabled: boolean = false;
  @Input() border: boolean = false;
  @Input() placeholder: string = '';
  @Input() isPassword: boolean = false;
  @Input() isUppercase: boolean = false;
  @Input() inputType:
    | 'text'
    | 'number'
    | 'date'
    | 'datetime'
    | 'checkbox'
    | 'datetime-local'
    | 'password' = 'text';
  // End of input setting

  borderData: string = '';
  focus: boolean;

  // error message
  errorMessage: Record<string, string> = {
    required: 'The field is required',
    email: 'The e-mail is invalid',
    max: 'The input is exceeding maximum limit',
    maxlength: 'The input is exceeding maximum char length limit',
    min: 'The input is below minimum limit',
    minlength: 'The input is below minimum char limit',
    pattern:'The input pattern is invalid because it contains a forbidden character',
  };
  // End of error message

  inputTypePassword: 'text' | 'password' = 'password'

  ngOnInit(): void {
    if (this.border) {
      this.borderData = '1px solid #27AE60';
    }
  }

  onFocus() {
    this.focus = true;
  }

  onBlur() {
    this.focus = false;
  }

  togglePasswordVisibility() {
    if (this.inputTypePassword === 'text') {
      this.inputTypePassword = 'password'
    } else {
      this.inputTypePassword = 'text'
    }
  }
}
