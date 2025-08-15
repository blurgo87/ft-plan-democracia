import { Routes, Route, Navigate } from 'react-router-dom';
import ConsultaRiesgo from './components/consulta/consultaRiesgo'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/consulta-riesgo" replace />} />
      <Route path="/consulta-riesgo" element={<ConsultaRiesgo />} />
      <Route path="*" element={<Navigate to="/consulta-riesgo" replace />} />
    </Routes>
  );
}
