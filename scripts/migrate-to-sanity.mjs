#!/usr/bin/env node
/**
 * One-off script to convert markdown posts to Sanity document JSON.
 * Outputs JSON suitable for mcp_Sanity_create_documents_from_json.
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';
import { htmlToBlocks } from '@portabletext/block-tools';
import { Schema } from '@sanity/schema';
import { JSDOM } from 'jsdom';

const __dirname = dirname(fileURLToPath(import.meta.url));
const WRITING_DIR = join(__dirname, '../src/pages/writing');

const blockContentType = Schema.compile({
  name: 'blockContent',
  types: [
    {
      type: 'array',
      name: 'blockContent',
      of: [
        {
          type: 'block',
          name: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H1', value: 'h1' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [{ title: 'Bullet', value: 'bullet' }],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [{ name: 'href', type: 'url' }],
              },
            ],
          },
        },
      ],
    },
  ],
}).get('blockContent');

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: content };
  const [, fm, body] = match;
  const frontmatter = {};
  for (const line of fm.split('\n')) {
    const m = line.match(/^(\w+):\s*(.+)$/);
    if (m) frontmatter[m[1]] = m[2].replace(/^["']|["']$/g, '').trim();
  }
  return { frontmatter, body };
}

function slugFromFilename(filename) {
  return filename.replace(/\.md$/, '');
}

function mdToPortableText(md) {
  const html = marked.parse(md.trim(), { gfm: true });
  const wrapped = `<html><body>${html}</body></html>`;
  return htmlToBlocks(wrapped, blockContentType, {
    parseHtml: (html) => new JSDOM(html).window.document,
  });
}

const posts = [
  'coder.md',
  'use-your-brain-tell-the-story.md',
  'remote-work-isnt-broken-your-culture-is.md',
];

const documents = posts.map((file) => {
  const path = join(WRITING_DIR, file);
  const raw = readFileSync(path, 'utf-8');
  const { frontmatter, body } = parseFrontmatter(raw);
  const slug = slugFromFilename(file);
  return {
    type: 'post',
    content: {
      _type: 'post',
      title: frontmatter.title || slug,
      slug: { _type: 'slug', current: slug },
      date: frontmatter.date ? `${frontmatter.date}T12:00:00.000Z` : new Date().toISOString(),
      description: frontmatter.description || undefined,
      body: mdToPortableText(body),
    },
  };
});

console.log(JSON.stringify(documents, null, 2));
