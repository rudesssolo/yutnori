const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const root = path.resolve(__dirname, '..');

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const name = Buffer.from(type);
  const length = Buffer.alloc(4);
  const checksum = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  checksum.writeUInt32BE(crc32(Buffer.concat([name, data])));
  return Buffer.concat([length, name, data, checksum]);
}

function png(width, height, pixels) {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = 6;
  const rows = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    const offset = y * (width * 4 + 1);
    rows[offset] = 0;
    pixels.copy(rows, offset + 1, y * width * 4, (y + 1) * width * 4);
  }
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', header),
    chunk('IDAT', zlib.deflateSync(rows, {level: 9})),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

const mix = (a, b, t) => a.map((value, index) => Math.round(value + (b[index] - value) * t));
const distanceToSegment = (x, y, ax, ay, bx, by) => {
  const dx = bx - ax, dy = by - ay;
  const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(x - (ax + t * dx), y - (ay + t * dy));
};

function sample(x, y, maskable = false) {
  const diagonal = Math.max(0, Math.min(1, (x + y) / 1024));
  let color = mix([29, 42, 85], [10, 14, 31], diagonal);
  const corner = 112;
  const dx = Math.max(corner - x, 0, x - (512 - corner));
  const dy = Math.max(corner - y, 0, y - (512 - corner));
  if (!maskable && (dx || dy) && Math.hypot(dx, dy) > corner) return [0, 0, 0, 0];

  const radius = Math.hypot(x - 256, y - 256);
  if (Math.abs(radius - 169) <= 8.5) color = [255, 209, 102];
  const lines = [[137,137,256,256],[256,256,375,137],[137,375,256,256],[256,256,375,375]];
  if (lines.some(line => distanceToSegment(x, y, ...line) <= 7)) color = [255, 209, 102];

  const angle = 18 * Math.PI / 180;
  const rx = Math.cos(angle) * (x - 256) - Math.sin(angle) * (y - 256);
  const ry = Math.sin(angle) * (x - 256) + Math.cos(angle) * (y - 256);
  const capsuleDistance = Math.hypot(Math.max(Math.abs(rx) - 71, 0), ry);
  if (capsuleDistance <= 46.5) {
    if (capsuleDistance >= 39.5) color = [255, 240, 202];
    else color = mix([242, 211, 147], [112, 64, 30], Math.max(0, Math.min(1, (rx + 114) / 228)));
  }
  if (Math.abs(ry) <= 2.5 && Math.abs(rx) < 87) color = mix(color, [112, 64, 30], .6);
  if (Math.hypot(rx + 71, ry) <= 10) color = [212, 91, 68];
  if (radius <= 31.5) color = radius >= 24.5 ? [255, 240, 202] : [255, 209, 102];
  return [...color, 255];
}

function render(size, maskable = false) {
  const pixels = Buffer.alloc(size * size * 4);
  const samples = 3;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const total = [0, 0, 0, 0];
      for (let sy = 0; sy < samples; sy++) for (let sx = 0; sx < samples; sx++) {
        const rgba = sample((x + (sx + .5) / samples) * 512 / size, (y + (sy + .5) / samples) * 512 / size, maskable);
        rgba.forEach((value, channel) => total[channel] += value);
      }
      const offset = (y * size + x) * 4;
      total.forEach((value, channel) => pixels[offset + channel] = Math.round(value / (samples * samples)));
    }
  }
  return png(size, size, pixels);
}

for (const size of [180, 192, 512]) {
  fs.writeFileSync(path.join(root, 'icons', `yutnori-${size}.png`), render(size));
}
fs.writeFileSync(path.join(root, 'icons', 'yutnori-maskable-512.png'), render(512, true));
