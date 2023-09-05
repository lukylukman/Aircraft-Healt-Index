import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { UnitDTO } from 'src/app/pages/master-data-management/dto/master-data-manaement.dto';
import { HttpService } from 'src/app/providers/http/http.service';
import { LocalServiceConst } from 'src/app/shared/const/local-service.const';
import { PersonalInformation } from 'src/app/shared/layout/sidebar/interfaces/sidebar.interface';
import { environment } from 'src/environments/environment';
import { LocalStorageServiceInterface } from '../interfaces/localstorage.service.interface';
import { LocalstorageService } from './localstorage.service';
import { LoggerService } from './logger.service';

@Injectable()
export class UserSoeService extends HttpService {
  logger: LoggerService;
  localService: LocalStorageServiceInterface;

  constructor(httpClient: HttpClient) {
    super(httpClient);
    this.localService = new LocalstorageService();
    this.logger = new LoggerService(UserSoeService.name);
  }

  async setPersonalInfoCache(personalNumber: string): Promise<void> {
    const cachedPersonalInformationRaw = localStorage.getItem(
      LocalServiceConst.USER_INFO
    );

    if (!cachedPersonalInformationRaw) {
      const personalInformation: PersonalInformation = await this.getUserInfo(
        personalNumber
      );

      this.logger.log('Storing to Cache => ', personalInformation);
      this.localService.saveData(
        LocalServiceConst.USER_INFO,
        JSON.stringify(personalInformation)
      );
    } else {
      this.logger.log(
        'Fetch from Cache =>',
        JSON.parse(
          this.localService.getData(
            LocalServiceConst.USER_INFO
          ) as unknown as string
        )
      );
    }
  }

  getPersonalInformationFromCache(): PersonalInformation {
    if (localStorage.getItem(LocalServiceConst.USER_INFO)) {
      return JSON.parse(
        this.localService.getData(
          LocalServiceConst.USER_INFO
        ) as unknown as string
      ) as PersonalInformation;
    } else {
      return null;
    }
  }

  async getUserInfo(personalNumber: string): Promise<PersonalInformation> {
    const request = this.get(
      environment.soeApiUrl + '/v1/employee/' + personalNumber,
      {}
    );

    const response = await lastValueFrom(request);

    if (!response) {
      return null;
    }

    const results = response['body'] as PersonalInformation;

    return results;
  }

  async getManagerByService(unit: string): Promise<PersonalInformation> {
    // TODO: Please use actual API / OLA API to Get Unit Manager or Substitute
    const request = this.get(
      environment.soeApiUrl + '/v1/unit-manager/' + unit,
      {}
    );

    const response = await lastValueFrom(request);

    if (!response) {
      return null;
    }

    const results = response['body'] as PersonalInformation;

    return results;
  }

  removeUserInfoFromCache(): void {
    this.localService.removeData(LocalServiceConst.USER_INFO);
  }

  async getAllUnit(): Promise<UnitDTO[]> {
    const request = this.get(
      environment.soeApiUrl + '/v1/unit?page=1&perPage=200',
      {}
    );

    const response = await lastValueFrom(request);

    if (!response) {
      return null;
    }

    const results = response['body'] as UnitDTO[];

    return results;
  }
}
