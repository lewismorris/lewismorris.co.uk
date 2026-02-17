import { sanityClient } from 'sanity:client';
import {
  createImageUrlBuilder,
  type SanityImageSource,
} from '@sanity/image-url';

export const imageBuilder = createImageUrlBuilder(sanityClient);

export function urlForImage(source: SanityImageSource) {
  return imageBuilder.image(source);
}

const SRCSET_WIDTHS = [400, 800, 1200, 1600];

export function buildImageSrcset(
  source: SanityImageSource,
  maxWidth = 1600
): string {
  const widths = SRCSET_WIDTHS.filter((w) => w <= maxWidth);
  return widths
    .map(
      (w) =>
        `${urlForImage(source).width(w).fit('max').auto('format').url()} ${w}w`
    )
    .join(', ');
}
