const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const html = read('yutnori.html');
const worker = read('service-worker.js');
const manifest = JSON.parse(read('manifest.webmanifest'));
const version = JSON.parse(read('version.json'));

const scripts = [...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)]
  .filter(match => !/\btype=["']module["']/i.test(match[1]) && !/\bsrc=/i.test(match[1]))
  .map(match => match[2])
  .join('\n');
assert.doesNotThrow(() => new Function(scripts), 'Il JavaScript inline deve essere sintatticamente valido');

const ids = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map(match => match[1]);
assert.strictEqual(new Set(ids).size, ids.length, 'Gli id HTML devono essere univoci');
const idSet = new Set(ids);
for (const match of scripts.matchAll(/\$\(['"]#([^'"]+)['"]\)/g)) {
  assert(idSet.has(match[1]), `Elemento HTML mancante: #${match[1]}`);
}

assert.strictEqual(manifest.display, 'standalone');
assert.strictEqual(manifest.orientation, 'portrait');
assert(manifest.icons.some(icon => icon.type === 'image/png' && icon.sizes === '192x192'));
assert(manifest.icons.some(icon => icon.type === 'image/png' && icon.sizes === '512x512' && icon.purpose === 'any'));
assert(manifest.icons.some(icon => icon.type === 'image/png' && icon.sizes === '512x512' && icon.purpose === 'maskable'));
assert(/^\d{4}\.\d{2}\.\d{2}\.\d+$/.test(version.version), 'Versione non valida');

for (const icon of manifest.icons.filter(icon => icon.type === 'image/png')) {
  const bytes = fs.readFileSync(path.join(root, icon.src));
  assert.strictEqual(bytes.subarray(1, 4).toString(), 'PNG', `${icon.src} non è un PNG`);
  const [width, height] = icon.sizes.split('x').map(Number);
  assert.strictEqual(bytes.readUInt32BE(16), width, `Larghezza errata per ${icon.src}`);
  assert.strictEqual(bytes.readUInt32BE(20), height, `Altezza errata per ${icon.src}`);
}

assert(worker.includes("'./version.json'"), 'Il service worker deve memorizzare version.json');
assert(worker.includes('await cache.put(event.request, response.clone())'), 'La scrittura in cache deve essere attesa');
assert(worker.includes('if (previousCaches.length) await notifyAppUpdate()'), 'L’aggiornamento del service worker deve avvisare le app già installate');
assert(html.includes("fetch('./version.json',{cache:'no-store'})"), 'Il controllo aggiornamenti deve usare version.json');
assert(html.includes("G.phase==='awaitThrow'||(!T&&G.phase==='awaitMove')"), 'Il tutorial non deve consentire lanci durante una mossa');
assert(html.includes('while(G===game&&!game.over'), 'La CPU deve interrompersi quando cambia partita');

console.log('Smoke test OK');
