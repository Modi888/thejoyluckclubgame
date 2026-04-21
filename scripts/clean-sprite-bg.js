// Flood-fill alpha removal for mother-spritesheet.png idle column.
// The AI-generated idle frames came with light gray backgrounds (~200-255 RGB).
// We flood-fill from every edge pixel of each 128x128 frame, treating any
// near-white pixel as background, and set its alpha to 0.
const sharp = require('sharp');
const path = require('path');

const FRAME = 128;
const COLS = 3;
const ROWS = 4;
const TOLERANCE = 30; // near-white threshold: channel values > 255 - TOLERANCE count as bg
// We also treat any pixel whose all channels are > 180 AND connected to a bg seed as bg.

async function processSheet(inputPath, outputPath) {
  const img = sharp(inputPath).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const buf = Buffer.from(data);

  const idx = (x, y) => (y * width + x) * channels;
  const isBgColor = (x, y) => {
    const i = idx(x, y);
    const r = buf[i], g = buf[i + 1], b = buf[i + 2], a = buf[i + 3];
    if (a === 0) return true; // already transparent
    // near-white / light-gray detection
    return r > 180 && g > 180 && b > 180 && Math.abs(r - g) < 20 && Math.abs(g - b) < 20;
  };

  const clearPixel = (x, y) => {
    const i = idx(x, y);
    buf[i + 3] = 0;
  };

  // For each frame, flood-fill from all border pixels
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const x0 = col * FRAME;
      const y0 = row * FRAME;
      const x1 = x0 + FRAME - 1;
      const y1 = y0 + FRAME - 1;

      const visited = new Uint8Array(FRAME * FRAME);
      const vIdx = (x, y) => (y - y0) * FRAME + (x - x0);
      const stack = [];

      // Seed from all 4 edges
      for (let x = x0; x <= x1; x++) {
        if (isBgColor(x, y0)) { stack.push([x, y0]); visited[vIdx(x, y0)] = 1; }
        if (isBgColor(x, y1)) { stack.push([x, y1]); visited[vIdx(x, y1)] = 1; }
      }
      for (let y = y0; y <= y1; y++) {
        if (isBgColor(x0, y)) { stack.push([x0, y]); visited[vIdx(x0, y)] = 1; }
        if (isBgColor(x1, y)) { stack.push([x1, y]); visited[vIdx(x1, y)] = 1; }
      }

      while (stack.length) {
        const [x, y] = stack.pop();
        clearPixel(x, y);
        const neighbors = [[x-1,y],[x+1,y],[x,y-1],[x,y+1]];
        for (const [nx, ny] of neighbors) {
          if (nx < x0 || nx > x1 || ny < y0 || ny > y1) continue;
          const vi = vIdx(nx, ny);
          if (visited[vi]) continue;
          if (!isBgColor(nx, ny)) continue;
          visited[vi] = 1;
          stack.push([nx, ny]);
        }
      }
    }
  }

  await sharp(buf, { raw: { width, height, channels } })
    .png()
    .toFile(outputPath);
  console.log('wrote', outputPath);
}

(async () => {
  const dir = path.resolve(__dirname, '../client/src/assets/characters');
  for (const name of ['mother-spritesheet.png', 'daughter-spritesheet.png']) {
    const p = path.join(dir, name);
    await processSheet(p, p); // overwrite in place
  }
})();
