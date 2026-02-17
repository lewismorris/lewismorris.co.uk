import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.PUBLIC_SANITY_PROJECT_ID ?? 'ib5naxjq',
    dataset: process.env.PUBLIC_SANITY_DATASET ?? 'production',
  },
  deployment: {
    appId: 'r2t7m7fbo56b7l91b7kjkmav',
  },
});
