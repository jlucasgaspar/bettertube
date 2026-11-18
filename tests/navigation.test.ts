// @vitest-environment happy-dom
import { describe, expect, it, vi } from 'vitest';
import { onNavigate } from '../lib/youtube/navigation';
import { events } from '../lib/youtube/selectors';

describe('onNavigate', () => {
  it('fires immediately and after each yt-navigate-finish', () => {
    const listener = vi.fn();
    const stop = onNavigate(listener);
    expect(listener).toHaveBeenCalledTimes(1);

    document.dispatchEvent(new Event(events.navigateFinish));
    expect(listener).toHaveBeenCalledTimes(2);

    stop();
    document.dispatchEvent(new Event(events.navigateFinish));
    expect(listener).toHaveBeenCalledTimes(2);
  });
});
