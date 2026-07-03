/**
 * Post-build script for Read the Docs compatibility.
 * Rewrites absolute asset paths (/_next/) to include the
 * Read the Docs version/language subpath prefix.
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, statSync, mkdirSync } from 'fs';
import { join, resolve } from 'path';

const outDir = resolve('out');
const outputDir = resolve('_readthedocs/html');

// Read the Docs provides these environment variables
const lang = process.env.READTHEDOCS_LANGUAGE || 'en';
const version = process.env.READTHEDOCS_VERSION || 'latest';
const prefix = `/${lang}/${version}`;

function getAllFiles(dir) {
  const files = [];
  try {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      if (statSync(fullPath).isDirectory()) {
        files.push(...getAllFiles(fullPath));
      } else {
        files.push(fullPath);
      }
    }
  } catch {}
  return files;
}

function fixHtmlFiles() {
  const htmlFiles = getAllFiles(outDir).filter(f => f.endsWith('.html'));
  let count = 0;

  for (const file of htmlFiles) {
    let content = readFileSync(file, 'utf-8');
    // Replace absolute /_next/ paths with version-prefixed paths
    const updated = content.replace(/\/_next\//g, `${prefix}/_next/`);
    if (updated !== content) {
      writeFileSync(file, updated, 'utf-8');
      count++;
    }
  }

  console.log(`Fixed ${count} HTML files`);
}

function copyToOutput() {
  if (!existsSync(outDir)) {
    console.error('Build output "out/" not found. Run `next build` first.');
    process.exit(1);
  }

  // Create output directory
  mkdirSync(outputDir, { recursive: true });

  // Copy all files from out/ to output
  const files = getAllFiles(outDir);
  for (const file of files) {
    const relativePath = file.replace(outDir, '').replace(/^[\\/]/, '');
    const destPath = join(outputDir, relativePath);
    mkdirSync(destPath.replace(/[^\\/]+$/, ''), { recursive: true });
    writeFileSync(destPath, readFileSync(file));
  }

  console.log(`Copied ${files.length} files to ${outputDir}`);
}

console.log(`Read the Docs prefix: ${prefix}`);
fixHtmlFiles();
copyToOutput();
console.log('Done!');
