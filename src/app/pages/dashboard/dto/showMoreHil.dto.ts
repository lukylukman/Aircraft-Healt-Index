// DTO untuk setiap catatan APU
export interface APURecordDTO {
  id: string;
  customerName: string;
  aircraftRegistration: string;
  apuSn: string;
  tslv: number;
  ct5Atp: number;
  rank: number;
  aircraftType: string | null;
  apuNegativeScore: number;
  createdAt: string;
}

// DTO untuk setiap catatan Engine Tren
export interface EngineTrendRecordDTO {
  id: string;
  customerName: string;
  esn: string;
  aircraftRegistration: string;
  position: number;
  consumptionRate: number;
  egthdm: number;
  n1Vib: number;
  n3Vib: number;
  rank: number;
  aircraftType: string | null;
  engineTrendNegativeScore: number;
  createdAt: string;
}

export interface EngineGeRecordDTO {
  id: string;
  customerName: string;
  aircraftRegistration: string;
  position: number;
  aircraftType: string | null;
  egtHotDayMarginSmoothed: number;
  oilPressureSmoothed: number;
  fanVibeFwdSmoothed: number;
  coreVibeRearSmoothed: number;
  rank: number;
  engineGeNegativeScore: number;
  createdAt: string;
}

export interface BleedRecordDTO {
  id: string;
  customerName: string;
  aircraftRegistration: string;
  date: string;
  engine1: number;
  engine2: number;
  status: string;
  aircraftType: string;
  bleedNegativeScore: number;
  createdAt: string;
}

export interface RepetitiveRecordDTO {
  id: string;
  customerName: string;
  firstOccurrence: string;
  lastOccurence: string;
  aircraftRegistration: string;
  aircraftType: string;
  uic: string;
  status: string;
  dateStatus: string;
  amountOfTrouble: number;
  repetitiveNegativeScore: number;
  createdAt: string;
}

// DTO untuk setiap catatan Pack
export interface PackRecordDTO {
  id: string;
  customerName: string;
  aircraftRegistration: string;
  date: string;
  status: string;
  problem: string;
  packAssessmentDate: string;
  recommendation: string;
  packNegativeScore: number;
  createdAt: string;
}

export interface HilRecordDTO {
  id: string;
  subject: string;
  description: string;
  dateOccur: string;
  dueDate: string;
  flightNo: string;
  status: number;
  category: string;
  aircraftRegistration: string;
  aircraftType: string;
  station: string;
  optionID: string | null;
  diffDaysToNow: number;
  customer: string;
  priorityId: string;
  dueStatus: string;
  statusDescription: string;
  CategoryNo: number;
  categoryDescrption: string;
  categoryAlphabet: string;
  categoryDueDays: string;
  hilNegativeScore: number;
  reason: string;
  createdAt: string;
  config: {
    id: number;
    uniqueId: string;
    configName: string;
    configValue: number;
    configParentId: number;
    customerName: string;
    createdAt: string;
    updatedAt: string;
  };
  customerName: string;
}

// DTO untuk agregasi nilai negatif
export interface AggregationsDTO {
  packNegativeScore: {
    value: number;
  };
  bleedNegativeScore: {
    value: number;
  };
  hilNegativeScore: {
    value: number;
  };
  repetitiveNegativeScore: {
    value: number;
  };
  engineGeNegativeScore: {
    value: number;
  };
  apuNegativeScore: {
    value: number;
  };
  engineTrendNegativeScore: {
    value: number;
  };
}

// DTO untuk respons utama
export interface ApiResponseDTO {
  data: {
    record: {
      apuRecord: APURecordDTO[];
      packRecord: PackRecordDTO[];
      // Anda juga bisa menambahkan DTO untuk record lainnya di sini
    };
    aggregations: AggregationsDTO;
    totalScore: number;
  };
  meta: {
    status: string;
  };
  message: string;
  time: string;
}
