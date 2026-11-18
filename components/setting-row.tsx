import { useId } from 'react';
import type { ReactNode } from 'react';

interface SwitchRowProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  compact?: boolean;
  /** A sub-setting of the row above it: indented to show it belongs to that master. */
  nested?: boolean;
  stateLabel: string;
}

/** A feature toggle: cue dot, label, optional description, standard switch. */
export function SwitchRow({
  label,
  description,
  checked,
  onChange,
  disabled,
  compact,
  nested,
  stateLabel,
}: SwitchRowProps) {
  const labelId = useId();
  const descriptionId = useId();
  return (
    <div
      className={`flex items-start gap-4 border-b border-line ${compact ? 'py-2.5' : 'py-4'} ${
        nested ? 'pl-7' : ''
      } ${disabled ? 'opacity-55' : ''}`}
    >
      <span
        className={`cue ${compact ? 'mt-[0.4375rem]' : 'mt-2'}`}
        data-on={checked && !disabled}
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1">
        <div id={labelId} className={`font-medium ${compact ? 'text-sm' : 'text-base'}`}>
          {label}
        </div>
        {description && !compact && (
          <div id={descriptionId} className="mt-0.5 text-sm text-muted">
            {description}
          </div>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={labelId}
        aria-describedby={description && !compact ? descriptionId : undefined}
        title={stateLabel}
        disabled={disabled}
        className="switch self-center"
        onClick={() => onChange(!checked)}
      />
    </div>
  );
}

interface FieldRowProps {
  label: string;
  description?: string;
  children: (id: string) => ReactNode;
  compact?: boolean;
}

/** A labeled select or other single control. */
export function FieldRow({ label, description, children, compact }: FieldRowProps) {
  const id = useId();
  return (
    <div className={`flex items-center gap-4 border-b border-line ${compact ? 'py-2.5' : 'py-4'}`}>
      <div className="min-w-0 flex-1">
        <label htmlFor={id} className={`block font-medium ${compact ? 'text-sm' : 'text-base'}`}>
          {label}
        </label>
        {description && !compact && <div className="mt-0.5 text-sm text-muted">{description}</div>}
      </div>
      {children(id)}
    </div>
  );
}
