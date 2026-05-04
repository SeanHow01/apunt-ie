/**
 * Generates public/icon-192.png and public/icon-512.png for the PWA manifest.
 *
 * Design: lowercase italic "c" in Fraunces, centred on the Punt
 * brand background (oklch 0.977 0.008 75) with accent (oklch 0.60 0.19 27).
 *
 * Run with:
 *   pnpm tsx scripts/generate-icons.ts
 *
 * Requires: sharp (already a devDependency)
 */

import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'public');

const BG = '#F5EDD8';
const ACCENT = '#B85C38';

async function generateIcon(size: number, outFile: string) {
  const padding = Math.round(size * 0.15);
  const fontSize = Math.round(size * 0.55);

  // Build an SVG with the letter "c" centred on the cream background
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
      <rect width="${size}" height="${size}" fill="${BG}" />
      <text
        x="50%"
        y="54%"
        dominant-baseline="middle"
        text-anchor="middle"
        font-family="Georgia, 'Times New Roman', serif"
        font-style="italic"
        font-size="${fontSize}"
        fill="${ACCENT}"
        letter-spacing="-2"
      >c</text>
      <!-- Thin border in rule colour -->
      <rect
        x="${padding / 2}" y="${padding / 2}"
        width="${size - padding}" height="${size - padding}"
        fill="none"
        stroke="rgba(42,26,20,0.12)"
        stroke-width="${Math.max(1, Math.round(size * 0.012))}"
      />
    </svg>
  `;

  await sharp(Buffer.from(svg)).png().toFile(outFile);
  console.log(`✓ ${path.basename(outFile)} (${size}×${size})`);
}

async function main() {
  await generateIcon(192, path.join(outDir, 'icon-192.png'));
  await generateIcon(512, path.join(outDir, 'icon-512.png'));
  console.log('Icons written to public/');
}

main().catch((err) => { console.error(err); process.exit(1); });
