import type { SchemaTypeDefinition } from 'sanity';
import { albumType } from './album';
import { blockContentType } from './blockContent';
import { photoType } from './photo';
import { postType } from './post';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [albumType, blockContentType, photoType, postType],
};
