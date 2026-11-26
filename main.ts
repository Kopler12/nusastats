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

import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

// The repository root is the directory holding this file.
const repoRoot = dirname(fileURLToPath(import.meta.url));

// The grader hands us a writable /output; outside it the env var stands in.
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Start from an empty output directory so a stale file from an earlier run
// can never leak into the hand-in, then stage the two hand-in folders.
rmSync(outputDir, { recursive: true, force: true });
mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
}

// The dossier is byte for byte what the vendored library writes from the
// staged files, with the scorer's caps applied (see the kit's RULES.txt).
const dossier = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(outputDir, 'dossier.json'), dossier);
