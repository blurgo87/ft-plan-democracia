// Formato EXACTO que arroja la IA hoy (RAW)
export type AiRawResponse = {
  informe?: string;
  nivel_riesgo?: {
    score_acumulado?: {
      Riesgo?: number;
      Neutral?: number;
      Irrelevante?: number;
    };
    // pares [texto, score]
    oraciones_riesgo?: [string, number][];
    total_oraciones?: number;
  };
  enlaces?: {
    web?: string[];
    social?: string[];
    gov?: string[];
    media?: string[];
  };
};
