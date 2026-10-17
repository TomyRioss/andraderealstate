migrate((app) => {
  const base = (name, fields, indexes = []) => new Collection({
    type: 'base', name, listRule: '', viewRule: '', createRule: '', updateRule: '', deleteRule: '', fields, indexes,
  })
  const text = (name, required = false) => ({ name, type: 'text', required })
  const number = (name) => ({ name, type: 'number' })
  const bool = (name, value = false) => ({ name, type: 'bool', required: false, default: value })
  const json = (name) => ({ name, type: 'json' })
  const date = (name) => ({ name, type: 'date' })
  app.save(base('properties', [
    text('title', true), text('slug', true), text('description', true), text('address', true), text('city', true), text('state', true), text('zipCode'), number('lat'), number('lng'),
    { name: 'contractType', type: 'select', required: true, maxSelect: 1, values: ['SALE', 'RENT', 'DEVELOPMENT'] },
    { name: 'category', type: 'select', required: true, maxSelect: 1, values: ['HOUSE', 'APARTMENT', 'LAND', 'COMMERCIAL', 'DEVELOPMENT_PROJECT', 'OTHER'] },
    number('priceMXN'), number('priceUSD'), bool('priceVisible', true), number('bedrooms'), number('bathrooms'), number('halfBaths'), number('parkingSpots'), number('areaSqm'), number('landAreaSqm'), number('floors'), number('yearBuilt'), json('photos'), text('videoUrl'), text('mapsUrl'), text('whatsapp'), json('amenities'), json('features'), bool('active', true), bool('featured'), date('createdAt'), date('updatedAt'),
  ], ['CREATE UNIQUE INDEX idx_properties_slug ON properties (slug)']))
  app.save(base('contact_forms', [
    { name: 'type', type: 'select', required: true, maxSelect: 1, values: ['BUY', 'SELL', 'MANAGE'] }, text('name'), text('phone', true), text('email', true), text('address'), json('photos'),
    { name: 'status', type: 'select', required: true, maxSelect: 1, values: ['PENDING', 'CONTACTED', 'CLOSED', 'DISCARDED'] }, text('notes'), bool('active', true), date('createdAt'), date('updatedAt'),
  ]))
  app.save(base('testimonials', [
    text('author', true), text('location'), number('rating'), text('content', true),
    { name: 'status', type: 'select', required: true, maxSelect: 1, values: ['PENDING', 'APPROVED', 'REJECTED'] }, bool('active', true), date('createdAt'), date('updatedAt'),
  ]))
  app.save(new Collection({
    type: 'auth', name: 'admins', listRule: '', viewRule: '', createRule: '', updateRule: '', deleteRule: '',
    fields: [text('name'), { name: 'role', type: 'select', required: true, maxSelect: 1, values: ['ADMIN', 'SUPER_ADMIN'], hidden: true }],
  }))
}, (app) => {
  for (const name of ['properties', 'contact_forms', 'testimonials', 'admins']) {
    try { const c = app.findCollectionByNameOrId(name); app.delete(c) } catch (_) {}
  }
})
