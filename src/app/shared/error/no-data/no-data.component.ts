import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-data',
  templateUrl: './no-data.component.html',
  styleUrls: ['./no-data.component.css']
})
export class NoDataComponent implements OnInit {

  @Input() title: string = "There's No Data";
  @Input() desc: string = "Try to Reload Page";
  @Input() picSize: string = "h-[28rem] w-[28rem]";

  imageSize: string = ''
  
  ngOnInit(): void {
    this.setImageSize()
  }

  setImageSize(){
  }
}
