import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

/**
 * After the build, list every emitted file (hashed JS/CSS, icons, manifest...)
 * and inject it into dist/sw.js so the whole app shell is cached on the
 * very first visit. No PWA library required.
 */
function swPrecache() {
  let outDir;
  const walk = (dir) =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
      const full = path.join(dir, e.name);
      return e.isDirectory() ? walk(full) : [full];
    });

  return {
    name: 'sw-precache',
    apply: 'build',
    configResolved(cfg) {
      outDir = path.resolve(cfg.root, cfg.build.outDir);
    },
    closeBundle() {
      const swPath = path.join(outDir, 'sw.js');
      if (!fs.existsSync(swPath)) return;
      const files = walk(outDir)
        .map((f) => path.relative(outDir, f).split(path.sep).join('/'))
        .filter((f) => f !== 'sw.js')
        .map((f) => './' + f);
      const list = ['./', ...files];
      const build = Date.now().toString(36);
      let sw = fs.readFileSync(swPath, 'utf8');
      sw = sw
        .replace(/\/\*__PRECACHE__\*\/\[[^\]]*\]/, JSON.stringify(list))
        .replace(/\/\*__BUILD__\*\/"[^"]*"/, JSON.stringify(build));
      fs.writeFileSync(swPath, sw);
      console.log(`[sw-precache] ${list.length} files, build ${build}`);
    },
  };
}

export default defineConfig({
  base: './', // relative paths: works at a domain root or in a sub-folder
  plugins: [react(), swPrecache()],
});