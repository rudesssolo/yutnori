const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const input = process.argv[2];
if (!input) throw new Error('Usage: node tools/prepare-generated-icon.js <source.png>');

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

function decodePng(file) {
  const png = fs.readFileSync(file);
  if (png.subarray(1, 4).toString() !== 'PNG') throw new Error('The source is not a PNG');
  const width = png.readUInt32BE(16), height = png.readUInt32BE(20);
  const bitDepth = png[24], colorType = png[25], interlace = png[28];
  if (bitDepth !== 8 || ![2, 6].includes(colorType) || interlace !== 0) {
    throw new Error('Only non-interlaced 8-bit RGB/RGBA PNG files are supported');
  }
  const channels = colorType === 6 ? 4 : 3;
  const idat = [];
  for (let offset = 8; offset < png.length;) {
    const length = png.readUInt32BE(offset);
    const type = png.subarray(offset + 4, offset + 8).toString();
    if (type === 'IDAT') idat.push(png.subarray(offset + 8, offset + 8 + length));
    offset += length + 12;
  }
  const packed = zlib.inflateSync(Buffer.concat(idat));
  const stride = width * channels;
  const pixels = Buffer.alloc(stride * height);
  const paeth = (a, b, c) => {
    const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
    return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
  };
  for (let y = 0; y < height; y++) {
    const rowStart = y * (stride + 1), filter = packed[rowStart];
    for (let x = 0; x < stride; x++) {
      const raw = packed[rowStart + x + 1];
      const left = x >= channels ? pixels[y * stride + x - channels] : 0;
      const up = y ? pixels[(y - 1) * stride + x] : 0;
      const upLeft = y && x >= channels ? pixels[(y - 1) * stride + x - channels] : 0;
      const prediction = filter === 0 ? 0 :
        filter === 1 ? left :
        filter === 2 ? up :
        filter === 3 ? Math.floor((left + up) / 2) :
        filter === 4 ? paeth(left, up, upLeft) :
        (() => { throw new Error(`Unsupported PNG filter ${filter}`); })();
      pixels[y * stride + x] = (raw + prediction) & 255;
    }
  }
  return {width, height, channels, pixels};
}

function resizeArea(source, size) {
  const output = Buffer.alloc(size * size * source.channels);
  const scaleX = source.width / size, scaleY = source.height / size;
  for (let y = 0; y < size; y++) {
    const y0 = y * scaleY, y1 = (y + 1) * scaleY;
    for (let x = 0; x < size; x++) {
      const x0 = x * scaleX, x1 = (x + 1) * scaleX;
      const sums = new Array(source.channels).fill(0);
      let total = 0;
      for (let sy = Math.floor(y0); sy < Math.ceil(y1); sy++) {
        const wy = Math.min(y1, sy + 1) - Math.max(y0, sy);
        for (let sx = Math.floor(x0); sx < Math.ceil(x1); sx++) {
          const weight = wy * (Math.min(x1, sx + 1) - Math.max(x0, sx));
          const offset = (sy * source.width + sx) * source.channels;
          for (let channel = 0; channel < source.channels; channel++) sums[channel] += source.pixels[offset + channel] * weight;
          total += weight;
        }
      }
      const offset = (y * size + x) * source.channels;
      for (let channel = 0; channel < source.channels; channel++) output[offset + channel] = Math.round(sums[channel] / total);
    }
  }
  return output;
}

function encodePng(size, channels, pixels) {
  const rows = Buffer.alloc((size * channels + 1) * size);
  for (let y = 0; y < size; y++) pixels.copy(rows, y * (size * channels + 1) + 1, y * size * channels, (y + 1) * size * channels);
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8;
  header[9] = channels === 4 ? 6 : 2;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', header),
    chunk('IDAT', zlib.deflateSync(rows, {level: 9})),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

const root = path.resolve(__dirname, '..');
const source = decodePng(input);
if (source.width !== source.height) throw new Error('The source icon must be square');
for (const size of [180, 192, 512]) {
  const output = encodePng(size, source.channels, resizeArea(source, size));
  fs.writeFileSync(path.join(root, 'icons', `yutnori-modern-${size}.png`), output);
}
fs.copyFileSync(
  path.join(root, 'icons', 'yutnori-modern-512.png'),
  path.join(root, 'icons', 'yutnori-modern-maskable-512.png')
);
