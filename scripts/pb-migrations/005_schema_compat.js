migrate((app) => {
  const contacts = app.findCollectionByNameOrId('contact_forms')
  contacts.fields.getByName('email').required = false
  app.save(contacts)
  const uploads = app.findCollectionByNameOrId('uploads')
  uploads.fields.getByName('file').maxSize = 20971520
  return app.save(uploads)
}, (app) => {
  const contacts = app.findCollectionByNameOrId('contact_forms')
  contacts.fields.getByName('email').required = true
  app.save(contacts)
  const uploads = app.findCollectionByNameOrId('uploads')
  uploads.fields.getByName('file').maxSize = 10485760
  return app.save(uploads)
})
