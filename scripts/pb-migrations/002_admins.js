migrate((app) => {
  const old = app.findCollectionByNameOrId('admins')
  app.delete(old)
  app.save(new Collection({
    type: 'base', name: 'admins', listRule: null, viewRule: null, createRule: null, updateRule: null, deleteRule: null,
    fields: [
      { name: 'email', type: 'email', required: true },
      { name: 'password', type: 'text', required: true, hidden: true },
      { name: 'name', type: 'text' },
      { name: 'role', type: 'select', required: true, maxSelect: 1, values: ['ADMIN', 'SUPER_ADMIN'] },
      { name: 'createdAt', type: 'date' },
      { name: 'updatedAt', type: 'date' },
    ],
    indexes: ['CREATE UNIQUE INDEX idx_admins_email ON admins (email)'],
  }))
}, (app) => {
  const current = app.findCollectionByNameOrId('admins')
  app.delete(current)
})
