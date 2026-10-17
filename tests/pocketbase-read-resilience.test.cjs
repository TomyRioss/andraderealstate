const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const ts = require('typescript');

function loadReadService(mockPocketBase) {
  delete globalThis.__andradePocketBaseReads;
  const filename = path.join(process.cwd(), 'lib', 'pocketbase-data.ts');
  const source = fs.readFileSync(filename, 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  const testModule = { exports: {} };
  const testRequire = (specifier) =>
    specifier === '@/lib/pocketbase' ? { pb: mockPocketBase } : require(specifier);

  new Function('require', 'module', 'exports', compiled)(testRequire, testModule, testModule.exports);
  return testModule.exports;
}

test('PocketBase reads retry transient network errors and serve the last good snapshot', async () => {
  let unavailable = false;
  let attempts = 0;
  const readService = loadReadService({
    collection: () => ({
      getFullList: async () => {
        attempts++;
        if (unavailable) throw { status: 0, originalError: { cause: { code: 'ECONNABORTED' } } };
        return [{ id: 'p1', title: 'Casa', collectionId: 'private', collectionName: 'properties' }];
      },
    }),
  });

  assert.deepEqual(await readService.readPocketBaseCollection('properties'), [
    { id: 'p1', title: 'Casa', collectionId: 'private', collectionName: 'properties' },
  ]);
  unavailable = true;
  const originalError = console.error;
  console.error = () => {};
  try {
    assert.deepEqual(await readService.readPocketBaseCollection('properties'), [
      { id: 'p1', title: 'Casa', collectionId: 'private', collectionName: 'properties' },
    ]);
  } finally {
    console.error = originalError;
  }

  assert.equal(attempts, 4);
});

test('PocketBase cold-start network failure returns an empty read result instead of throwing', async () => {
  let attempts = 0;
  const readService = loadReadService({
    collection: () => ({
      getFullList: async () => {
        attempts++;
        throw { status: 0, originalError: { cause: { code: 'ECONNABORTED' } } };
      },
    }),
  });

  const originalError = console.error;
  console.error = () => {};
  try {
    assert.deepEqual(await readService.readPocketBaseCollection('properties'), []);
  } finally {
    console.error = originalError;
  }

  assert.equal(attempts, 3);
});
