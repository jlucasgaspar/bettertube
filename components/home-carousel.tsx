import { ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';

/** Styles for the carousel and the card menu. Joined with the custom home styles. */
export const HOME_CAROUSEL_CSS = `
  .carousel { position: relative; }
  .rail {
    display: flex; gap: 16px; margin: 0; padding: 4px 4px 8px; list-style: none;
    overflow-x: auto; scroll-snap-type: x proximity; scroll-padding-inline: 4px; scrollbar-width: none;
  }
  .rail::-webkit-scrollbar { display: none; }
  .rail > li { position: relative; flex: 0 0 240px; scroll-snap-align: start; min-width: 0; }
  .arrow {
    position: absolute; top: 51px; z-index: 2; display: flex; align-items: center;
    justify-content: center; width: 40px; height: 40px; margin: 0; padding: 0;
    border: 1px solid var(--line); border-radius: 50%; background: var(--bg); color: var(--ink);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  }
  .arrow:hover { background: var(--surface); }
  .carousel.compact .arrow { top: 50%; margin-top: -24px; }
  .arrow.prev { left: -12px; }
  .arrow.next { right: -12px; }
  .menu-btn {
    position: absolute; top: 8px; right: 8px; z-index: 1; display: flex; align-items: center;
    justify-content: center; width: 32px; height: 32px; margin: 0; padding: 0; border: 0;
    border-radius: 50%; background: rgba(0, 0, 0, 0.7); color: #ffffff; opacity: 0;
  }
  .menu-btn:hover { background: rgba(0, 0, 0, 0.85); }
  li:hover .menu-btn, li:focus-within .menu-btn, .menu-btn[aria-expanded='true'] { opacity: 1; }
  .menu-btn.inline { top: 50%; right: 0; transform: translateY(-50%); background: transparent; color: var(--ink); }
  .menu-btn.inline:hover { background: var(--surface); }
  .has-menu .channel { padding-right: 36px; }
  .menu {
    position: absolute; top: 44px; right: 8px; z-index: 3; min-width: 120px; padding: 6px 0;
    border: 1px solid var(--line); border-radius: 12px; background: var(--bg); color: var(--ink);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  }
  .menu-btn.inline + .menu { top: calc(50% + 20px); }
  .menu-item {
    display: block; width: 100%; height: auto; margin: 0; padding: 8px 16px; border: 0;
    border-radius: 0; background: transparent; color: inherit; font: 400 14px/20px Roboto, Arial, sans-serif;
    text-align: left; cursor: pointer;
  }
  .menu-item:hover, .menu-item:focus-visible { background: var(--surface); }
  @media (prefers-reduced-motion: no-preference) {
    .menu-btn { transition: opacity 120ms ease-out; }
  }
`;

interface CarouselProps {
  children: ReactNode;
  prevLabel: string;
  nextLabel: string;
  /** Rows without a thumbnail (channels): center the arrows on the row. */
  compact?: boolean;
  /** When this value changes the row jumps back to its start, for example after a new sort order. */
  resetKey?: string;
}

/** A horizontal row that scrolls sideways, with arrows that appear only when there is more to see. */
export function Carousel({ children, prevLabel, nextLabel, compact, resetKey }: CarouselProps) {
  const rail = useRef<HTMLUListElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  useEffect(() => {
    const element = rail.current;
    if (!element) return;
    const update = () => {
      setCanPrev(element.scrollLeft > 1);
      setCanNext(element.scrollLeft + element.clientWidth < element.scrollWidth - 1);
    };
    update();
    element.addEventListener('scroll', update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(element);
    const mutations = new MutationObserver(update);
    mutations.observe(element, { childList: true });
    return () => {
      element.removeEventListener('scroll', update);
      observer.disconnect();
      mutations.disconnect();
    };
  }, []);

  useEffect(() => {
    rail.current?.scrollTo({ left: 0 });
  }, [resetKey]);

  const scrollBy = (direction: -1 | 1) => {
    const element = rail.current;
    if (!element) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    element.scrollBy({
      left: direction * element.clientWidth * 0.9,
      behavior: reduce ? 'auto' : 'smooth',
    });
  };

  return (
    <div className={`carousel${compact ? ' compact' : ''}`}>
      {canPrev && (
        <button
          type="button"
          className="arrow prev"
          aria-label={prevLabel}
          onClick={() => scrollBy(-1)}
        >
          <ChevronLeft size={22} aria-hidden="true" />
        </button>
      )}
      <ul className="rail" ref={rail}>
        {children}
      </ul>
      {canNext && (
        <button
          type="button"
          className="arrow next"
          aria-label={nextLabel}
          onClick={() => scrollBy(1)}
        >
          <ChevronRight size={22} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

interface CardMenuProps {
  /** Accessible name for the trigger, naming the card it belongs to. */
  label: string;
  removeLabel: string;
  onRemove: () => void;
  inline?: boolean;
}

/** A three-dots button on a card that opens a one-item menu. */
export function CardMenu({ label, removeLabel, onRemove, inline }: CardMenuProps) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const container = useRef<HTMLSpanElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!container.current || !event.composedPath().includes(container.current)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.stopPropagation();
      setOpen(false);
      trigger.current?.focus();
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('keydown', onKeyDown, true);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('keydown', onKeyDown, true);
    };
  }, [open]);

  return (
    <span ref={container} style={{ display: 'contents' }}>
      <button
        ref={trigger}
        type="button"
        className={`menu-btn${inline ? ' inline' : ''}`}
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((value) => !value)}
      >
        <MoreVertical size={18} aria-hidden="true" />
      </button>
      {open && (
        <div id={menuId} className="menu" role="menu">
          <button
            type="button"
            role="menuitem"
            className="menu-item"
            autoFocus
            onClick={() => {
              setOpen(false);
              onRemove();
            }}
          >
            {removeLabel}
          </button>
        </div>
      )}
    </span>
  );
}
