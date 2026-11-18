---
name: BetterTube
description: A settings panel read like a reel head, where every switch is a cue you can verify at a glance.
colors:
  cue-red: '#d93a22'
  focus-ember: '#ff6a4d'
  white-leader: '#faf8f7'
  leader-surface: '#ffffff'
  ink-light: '#1a1514'
  projection-black: '#131110'
  black-surface: '#1d1a19'
  projection-white: '#f2eeec'
  leader-gray-light: '#5f5755'
  leader-gray-dark: '#a8a09d'
  rule-light: '#e6e0de'
  rule-dark: '#2b2725'
  rule-strong-light: '#857d7a'
  rule-strong-dark: '#6b6361'
typography:
  display:
    fontFamily: 'Barlow, system-ui, sans-serif'
    fontSize: '2.5rem'
    fontWeight: 700
    lineHeight: 1
    letterSpacing: '-0.025em'
  title:
    fontFamily: 'Barlow, system-ui, sans-serif'
    fontSize: '1.375rem'
    fontWeight: 700
    lineHeight: 1
  body:
    fontFamily: 'Barlow, system-ui, sans-serif'
    fontSize: '1rem'
    fontWeight: 400
    lineHeight: 1.5
  body-strong:
    fontFamily: 'Barlow, system-ui, sans-serif'
    fontSize: '1rem'
    fontWeight: 500
    lineHeight: 1.5
  label:
    fontFamily: 'Barlow, system-ui, sans-serif'
    fontSize: '0.875rem'
    fontWeight: 500
    lineHeight: 1.43
  caption:
    fontFamily: 'Barlow, system-ui, sans-serif'
    fontSize: '0.75rem'
    fontWeight: 400
    lineHeight: 1.33
rounded:
  field: '4px'
  pill: '999px'
spacing:
  xs: '4px'
  sm: '8px'
  md: '16px'
  lg: '24px'
  rail: '240px'
components:
  switch:
    backgroundColor: 'transparent'
    rounded: '{rounded.pill}'
    width: '2.5rem'
    height: '1.375rem'
  switch-on:
    backgroundColor: '{colors.cue-red}'
    rounded: '{rounded.pill}'
  cue-dot:
    backgroundColor: '{colors.white-leader}'
    rounded: '{rounded.pill}'
    size: '0.5rem'
  cue-dot-on:
    backgroundColor: '{colors.cue-red}'
  field:
    backgroundColor: '{colors.leader-surface}'
    textColor: '{colors.ink-light}'
    typography: '{typography.label}'
    rounded: '{rounded.field}'
    padding: '6px 32px 6px 10px'
  btn:
    backgroundColor: 'transparent'
    textColor: '{colors.ink-light}'
    typography: '{typography.label}'
    rounded: '{rounded.field}'
    padding: '8px 14px'
  rail-item-current:
    backgroundColor: '{colors.leader-surface}'
    typography: '{typography.label}'
    rounded: '4px'
    padding: '8px 12px'
---

# Design System: BetterTube

## Overview

**Creative North Star: "The Projection Leader"**

The panel is a reel leader: a strip of cue marks you read before the film starts. A clean white leader in light, a true-black projection room in dark, one red-orange accent (between YouTube red and Claude terracotta) that means exactly three things (on, focus, selection). Nothing else is colored, so a lit dot is always information. Hierarchy comes from scale contrast in one sturdy grotesque (Barlow), not from decoration, cards or shadow.

The options page is a 240px rail plus a content column capped near 42rem. The popup is a 360px strip of the same rows made compact. Both draw the same state twice on purpose: a cue dot at the row's left and a switch at its right, so the two agree and the state is trusted. The rail carries the same idea as a transit line: a 1px connector running through stops, a cue dot per feature showing on/off, and a plain tick for General, Saved and About.

State only what the build confirms: this is a utility surface for heavy daily users, dense but unhurried, and it refuses the generic gray sidebar with blue toggles.

**Key Characteristics:**

- One accent (cue red), used only for on, focus, and text selection.
- Flat, tonal, bordered: no shadows, no cards, hairline rules between rows.
- Strict five-step type scale, Barlow 400/500/700, tabular numerals globally.
- Cue dot plus switch always paired; state is never shown by one alone.
- Two themes sharing one token set: light (white leader) and dark (true black), plus system.

## Colors

A two-room palette: a clean white leader and a true-black projection room, with a single red-orange signal. Grays are faintly warm, never blue-tinted.

### Primary

