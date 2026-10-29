import fs from 'node:fs'; import path from 'node:path'; import os from 'node:os';
const src = path.join(os.homedir(), 'xmarket', 'public');
const mf = ['manifest.json', 'manifest.webmanifest'].map((f) => path.join(src, f)).find(fs.existsSync);
if (!mf) { console.error('ERROR: no manifest in ' + src); process.exit(1); }
const m = JSON.parse(fs.readFileSync(mf, 'utf8'));
const icons = [];
for (const ic of m.icons || []) {
  const f = path.join(src, ic.src.replace(/^\//, ''));
  if (!fs.existsSync(f)) { console.warn('skip missing', ic.src); continue; }
  const name = path.basename(f);
  fs.copyFileSync(f, path.join('public', name));
  icons.push({ src: '/' + name, sizes: ic.sizes, type: ic.type || 'image/png', ...(ic.purpose ? { purpose: ic.purpose } : {}) });
}
if (!icons.length) { console.error('ERROR: no usable icons in the XMARKET manifest'); process.exit(1); }
for (const extra of ['favicon.ico', 'apple-touch-icon.png']) {
  const f = path.join(src, extra); if (fs.existsSync(f)) fs.copyFileSync(f, path.join('public', extra));
}
const out = { name: 'XMARKET', short_name: 'XMARKET', description: 'Your World of Great Deals. Explore. Shop. Save.',
  start_url: '/', scope: '/', display: 'standalone', background_color: '#FFFFFF', theme_color: '#2563EB', icons };
fs.writeFileSync('public/manifest.webmanifest', JSON.stringify(out, null, 2));
console.log('OK: ' + icons.length + ' icons', icons.map((i) => i.src).join(' '));
