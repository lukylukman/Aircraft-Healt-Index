import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ModalSize } from './modal.size';
import { ModalInterface } from './modal.interface';
import { LoggerService } from 'src/app/core/services/logger.service';
import { Modal } from 'flowbite';
@Component({
  selector: 'app-modal[title][idSelector]',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})

export class ModalComponent implements OnInit, OnDestroy {
  
  @Output() modaltoClose = new EventEmitter();
  @Input() size: ModalSize = 'lg';
  @Input() title: string = '';
  @Input() idSelector: string = '';
  @Input() modalName: string = 'sm';
  // @Input() properties: ModalInterface; // Modal Size. Available value :  ['sm', 'md', 'lg', 'xl]
  logger: LoggerService;

  modal?:Modal;
  
  modalSize: string = 'max-w-md';

  constructor() {
    this.logger = new LoggerService(ModalComponent.name);

  }
  ngOnDestroy(): void {
    this.logger.log("ondestroy")
  }

  ngAfterViewInit(): void {
    this.modal = new Modal(document.getElementById(this.idSelector), {});
  }

  closeModal(){
    // this.modalService.closeModal();
    this.modaltoClose.emit();
    this.modal?.hide()
  }

  ngOnInit(): void {
    this.getModalSize();
  }

  getModalSize(): void {
    switch(this.size) {
      case 'md':
        this.modalSize = 'max-w-md';
        break;
      case 'lg':
        this.modalSize = 'max-w-lg';
        break;
      case '4xl':
        this.modalSize = 'max-w-4xl';
        break;
      case '7xl':
        this.modalSize = 'max-w-7xl';
        break
      default:
        this.modalSize = 'max-w-md';
    }
  }
}