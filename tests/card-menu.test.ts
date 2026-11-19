// @vitest-environment happy-dom
import { act, createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CardMenu } from '../components/home-carousel';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let host: HTMLElement;
let root: Root;
const onRemove = vi.fn();

beforeEach(() => {
  onRemove.mockClear();
  host = document.createElement('div');
  document.body.append(host);
  root = createRoot(host);
  act(() => {
    root.render(
      createElement(CardMenu, { label: 'More options: Clip', removeLabel: 'Remove', onRemove }),
    );
  });
});

afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

const trigger = () => host.querySelector<HTMLButtonElement>('button[aria-haspopup="menu"]')!;
const item = () => host.querySelector<HTMLButtonElement>('[role="menuitem"]');

describe('CardMenu', () => {
  it('is closed until the three dots are pressed', () => {
    expect(item()).toBeNull();
    expect(trigger().getAttribute('aria-expanded')).toBe('false');
    act(() => trigger().click());
    expect(item()?.textContent).toBe('Remove');
    expect(trigger().getAttribute('aria-expanded')).toBe('true');
  });

  it('removes and closes when the item is chosen', () => {
    act(() => trigger().click());
    act(() => item()!.click());
    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(item()).toBeNull();
  });

  it('closes on Escape without removing', () => {
    act(() => trigger().click());
    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });
    expect(item()).toBeNull();
    expect(onRemove).not.toHaveBeenCalled();
  });

  it('closes when pressing outside', () => {
    act(() => trigger().click());
    act(() => {
      document.body.dispatchEvent(new Event('pointerdown', { bubbles: true, composed: true }));
    });
    expect(item()).toBeNull();
  });
});
