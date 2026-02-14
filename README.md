# lewismorris.co.uk

Personal Astro site for writing and photography.

## Stack
- Astro 5
- Tailwind CSS 4
- Astro Content Collections

## Commands
- `npm install`
- `npm run dev`
- `npm run photos:sync`
- `npm run build`
- `npm run preview`

## Photo System (MVP)

### Routes
- `/photos`
- `/photos/{album-name}`

### Album metadata
Album entries live in `src/content/photos/*.md` and use the `photos` collection schema:
- `title` (required)
- `description` (optional)
- `date` (required)
- `cover` (required image)

### Images
Place photos in album folders:
- `src/assets/photos/{album-name}/...`

### Photo data sync
Run:

```sh
npm run photos:sync
```

This script:
- scans each `src/assets/photos/{album-name}` folder
- generates photo entries from filenames
- writes sidecar data to `src/content/photos-data/{album-name}.json`

### Build behavior
`npm run build` automatically runs photo sync first via `prebuild`.

## Authoring workflow
1. Add photos to `src/assets/photos/{album-name}/`.
2. Create or update album markdown in `src/content/photos/{album-name}.md`.
3. Run `npm run photos:sync`.
4. Run `npm run dev` or `npm run build`.
