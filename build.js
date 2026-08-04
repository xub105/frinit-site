'use strict';
// Build static site from data/content.json -> dist/
const fs = require('fs');
const path = require('path');
const V = require('./views');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');

function rmrf(p) { fs.rmSync(p, { recursive: true, force: true }); }
function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name);
    const d = path.join(dst, e.name);
    if (e.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function makeStatic(s) {
  // asset paths -> relative
  s = s.replace(/="\/(css|js|uploads)\//g, '="$1/');
  // page links -> .html
  const map = {
    '/': 'index.html',
    '/about': 'about.html',
    '/products': 'products.html',
    '/service': 'service.html',
    '/news': 'news.html',
    '/credentials': 'credentials.html',
    '/contact': 'contact.html'
  };
  s = s.replace(/href="(\/[^"]*)"/g, (m, p) => 'href="' + (map[p] || p) + '"');
  return s;
}

const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'content.json'), 'utf8'));

fs.mkdirSync(DIST, { recursive: true });
copyDir(path.join(ROOT, 'public'), DIST);

const pages = [
  ['index.html', V.home(content), '/'],
  ['about.html', V.about(content), '/about'],
  ['products.html', V.products(content), '/products'],
  ['service.html', V.service(content), '/service'],
  ['news.html', V.news(content), '/news'],
  ['credentials.html', V.credentials(content), '/credentials'],
  ['contact.html', V.contact(content), '/contact']
];

for (const [file, body, active] of pages) {
  fs.writeFileSync(path.join(DIST, file), makeStatic(V.layout(content, body, active)));
}

// Decap admin
copyDir(path.join(ROOT, 'admin'), path.join(DIST, 'admin'));

console.log('✓ Built static site to dist/ (' + pages.length + ' pages + admin)');
