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
- **`src/components/callout.js`** — an `<aside>` wrapper (`<Callout>`) available to every blog post's MDX body via `MDXProvider` in the post template, without an explicit import in the content file. Used for content cross-posted from dev.to, where `{% card %}` Liquid tags have no MDX equivalent.
- **Styling** is CSS Modules throughout (`*.module.css`, imported as `import * as styles from './x.module.css'` or destructured), no CSS-in-JS or utility framework.
- **`gatsby-config.js`** is the single source of truth for plugins/site metadata (`title`, `description`, `siteUrl`), including `gatsby-plugin-feed`, which emits the RSS feed at `/rss.xml`.
- **`gatsby-node.js`** sources the About page's `DevToArticle` nodes from the dev.to API (build continues with a warning if the API is unreachable), declares the optional `MdxFrontmatter` fields, and adds an `Mdx.timeToRead` resolver that counts words in the post file. Templates prefer `frontmatter.reading_time` and fall back to `timeToRead`.
- **`static/_headers`** — a Netlify headers file that serves `*.pdf` with `Content-Disposition: inline`, so publication/certificate PDF links open in a new tab instead of forcing a download regardless of where they're hosted. This only takes effect on Netlify (or a host that reads the same file format), not `gatsby develop`/`gatsby serve`.
- **`.kiro/specs/`** contains spec-driven design docs (requirements/design/tasks) for past feature work, e.g. `enhanced-about-page/` documents an earlier About page iteration's requirements and task breakdown — check here for historical rationale, but note the Peer Review & Judging section it describes was later removed in favor of the Activities page.

## Dependency notes

Gatsby 5, React 18, and `@mdx-js/react` 2.x are pinned together by peer dependencies: `gatsby-plugin-mdx`'s stable release requires `@mdx-js/react ^2.0.0`, and React 19 support only exists behind a `-react19.x` prerelease tag of `gatsby`/`gatsby-plugin-mdx`, not on the stable line. Don't bump React or MDX to a major version without first confirming Gatsby's stable releases support it.
