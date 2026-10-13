# AGENTS.md

Guidance for AI coding agents (Claude Code, Codex, Cursor, Kiro, and others) working in this repository: the Gatsby 5 personal site and blog at swapnilgaikwad.me.

For commands and architecture, read `CLAUDE.md`. It is the full reference for this repo, and its "Diagram design system" section is identical to the one below.

## Quick reference

- `npm run develop` starts the dev server at http://localhost:8000; `npm run build` makes a production build; `npm run clean` clears Gatsby's cache.
- Blog posts are MDX in `blog/<slug>/index.mdx`. `<Callout>` and the diagram components below are available in every post without an import.
- Activities (conferences, hackathon judging) are data in `src/data/activities.js`; the Activities page and the home page's Upcoming section read from it.
- Style with CSS Modules and the shared theme tokens in `src/styles/global.css`; never hardcode colours.

## Diagram design system

Every diagram in a blog post is built from the components in `src/components/diagrams/`, so figures look the same across all posts, follow light/dark mode, reflow on phones, and stay readable by screen readers. This section is the source of truth. It appears identically in `CLAUDE.md` and `AGENTS.md`; when you change one, change the other in the same commit.

The reference implementation is `blog/genai-agents-judgment-heavy-workflows/index.mdx`, which uses every component. Copy its patterns.

### Hard rules

1. **Only these components.** Use `<Flow>`, `<Compare>`, `<Matrix>`, and `<Bars>`; they are available in every post without an import (registered in the post template's `shortcodes`, like `<Callout>`). Do not add diagram images, hand-written SVG, Mermaid, ASCII art, or screenshots of diagrams to posts.
2. **No colours in posts.** Colour comes only from the six `kind` values below, which map to `--diagram-*` tokens in `src/styles/global.css` (with dark-mode values in both dark blocks). Never pass a colour, style, or className.
3. **Extend the system, not the post.** If a post needs a shape that doesn't exist, add a component to `src/components/diagrams/` (tokens only, shape cue per kind, container-query layout for narrow widths), register it in the default export, document it here in both files, and use it in the post. Never make a one-off.
4. **Only draw what the text says.** A figure restates a point the post already makes; it never adds facts, numbers, or names. If a figure simplifies or invents an example ordering, start the caption with `Simplified.` or `Illustrative.`
5. **No confidential detail.** Use generic role names ("Fee structure agent", "Reviewer"), never internal system, team, or customer names or unpublished figures.

### Kinds (the visual vocabulary)

Each kind has a colour and a shape cue, so meaning never relies on colour alone. A post gives kinds a local meaning with the `legend` prop; it does not invent new kinds.

| kind | Use for | Look |
| --- | --- | --- |
| `step` | Ordinary or mechanical step (default) | Grey, thin border |
| `focus` | The thing the figure is about | Accent purple, thick border |
| `agent` | An AI/automated agent or service | Blue, square corners |
| `human` | A human decision or checkpoint | Teal, thick left bar |
| `risk` | Failure, danger, the rejected option | Amber, dashed border |
| `muted` | Out of scope, baseline, de-emphasised | Faint, dashed, muted text |

Use at most three kinds in one figure. A legend appears automatically when a figure uses two or more kinds; rename entries with `legend={{ step: 'Mechanical', focus: 'Judgment-heavy' }}`, or hide it with `legend={false}` when the labels already explain it.

### Components

All components take `title` (2–4 words, shown as a small uppercase label) and `caption` (required: one or two full sentences stating the takeaway, not describing the picture).

**`<Flow>`**: a sequence of 2–6 steps, left to right; stacks vertically on phones. Optional `loop` adds a "↺ …" note for cycles.

```mdx
<Flow
  title="Checkpoints by design"
  caption="Illustrative. A human decides only where a wrong call is expensive to undo."
  legend={{ step: 'Automated check' }}
  steps={[
    { label: 'Fee structure agent', kind: 'agent' },
    { label: 'Reviewer decides', tag: 'Checkpoint', note: 'Hard to reverse', kind: 'human' },
    { label: 'Validation', note: 'No human needed', kind: 'step' }
  ]}
/>
```

**`<Compare>`**: two options side by side (before/after, rejected/chosen), each with up to 4 steps and a one-line `verdict`. Put the rejected option on the left with `kind: 'risk'` (verdict gets ✕) and the chosen one on the right with `kind: 'focus'` (verdict gets ✓).

```mdx
<Compare
  title="One agent or many"
  caption="A monolith fails as a whole; narrow agents fail one decision at a time."
  left={{ title: 'One end-to-end agent', kind: 'risk',
          steps: [{ label: 'Single agent owns the whole flow', kind: 'agent' }],
          verdict: 'Hard to debug' }}
  right={{ title: 'Narrow, bounded agents', kind: 'focus',
           steps: [{ label: 'Fee structure agent', kind: 'agent' }, { label: 'Tax treatment agent', kind: 'agent' }],
           verdict: 'Every output traces to one agent' }}
/>
```

**`<Matrix>`**: exactly 2×2. `cells[row][col]`; `highlight={[row, col]}` marks the cell the figure is about (default `highlightKind="risk"`).

```mdx
<Matrix
  title="Where review breaks down"
  caption="The costly failures read as correct."
  colLabel="How the output reads" rowLabel="What it actually is"
  cols={['Looks right', 'Looks wrong']} rows={['Correct', 'Wrong']}
  cells={[['Approved', 'Flagged, then cleared'], ['Slips through review', 'Caught as broken']]}
  highlight={[1, 0]}
/>
```

**`<Bars>`**: 2–5 horizontal bars comparing magnitudes (durations, counts). Bars scale to the largest `value`; `display` is the text shown. Use `muted` for the baseline and `focus` for the result.

```mdx
<Bars
  title="The goal"
  caption="The months went to judgment, not data movement."
  legend={false}
  items={[
    { label: 'Typical onboarding', value: 26, display: 'Up to 6 months', kind: 'muted' },
    { label: 'With agents (target)', value: 3, display: '~3 weeks', kind: 'focus' }
  ]}
/>
```

### Writing and placement

- One idea per figure. At most one figure per section, and roughly one figure per 150–250 words of post.
- Place the figure directly after the paragraph that makes its point, never between a heading and its first paragraph.
- Labels: sentence case, 2–5 words, no trailing period, no emoji. `note`: up to about 6 words. `tag`: one word, such as "Checkpoint".
- Use the same name for the same thing in the text and the figure.
- Good first figures for a post: the core before/after (`Bars` or `Compare`), then the process (`Flow`), then the failure mode (`Matrix`).
- Cross-posting to dev.to: these components don't render there. Replace each with a screenshot of the figure from the live site (light mode), using the caption as alt text.

### Before you commit a post with diagrams

1. Run `npm run build` (after `npm run clean` if you changed any diagram CSS, because Gatsby can inline stale CSS from its cache).
2. Look at every figure in light mode, dark mode, and at phone width (about 390px).
3. Check each caption states a takeaway and each figure matches the text exactly.
