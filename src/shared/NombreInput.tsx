import { useId, type ReactNode } from 'react';
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
  rightAddon
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
      <label htmlFor={inputId} className="form-label fw-medium">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <div className="input-group input-group-lg">
        <IconCandidatoColombia size={45} stroke="#4A646C" className="mx-3" decorative />
        <input
          id={inputId}
          type="text"
          className="form-control"
          inputMode="text"
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
        {/* Addon derecho opcional (por ejemplo, botón submit) */}
        {rightAddon}
      </div>
      <small id={helpId} className="visually-hidden">
        Solo letras y espacios. Longitud mínima {minLength}.
      </small>
    </div>
  );
}
