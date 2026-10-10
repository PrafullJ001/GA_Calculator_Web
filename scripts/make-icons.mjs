// Generates the PNG app icons using Node only (needs the "sharp" package).
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const OUT = fileURLToPath(new URL('../public/icons/', import.meta.url));
mkdirSync(OUT, { recursive: true });

// Grape cluster + leaf. `scale` shrinks the artwork for the maskable (safe-zone) icon.
const art = (scale) => `
  <g transform="translate(512 532) scale(${scale}) translate(-512 -512)">
    <g fill="#E6B842">
      <circle cx="370" cy="400" r="112"/><circle cx="512" cy="400" r="112"/><circle cx="654" cy="400" r="112"/>
      <circle cx="440" cy="560" r="112"/><circle cx="584" cy="560" r="112"/><circle cx="512" cy="710" r="112"/>
    </g>
    <g fill="#FFF4CD">
      <circle cx="338" cy="360" r="26"/><circle cx="480" cy="360" r="26"/><circle cx="622" cy="360" r="26"/>
      <circle cx="408" cy="520" r="26"/><circle cx="552" cy="520" r="26"/><circle cx="480" cy="670" r="26"/>
    </g>
    <path d="M520 300c0-120 90-190 220-190 0 120-80 190-220 190z" fill="#F0CB63"/>
  </g>`;

const rounded = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
  <rect width="1024" height="1024" rx="225" fill="#115E59"/>${art(0.9)}</svg>`;
const maskable = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
  <rect width="1024" height="1024" fill="#115E59"/>${art(0.66)}</svg>`;

const png = (svg, size, file, flatten) => {
  let img = sharp(Buffer.from(svg)).resize(size, size);
  if (flatten) img = img.flatten({ background: '#115E59' });
  return img.png().toFile(OUT + file);
};

await png(rounded, 192, 'icon-192.png');
await png(rounded, 512, 'icon-512.png');
await png(maskable, 512, 'icon-maskable-512.png');
await png(maskable, 180, 'apple-touch-icon.png', true);
console.log('icons written');