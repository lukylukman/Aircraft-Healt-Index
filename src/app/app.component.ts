import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'ahi-angular';
  login: boolean;

  //Checking is Admin or User
  isAdmin: boolean = true;
}
