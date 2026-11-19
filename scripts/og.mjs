/**
 * Renders the Open Graph image and app icons with headless Chrome/Edge,
 * then converts/resizes them with Python (Pillow) via scripts/og_post.py.
 *
 *   npm run og
 *
 * Outputs: assets/img/og-image.jpg (1200×630), apple-touch-icon.png, icon-192.png, icon-512.png,
 *          icon-512-maskable.png, favicon-32.png and /favicon.ico
 * Set CHROME_PATH if your browser is not auto-detected.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'og-'));

const candidates = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
].filter(Boolean);
const chrome = candidates.find((p) => fs.existsSync(p));
if (!chrome) { console.error('Chrome/Edge not found — set CHROME_PATH.'); process.exit(1); }

function shot(file, query, w, h, out, transparent) {
  const url = pathToFileURL(path.join(ROOT, 'scripts', file)).href + (query || '');
  execFileSync(chrome, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files',
    `--window-size=${w},${h}`, '--virtual-time-budget=8000', '--force-device-scale-factor=1',
    ...(transparent ? ['--default-background-color=00000000'] : []),
    `--screenshot=${out}`, url,
  ], { stdio: 'ignore' });
  console.log('  rendered', path.basename(out));
}

console.log('Rendering…');
shot('og-template.html', '', 1200, 630, path.join(TMP, 'og.png'));
shot('icon-template.html', '?mode=circle', 512, 512, path.join(TMP, 'circle.png'), true);
shot('icon-template.html', '?mode=square', 512, 512, path.join(TMP, 'square.png'));
shot('icon-template.html', '?mode=maskable', 512, 512, path.join(TMP, 'maskable.png'));

execFileSync('python', [path.join(ROOT, 'scripts', 'og_post.py'), TMP], { stdio: 'inherit' });
fs.rmSync(TMP, { recursive: true, force: true });
