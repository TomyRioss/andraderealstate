'use client'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  name: 'Andrade Real Estate',
  url: process.env.NEXT_PUBLIC_SITE_URL,
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'MX',
  },
}

export default function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
