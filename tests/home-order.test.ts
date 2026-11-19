import { describe, expect, it } from 'vitest';
import { DEFAULT_HOME_ORDER, normalizeHomeOrder, orderItems } from '../lib/home-order';

const dated = [
  { id: 'b', savedAt: 20 },
  { id: 'a', savedAt: 10 },
  { id: 'c', savedAt: 30 },
];

describe('orderItems', () => {
  it('keeps the stored order by default', () => {
    expect(orderItems(dated, 'default')).toBe(dated);
  });

  it('sorts dated items newest and oldest first without touching the input', () => {
    expect(orderItems(dated, 'newest').map((i) => i.id)).toEqual(['c', 'b', 'a']);
    expect(orderItems(dated, 'oldest').map((i) => i.id)).toEqual(['a', 'b', 'c']);
    expect(dated.map((i) => i.id)).toEqual(['b', 'a', 'c']);
  });

  it('treats an undated list (Watch Later) as newest first and reverses it for oldest', () => {
    const list = [{ id: '1' }, { id: '2' }, { id: '3' }];
    expect(orderItems(list, 'newest')).toBe(list);
    expect(orderItems(list, 'oldest').map((i) => i.id)).toEqual(['3', '2', '1']);
  });
});

describe('normalizeHomeOrder', () => {
  it('falls back to the defaults for missing or broken data', () => {
    expect(normalizeHomeOrder(undefined)).toEqual(DEFAULT_HOME_ORDER);
    expect(normalizeHomeOrder({ saved: 'sideways', channels: 7 })).toEqual(DEFAULT_HOME_ORDER);
  });

  it('keeps valid choices and never gives Watch Later a default order', () => {
    expect(
      normalizeHomeOrder({ saved: 'oldest', channels: 'newest', watchLater: 'default' }),
    ).toEqual({ saved: 'oldest', channels: 'newest', watchLater: 'newest' });
    expect(normalizeHomeOrder({ watchLater: 'oldest' }).watchLater).toBe('oldest');
  });
});
