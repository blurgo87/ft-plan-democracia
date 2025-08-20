import { useEffect, useRef, useState } from 'react';
import NameInput from '../../shared/NombreInput';
import { queryRisk } from '../../services/riskServices';
import type { RiskResponse } from '../../types/risk';
import Resultados from './Resultados';
import HeaderIdentidad from '../consulta/HeaderIdentidad';


// Normaliza como el input: sin acentos, solo letras/espacios, colapsa espacios y MAYÚSCULAS.
function normalizeName(raw: string): string {
  let s = raw.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  s = s.replace(/[^A-Za-z\s]/g, '');
  s = s.replace(/\s{2,}/g, ' ');
  s = s.trim();
  return s.toUpperCase();
}

export default function ConsultaRiesgo() {
  const [nombre, setNombre] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [data, setData] = useState<RiskResponse | null>(null);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  const isValid = nombre.trim().length >= 4;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!isValid) return;

    setLoading(true);
    setData(null);
    try {
      const clean = nombre.trim();
      const norm = normalizeName(clean);

      if (norm === 'GUSTAVO BOLIVAR') {
        // Carga determinística desde JSON local
        const res = await fetch('/data/GUSTAVOBOLIVAR.json', { cache: 'no-cache' });
        if (!res.ok) throw new Error('No se pudo leer el JSON local');
        const json = await res.json();

        // Mapear al shape esperado por Resultados: usamos informe -> informe_publico
        const mapped: RiskResponse = {
          ...json,
          informe_publico: json.informe ?? json.informe_publico,
        };
        setData(mapped);
      } else {
        // Flujo normal hacia backend
        const apiRes = await queryRisk(clean);
        setData(apiRes);
      }
    } catch (err) {
      setErrorMsg('No se pudo completar la consulta. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (data && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [data]);

  return (
    <main className="container d-flex flex-column align-items-center min-vh-100 ">
      {/* Header con mismo ancho que el card */}
      <div className="w-100" style={{ maxWidth: 900 }}>
        <HeaderIdentidad titulo="Consulta de Riesgo" />
      </div>

      <section className="w-100 d-flex justify-content-center mt-4">
        <div
          className="card shadow-sm p-3 w-100"
          style={{ maxWidth: 900 }}
        >
          <form onSubmit={onSubmit} noValidate>
            <div className="mb-3">
              <NameInput
                id="nombreApellidos"
                label="Nombre y Apellidos"
                value={nombre}
                onChange={setNombre}
                placeholder="Ejemplo: JUAN PÉREZ"
                required
                minLength={3}
                rightAddon={
                  <div
                    className="d-flex align-items-center justify-content-center border rounded-4 bg-white shadow-sm"
                    style={{ height: 56, width: 56 }}
                  >
                    <button
                      type="submit"
                      className="btn btn-unp d-flex align-items-center justify-content-center fw-bold p-0"
                      disabled={!isValid || loading}
                      aria-label="Enviar consulta"
                      aria-live="polite"
                      style={{ height: '100%', width: '100%' }}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          <span className="visually-hidden">procesando consulta…</span>
                        </>
                      ) : (
                        <span aria-hidden="true" className="fs-4">↑</span>
                      )}
                    </button>
                  </div>
                }

              />
            </div>

            {errorMsg && <div className="alert alert-danger mt-3 mb-0">{errorMsg}</div>}

            <div ref={resultsRef}>
              <Resultados data={data} />
            </div>
          </form>
        </div>
      </section>
    </main>

  );
}
