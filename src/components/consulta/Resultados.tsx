import { useEffect, useRef, useState } from "react";
import { Subtitulo } from "react-ecosistema-unp/ui";
import type { RiskResponse } from "../../types/risk";
import ScorePieChart from "./ScorePastel";
import ScoreProgress from "./ScoreProgress";
import MarkdownTypeReveal from "./MarkdownTypeReveal";
import TarjetaCard from "./TarjetaCard";
import "../../styles/transiciones.css";

type NormalizedSentence = { text: string; score: number };
type Props = { data: RiskResponse | null };

// ==== Helpers ====
function normalizeOraciones(raw: unknown): NormalizedSentence[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item): NormalizedSentence => {
    if (Array.isArray(item)) {
      return { text: String(item[0] ?? ""), score: Number(item[1] ?? 0) };
    }
    if (item && typeof item === "object") {
      const anyItem = item as { text?: unknown; score?: unknown };
      return {
        text: String(anyItem.text ?? ""),
        score: Number(anyItem.score ?? 0),
      };
    }
    return { text: String(item ?? ""), score: 0 };
  });
}

function stripThinkBlocks(md: string): string {
  return md.replace(/<think>[\s\S]*?<\/think>/gi, "");
}

// ==== Componente principal ====
export default function Resultados({ data }: Props) {
  const [phase, setPhase] = useState(0);
  const [topN, setTopN] = useState(3);
  const [done, setDone] = useState(false);

  // refs de scroll
  const headerRef = useRef<HTMLElement | null>(null);
  const scoresRef = useRef<HTMLDivElement | null>(null);
  const informeRef = useRef<HTMLDivElement | null>(null);
  const tablaRef = useRef<HTMLDivElement | null>(null);
  const enlacesRef = useRef<HTMLDivElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  const hasData = !!data;

  // ==== Avance de fases (monótono) ====
  const setPhaseForward = (next: number) =>
    setPhase((prev) => (next > prev ? next : prev));

  useEffect(() => {
    if (!hasData) return;
    setPhase(0);
    setDone(false);

    const timers = [
      window.setTimeout(() => setPhaseForward(1), 250),
      window.setTimeout(() => setPhaseForward(2), 500),
      window.setTimeout(() => setPhaseForward(3), 800),
    ];
    return () => timers.forEach(clearTimeout);
  }, [hasData]);

  // ==== Datos derivados ====
  const scores = hasData ? data!.nivel_riesgo?.score_acumulado : undefined;
  const todas = hasData ? normalizeOraciones(data!.nivel_riesgo?.oraciones_riesgo) : [];

  const enlacesRaw = hasData ? (data as any).enlaces ?? {} : {};
  const enlaces = {
    web: Array.isArray(enlacesRaw.web) ? enlacesRaw.web : [],
    social: Array.isArray(enlacesRaw.social) ? enlacesRaw.social : [],
    gov: Array.isArray(enlacesRaw.gov) ? enlacesRaw.gov : [],
    media: Array.isArray(enlacesRaw.media) ? enlacesRaw.media : [],
  };
  const hasLinks =
    enlaces.web.length + enlaces.social.length + enlaces.gov.length + enlaces.media.length > 0;

  const rawInforme = hasData
    ? (data as any).informe_publico ?? (data as any).informe
    : "";
  const informe =
    typeof rawInforme === "string"
      ? stripThinkBlocks(
          rawInforme.slice(rawInforme.indexOf("# Informe Detallado")).trim() ||
            rawInforme.trim()
        )
      : "";

  // ==== Avance automático ====
  useEffect(() => {
    if (!hasData) return;

    // de informe a tabla
    if (phase === 3 && informe) {
      // typing done avanza a 4
    }

    // de tabla a enlaces
    if (phase === 4) {
      const t = window.setTimeout(() => setPhaseForward(hasLinks ? 5 : 6), 1200);
      return () => clearTimeout(t);
    }

    // al mostrar enlaces o terminar → marcar done + scroll al final
    if (phase === 5 || phase === 6) {
      const t = window.setTimeout(() => {
        setDone(true);
        endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 800);
      return () => clearTimeout(t);
    }
  }, [phase, hasData, hasLinks, informe]);

  // ==== Scroll automático al entrar a cada bloque ====
  useEffect(() => {
    const map = [
      null,
      headerRef.current,
      scoresRef.current,
      informeRef.current,
      tablaRef.current,
      enlacesRef.current,
    ] as const;
    const target = map[phase];
    if (target) target.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [phase]);

  // ==== UI ====
  const mdAutoScroll = phase === 3 && !done;
  const rootClass = `mt-4 position-relative ${done ? "no-anim" : ""}`;

  return (
    <section className={rootClass}>
      {/* Header */}
      {hasData && phase >= 1 && (
        <header ref={headerRef} className={`mb-3 ${done ? "" : "reveal-slide"}`}>
          <Subtitulo subtitle="Resultados del análisis" />
        </header>
      )}

      {/* Scores */}
      {hasData && phase >= 2 && scores && (
        <div ref={scoresRef} className={`row g-3 ${done ? "" : "reveal-slide delay-1"}`}>
          <ScorePieChart scores={scores} />
        </div>
      )}

      {/* Informe */}
      {hasData && phase >= 3 && informe && (
        <div ref={informeRef} className={`${done ? "" : "reveal-slide delay-2"} mt-4`}>
          <div
            id="informe-detallado"
            className="border rounded-3 p-3 bg-white"
            style={{ borderColor: "#7bd5fe" }}
          >
            <MarkdownTypeReveal
              content={informe}
              start={!done}
              speedChar={16}
              pauseNewline={260}
              pauseSentenceEnd={140}
              forceDone={done}
              onDone={() => setPhaseForward(4)}
              autoScroll={mdAutoScroll}
              smoothScroll
            />
          </div>
        </div>
      )}

      {/* Tabla Top-N */}
      {hasData && phase >= 4 && todas.length > 0 && (
        <div ref={tablaRef} className={`${done ? "" : "reveal-slide delay-3"} mt-4`}>
          <div className="d-flex align-items-center justify-content-between mb-2">
            <Subtitulo subtitle="Antecedentes de riesgo" />
            <select
              id="topN"
              className="form-select form-select-sm"
              style={{ width: 100, borderColor: "#7bd5fe" }}
              value={topN}
              onChange={(e) => setTopN(Number(e.target.value))}
            >
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
            </select>
          </div>

          <div className="table-responsive">
            <table className="table table-sm table-striped table-hover align-middle mb-0">
              <thead className="table-light position-sticky top-0" style={{ zIndex: 1 }}>
                <tr>
                  <th className="text-center" style={{ width: "3.5rem" }}>
                    #
                  </th>
                  <th style={{ width: "70%" }}>Antecedentes</th>
                  <th className="text-end" style={{ width: "25%" }}>
                    Puntaje
                  </th>
                </tr>
              </thead>
              <tbody>
                {todas.slice(0, topN).map((o, i) => {
                  const pct = Math.max(0, Math.min(100, Number(o.score ?? 0) * 100));
                  return (
                    <tr key={`${i}-${pct}`} className={done ? "" : "stagger-item"}>
                      <td className="text-center text-muted">{i + 1}</td>
                      <td style={{ textAlign: "justify" }}>
                        <div className="text-wrap lh-base">{o.text}</div>
                      </td>
                      <td className="text-end">
                        <ScoreProgress
                          pct={pct}
                          label="Puntaje"
                          fillRemainder
                          primaryColor="#7bd5fe"
                          remainderColor="#e0e0e0"
                          height={8}
                          width="200px"
                          maxWidth="90%"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Enlaces */}
      {hasData && phase >= 5 && hasLinks && (
        <div ref={enlacesRef} className={`${done ? "" : "reveal-soft delay-2"} mt-4`}>
          <Subtitulo subtitle="Enlaces" />
          <div className="row g-2">
            <TarjetaCard kind="web" title="Fuentes Web" icon="🌐" items={enlaces.web} />
            <TarjetaCard kind="social" title="Redes Sociales" icon="💬" items={enlaces.social} />
            <TarjetaCard kind="gov" title="Gobierno" icon="🏛️" items={enlaces.gov} />
            <TarjetaCard kind="media" title="Medios" icon="📰" items={enlaces.media} />
          </div>
        </div>
      )}

      {/* Sentinela final */}
      <div ref={endRef} className="pt-1" />
    </section>
  );
}
