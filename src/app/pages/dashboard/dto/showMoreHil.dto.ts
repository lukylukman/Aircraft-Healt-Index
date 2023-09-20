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