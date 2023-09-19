export interface AircraftDetailHilDTO {
  id: string;
  aircraftRegistration: string;
  subject: string;
  category: string;
  categoryDescription: string;
  dateOccur: Date;
  dueDate: Date;
  status: string;
  partNumber: string | null;
  followOnId: string;
  followOnDescription: string;
  followOnDate: Date;
}
