// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { EnvironmentInterface } from './environment.interface';

const baseUrl: string = 'https://api.gmf-aeroasia.co.id';

export const environment: EnvironmentInterface = {
  host: {
    ahi: {
      header: {
        xApiKey: '6E8F-7A21-8D4C-96B5',
      },
      url: 'https://api-dev.gmf-aeroasia.co.id/ahi/synchronizer',
      apiVersion: 'v1',
    },
    soe: {
      header: {
        xApiKey: '543C-EF0B-4137-A27F',
      },
      url: baseUrl + '/th/soev2',
      apiVersion: 'v2',
    },
  },
  production: false,
  version: '1.0.1',
  // apiUrl: 'http://localhost:6001',
  apiUrl: 'https://api-dev.gmf-aeroasia.co.id/ahi/synchronizer',
  soeApiUrl: 'https://api.gmf-aeroasia.co.id/th/soe',
  keycloakUrl: 'https://dev-auth.gmf-aeroasia.co.id/auth',
  sapApiUrl: 'https://api.gmf-aeroasia.co.id/utils/sap',
  baseUrl: 'http://localhost:4200',
  logger: ['error', 'log', 'warn', 'debug'],
  localKey: 'st+NnHcipOHKvd0WCcBjqLKbo9nV8sY0',
  realm: 'ahi',
  keycloakClientId: 'ahi-web',
  ahiApiKey: '6E8F-7A21-8D4C-96B5',
  soeApiKey: '343C-ED0B-4137-B27E',
  sapApiKey: 'CAD2-4CEA-99AE-314C',
  mediaApiManagement:
    'https://api.gmf-aeroasia.co.id/innovation/utils/v1/api/media',
  innovationUtilsApiUrl: 'https://api.gmf-aeroasia.co.id/innovation/utils',
  innovationUtilsApiKey: '42BB-2C1A-451F-98AC',
};
