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
- **`src/components/seo.js`** — sets `<title>`, `<meta description>`, `<link rel="canonical">`, and the Open Graph / Twitter card tags per page; each page exports a `Head` component that renders `<Seo />` with page-specific props. `canonical` and `image` accept a site-relative path and are resolved against `siteMetadata.siteUrl`. Blog posts default their canonical to their own URL on this site. Pages without their own `image` fall back to `static/og-default.png` (1200×630, the site's dark theme colours) so every shared link gets a preview card; blog posts use their cover.
- **`src/components/structured-data.js`** — schema.org JSON-LD. `PERSON` (the author) is rendered via `<JsonLd data={personSchema()} />` inside `<Seo>` on the home and About pages, and every post's `Head` renders a `BlogPosting` (with `PERSON` as author) from its frontmatter. Keep `PERSON` limited to facts already public on the site or linked profiles.
- **Crawling** — `gatsby-plugin-sitemap` writes `/sitemap-index.xml` (404 excluded), and `static/robots.txt` points crawlers to it. `src/pages/404.js` is the custom not-found page and carries `noindex`.
- **Images in `static/activities/`** are WebP (certificates keep their PDF originals). `static/blog-figures/` stays PNG on purpose: dev.to cross-posts link those exact URLs. Blog cover images go through `gatsby-plugin-image`, which already serves WebP.
- **Theming** — `src/styles/global.css` defines CSS custom properties (`--bg`, `--text`, `--accent`, `--shadow`, etc.) on `:root` for light mode by default, with a dark override both under `@media (prefers-color-scheme: dark)` and `:root[data-theme="dark"]`. `gatsby-ssr.js` injects a synchronous inline script (`onRenderBody`/`setPreBodyComponents`) that sets `data-theme` on `<html>` before first paint, so there's no flash of the wrong theme. `src/components/theme-toggle.js` is the sun/moon button in the sidebar that flips `data-theme` and persists the choice to `localStorage`; it renders a placeholder until mount to avoid a hydration mismatch, since the stored theme isn't knowable during SSR. `gatsby-browser.js` just imports `global.css`. Every page-level CSS module should reference these shared tokens rather than hardcoding colors, so a theme change stays consistent site-wide.
- **`src/pages/about.js`** — not CMS-driven; focus areas (the three cards under the opening line), experience, publications and skills live as plain JS array constants at the top of the file and is mapped into JSX (no wrapping page-scoped CSS tokens — `about.module.css` consumes the shared global tokens directly). To update About page content, edit those arrays directly rather than looking for a data file. Publication PDFs are self-hosted under `static/papers/`.
- **`src/pages/activities.js`** + **`src/data/activities.js`** — the Activities page (conference service, hackathon judging). `activities.js` in `src/data/` is a single array of activity objects (type `conference` | `hackathon`, one or more `roles`, each role optionally carrying `photos`/`certificates`); the page component sorts them newest-first by `date.end` (falling back to `date.start`) and renders a lightbox (`MediaDialog`) for enlarging photos/certificate images, with focus trapping and Escape-to-close. Media files live in `static/activities/<activity-id>/`. See the comment at the top of `src/data/activities.js` for the shape to copy when adding an entry.
- **`src/components/diagrams/`** — the blog's diagram design system (`<Flow>`, `<Compare>`, `<Matrix>`, `<Bars>`, and `<Diagram>` for draw.io exports), provided to every post via `MDXProvider` alongside `<Callout>`. The concept components are built from HTML and the `--diagram-*` tokens in `global.css`, not images. Any diagram in a post must follow the "Diagram design system" section below.
- **`design/drawio/`** — the draw.io style library (`blog-diagram-library.xml`) and template (`blog-diagram-template.drawio`) for free-form diagrams, in the same palette as the components.
- **`scripts/export-figures.py`** + **`static/blog-figures/<slug>/`** — exports each post's component figures as PNGs for cross-posting (dev.to can't render the components); draw.io exports live in the same folder. Served at `/blog-figures/<slug>/...`.
- **`src/components/callout.js`** — an `<aside>` wrapper (`<Callout>`) available to every blog post's MDX body via `MDXProvider` in the post template, without an explicit import in the content file. Used for content cross-posted from dev.to, where `{% card %}` Liquid tags have no MDX equivalent.
- **Styling** is CSS Modules throughout (`*.module.css`, imported as `import * as styles from './x.module.css'` or destructured), no CSS-in-JS or utility framework.
- **`gatsby-config.js`** is the single source of truth for plugins/site metadata (`title`, `description`, `siteUrl`), including `gatsby-plugin-feed`, which emits the RSS feed at `/rss.xml`.
- **`gatsby-node.js`** sources the About page's `DevToArticle` nodes from the dev.to API (build continues with a warning if the API is unreachable), declares the optional `MdxFrontmatter` fields, and adds an `Mdx.timeToRead` resolver that counts words in the post file. Templates prefer `frontmatter.reading_time` and fall back to `timeToRead`.
- **`static/_headers`** — a Netlify headers file that serves `*.pdf` with `Content-Disposition: inline`, so publication/certificate PDF links open in a new tab instead of forcing a download regardless of where they're hosted. This only takes effect on Netlify (or a host that reads the same file format), not `gatsby develop`/`gatsby serve`.
- **`.kiro/specs/`** contains spec-driven design docs (requirements/design/tasks) for past feature work, e.g. `enhanced-about-page/` documents an earlier About page iteration's requirements and task breakdown — check here for historical rationale, but note the Peer Review & Judging section it describes was later removed in favor of the Activities page.

