import { TimestampDTO } from './timeStamp.dto';

export interface PostUploadConfigDTO extends TimestampDTO {
  uniqueId: string;
  documentName: string;
  documentType: string;
  documentLocation?: string;
  personalNumber?: string;
  documentProperties: string;
  signed: boolean;
}
