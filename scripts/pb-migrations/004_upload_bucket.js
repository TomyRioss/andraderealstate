migrate((app) => {
  const collection = app.findCollectionByNameOrId('uploads')
  collection.fields.add(new SelectField({ name: 'bucket', required: true, maxSelect: 1, values: ['property-images', 'contact-uploads'] }))
  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId('uploads')
  collection.fields.removeByName('bucket')
  return app.save(collection)
})
