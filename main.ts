// NusaStats hand-in program (Node 22, standard library only).
//
// What it does, in three steps:
//   1. Stage the site: copy this repository's app/ and screenshots/ into the
//      output directory (MAKEFUN_OUTPUT_DIR outside the grader, /output in it).
//   2. Build the dossier: ask the vendored make.fun library to summarise the
//      staged app/ and screenshots/ and write it as dossier.json.
//   3. Nothing else: no network, no timestamps, no random data — running it
//      twice over the same repository writes the same bytes twice.
//
// Run it from the repository root:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

// The repository root is the directory holding this file.
const repoRoot = dirname(fileURLToPath(import.meta.url));

// The grader hands us a writable /output; outside it the env var stands in.
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Copy a directory tree in fixed sorted order, so the staged output is
// identical regardless of the order the filesystem hands entries back in.
// (cpSync copies in readdir order, which is filesystem-dependent.)
function copyTreeSorted(srcDir, destDir) {
  mkdirSync(destDir, { recursive: true });
  const entries = readdirSync(srcDir, { withFileTypes: true });
  entries.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  for (const entry of entries) {
    const src = join(srcDir, entry.name);
    const dest = join(destDir, entry.name);
    if (entry.isDirectory()) copyTreeSorted(src, dest);
    else if (entry.isFile()) copyFileSync(src, dest);
  }
}

// Both hand-in folders must be present. Fail loudly, naming the missing
// one, instead of staging a half-empty output directory.
for (const dir of ['app', 'screenshots']) {
  if (!existsSync(join(repoRoot, dir))) {
    throw new Error(`NusaStats hand-in is missing its ${dir}/ directory in ${repoRoot}`);
  }
}

// Start from an empty output directory so a stale file from an earlier run
// can never leak into the hand-in, then stage the two hand-in folders.
rmSync(outputDir, { recursive: true, force: true });
mkdirSync(outputDir, { recursive: true });
copyTreeSorted(join(repoRoot, 'app'), join(outputDir, 'app'));
copyTreeSorted(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'));

// The dossier is byte for byte what the vendored library writes from the
// staged files, with the scorer's caps applied (see the kit's RULES.txt).
const dossier = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(outputDir, 'dossier.json'), dossier);

// The hand-in is useless without its dossier: confirm the file landed on
// disk and is not empty before declaring success.
const dossierPath = join(outputDir, 'dossier.json');
if (!existsSync(dossierPath) || statSync(dossierPath).size === 0) {
  throw new Error(`dossier.json was not written or is empty at ${dossierPath}`);
}
