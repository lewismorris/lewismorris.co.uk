import { defineCollection, z } from 'astro:content';

const photos = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      date: z.coerce.date(),
      cover: image(),
      hidden: z.boolean().optional()
    })
});

const photosData = defineCollection({
  type: 'data',
  schema: z.object({
    albumSlug: z.string(),
    photos: z.array(
      z.object({
        src: z.string(),
        alt: z.string(),
        width: z.number().optional(),
        height: z.number().optional(),
        capturedAt: z.string().optional(),
        iso: z.number().optional(),
        aperture: z.string().optional(),
        shutter: z.string().optional(),
        camera: z.string().optional(),
        lens: z.string().optional()
      })
    )
  })
});

export const collections = {
  photos,
  'photos-data': photosData
};
