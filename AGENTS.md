# Agent Guide — lewismorris.co.uk

This document helps AI agents understand the project structure, conventions, and how to work with this codebase.

## Project Overview

Personal website and blog for Lewis Morris. A static site with a homepage, writing/blog section, and placeholder for a photos section. Hosted at https://lewismorr.is.

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Astro | 5.17.2 | Static site generator, routing, layouts |
| Sanity | 5.x | Headless CMS for blog/writing content |
| @sanity/astro | 3.x | Sanity client integration |
| Tailwind CSS | 4.1.18 | Styling via `@tailwindcss/vite` |
| date-fns | 4.1.0 | Date formatting (e.g. `format`, `differenceInYears`) |
| @astrojs/sitemap | 3.7.0 | Sitemap generation |
| astro-portabletext | 0.13.x | Portable Text rendering |
| @tailwindcss/typography | 0.5.x | Prose styling for markdown content |
| Prettier | 3.6.x | Code formatting (with `prettier-plugin-astro`) |

## Project Structure

```
lewismorris.co.uk/
├── astro.config.mjs        # Astro config: site URL, sitemap, Sanity, Tailwind
├── sanity.config.ts        # Sanity Studio config (run via npx sanity dev)
├── sanity.cli.ts           # Sanity CLI project reference
├── tailwind.config.mjs     # Tailwind content paths, theme extensions
├── _redirects              # Netlify redirects (e.g. /blog/* → /writing/*)
├── package.json
├── src/
│   ├── env.d.ts            # TypeScript / Astro type references
│   ├── sanity/             # Sanity schema and lib
│   │   ├── schemaTypes/    # blockContent, post
│   │   └── lib/            # load-query, url-for-image
│   ├── styles/
│   │   └── global.css      # Global styles, Tailwind imports, base typography
│   ├── layouts/
│   │   ├── Layout.astro    # Base layout: meta, favicons, ClientRouter, slot
│   │   ├── BlogLayout.astro # Blog post layout: title, date, Portable Text body
│   │   └── MarkdownLayout.astro # Simple markdown layout with back link
│   ├── components/
│   │   ├── Prose.astro     # Typography wrapper using prose classes
│   │   ├── PortableText.astro # Renders Sanity Portable Text
│   │   └── portable-text/  # Custom marks (e.g. LinkMark)
│   └── pages/
│       ├── index.astro     # Homepage: bio, writing list, photos link
│       └── writing/
│           └── [slug].astro # Dynamic route: queries Sanity by slug
```

## Routing & Content

- **File-based routing:** `src/pages/` maps directly to URLs.
- **Writing posts:** Sourced from Sanity CMS. Dynamic route `src/pages/writing/[slug].astro` queries `*[_type == "post" && slug.current == $slug][0]`.
- **Post schema:** `title`, `slug`, `date`, `description`, `body` (Portable Text).
- **Post listing:** Homepage queries `*[_type == "post" && defined(slug.current)] | order(date desc)`.
- **Sanity Studio:** Run `npx sanity dev` to edit content locally. Manage at [sanity.io/manage](https://sanity.io/manage). Project: `ib5naxjq`, dataset: `production`.
- **Redirects:** `/blog/*` redirects to `/writing/*` via `_redirects` (Netlify-style).

## Layout Hierarchy

1. **Layout.astro** — Root shell: `<html>`, `<head>`, `<body>`, `ClientRouter`, meta, favicons.
2. **BlogLayout.astro** — Wraps `Layout`, adds article header (title, formatted date), `PortableText` for body.
3. **MarkdownLayout.astro** — Wraps `Layout`, adds back link, `Prose` for content.

## Styling Conventions

- **Tailwind v4:** Uses `@import "tailwindcss"` in `global.css` and `@tailwindcss/vite` in Astro config.
- **Tailwind config:** `content` includes `./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}`.
- **Theme:** Neutral palette, dark mode via `dark:` variants, serif body, responsive padding (`px-6 md:px-12`, etc.).
- **Prose:** `Prose.astro` uses `@tailwindcss/typography` with custom `prose-*` overrides for headings and spacing.

## Key Patterns

- **Layout composition:** Pages/layouts use `<slot />` for nested content.
- **Props:** Layouts receive `title`, `frontmatter` as needed.
- **Date formatting:** Use `date-fns` (e.g. `format(date, 'do MMMM yyyy')`, `differenceInYears()`).
- **Client-side navigation:** `ClientRouter` from `astro:transitions` handles SPA-style transitions.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build + copy `_redirects` to `dist/` |
| `npm run preview` | Preview production build |
| `npm run astro` | Run Astro CLI |

## Conventions for Agents

1. **Update AGENTS.md:** When making major changes (tech stack, structure, routing, styling, scripts, build config), update this file to reflect the changes in the same session.
2. **New blog posts:** Create in Sanity Studio (`npx sanity dev`) as `post` documents with `title`, `slug`, `date`, optional `description`, and `body` (Portable Text).
3. **New pages:** Add `.astro` (or `.md` with layout) under `src/pages/`.
4. **Styling:** Prefer Tailwind utility classes; use `Prose.astro` for markdown-derived content.
5. **Formatting:** Prettier with 2-space tabs, 80 char print width; use `prettier-plugin-astro` for `.astro` files.
6. **Site URL:** Configured as `https://lewismorr.is` in `astro.config.mjs`; update there if the domain changes.
7. **Photos section:** Index links to `/photos`; corresponding pages/content were removed in recent changes. Re‑adding photos would require new routes and content structure.
