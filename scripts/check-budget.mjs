// Fails when the built extension grows past the budgets below. Run after `pnpm build`.
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';

const OUT = '.output/chrome-mv3';
const KB = 1024;

// Bytes, uncompressed. Budgets sit ~15% above the size at v1.0.0 prep.
const BUDGETS = [
  { name: 'content script (content.js)', file: 'content-scripts/content.js', max: 340 * KB },
  { name: 'background (background.js)', file: 'background.js', max: 20 * KB },
];
const TOTAL_MAX = 900 * KB;

function size(path) {
  const stat = statSync(path);
  if (!stat.isDirectory()) return stat.size;
  return readdirSync(path).reduce((sum, name) => sum + size(join(path, name)), 0);
}

const fmt = (bytes) => `${(bytes / KB).toFixed(1)} kB`;
let failed = false;

function report(name, actual, max) {
  const ok = actual <= max;
  failed ||= !ok;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}: ${fmt(actual)} / ${fmt(max)}`);
}

try {
  for (const { name, file, max } of BUDGETS) report(name, size(join(OUT, file)), max);
  report('total extension size', size(OUT), TOTAL_MAX);
} catch (error) {
  console.error(`Cannot read ${OUT}. Run \`pnpm build\` first.`, error.message);
  process.exit(1);
}
process.exit(failed ? 1 : 0);
