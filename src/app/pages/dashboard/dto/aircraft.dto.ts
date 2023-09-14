import { AircraftScoreDTO } from './aircraft-score.dto';
import { TimestampDTO } from './timeStamp.dto';

export interface AircraftDTO extends TimestampDTO {
  sapRegistration: string;
  aircraftRegistration: string;
  carrierId: number;
  blockOnDate: Date;
  blockOnTime: Date;
  arrivalStation: string;
  aircraftScore?: AircraftScoreDTO;
}
