import { TimestampDTO } from "./timeStamp.dto";

export interface SetConfigDTO extends TimestampDTO {
  id: number;
  uniqueId: string;
  configName: string;
  configValue: number;
  configParentId: number | null;
  customerName: string;
}
