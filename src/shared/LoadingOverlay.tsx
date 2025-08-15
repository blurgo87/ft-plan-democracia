type Props = {
  text?: string;
};

export default function LoadingOverlay({ text = '<think> procesando consulta…' }: Props) {
  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ background: 'rgba(255,255,255,0.8)', zIndex: 1050 }}
      role="status"
      aria-live="assertive"
      aria-label="Cargando"
    >
      <div className="text-center">
        <div className="spinner-border mb-3" role="status" aria-hidden="true" />
        <div className="fw-semibold">{text}</div>
      </div>
    </div>
  );
}
