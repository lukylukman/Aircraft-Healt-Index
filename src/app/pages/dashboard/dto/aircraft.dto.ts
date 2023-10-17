import { AircraftScoreDTO } from './aircraft-score.dto';
import { TimestampDTO } from './timeStamp.dto';

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

export interface AircraftDTO2 extends TimestampDTO {
    sapRegistration: string;
    aircraftRegistration: string;
    carrierId: number;
    arrivalStation: string;
    blockOnDate: Date;
    blockOnTime: Date;
    aircraftType: string;
    aircraftTypeId: number;
    aircraftGroup: null | string;
    totalScore: number;
    totalScoreYesterday: number;
    totalScoreDifference: number;
}