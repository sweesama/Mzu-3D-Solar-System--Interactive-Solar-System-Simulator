#!/usr/bin/env node
// Submit URLs to IndexNow. No dependencies. Requires Node 18+.
//
//   node scripts/indexnow.mjs <url> [url...]
//   node scripts/indexnow.mjs --sitemap [sitemap.xml]

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HOST = 'www.3dsolarsystem.net';
const KEY = '8894b846bf144cbdb509ce481d85f7d9';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const MAX_URLS = 10000;
const DEFAULT_SITEMAP = fileURLToPath(new URL('../sitemap.xml', import.meta.url));

function fail(message) {
  console.error(message);
  process.exit(1);
}

function printUsage() {
  console.error(`Usage:
  node scripts/indexnow.mjs <url> [url...]
  node scripts/indexnow.mjs --sitemap [sitemap.xml]

Submits absolute https URLs for ${HOST} to ${ENDPOINT}.
--sitemap reads every <loc> from sitemap.xml (default: the repo sitemap).`);
}

function parseArgs(argv) {
  if (argv.length === 0 || argv.includes('-h') || argv.includes('--help')) {
    printUsage();
    process.exit(argv.length === 0 ? 1 : 0);
  }

  const flagIndex = argv.findIndex((arg) => arg === '--sitemap' || arg.startsWith('--sitemap='));
  if (flagIndex !== -1) {
    if (argv.filter((arg) => arg === '--sitemap' || arg.startsWith('--sitemap=')).length > 1) {
      fail('Pass --sitemap once.');
    }
    const flag = argv[flagIndex];
    const rest = argv.filter((_, index) => index !== flagIndex);
    let file = '';
    if (flag.startsWith('--sitemap=')) {
      file = flag.slice('--sitemap='.length);
      if (!file) fail('Missing sitemap path after --sitemap=.');
    } else if (rest[0] && !rest[0].startsWith('-')) {
      file = rest.shift();
    }
    if (rest.some((arg) => arg.startsWith('-'))) fail(`Unknown option: ${rest.find((arg) => arg.startsWith('-'))}`);
    if (rest.length) fail('Use either URL arguments or --sitemap [file], not both.');
    return { sitemap: file ? resolve(file) : DEFAULT_SITEMAP };
  }

  const unknown = argv.find((arg) => arg.startsWith('-'));
  if (unknown) fail(`Unknown option: ${unknown}`);
  return { urls: argv };
}

function unescapeXml(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

export function urlsFromSitemap(xml) {
  const urls = [];
  for (const match of xml.matchAll(/<loc>([^<]*)<\/loc>/gi)) {
    const url = unescapeXml(match[1].trim());
    if (url) urls.push(url);
  }
  return urls;
}

export function normalizeUrl(input) {
  let parsed;
  try {
    parsed = new URL(input);
  } catch {
    throw new Error(`Not an absolute URL: ${input}`);
  }
  if (parsed.protocol !== 'https:') throw new Error(`URL must be https: ${input}`);
  if (parsed.hostname !== HOST) throw new Error(`URL host must be ${HOST}: ${input}`);
  return parsed.href;
}

async function loadUrls(args) {
  const parsed = parseArgs(args);
  let raw = parsed.urls;
  if (parsed.sitemap) {
    let xml;
    try {
      xml = await readFile(parsed.sitemap, 'utf8');
    } catch (err) {
      fail(`Cannot read sitemap ${parsed.sitemap}: ${err.message}`);
    }
    raw = urlsFromSitemap(xml);
    if (!raw.length) fail(`No <loc> URLs found in ${parsed.sitemap}`);
  }

  const urls = [];
  const seen = new Set();
  for (const url of raw) {
    const href = normalizeUrl(url);
    if (!seen.has(href)) {
      seen.add(href);
      urls.push(href);
    }
  }
  if (urls.length > MAX_URLS) fail(`IndexNow accepts at most ${MAX_URLS} URLs per request (${urls.length} given).`);
  return urls;
}

async function submit(urls) {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList: urls,
    }),
    signal: AbortSignal.timeout(30000),
  });
  const text = await response.text();
  if (response.status !== 200 && response.status !== 202) {
    fail(`IndexNow responded ${response.status}${text ? `: ${text.trim()}` : ''}`);
  }
  console.log(`Submitted ${urls.length} URL(s): HTTP ${response.status}`);
  if (text.trim()) console.log(text.trim());
}

async function main() {
  await submit(await loadUrls(process.argv.slice(2)));
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch((err) => {
    fail(err?.name === 'TimeoutError' ? 'IndexNow request timed out.' : (err?.message || String(err)));
  });
}
