import { LoggerType } from 'src/app/core/interfaces/logger.service.interface';

export interface GmfAppHost {
  url: string;
  apiVersion: string;
  header?: {
    xApiKey: string;
  };
}

type Host = 'soe' | 'ahi';

export interface EnvironmentInterface {
   host: Record<Host, GmfAppHost>;

  /**
   * Define API Call for take data
   * @example https://api.hostname.com/api
   */
  apiUrl: string;

  /**
   * Define API Call for take personal Data data
   * @example https://api.hostname.com/api
   */
  soeApiUrl: string;

  /**
   * Define API Call for take personal Data data
   * @example https://api.hostname.com/api
   */
  innovationUtilsApiUrl: string;

  /**
   * Define API Call for take personal Data data
   * @example https://api.hostname.com/api
   */
  innovationUtilsApiKey: string;

  /**
   * API Key header for Utils SAP
   * @example ABCD-1234-EF123-CC41
   */
  sapApiUrl: string;

  /**
   * API Key header for ahi
   * @example ABCD-1234-EF123-CC41
   */
  ahiApiKey: string;

  /**
   * API Key header for Utils SAP
   * @example ABCD-1234-EF123-CC41
   */
  sapApiKey: string;

  /**
   * API Key header for ahi
   * @example ABCD-1234-EF123-CC41
   */
  soeApiKey: string;

  /**
   * Define API Call for Authentication Server
   * @example https://api.hostname.com/auth
   */
  keycloakUrl: string;

  /**
   * Define Client ID for OAuth2
   * @example 'ahi-web'
   */
  keycloakClientId: string;

  /**
   * Define base url including protocol, hostname, port
   * @example http://localhost:4200
   */
  baseUrl: string;

  /**
   * Define application mode. set true for production mode
   *
   */
  production: boolean;

  /**
   * Define log type that should be printed
   * @example logger: ['warn','log']
   */
  logger: LoggerType[];

  /**
   * Define local key for encryption
   * @example 'your_s4lt_h3r3'
   */
  localKey: string;

  /**
   * Define realm for your app
   * @example 'ahi'
   */
  realm: string;

  /**
   * Define API Management for PMO File Processing
   * @example https://api.hostname.com/api
   */
  mediaApiManagement: string;

  /**
   * Define Version of The Apps
   * @example 0.0.1
   */
  version: string;
}