## Diagram design system

Every diagram in a blog post follows one visual system, so figures look the same across all posts, whoever (or whatever agent) made them and on whatever machine. This section is the source of truth. It appears identically in `CLAUDE.md` and `AGENTS.md`; when you change one, change the other in the same commit.

There are two tools, each for a different kind of figure:

| Figure | Tool | Why |
| --- | --- | --- |
| Concept figures: a process, a before/after, a 2×2, a few numbers compared | Components in `src/components/diagrams/`: `<Flow>`, `<Compare>`, `<Matrix>`, `<Bars>` | Built from HTML, so they follow light/dark mode, reflow on phones, and are read by screen readers. Default choice. |
| Free-form figures the components can't express: architecture, sequence, data flow between services, anything with arbitrary layout | draw.io, using the shared library in `design/drawio/`, shown with `<Diagram>` | Any shape, edited visually, and the export stays editable. |

If a component can express the idea, use the component. Reach for draw.io only when the layout itself is the point.

The reference implementations are `blog/genai-agents-judgment-heavy-workflows/index.mdx` and `blog/code-reviews-senior-engineers/index.mdx`, which between them use every component. Copy their patterns.

### Hard rules

1. **Only these two tools.** Component figures, or draw.io diagrams built from `design/drawio/blog-diagram-library.xml`. No hand-written SVG, Mermaid, ASCII art, screenshots of other tools, or images from anywhere else as diagrams.
2. **No ad-hoc colours.** Colour comes only from the six kinds below. In components that means the `kind` prop, which maps to the `--diagram-*` tokens in `src/styles/global.css` (dark-mode values live in both dark blocks); never pass a colour, style, or className. In draw.io it means copying shapes from the library and never restyling their fill, stroke, dash, or font.
3. **Extend the system, not the post.** If a concept figure needs a shape no component has, add a component to `src/components/diagrams/` (tokens only, a shape cue per kind, container-query layout for narrow widths), register it in the default export, document it here in both files, and use it. If draw.io needs a new shape, add it to the library with the same palette and document it here. Never make a one-off.
4. **Only draw what the text says.** A figure restates a point the post already makes; it never adds facts, numbers, or names. If a figure simplifies or invents an example ordering, start the caption with `Simplified.` or `Illustrative.`
5. **No confidential detail.** Use generic role names ("Fee structure agent", "Reviewer"), never internal system, team, or customer names or unpublished figures.

### Kinds (the visual vocabulary)

Each kind has a colour and a shape cue, so meaning never relies on colour alone. The same six kinds exist as component `kind` values and as draw.io library shapes. A post gives kinds a local meaning with a legend; it never invents new kinds.

| kind | Use for | Component look | draw.io shape |
| --- | --- | --- | --- |
| `step` | Ordinary or mechanical step (default) | Grey, thin border | Grey rounded box |
| `focus` | The thing the figure is about | Accent purple, thick border | Purple, thick border, bold text |
| `agent` | An AI/automated agent or service | Blue, square corners | Blue, square corners |
| `human` | A human decision or checkpoint | Teal, thick left bar | Teal, double border |
| `risk` | Failure, danger, the rejected option | Amber, dashed border | Amber, dashed border |
| `muted` | Out of scope, baseline, de-emphasised | Faint, dashed, muted text | Faint dashed outline, no fill |

Use at most three kinds in one figure. Components show a legend automatically when a figure uses two or more kinds; rename entries with `legend={{ step: 'Mechanical', focus: 'Judgment-heavy' }}`, or hide it with `legend={false}` when the labels already explain it. In draw.io, copy the legend row from the template whenever two or more kinds appear.

### Components

All components take `title` (2–4 words, shown as a small uppercase label) and `caption` (required: one or two full sentences stating the takeaway, not describing the picture).

**`<Flow>`**: a sequence of 2–6 steps, left to right; stacks vertically on phones. Optional `loop` adds a "↺ …" note for cycles. Steps take `label`, optional `note` and one-word `tag`, and `kind`.

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

**`<Bars>`**: 2–5 horizontal bars comparing magnitudes (durations, counts, percentages from one source). Bars scale to the largest `value`; `display` is the text shown. Use `muted` for the baseline and `focus` for the result. If the values are relative rather than measured, say so in the caption with `Illustrative.`

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

**`<Diagram>`**: shows an exported draw.io diagram in the same frame as every other figure, on a light panel in both themes, linked to the full-size image. `alt` is required and names what the diagram shows.

```mdx
<Diagram
  title="Request path"
  caption="Illustrative. The agent never writes directly; every change goes through the reviewer."
  src="/blog-figures/my-post/1-request-path.drawio.png"
  alt="Architecture diagram of the request path from client to agent to reviewer to datastore"
/>
```

