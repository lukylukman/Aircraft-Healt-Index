import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { HttpService } from 'src/app/providers/http/http.service';
import { environment } from 'src/environments/environment';
import { KeycloakResponseDTO } from '../dto/keycloak-response.dto';
import { LocalStorageServiceInterface } from '../interfaces/localstorage.service.interface';
import { LocalstorageService } from './localstorage.service';
import { LoggerService } from './logger.service';

@Injectable()
export class AuthService extends HttpService {
  logger: LoggerService;
  localService: LocalStorageServiceInterface;

  constructor(httpClient: HttpClient) {
    super(httpClient);
    this.localService = new LocalstorageService();
    this.logger = new LoggerService(AuthService.name);
  }

  async checkUserInfo(
    username: string,
    password: string
  ): Promise<KeycloakResponseDTO> {
    const keycloakFormBody = {
      grant_type: 'password',
      client_id: environment.keycloakClientId,
      username: username,
      password: password,
    };

    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );

    const urlEncoded = this.encodeFormData(keycloakFormBody);

    const request = this.post(
      environment.keycloakUrl +
        '/realms/' +
        environment.realm +
        '/protocol/openid-connect/token',
      urlEncoded,
      headers
    );

    const response = await lastValueFrom(request);

    if (!response) {
      return null;
    }

    const results = response as KeycloakResponseDTO;

    return results;
  }
}
