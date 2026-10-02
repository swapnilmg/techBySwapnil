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
- **`src/components/layout.js`** — shared shell for every page: site title (from `siteMetadata.title` via `useStaticQuery`), top nav (Home/About; a Blog link exists in the JSX but is commented out), and the page's `<h1>`. Styled with a CSS module (`layout.module.css`).
- **`src/components/seo.js`** — sets `<title>`, `<meta description>`, `<link rel="canonical">`, and the Open Graph / Twitter card tags per page; each page exports a `Head` component that renders `<Seo />` with page-specific props. `canonical` and `image` accept a site-relative path and are resolved against `siteMetadata.siteUrl`. Blog posts default their canonical to their own URL on this site.
- **`src/pages/about.js`** — not CMS-driven; experience/publications/skills content lives as plain JS array constants at the top of the file and is mapped into JSX. To update About page content, edit those arrays directly rather than looking for a data file. Its CSS module (`about.module.css`) defines page-scoped design tokens (`--accent`, `--accent-soft`, etc.) on a wrapping `.page` div and has its own responsive breakpoint set independent of `layout.module.css`.
- **Styling** is CSS Modules throughout (`*.module.css`, imported as `import * as styles from './x.module.css'` or destructured), no CSS-in-JS or utility framework.
- **`gatsby-config.js`** is the single source of truth for plugins/site metadata (`title`, `description`, `siteUrl`), including `gatsby-plugin-feed`, which emits the RSS feed at `/rss.xml`.
- **`gatsby-node.js`** sources the About page's `DevToArticle` nodes from the dev.to API (build continues with a warning if the API is unreachable), declares the optional `MdxFrontmatter` fields, and adds an `Mdx.timeToRead` resolver that counts words in the post file. Templates prefer `frontmatter.reading_time` and fall back to `timeToRead`. `gatsby-browser.js` only imports `src/styles/global.css`; there is no `gatsby-ssr.js`.
- **`.kiro/specs/`** contains spec-driven design docs (requirements/design/tasks) for past feature work, e.g. `enhanced-about-page/` documents the current About page's requirements and task breakdown — check here for the rationale behind existing sections before proposing structural changes to a spec'd page.

## Dependency notes

Gatsby 5, React 18, and `@mdx-js/react` 2.x are pinned together by peer dependencies: `gatsby-plugin-mdx`'s stable release requires `@mdx-js/react ^2.0.0`, and React 19 support only exists behind a `-react19.x` prerelease tag of `gatsby`/`gatsby-plugin-mdx`, not on the stable line. Don't bump React or MDX to a major version without first confirming Gatsby's stable releases support it.
