export function buildWhatsappLink(phone: string, propertyTitle: string, propertyUrl: string): string {
  const message = encodeURIComponent(
    `Hola, me interesa la propiedad "${propertyTitle}". Puedes ver más detalles aquí: ${propertyUrl}`
  )
  const clean = phone.replace(/\D/g, '')
  return `https://wa.me/${clean}?text=${message}`
}
