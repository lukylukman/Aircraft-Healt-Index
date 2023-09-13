import { TimestampDTO } from './timeStamp.dto';

export interface AircraftDTO extends TimestampDTO {
  uniqueId: string,
  title: string;
  count: number;
  total: number;
  subtitle: string;
  time: string;
  timePeriod: string;
  date: string;
  year: string;
}