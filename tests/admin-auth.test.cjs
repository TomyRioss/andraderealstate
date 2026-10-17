const assert = require('node:assert/strict')
const fs = require('node:fs')
const test = require('node:test')
const ts = require('typescript')

function loadClient() {
  let requests = 0
  const client = {
    authStore: { isValid: false },
    autoCancellation() {},
    collection(name) {
      assert.equal(name, '_superusers')
      return {
        async authWithPassword(email, password) {
          assert.equal(email, 'server@example.com')
          assert.equal(password, 'private-test-password')
          requests++
          await new Promise(resolve => setImmediate(resolve))
          client.authStore.isValid = true
        },
      }
    },
  }
  const compiled = ts.transpileModule(fs.readFileSync('lib/pocketbase-admin.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText
  const module = { exports: {} }
  const env = {
    POCKETBASE_SUPERUSER_EMAIL: 'server@example.com',
    POCKETBASE_SUPERUSER_PASSWORD: 'private-test-password',
  }
  new Function('require', 'module', 'exports', 'process', compiled)(
    name => name === 'server-only' ? {} : { default: function () { return client } },
    module, module.exports, { env },
  )
  return { ...module.exports, client, env, requests: () => requests }
}

test('V18 private login client authenticates once for concurrent requests and renews expired auth', async () => {
  const service = loadClient()
  const clients = await Promise.all([service.getAdminPocketBase(), service.getAdminPocketBase()])
  assert.equal(clients[0], service.client)
  assert.equal(clients[1], service.client)
  assert.equal(service.requests(), 1)
  await service.getAdminPocketBase()
  assert.equal(service.requests(), 1)
  service.client.authStore.isValid = false
  await service.getAdminPocketBase()
  assert.equal(service.requests(), 2)
})

test('V18 missing private credentials fail closed', async () => {
  const service = loadClient()
  delete service.env.POCKETBASE_SUPERUSER_PASSWORD
  await assert.rejects(service.getAdminPocketBase(), /Missing PocketBase server credentials/)
  assert.equal(service.requests(), 0)
})
