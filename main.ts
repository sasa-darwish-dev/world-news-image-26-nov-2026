import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

function crc32(buffer: Buffer, start: number, end: number): number {
  let crc = 0xffffffff;
  for (let i = start; i < end; i++) {
    crc ^= buffer[i];
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ 0xffffffff) >>> 0;
}

try {
  const png = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'assets', 'entry.png'));
  if (png.length > 1048576) throw new Error('PNG exceeds 1048576 bytes');
  if (png.length < 45 || !png.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) {
    throw new Error('Invalid PNG signature');
  }
  let offset = 8, chunks = 0, idat = false, ended = false;
  while (offset < png.length) {
    if (offset + 12 > png.length) throw new Error('Truncated PNG chunk header');
    const length = png.readUInt32BE(offset);
    const end = offset + 8 + length;
    if (end + 4 > png.length) throw new Error('Truncated PNG chunk');
    const type = png.toString('ascii', offset + 4, offset + 8);
    if (crc32(png, offset + 4, end) !== png.readUInt32BE(end)) throw new Error(`Bad ${type} CRC`);
    if (chunks === 0) {
      if (type !== 'IHDR' || length !== 13) throw new Error('Invalid first IHDR');
      const w = png.readUInt32BE(offset + 8), h = png.readUInt32BE(offset + 12);
      if (!w || !h || w > 1024 || h > 1024) throw new Error(`Invalid dimensions: ${w}x${h}`);
    } else if (type === 'IHDR') throw new Error('Duplicate IHDR');
    if (type === 'IDAT') idat = true;
    if (type === 'IEND') {
      if (length || !idat || end + 4 !== png.length) throw new Error('Invalid IEND');
      ended = true;
    }
    offset = end + 4;
    chunks++;
  }
  if (!idat || !ended) throw new Error('Incomplete PNG');
  const outputDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';
  mkdirSync(outputDir, { recursive: true });
  writeFileSync(join(outputDir, 'entry.png'), png);
} catch (error) {
  console.error(`Entry failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