- **Cue Red** (#d93a22): the "on" state of the switch track and cue dot, text selection background, and the focus ring in the light theme. Identical in both themes. Its text-on color is white (#ffffff, the switch thumb when on and selected text).
- **Focus Ember** (#ff6a4d): the brighter focus ring on the dark theme only, so the ring holds contrast on black.

### Neutral

- **White Leader** (#faf8f7): light ground. **Leader Surface** (#ffffff): light fields and the current rail item.
- **Projection Black** (#131110): dark ground. **Black Surface** (#1d1a19): dark fields and the current rail item.
- **Leader Ink** (#1a1514): light-theme ink. **Projection White** (#f2eeec): dark-theme ink.
- **Leader Gray** (#5f5755 light, #a8a09d dark): descriptions, inactive rail items, switch thumb when off.
- **Hairline** (#e6e0de light, #2b2725 dark): row dividers and the rail's right border.
- **Strong Hairline** (#857d7a light, #6b6361 dark): control outlines (switch, field, button), the off cue dot, ticks, the rail connector.

### Named Rules

**The One Signal Rule.** The red-orange accent appears only for on, focus, and selection. If something is red-orange it is lit; never use it for decoration, links or hierarchy.

**The Focus Follows Theme Rule.** Focus ring is 2px with 2px offset: Cue Red in light, the brighter Focus Ember in dark. Cue Red on black is too dim to hold contrast, so dark steps up.

**The Paired State Rule.** A cue dot never appears alone on a toggle row; it always sits beside its switch (the rail is the one place the dot stands as an index, and it mirrors a feature's master switch).

## Typography

**Display / Body Font:** Barlow (with system-ui, sans-serif), weights 400, 500, 700 from @fontsource.

**Character:** A sturdy, slightly condensed grotesque. Scale contrast does the work; weight shifts are small and functional.

### Hierarchy

- **Display** (700, 2.5rem/40px, line-height 1, tracking -0.025em): section title on the options page only.
- **Title** (700, 1.375rem/22px, line-height 1): the BetterTube wordmark in rail and popup.
- **Body** (400, 1rem/16px): about copy and the saved placeholder, max width prose.
- **Body strong** (500, 1rem): row labels on the options page.
- **Label** (500, 0.875rem/14px): buttons, selects, popup row labels, rail items (700 when current).
- **Caption** (400, 0.75rem/12px): the tagline under the wordmark. Row descriptions and secondary text use 14px in Leader Gray.

### Named Rules

**The Five Steps Rule.** Only 12, 14, 16, 22 and 40px exist. A new size is a new step in the scale, not a one-off.

**The Tabular Rule.** Tabular numerals are on at the root; do not turn them off for numbers that sit in columns or versions.

## Layout

Options: a two-column grid, 15rem rail (sticky, full height, hairline right border) and a content column with 56px horizontal and 48px vertical padding at 48rem and up, content capped at 42rem. Below 48rem the grid stacks: the rail becomes a horizontally scrolling strip under the wordmark with faded edges (mask) so it reads as scrollable, and the current item is scrolled into view. Popup: fixed 22.5rem (360px) width, 16px padding, four compact feature rows, then the two selects, then a full-width "Open settings" button with 16px above it.

Rows: flex, 16px gap, hairline bottom border, 16px vertical padding (10px compact in the popup). Left: cue dot (top-aligned to the first line). Middle: label and one-line description. Right: switch or select. A nested row (sub-setting) is indented 28px and dims to 55% opacity when its master is off, with its dot unlit and its switch disabled. Spacing rhythm is Tailwind's 4px base: 4, 8, 12, 16, 24.

Copy must tolerate six locales; rows wrap description text, labels stay in the flexible middle column, controls never shrink.

## Elevation & Depth

Flat. There are no shadows anywhere. Depth is tonal and linear: a slightly lighter surface for fields and the current rail item, and hairlines for separation. Scrollbars are thin and recolored to the strong hairline.

### Named Rules

**The No Shadow Rule.** State is carried by fill, border and weight, never by elevation.

## Shapes

Mostly rectilinear with small, consistent rounding. Fields, buttons and the current rail item use a 4px radius. Switch, thumb and cue dot are full pills (999px). Outlines are 1px in Strong Hairline; hover on fields and buttons darkens the border to ink. The registration mark is the one authored glyph: a 1.5px ring and crosshair with a filled accent center, 28px in the rail and 22px in the popup, drawn in current text color.

## Components

### Switch

A real `role="switch"` button, 40x22px pill. Off: transparent track, 1px Strong Hairline border, 16px Leader Gray thumb at left. On: Cue Red track and border, white thumb translated 18px. Transitions 160ms on an ease-out-expo curve (cubic-bezier(0.16, 1, 0.3, 1)). Disabled keeps the off look even when its value is true.

### Cue Dot

8px pill. Unlit: ground fill with a Strong Hairline border. Lit: Cue Red fill and border. Decorative (aria-hidden); the switch carries the semantics.

### Tick

8px wide, 1px line centered vertically in Strong Hairline. Stands in for a cue dot in the rail for sections with no feature switch (General, Saved, About).

### Setting Row

Cue dot, label with optional description, control. Nested rows indent and dim as described in Layout. The popup uses a compact variant without descriptions.

### Field (select)

Native `select`, appearance none, 4px radius, Surface fill, 1px Strong Hairline, 14px text, min-width 11rem, custom 10x6 chevron at right. Hover darkens border to ink. Focus uses the global ring.

### Button

Outlined only: transparent fill, 1px Strong Hairline, 4px radius, 14px/500 label, 8px 14px padding, optional trailing 14px icon. Hover darkens border to ink. There is no filled variant in the build.

### Navigation (rail)

A vertical list on desktop, with a 1px Strong Hairline connector at 28px from the left running through every stop behind the dots. Each item: cue dot or tick, 16px icon, 14px label, 4px radius. Inactive: Leader Gray, ink on hover. Current: Surface fill and bold (700). No numerals, no accent color for current; current is carried by fill and weight.

### Registration Mark

Ring, crosshair and accent center dot. Used once per surface, beside the wordmark.

### Motion

Motion is limited to 160ms switch movement and 140ms button border change, and is removed under `prefers-reduced-motion`.

## Do's and Don'ts

### Do:

- **Do** pair every toggle's switch with a cue dot, and let both read the same value.
- **Do** keep the accent for on, focus, and selection only.
- **Do** build hierarchy from the 12/14/16/22/40 scale and weight 400/500/700.
- **Do** separate rows with 1px hairlines and indent sub-settings 28px under their master.
- **Do** use standard controls (switch button, native select, outlined button) in the leader's palette.
- **Do** use the same token set for light and dark; switch themes by redefining the CSS custom properties only.

### Don't:

- **Don't** use blue toggles, gray-on-gray sidebars or any second accent color.
- **Don't** add shadows, cards or gradients to separate content.
- **Don't** introduce a font size or weight outside the scale.
- **Don't** use the accent for decoration, links or the current rail item.
- **Don't** number the rail sections or add kickers and eyebrows above titles.
