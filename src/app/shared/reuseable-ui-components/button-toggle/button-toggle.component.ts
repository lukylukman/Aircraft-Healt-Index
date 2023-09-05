import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OptionTitleDTO } from './interfaces/options-dto';

@Component({
  selector: 'app-button-toggle',
  templateUrl: './button-toggle.component.html',
  styleUrls: ['./button-toggle.component.css']
})
export class ButtonToggleComponent {

  @Input() titles : OptionTitleDTO[] = [];
  @Output() selectedButton = new EventEmitter<OptionTitleDTO>();

  selectedTitle?: OptionTitleDTO;

  onSelect(title: OptionTitleDTO): void {
    this.selectedTitle = title;
    this.selectedButton.emit(title)
  }
}
