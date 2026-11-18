/** Cue-mark: a registration cross inside a ring, the one authored mark of the leader. */
export function RegistrationMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14 1v26M1 14h26" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="14" cy="14" r="3" fill="var(--accent)" />
    </svg>
  );
}
