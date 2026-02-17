import { defineArrayMember, defineField, defineType } from 'sanity';
import { FolderIcon } from '@sanity/icons';

export const albumType = defineType({
  name: 'album',
  type: 'document',
  icon: FolderIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'featuredImage',
      type: 'reference',
      to: [{ type: 'photo' }],
      description: 'Optional. Used as album preview on /photos. Falls back to first photo.',
    }),
    defineField({
      name: 'photos',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'photo' }] })],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
      media: 'featuredImage',
    },
    prepare({ title, slug, media }) {
      return {
        title,
        subtitle: slug ? `/${slug}` : undefined,
        media,
      };
    },
  },
});
