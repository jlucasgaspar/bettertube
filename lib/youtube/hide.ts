/**
 * Hides elements with a stylesheet instead of touching YouTube's DOM, so the stock UI comes back
 * the moment the style is removed. Safe to call repeatedly.
 */
export function createHider(id: string, selector: string, doc: Document = document) {
  return {
    set(hidden: boolean) {
      const existing = doc.getElementById(id);
      if (hidden && !existing) {
        const style = doc.createElement('style');
        style.id = id;
        style.textContent = `${selector} { display: none !important; }`;
        (doc.head ?? doc.documentElement).append(style);
      } else if (!hidden) {
        existing?.remove();
      }
    },
  };
}
