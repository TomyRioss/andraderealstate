const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const ts = require('typescript');

const root = process.cwd();

function propertyName(name) {
  return ts.isIdentifier(name) || ts.isStringLiteral(name) ? name.text : undefined;
}

function findProperty(node, expectedName) {
  if (ts.isPropertyAssignment(node) && propertyName(node.name) === expectedName) {
    return node;
  }

  let found;
  ts.forEachChild(node, (child) => {
    found ??= findProperty(child, expectedName);
  });
  return found;
}

function readPatterns() {
  const filename = path.join(root, 'next.config.ts');
  const source = ts.createSourceFile(
    filename,
    fs.readFileSync(filename, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  const localPatterns = findProperty(source, 'localPatterns')?.initializer;
  assert.ok(ts.isArrayLiteralExpression(localPatterns), 'images.localPatterns must be an array');

  return localPatterns.elements.map((element) => {
    assert.ok(ts.isObjectLiteralExpression(element), 'each local pattern must be an object');
    const pattern = {};
    for (const property of element.properties) {
      if (!ts.isPropertyAssignment(property)) continue;
      const name = propertyName(property.name);
      if (name && ts.isStringLiteral(property.initializer)) {
        pattern[name] = property.initializer.text;
      }
    }
    return pattern;
  });
}

function sourceFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(filename);
    return /\.(tsx?|jsx?)$/.test(entry.name) ? [filename] : [];
  });
}

function localImageSources() {
  const sources = [];
  for (const directory of ['app', 'components']) {
    for (const filename of sourceFiles(path.join(root, directory))) {
      const source = ts.createSourceFile(
        filename,
        fs.readFileSync(filename, 'utf8'),
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TSX,
      );
      const visit = (node) => {
        if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
          if (node.tagName.getText(source) === 'Image') {
            for (const attribute of node.attributes.properties) {
              if (
                ts.isJsxAttribute(attribute) &&
                propertyName(attribute.name) === 'src' &&
                attribute.initializer &&
                ts.isStringLiteral(attribute.initializer) &&
                attribute.initializer.text.startsWith('/') &&
                !attribute.initializer.text.startsWith('//')
              ) {
                sources.push(attribute.initializer.text);
              }
            }
          }
        }
        ts.forEachChild(node, visit);
      };
      visit(source);
    }
  }
  return sources;
}

function matches(pattern, source) {
  const url = new URL(source, 'http://local');
  const escaped = pattern.pathname
    .replace(/[|\\{}()[\]^$+?.]/g, '\\$&')
    .replace(/\*\*/g, '\u0000')
    .replace(/\*/g, '[^/]*')
    .replace(/\u0000/g, '.*');
  return (
    new RegExp(`^${escaped}$`).test(url.pathname) &&
    (pattern.search === undefined || pattern.search === url.search)
  );
}

test('V14: every static local next/image source matches images.localPatterns', () => {
  const patterns = readPatterns();
  const sources = localImageSources();
  const uncovered = sources.filter((source) => !patterns.some((pattern) => matches(pattern, source)));

  assert.deepEqual(uncovered, [], `Uncovered local next/image sources: ${uncovered.join(', ')}`);
});
