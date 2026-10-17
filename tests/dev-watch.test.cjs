const assert = require('node:assert/strict')
const fs = require('node:fs')
const test = require('node:test')
const ts = require('typescript')

const compiled = ts.transpileModule(fs.readFileSync('next.config.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText
const configModule = { exports: {} }
new Function('module', 'exports', compiled)(configModule, configModule.exports)
const nextConfig = configModule.exports.default

test('V19 dev watcher ignores QA output on Windows and POSIX, preserves source watching and default exclusions', () => {
  const original = /[\\/](?:node_modules|\.git|\.next)(?:[\\/]|$)/
  const config = { watchOptions: { ignored: original, aggregateTimeout: 5 } }
  const result = nextConfig.webpack(config, { dev: true })
  for (const root of ['C:\\project\\', '/project/']) {
    for (const folder of ['.playwright-cli', 'dogfood-output', '.next', '.git', 'node_modules']) {
      assert.equal(result.watchOptions.ignored.test(`${root}${folder}/output.log`), true)
    }
    assert.equal(result.watchOptions.ignored.test(`${root}app/page.tsx`), false)
  }
  assert.equal(result.watchOptions.aggregateTimeout, 5)
})

test('V19 production webpack configuration unchanged', () => {
  const config = { watchOptions: { ignored: /original/ } }
  const before = config.watchOptions
  assert.equal(nextConfig.webpack(config, { dev: false }), config)
  assert.equal(config.watchOptions, before)
})
