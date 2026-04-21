const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const CHARS_DIR = path.join(__dirname, 'client/src/assets/characters');
const FRAME_SIZE = 128; // normalized frame size for each sprite

async function getImageDimensions(filePath) {
  const meta = await sharp(filePath).metadata();
  return { width: meta.width, height: meta.height };
}

async function extractAndResize(filePath, frameSize) {
  const { width, height } = await getImageDimensions(filePath);
  return sharp(filePath)
    .resize(frameSize, frameSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
}

async function splitWalkAndResize(filePath, frameSize) {
  const { width, height } = await getImageDimensions(filePath);
  const halfW = Math.floor(width / 2);

  const frame1 = await sharp(filePath)
    .extract({ left: 0, top: 0, width: halfW, height })
    .resize(frameSize, frameSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const frame2 = await sharp(filePath)
    .extract({ left: halfW, top: 0, width: width - halfW, height })
    .resize(frameSize, frameSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  return [frame1, frame2];
}

async function buildSpritesheet(name) {
  const directions = ['down', 'left', 'right', 'up'];
  // Row order: down-idle, down-walk1, down-walk2, left-idle, left-walk1, left-walk2, ...
  // Layout: 3 columns (idle, walk1, walk2) x 4 rows (down, left, right, up)
  const cols = 3;
  const rows = 4;
  const frames = [];

  for (const dir of directions) {
    const idleFile = dir === 'down'
      ? path.join(CHARS_DIR, `${name}.png`)
      : path.join(CHARS_DIR, `${name}-${dir === 'up' ? 'back' : dir}.png`);

    const walkFile = path.join(CHARS_DIR, `${name}-walk-${dir}.png`);

    const idleFrame = await extractAndResize(idleFile, FRAME_SIZE);
    const [walk1, walk2] = await splitWalkAndResize(walkFile, FRAME_SIZE);

    frames.push(idleFrame, walk1, walk2);
  }

  const sheet = sharp({
    create: {
      width: cols * FRAME_SIZE,
      height: rows * FRAME_SIZE,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  });

  const composites = frames.map((buf, i) => ({
    input: buf,
    left: (i % cols) * FRAME_SIZE,
    top: Math.floor(i / cols) * FRAME_SIZE,
  }));

  const outPath = path.join(CHARS_DIR, `${name}-spritesheet.png`);
  await sheet.composite(composites).png().toFile(outPath);
  console.log(`Created: ${outPath} (${cols * FRAME_SIZE}x${rows * FRAME_SIZE}, frame: ${FRAME_SIZE}x${FRAME_SIZE})`);
  console.log(`Layout: 3 cols (idle, walk1, walk2) x 4 rows (down, left, right, up)`);
}

async function main() {
  await buildSpritesheet('mother');
  await buildSpritesheet('daughter');
}

main().catch(console.error);
