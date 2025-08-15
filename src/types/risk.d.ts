export type RiskSentence = { text: string; score: number };

export type RiskLinks = {
  web: string[];
  social: string[];
  gov: string[];
  media: string[];
};

export type RiskScores = {
  Riesgo: number;
  Neutral: number;
  Irrelevante: number;
};

export type RiskPayload = {
  score_acumulado: RiskScores;
  oraciones_riesgo: RiskSentence[];
  total_oraciones: number;
};

export type RiskResponse = {
  informe_raw?: string;        // con <think>
  informe_publico?: string;    // sin <think>
  think_block?: string | null; // contenido <think>, oculto por defecto
  nivel_riesgo?: RiskPayload;
  enlaces?: RiskLinks;
};
