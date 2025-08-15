import type { AiRawResponse } from '../types/ai-raw';
import type { RiskResponse, RiskSentence, RiskLinks, RiskScores, RiskPayload } from '../types/risk';

const USE_MOCK = String(import.meta.env.VITE_USE_MOCK ?? 'false').toLowerCase() === 'true';

function splitThink(informe?: string): { publicText: string; think: string | null } {
  if (!informe) return { publicText: '', think: null };
  const re = /<think>\s*([\s\S]*?)\s*<\/think>/i;
  const reOpen = /<think>\s*([\s\S]*?)$/i;
  let think: string | null = null;
  let publicText = informe;
  const m = informe.match(re);
  if (m) {
    think = m[1].trim();
    publicText = informe.replace(re, '').trim();
  } else {
    const m2 = informe.match(reOpen);
    if (m2) {
      think = m2[1].trim();
      publicText = informe.replace(reOpen, '').trim();
    }
  }
  return { publicText, think };
}

function normalizeScores(raw?: AiRawResponse['nivel_riesgo']): RiskPayload | undefined {
  if (!raw) return undefined;
  const scores: RiskScores = {
    Riesgo: Number(raw.score_acumulado?.Riesgo ?? 0),
    Neutral: Number(raw.score_acumulado?.Neutral ?? 0),
    Irrelevante: Number(raw.score_acumulado?.Irrelevante ?? 0),
  };
  const oraciones: RiskSentence[] = Array.isArray(raw.oraciones_riesgo)
    ? raw.oraciones_riesgo.map((it: any) =>
      Array.isArray(it)
        ? { text: String(it[0] ?? '').trim(), score: Number(it[1] ?? 0) }
        : { text: String(it?.text ?? '').trim(), score: Number(it?.score ?? 0) }
    )
    : [];
  return {
    score_acumulado: scores,
    oraciones_riesgo: oraciones,
    total_oraciones: Number(raw.total_oraciones ?? oraciones.length),
  };
}

function normalizeLinks(raw?: AiRawResponse['enlaces']): RiskLinks | undefined {
  if (!raw) return undefined;
  return { web: raw.web ?? [], social: raw.social ?? [], gov: raw.gov ?? [], media: raw.media ?? [] };
}

export function normalizeAiResponse(raw: AiRawResponse): RiskResponse {
  const { publicText, think } = splitThink(raw.informe);
  return {
    informe_raw: raw.informe,
    informe_publico: publicText,
    think_block: think ?? null,
    nivel_riesgo: normalizeScores(raw.nivel_riesgo),
    enlaces: normalizeLinks(raw.enlaces),
  };
}

function normalizeFullNameForMatch(name: string): string {
  const noAccents = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return noAccents.replace(/[^A-Za-z\s]/g, '').replace(/\s+/g, ' ').trim().toUpperCase();
}

export async function queryRisk(fullName: string): Promise<RiskResponse> {
  const clean = normalizeFullNameForMatch(fullName);

  if (USE_MOCK) {
    return {
      informe_raw: '',
      informe_publico: `Mock desactivado. Configura VITE_USE_MOCK=false para backend real.`,
      think_block: null,
      nivel_riesgo: { score_acumulado: { Riesgo: 0, Neutral: 0, Irrelevante: 0 }, oraciones_riesgo: [], total_oraciones: 0 },
      enlaces: { web: [], social: [], gov: [], media: [] }
    };
  }

  const API_URL = '/api/consulta';
  const controller = new AbortController();

  try {
    console.log("📡 Enviando petición a:", API_URL, "con payload:", { consulta: clean });

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ consulta: clean }),
      mode: 'cors',
      signal: controller.signal
    });

    console.log("📡 Respuesta HTTP:", res.status, res.statusText);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json = await res.json();
    console.log("📦 Datos recibidos del backend:", json);

    return normalizeAiResponse(extractRaw(json));
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(`No se pudo consultar en ${API_URL}: ${msg}`);
  } 
}

function extractRaw(anyJson: any): AiRawResponse {
  if (anyJson?.informe || anyJson?.nivel_riesgo) return anyJson as AiRawResponse;
  if (anyJson?.data) return anyJson.data as AiRawResponse;
  if (anyJson?.result) return anyJson.result as AiRawResponse;
  return anyJson as AiRawResponse;
}
