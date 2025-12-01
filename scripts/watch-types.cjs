/**
 * Watch mode for automatic type generation
 *
 * Watches component files and automatically regenerates types when they change
 * Run: npm run generate:watch
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const COMPONENTS_DIR = path.join(__dirname, '../src/components');

let debounceTimer = null;

function regenerateTypes() {
  try {
    console.log('\n⚡ Regenerating types...');
    execSync('node scripts/generate-types.cjs', { stdio: 'inherit' });
    console.log('✅ Types regenerated successfully\n');
  } catch (error) {
    console.error('❌ Error regenerating types:', error.message);
  }
}

function debouncedRegenerate() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(regenerateTypes, 500);
}

function watchDirectory(dir) {
  fs.watch(dir, { recursive: true }, (eventType, filename) => {
    if (!filename) return;

    // Only regenerate for TypeScript files in component directories
    if (filename.endsWith('.ts') && !filename.endsWith('.test.ts')) {
      console.log(`📝 Changed: ${filename}`);
      debouncedRegenerate();
    }
  });
}

console.log('👀 Watching for component changes...');
console.log(`📂 Watching: ${COMPONENTS_DIR}\n`);

// Initial generation
regenerateTypes();

// Watch for changes
watchDirectory(COMPONENTS_DIR);

// Keep the process running
console.log('Press Ctrl+C to stop watching\n');