### draw.io rules

1. **Start from the shared files.** In draw.io (app.diagrams.net, the desktop app, or the VS Code extension), open `design/drawio/blog-diagram-library.xml` with File > Open Library, and use `design/drawio/blog-diagram-template.drawio` as a starting point and style reference. Build only from library shapes: the six kinds, `boundary` (a dashed container for a service or system), `arrow`, and `note`.
2. **Keep the library's styling.** Don't change fills, strokes, dashes, fonts (Helvetica, 14px for shapes, 12px for notes and arrow labels), or arrow styles. Resize shapes and edit text freely.
3. **Layout for reading on a phone.** Lay out left to right with no more than 5 shapes per row, or top to bottom for longer chains. Keep labels 2–5 words. Leave at least 40px between shapes, and align to the grid.
4. **Export settings.** File > Export as > PNG with zoom 200%, border 16, "Include a copy of my diagram" on, and transparent background off. The PNG keeps the editable diagram inside it, so there is no separate `.drawio` file to lose; reopen the PNG in draw.io to edit.
5. **Where it goes.** Save as `static/blog-figures/<slug>/<n>-<name>.drawio.png`, where `<n>` is its order among the post's figures, and show it with `<Diagram>`. The same file is used on the site and when cross-posting.
6. **AI agents** can't see draw.io output while working. If you're an agent, prefer components. If a free-form diagram is needed, edit a copy of the template's XML using only library styles, then ask the author to open it in draw.io, check it, and export it with the settings above. Never commit a draw.io export no human has looked at.

### Writing and placement

- One idea per figure. At most one figure per section, and roughly one figure per 150–250 words of post.
- Place the figure directly after the paragraph that makes its point, never between a heading and its first paragraph.
- Labels: sentence case, 2–5 words, no trailing period, no emoji. `note`: up to about 6 words. `tag`: one word, such as "Checkpoint".
- Use the same name for the same thing in the text and the figure.
- Good first figures for a post: the core before/after (`Bars` or `Compare`), then the process (`Flow`), then the failure mode (`Matrix`).

### Cross-posting (dev.to, LinkedIn)

Components don't render outside this site, so cross-posted versions use images of every figure, hosted on this site.

1. Export the component figures: `npm run clean && npm run build && npm run serve`, then `python3 scripts/export-figures.py <slug>` (first time only: `pip install playwright && python3 -m playwright install chromium`). This writes 2x light-mode PNGs, without captions, to `static/blog-figures/<slug>/`, and copies the post's cover there too. It also prints the cover URL and dev.to-ready markdown for every figure in post order (image, then the caption in italics), including `<Diagram>` images.
2. Commit the PNGs and merge, so the images are live at `https://swapnilgaikwad.me/blog-figures/<slug>/...` before the cross-post links to them.
3. In the cross-posted markdown, replace each figure with its printed snippet, in the same place as on the site.
4. The cross-post's canonical URL is this site's post URL, and the site post ends with an "Also published on dev.to" line and carries `original_url` (see "Cross-posted content" in the Architecture section of `CLAUDE.md`).
5. Whenever a figure changes, re-run the export, commit the PNGs, and the cross-post updates itself, because it links to the same URLs.
6. Use the same cover on the cross-post. `static/_headers` lets other sites fetch `/blog-figures/*`, so the cover can be attached in the dev.to editor straight from its URL on this site.

### Cover images

Every post has a cover so posts look like a set on the blog index, in link previews, and on dev.to.

- **Where:** `blog/<slug>/cover.png`, set as `hero_image: "./cover.png"` with a `hero_image_alt` that describes the picture.
- **Size:** 1536×672 PNG. dev.to crops covers to about 1000×420, so keep everything important in the middle 1400×600.
- **Style:** match the existing covers. Dark navy background, two neon-blue horizontal rails, a faint perspective grid, and thin amber streaks. In the middle, flat coloured blocks (blue, cyan, salmon) wired with white arrows into one glowing central motif that stands for the post's idea. Retro outline monitors sit in two corners. No text and no logos, so titles never clash.
- **Making one:** build it as an SVG or HTML scene in that style and render it to PNG, or draw it in a design tool and export at that size. Compare it side by side with an existing cover before committing.

### Before you commit a post with diagrams

1. Run `npm run clean && npm run build`. The clean matters whenever diagram CSS changed, because Gatsby can inline stale CSS from its cache.
2. Look at every figure in light mode, dark mode, and at phone width (about 390px).
3. Check each caption states a takeaway and each figure matches the text exactly.
4. If the post is cross-posted, re-export its figures (see above) and commit the PNGs in the same change.

## Dependency notes

Gatsby 5, React 18, and `@mdx-js/react` 2.x are pinned together by peer dependencies: `gatsby-plugin-mdx`'s stable release requires `@mdx-js/react ^2.0.0`, and React 19 support only exists behind a `-react19.x` prerelease tag of `gatsby`/`gatsby-plugin-mdx`, not on the stable line. Don't bump React or MDX to a major version without first confirming Gatsby's stable releases support it.
