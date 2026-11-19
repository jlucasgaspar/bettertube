// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest';
import { createHider } from '../lib/youtube/hide';

beforeEach(() => {
  document.head.innerHTML = '';
});

describe('createHider', () => {
  it('adds one style while hidden and removes it afterwards', () => {
    const hider = createHider('hide-test', '.feed');
    hider.set(true);
    hider.set(true);
    expect(document.querySelectorAll('#hide-test')).toHaveLength(1);
    expect(document.getElementById('hide-test')?.textContent).toContain('.feed');
    hider.set(false);
    expect(document.getElementById('hide-test')).toBeNull();
  });

  it('is a no-op when nothing is hidden', () => {
    expect(() => createHider('hide-test', '.feed').set(false)).not.toThrow();
  });
});
