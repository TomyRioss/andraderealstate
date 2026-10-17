migrate((app) => {
  app.save(new Collection({
    type: 'base', name: 'uploads', listRule: '', viewRule: '', createRule: '', updateRule: null, deleteRule: null,
    fields: [{ name: 'file', type: 'file', required: true, maxSelect: 1, maxSize: 10485760 }],
  }))
}, (app) => {
  const collection = app.findCollectionByNameOrId('uploads')
  app.delete(collection)
})
