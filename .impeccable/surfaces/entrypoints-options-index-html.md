---
version: 1
slug: 'entrypoints-options-index-html'
primary_target: 'entrypoints/options/index.html'
related_targets: ['entrypoints/popup/index.html']
---

# Surface: BetterTube options page and popup

Mode: Operate. Surfaces: `entrypoints/options` (full settings, left rail) and `entrypoints/popup` (quick toggles, link to options). Code-led build.

Audience, job: heavy YouTube desktop users switching features on/off and choosing language and theme; popup is seen many times a day, options occasionally.
Constraints: six locales (text expansion), light/dark/system, keyboard operable, popup ~360px wide, standard controls only (switch, select, radio, button, nav).
Unresolved: logo/icon; saved-videos section stays a placeholder until M3.

## Direction contract

THESIS: A settings panel read like a reel head: every switch is a cue you can verify at a glance. Refuses the generic gray sidebar-with-blue-toggles extension page.

OWN-WORLD: Projection leader, recolored by the user to a red-orange accent (between YouTube red and Claude terracotta). Dark theme: true near-black ground (#131110), warm off-white ink (#f2eeec). Light theme: clean white ground (#faf8f7), near-black ink (#1a1514). Accent #d93a22 (focus on dark #ff6a4d) is the single "on", focus and selection color; secondary text in neutral warm gray. Tabular numerals, cue-dot indicators, thin registration-cross index marks. One sturdy grotesque at a strict size scale; hierarchy by scale contrast.

STORY: The visitor sees which features are cued and which are off within one glance, flips one, and trusts the state because the cue dot and switch agree.

FIRST VIEWPORT: Options at 1280x800: a 240px left rail of sections joined by a 1px line, dots showing each feature's state (current section marked by fill and bold), content column with section title at display scale, then setting rows (label, one-line description, standard switch or select at right), accent cue dot beside every enabled row. Popup 360px wide: title row, four feature switches with cue dots, theme and language selects, "Open settings" button at the foot.

FORM: Projection Leader, assigned, candidate 4 of my grounded list; seed:f456d9a154644597. Raises: variable-font-specimen (strict size scale), midnight transit diagram (sidebar order as stops on one line).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
