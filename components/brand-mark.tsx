/** The BetterTube mark: a shield holding a play button, on the accent tile. Same art as the toolbar icon. */
export function BrandMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 128 128" aria-hidden="true">
      <rect width="128" height="128" rx="28" fill="#d93a22" />
      <path d="M64 16L104 30V62C104 86 88 102 64 112C40 102 24 86 24 62V30Z" fill="#ffffff" />
      <path d="M54 46v36l30-18z" fill="#d93a22" />
    </svg>
  );
}
