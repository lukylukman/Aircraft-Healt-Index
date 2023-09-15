import { TimestampDTO } from './timeStamp.dto';

export interface PostUploadConfigDTO {
  _index: string;
  _id: string;
  _version: number;
  result: string;
  shards: {
            total: number;
            successful: number;
            failed: number;
              },
  seq_no: number;
  _primary_term: number;
  }
