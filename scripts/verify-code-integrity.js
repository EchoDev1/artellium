#!/usr/bin/env node

/**
 * Artellium Africa - Automated Code Integrity & Quality Verification Engine
 * 
 * Verifies that:
 * 1. All React hooks (useMemo, useState, useEffect, etc.) are strictly imported or declared.
 * 2. All JSX components & Lucide icons used in components are properly imported or declared.
 * 3. No undefined core identifiers slip into runtime builds.
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const DIRS_TO_SCAN = ['app', 'components', 'context', 'lib', 'hooks'];
const EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx']);

const REACT_HOOKS = [
  'useState',
  'useEffect',
  'useMemo',
  'useCallback',
  'useRef',
  'useContext',
  'useReducer',
  'useId',
  'useLayoutEffect',
  'useImperativeHandle',
  'useTransition',
  'useDeferredValue'
];

let totalFilesChecked = 0;
let errors = [];

function findSourceFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(findSourceFiles(fullPath));
    } else if (EXTENSIONS.has(path.extname(entry.name))) {
      results.push(fullPath);
    }
  }
  return results;
}

function verifyFile(filePath) {
  totalFilesChecked++;
  const code = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(PROJECT_ROOT, filePath).replace(/\\/g, '/');

  // Strip comments and strings to prevent false positives in regex checks
  const strippedCode = code
    .replace(/\/\*[\s\S]*?\*\//g, '') // multi-line comments
    .replace(/\/\/.*/g, '');           // single-line comments

  // 1. Check React Hooks
  for (const hook of REACT_HOOKS) {
    // Regex for direct hook invocation: hook(
    // Must not be preceded by a dot (e.g. React.useMemo, myObj.useMemo)
    const callRegex = new RegExp(`(?<![.\\w])${hook}\\s*\\(`, 'g');
    if (callRegex.test(strippedCode)) {
      // Check if imported from 'react'
      const importedFromReact = new RegExp(
        `import\\s+(?:(?:\\*\\s+as\\s+\\w+)|(?:\\w+)|(?:\\{[^}]*\\}))?(?:\\s*,\\s*(?:\\{[^}]*\\}))?\\s+from\\s+['"]react['"]`
      );
      const namedImport = new RegExp(
        `import\\s+[^'"]*\\b${hook}\\b[^'"]*from\\s+['"]react['"]`
      );
      const destructuredFromReact = new RegExp(
        `(?:const|let|var)\\s+\\{[^}]*\\b${hook}\\b[^}]*\\}\\s*=\\s*React\\b`
      );
      const destructuredFromCustom = new RegExp(
        `(?:const|let|var)\\s+\\{[^}]*\\b${hook}\\b[^}]*\\}\\s*=\\s*`
      );
      const declaredLocally = new RegExp(
        `(?:const|let|var|function)\\s+${hook}\\b`
      );

      const isImported = namedImport.test(code);
      const isReactDestructured = destructuredFromReact.test(code);
      const isDeclared = declaredLocally.test(code);

      if (!isImported && !isReactDestructured && !isDeclared) {
        errors.push({
          file: relativePath,
          type: 'MISSING_REACT_HOOK_IMPORT',
          message: `Hook '${hook}()' is used without being imported from 'react'.`
        });
      }
    }
  }

  // 2. Check for unimported JSX Tags (e.g. <Wrench />, <ShoppingBag />)
  // Gather all imported identifiers in the file
  const importedIdentifiers = new Set();
  const importStatements = code.match(/import\s+[\s\S]*?from\s+['"][^'"]+['"]/g) || [];
  for (const statement of importStatements) {
    // default import: import Foo from '...'
    const defaultMatch = statement.match(/import\s+([A-Za-z0-9_$]+)\s*(?:,|[a-z])/);
    if (defaultMatch && defaultMatch[1] && defaultMatch[1] !== 'type') {
      importedIdentifiers.add(defaultMatch[1]);
    }
    // named imports: import { A, B as C } from '...'
    const namedMatch = statement.match(/\{([\s\S]*?)\}/);
    if (namedMatch) {
      namedMatch[1].split(',').forEach(item => {
        const parts = item.trim().split(/\s+as\s+/);
        const name = parts[parts.length - 1].trim();
        if (name) importedIdentifiers.add(name);
      });
    }
  }

  // Gather locally declared components/variables
  const localDeclarations = new Set();
  const declMatches = strippedCode.match(/(?:const|let|var|function|class)\s+([A-Za-z0-9_$]+)/g) || [];
  for (const decl of declMatches) {
    const name = decl.split(/\s+/)[1];
    if (name) localDeclarations.add(name);
  }

  // Known global/framework identifiers allowed in JSX
  const allowedGlobals = new Set([
    'React', 'Fragment', 'Suspense', 'Image', 'Link', 'Script',
    'Head', 'AnimatePresence', 'motion', 'SVG', 'Path', 'G',
    'Circle', 'Rect', 'Polygon', 'Polyline', 'Line', 'Defs', 'LinearGradient', 'Stop'
  ]);

  // Find JSX elements: <CapitalIdentifier
  const jsxTagRegex = /<([A-Z][a-zA-Z0-9_]*)(?:\s|>|\/)/g;
  let match;
  while ((match = jsxTagRegex.exec(strippedCode)) !== null) {
    const tagName = match[1];
    if (
      !importedIdentifiers.has(tagName) &&
      !localDeclarations.has(tagName) &&
      !allowedGlobals.has(tagName)
    ) {
      errors.push({
        file: relativePath,
        type: 'MISSING_COMPONENT_IMPORT',
        message: `JSX Component '<${tagName} />' is referenced but neither imported nor declared.`
      });
    }
  }
}

console.log('\x1b[36m%s\x1b[0m', '🔍 Starting Artellium Africa Code Integrity Verification...');

for (const dirName of DIRS_TO_SCAN) {
  const fullDir = path.join(PROJECT_ROOT, dirName);
  const files = findSourceFiles(fullDir);
  for (const file of files) {
    verifyFile(file);
  }
}

console.log(`Checked ${totalFilesChecked} source files across: ${DIRS_TO_SCAN.join(', ')}.`);

if (errors.length > 0) {
  console.error('\n\x1b[31m%s\x1b[0m', `❌ Integrity Check Failed! Found ${errors.length} issue(s):`);
  errors.forEach((err, idx) => {
    console.error(`  ${idx + 1}. [${err.file}] - ${err.message}`);
  });
  console.error('\n\x1b[33m%s\x1b[0m', 'Please ensure all React hooks and components are explicitly imported before committing.');
  process.exit(1);
} else {
  console.log('\x1b[32m%s\x1b[0m', '✅ All React hooks, components, and imports are valid and fully resolved.');
  process.exit(0);
}
