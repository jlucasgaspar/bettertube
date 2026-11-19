import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = readFileSync(new URL('../assets/app.css', import.meta.url), 'utf8');

/** Tokens declared in a block that starts at `marker`. The light theme lives in `:root`. */
function tokens(marker: string): Record<string, string> {
  const start = css.indexOf(marker);
  const block = css.slice(start, css.indexOf('}', start));
  return Object.fromEntries(
    [...block.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6})/gi)].map((m) => [m[1], m[2]]),
  );
}

const light = tokens(':root {');
const dark = { ...light, ...tokens(":root[data-theme='dark'] {") };

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
}

function ratio(a: string, b: string): number {
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (high! + 0.05) / (low! + 0.05);
}

describe.each([
  ['light', light],
  ['dark', dark],
] as const)('%s theme contrast (WCAG AA)', (_name, theme) => {
  it('keeps text readable (4.5:1)', () => {
    for (const background of ['ground', 'surface']) {
      expect(ratio(theme.ink!, theme[background]!)).toBeGreaterThanOrEqual(4.5);
      expect(ratio(theme.muted!, theme[background]!)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('keeps the focus ring visible (3:1)', () => {
    expect(ratio(theme.focus!, theme.ground!)).toBeGreaterThanOrEqual(3);
    expect(ratio(theme.focus!, theme.surface!)).toBeGreaterThanOrEqual(3);
  });

  it('keeps control borders visible (3:1)', () => {
    expect(ratio(theme['line-strong']!, theme.ground!)).toBeGreaterThanOrEqual(3);
    expect(ratio(theme['line-strong']!, theme.surface!)).toBeGreaterThanOrEqual(3);
  });

  it('keeps the on state legible (white on accent, 4.5:1)', () => {
    expect(ratio(theme['accent-ink']!, theme.accent!)).toBeGreaterThanOrEqual(4.5);
  });
});
