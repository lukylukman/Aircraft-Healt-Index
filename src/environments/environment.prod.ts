// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { EnvironmentInterface } from './environment.interface';

export const environment: EnvironmentInterface = {
  production: false,
  version: '0.0.1',
  // apiUrl: 'http://localhost:6001',
  apiUrl: 'https://api.gmf-aeroasia.co.id/composite/ahi',
  soeApiUrl: 'https://api.gmf-aeroasia.co.id/th/soe',
  keycloakUrl: 'https://dev-auth.gmf-aeroasia.co.id/auth',
  sapApiUrl: 'https://api.gmf-aeroasia.co.id/utils/sap',
  baseUrl: 'http://localhost:4200',
  logger: ['error', 'log', 'warn', 'debug'],
  localKey: 'st+NnHcipOHKvd0WCcBjqLKbo9nV8sY0',
  realm: 'ahi',
  keycloakClientId: 'ahi-web',
  ahiApiKey: '4822-C85E-971C-FBCA',
  soeApiKey: '343C-ED0B-4137-B27E',
  sapApiKey: 'CAD2-4CEA-99AE-314C',
  mediaApiManagement:
    'https://api.gmf-aeroasia.co.id/innovation/utils/v1/api/media',
  innovationUtilsApiUrl: 'https://api.gmf-aeroasia.co.id/innovation/utils',
  innovationUtilsApiKey: '42BB-2C1A-451F-98AC',
};
