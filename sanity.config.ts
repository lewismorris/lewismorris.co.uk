import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schema } from './src/sanity/schemaTypes';

export default defineConfig({
  projectId: 'ib5naxjq',
  dataset: 'production',
  plugins: [structureTool()],
  schema,
});
