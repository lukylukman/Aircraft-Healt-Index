import { AircraftScoreDTO } from './aircraft-score.dto';
import { TimestampDTO } from './timeStamp.dto';
import { AircraftTypeDTO } from './aircraft-type.dto';

export interface AircraftDTO extends TimestampDTO {
  aircraftGroup: string;
  sapRegistration: string;
  aircraftRegistration: string;
  carrierId: number;
  blockOnDate: Date;
  blockOnTime: Date;
  arrivalStation: string;
  aircraftType: string;
  aircraftScore?: AircraftScoreDTO;
}
