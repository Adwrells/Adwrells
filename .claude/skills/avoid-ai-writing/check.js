#!/usr/bin/env node
// Manual AI-writing audit. Usage: node .claude/skills/avoid-ai-writing/check.js [file]
// Defaults to README.md. Exits 1 if the score crosses the threshold below.

const fs = require('fs');
const path = require('path');
const { analyzeText } = require(path.join(__dirname, 'detector', 'patterns.js'));

const THRESHOLD = 10; // score above this fails; current baseline is 1
const file = process.argv[2] || 'README.md';

if (!fs.existsSync(file)) {
  console.error(`not found: ${file}`);
  process.exit(2);
}

const r = analyzeText(fs.readFileSync(file, 'utf8'));

console.log(`\n  ${file}`);
console.log(`  score ${r.score}/100  ${r.label}  [${r.document_classification}]`);
console.log(`  ${r.stats.wordCount} words, tier1 ${r.stats.tier1Count}, tier2 ${r.stats.tier2Count}, tier3 ${r.stats.tier3Count}\n`);

if (!r.issues.length) {
  console.log('  no issues flagged\n');
} else {
  for (const i of r.issues) {
    console.log(`  [${(i.severity || '').padEnd(6)}] ${(i.type || '').padEnd(12)} ${String(i.text || '').slice(0, 90)}`);
  }
  console.log('');
}

// Known-benign on the profile README: bold count is structural "**Repo:**" labels,
// low-ttr is an artifact of ~50 repeated shields.io badge URLs. See CLAUDE.md.
process.exit(r.score > THRESHOLD ? 1 : 0);
