import { Component, Input, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-not-authorized',
  template: `
  <div class="h-screen bg-white">
    <div class="flex flex-col row-start-2 row-end-3 justify-center items-center m-auto">
      <img src="assets/images/403image.jpg" class="p-1 bg-white rounded max-w-xl" />
      <span class="text-center font-jakarta text-dbx-blue-500 text-6xl max-sm:text-5xl font-extrabold mt-6">{{ title }}</span>
      <span class="text-center font-jakarta text-dbx-blue-800 text-xl mt-6">{{ description }}</span>
      <button (click)="onClickLogout()" class="cursor-pointer bg-dbx-blue-600 hover:bg-dbx-blue-500 text-white font-bold mt-2 py-3 px-5 rounded-full text-center flex align-center leading-normal space-x-2 " data-bs-toggle="modal">
        Your exit door here
      </button>
    </div>
  </div>
  `,
})
export class NotAuthorizedTemplateGuard implements OnInit {

  @Input() title: string = "Not Authorized";
  @Input() description: string = "You are not allowed to be here. Have a nice day :)";

  constructor(private readonly kcService: KeycloakService) { }

  ngOnInit(): void {
  }

  onClickLogout() {
    this.kcService.logout(environment.baseUrl);
  }
}
