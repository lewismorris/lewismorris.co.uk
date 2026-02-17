import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import sanity from '@sanity/astro';
import react from '@astrojs/react';

import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  site: 'https://lewismorr.is',
  output: 'static',

  integrations: [
    sitemap(),
    sanity({
      projectId: 'ib5naxjq',
      dataset: 'production',
      useCdn: false,
      apiVersion: '2025-01-28',
    }),
    react(),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: netlify(),
});