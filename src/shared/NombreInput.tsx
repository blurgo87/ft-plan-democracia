import { useId, type ReactNode } from 'react';
import { Subtitulo } from 'react-ecosistema-unp/ui';
import IconCandidatoColombia from '../components/icon/IconCandidatoColombia';

export type NameInputProps = {
  id?: string;
  label?: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  /** Contenido opcional para renderizar al extremo derecho del input-group (p.ej. un botón submit). */
  rightAddon?: ReactNode;
};

function normalizeForEditing(raw: string): string {
  let s = raw.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  s = s.replace(/[^A-Za-z\s]/g, '');
  s = s.replace(/\s{2,}/g, ' ');
  s = s.replace(/^\s+/, '');
  s = s.replace(/\s{2,}$/, ' ');
  return s.toUpperCase();
}

export default function NameInput({
  id,
  label = 'Nombre y Apellidos',
  value,
  onChange,
  onBlur,
  placeholder,
  required,
  minLength = 4,
  rightAddon,
}: NameInputProps) {
  const generatedId = useId();
  const inputId = id ?? `name-${generatedId}`;
  const helpId = `${inputId}-help`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(normalizeForEditing(e.target.value));
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text');
    onChange(normalizeForEditing(paste));
  };

  return (
    <div>
      {/* Subtítulo visible con asterisco rojo */}
      {/* Label arriba */}
      <div className="d-flex align-items-center gap-2 mb-2">
        <Subtitulo subtitle={label} />
        {required && (
          <span className="text-danger fw-semibold" aria-hidden="true">*</span>
        )}
      </div>

      {/* Fila: icono, input y botón separados */}
      <div className="d-flex align-items-center gap-3" style={{ height: 52 }}>
        {/* ICONO */}
        <div
          className="d-flex align-items-center justify-content-center border rounded-4 bg-white"
          style={{ height: 52, width: 52 }}
        >
          <IconCandidatoColombia decorative />
        </div>

        {/* INPUT */}
        <input
          id={inputId}
          type="text"
          className="form-control border rounded-4 h-100"
          style={{ flex: 1 }}
          aria-describedby={helpId}
          aria-required={required ? 'true' : undefined}
          aria-invalid={value.trim().length < minLength}
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          onPaste={handlePaste}
          placeholder={placeholder}
          minLength={minLength}
          required={required}
          autoCapitalize="characters"
          autoComplete="name"
          spellCheck={false}
        />

        {/* BOTÓN (rightAddon) */}
        {rightAddon}
      </div>


      <small id={helpId} className="visually-hidden">
        Solo letras y espacios. Longitud mínima {minLength}.
      </small>
    </div>
  );
}
