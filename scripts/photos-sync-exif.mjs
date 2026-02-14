import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const photosRoot = path.join(projectRoot, 'src', 'assets', 'photos');
const outputRoot = path.join(projectRoot, 'src', 'content', 'photos-data');

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.heic', '.avif']);

function toPosix(value) {
  return value.split(path.sep).join('/');
}

function titleFromFilename(filename) {
  return filename
    .replace(path.extname(filename), '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function listDirectories(targetPath) {
  const entries = await fs.readdir(targetPath, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => !name.startsWith('_'));
}

async function listImages(targetPath) {
  const entries = await fs.readdir(targetPath, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => IMAGE_EXTENSIONS.has(path.extname(name).toLowerCase()))
    .sort((a, b) => a.localeCompare(b));
}

function toPhotoMetadata(albumSlug, filename) {
  return {
    src: `/src/assets/photos/${albumSlug}/${filename}`,
    alt: titleFromFilename(filename)
  };
}

async function main() {
  await fs.mkdir(outputRoot, { recursive: true });

  let albumSlugs = [];
  try {
    albumSlugs = await listDirectories(photosRoot);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('No photo albums found at src/assets/photos.');
      return;
    }
    throw error;
  }

  for (const albumSlug of albumSlugs) {
    const albumPath = path.join(photosRoot, albumSlug);
    const imageNames = await listImages(albumPath);

    const photos = imageNames.map((filename) => toPhotoMetadata(albumSlug, filename));

    const outputPath = path.join(outputRoot, `${albumSlug}.json`);
    const payload = {
      albumSlug,
      photos
    };

    await fs.writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
    console.log(`Synced ${photos.length} photos -> ${toPosix(path.relative(projectRoot, outputPath))}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
