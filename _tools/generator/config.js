'use strict';
/*
 * Edenseek Canonical Publishing Engine — configuration.
 * Milestone 2 · R1. Declares canonical inputs, schema-lite contracts, and
 * (for future commits) output targets. Commit 1 uses ONLY inputs + schema;
 * no outputs are written. This module has no dependencies (Node built-ins only).
 */
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..'); // repository root

module.exports = {
  engine: { name: 'edenseek-canonical-publishing-engine', version: '0.1.0-r1' },

  siteOrigin: 'https://edenseek.com',
  rootDir: ROOT,
  dataDir: path.join(ROOT, 'data'),

  tiers: ['E', 'T', 'M'],

  // Canonical collections + schema-lite required fields.
  // `root` is the array key inside each JSON file (the `_meta` key is ignored).
  collections: [
    {
      key: 'series', file: 'series.json', root: 'series',
      required: ['slug', 'title', 'url', 'tier'], tier: true, cover: 'cover.base',
      issues: { key: 'issues', required: ['number', 'title'], cover: 'cover.base' },
    },
    {
      key: 'books', file: 'books.json', root: 'books',
      required: ['slug', 'title', 'url', 'tier'], tier: true, cover: 'cover.base',
      issues: { key: 'issues', required: ['number', 'title'], cover: 'cover.base' },
    },
    { key: 'creators', file: 'creators.json', root: 'creators', required: ['slug', 'name', 'roles'] },
    { key: 'characters', file: 'characters.json', root: 'characters', required: ['slug', 'name'] },
    { key: 'news', file: 'news.json', root: 'news', required: ['slug', 'title', 'date', 'url'] },
  ],

  // Output targets are DECLARED for future commits; NOT written in Commit 1.
  outputs: {
    bundle: path.join(ROOT, 'data', 'edenseek-data.js'),        // Commit 2 (candidate only)
    sitemap: path.join(ROOT, 'sitemap.xml'),                    // Commit 4 (candidate only)
    searchIndex: path.join(ROOT, 'data', 'search-index.json'),  // Commit 6 (optional)
  },

  // Sitemap config (used from Commit 4). `lastmod` is a constant matching the
  // committed sitemap for byte-fidelity; record-derived lastmod is deferred.
  sitemap: {
    lastmod: '2026-07-02',
    routes: [
      '/', '/comics/', '/comics/i-ride-for-them/', '/comics/society-of-killers/',
      '/books/', '/books/egypt-the-cat/', '/creators/', '/about/', '/news/', '/contact/',
    ],
  },
};
