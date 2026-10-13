# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run develop   # start dev server at http://localhost:8000 (+ GraphiQL at /___graphql)
npm run build     # production build
npm run serve     # serve the production build locally
npm run clean     # wipe Gatsby's .cache/ and public/ (use when the data layer or routes act stale)
```

`npm test` is an unconfigured stub (`echo "Write tests!" && exit 1`) — there is no test suite in this repo. There is no lint script either.

There is no dev/build split by page: Gatsby's file-system routing means every file under `src/pages/` becomes a route, and every `.mdx` file under `blog/` becomes GraphQL-queryable content — there's no single-file way to "run one test" or "build one page."

## Architecture

Gatsby 5 site (React 18) with content and code cleanly separated:

- **`blog/`** — MDX content source, wired in via `gatsby-source-filesystem` (`gatsby-config.js`, `name: "blog"`). Each post is either a standalone `.mdx` file or a directory with `index.mdx` plus co-located assets (`blog/code-reviews-senior-engineers/index.mdx` + its `cover.png` hero image). Frontmatter fields (`title`, `date`, `slug`, and optionally `description`, `tags`, `reading_time`, `canonical_url`, `original_url`, `hero_image`/`hero_image_alt`/`hero_image_credit_text`/`hero_image_credit_link`) are read by the page templates below — adding a new field to frontmatter does nothing until it is declared in `gatsby-node.js`'s `MdxFrontmatter` type (optional fields need this so the schema is stable when no post uses them) and the corresponding GraphQL query and template are updated too.
- **Cross-posted content** — posts originally published on dev.to carry `original_url` (the dev.to permalink) and `canonical_url` (this site). The post body ends with an "Also published on dev.to" line. dev.to Liquid tags have no MDX equivalent: `{% card %}` becomes the `<Callout>` component (provided to every post via `MDXProvider` in the post template, so content files need no `import`), and heading anchors become standalone `<a id="...">` elements above the heading.
- **`src/pages/blog/index.js`** — the blog listing page; queries `allMdx` sorted by `frontmatter.date` and links to each post via `frontmatter.slug`.
- **`src/pages/blog/{mdx.frontmatter__slug}.js`** — Gatsby's file-system route API generates one page per MDX node at `/blog/<slug>/`, keyed off the `slug` frontmatter field (the literal `{mdx.frontmatter__slug}` filename syntax is how Gatsby maps a GraphQL field to a dynamic route segment). Renders the hero image via `gatsby-plugin-image`'s `getImage`/`GatsbyImage`, photo credit, and the MDX body via the `children` prop.
- **`src/components/layout.js`** — shared shell for every page: a persistent left sidebar (site title + theme toggle, tagline, nav for Home/About/Activities/Blog with active-route highlighting via Gatsby `Link`'s `activeClassName`/`partiallyActive`, LinkedIn), collapsing to a horizontal top bar under 900px. The page's `<h1>` comes from the `pageTitle` prop. Styled with `layout.module.css`.
- **`src/components/seo.js`** — sets `<title>`, `<meta description>`, `<link rel="canonical">`, and the Open Graph / Twitter card tags per page; each page exports a `Head` component that renders `<Seo />` with page-specific props. `canonical` and `image` accept a site-relative path and are resolved against `siteMetadata.siteUrl`. Blog posts default their canonical to their own URL on this site.
- **Theming** — `src/styles/global.css` defines CSS custom properties (`--bg`, `--text`, `--accent`, `--shadow`, etc.) on `:root` for light mode by default, with a dark override both under `@media (prefers-color-scheme: dark)` and `:root[data-theme="dark"]`. `gatsby-ssr.js` injects a synchronous inline script (`onRenderBody`/`setPreBodyComponents`) that sets `data-theme` on `<html>` before first paint, so there's no flash of the wrong theme. `src/components/theme-toggle.js` is the sun/moon button in the sidebar that flips `data-theme` and persists the choice to `localStorage`; it renders a placeholder until mount to avoid a hydration mismatch, since the stored theme isn't knowable during SSR. `gatsby-browser.js` just imports `global.css`. Every page-level CSS module should reference these shared tokens rather than hardcoding colors, so a theme change stays consistent site-wide.
- **`src/pages/about.js`** — not CMS-driven; experience/publications/skills content lives as plain JS array constants at the top of the file and is mapped into JSX (no wrapping page-scoped CSS tokens — `about.module.css` consumes the shared global tokens directly). To update About page content, edit those arrays directly rather than looking for a data file. Publication PDFs are self-hosted under `static/papers/`.
- **`src/pages/activities.js`** + **`src/data/activities.js`** — the Activities page (conference service, hackathon judging). `activities.js` in `src/data/` is a single array of activity objects (type `conference` | `hackathon`, one or more `roles`, each role optionally carrying `photos`/`certificates`); the page component sorts them newest-first by `date.end` (falling back to `date.start`) and renders a lightbox (`MediaDialog`) for enlarging photos/certificate images, with focus trapping and Escape-to-close. Media files live in `static/activities/<activity-id>/`. See the comment at the top of `src/data/activities.js` for the shape to copy when adding an entry.
- **`src/components/diagrams/`** — the blog's diagram design system (`<Flow>`, `<Compare>`, `<Matrix>`, `<Bars>`), provided to every post via `MDXProvider` alongside `<Callout>`. Built from HTML and the `--diagram-*` tokens in `global.css`, not images. Any diagram in a post must follow the "Diagram design system" section below.
- **`src/components/callout.js`** — an `<aside>` wrapper (`<Callout>`) available to every blog post's MDX body via `MDXProvider` in the post template, without an explicit import in the content file. Used for content cross-posted from dev.to, where `{% card %}` Liquid tags have no MDX equivalent.
- **Styling** is CSS Modules throughout (`*.module.css`, imported as `import * as styles from './x.module.css'` or destructured), no CSS-in-JS or utility framework.
- **`gatsby-config.js`** is the single source of truth for plugins/site metadata (`title`, `description`, `siteUrl`), including `gatsby-plugin-feed`, which emits the RSS feed at `/rss.xml`.
- **`gatsby-node.js`** sources the About page's `DevToArticle` nodes from the dev.to API (build continues with a warning if the API is unreachable), declares the optional `MdxFrontmatter` fields, and adds an `Mdx.timeToRead` resolver that counts words in the post file. Templates prefer `frontmatter.reading_time` and fall back to `timeToRead`.
- **`static/_headers`** — a Netlify headers file that serves `*.pdf` with `Content-Disposition: inline`, so publication/certificate PDF links open in a new tab instead of forcing a download regardless of where they're hosted. This only takes effect on Netlify (or a host that reads the same file format), not `gatsby develop`/`gatsby serve`.
- **`.kiro/specs/`** contains spec-driven design docs (requirements/design/tasks) for past feature work, e.g. `enhanced-about-page/` documents an earlier About page iteration's requirements and task breakdown — check here for historical rationale, but note the Peer Review & Judging section it describes was later removed in favor of the Activities page.

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

## Dependency notes

Gatsby 5, React 18, and `@mdx-js/react` 2.x are pinned together by peer dependencies: `gatsby-plugin-mdx`'s stable release requires `@mdx-js/react ^2.0.0`, and React 19 support only exists behind a `-react19.x` prerelease tag of `gatsby`/`gatsby-plugin-mdx`, not on the stable line. Don't bump React or MDX to a major version without first confirming Gatsby's stable releases support it.
