import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SelectionDTO } from '../dropdown/interface/selection.dto';

@Component({
  selector: 'app-footer-pagination',
  templateUrl: './footer-pagination.component.html',
  styleUrls: ['./footer-pagination.component.css'],
})
export class FooterPaginationComponent {
  @Input() currentPage: number = 1;
  @Input() totalItems: number = 1;
  @Input() lastPage: number = 1;
  @Input() totalItemsPerPage: number = 20;
  @Output() trigPrev = new EventEmitter();
  @Output() trigNext = new EventEmitter();

  perpageDropdown: SelectionDTO[] = [
    { id: 0, name: '10' },
    { id: 1, name: '20' },
    { id: 2, name: '30' },
    { id: 3, name: '50' },
    { id: 4, name: '100' },
  ];

  previous() {
    this.trigPrev.emit();
  }

  next() {
    this.trigNext.emit();
  }
}
