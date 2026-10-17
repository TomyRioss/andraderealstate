migrate((app) => {
  const properties = app.findCollectionByNameOrId('properties')
  const category = properties.fields.getByName('category')
  if (!category.values.includes('VACATION_STAY')) category.values.push('VACATION_STAY')
  return app.save(properties)
}, (app) => {
  const properties = app.findCollectionByNameOrId('properties')
  const category = properties.fields.getByName('category')
  category.values = category.values.filter((value) => value !== 'VACATION_STAY')
  return app.save(properties)
})
