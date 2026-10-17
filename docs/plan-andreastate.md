# Plan de acción — Andrade Real Estate
**Stack:** Next.js 16 · React 19 · Tailwind v4 · TypeScript · PocketBase · NextAuth
**Deadline:** 8 días · Mercado objetivo: México (versátil para LATAM)

---

## Identidad visual

Extraída del archivo de referencia proporcionado. No inventar ni sustituir.

| Token | Valor |
|---|---|
| `--primary` | `#1e3a5f` (azul marino profundo) |
| `--primary-dark` | `#0f4c5c` |
| `--dark` | `#0f172a` |
| `--light` | `#f8f9ff` |
| `--accent` | `#10b981` (verde esmeralda, CTAs secundarios) |
| Tipografía | **Poppins** 400 / 500 / 600 / 700 |
| Radio de borde | `50px` pills en top-bar · `12–16px` cards |
| Sombras | Suaves, sin agresividad (`0 10px 30px rgba(0,0,0,0.1)`) |

**Criterio de diseño:** profesional y sobrio como Tecnocasa MX — navegación clara, jerarquía visual limpia, sin efectos que distraigan. El usuario debe sentir autoridad y confianza desde el primer scroll, no entretenimiento.

---

## Estructura de carpetas

```
andrade_realstate/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                    # Landing
│   │   ├── propiedades/
│   │   │   ├── page.tsx                # Catálogo
│   │   │   └── [id]/page.tsx           # Detalle
│   │   ├── contacto/page.tsx           # Formulario compra/venta
│   │   └── testimonios/page.tsx        # Opcional: página completa
│   ├── admin/
│   │   ├── login/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── propiedades/
│   │   │   ├── page.tsx                # Listado
│   │   │   └── [id]/page.tsx           # Editar
│   │   ├── leads/page.tsx
│   │   └── testimonios/page.tsx
│   ├── api/
│   │   ├── properties/
│   │   │   ├── route.ts                # GET (catálogo) · POST
│   │   │   └── [id]/route.ts           # GET · PUT · DELETE
│   │   ├── contact/route.ts
│   │   └── testimonials/
│   │       ├── route.ts                # GET público (aprobados) · POST (usuario)
│   │       └── [id]/route.ts           # PUT · DELETE (admin)
│   └── sitemap.ts                      # Sitemap dinámico
├── components/
│   ├── ui/                             # Button, Input, Badge, Modal, etc.
│   ├── properties/                     # PropertyCard, PropertyGrid, Filters, Gallery, Map
│   ├── testimonials/                   # TestimonialCard, StarRating, TestimonialForm
│   └── admin/                          # DataTable, ImageUploader, StatusBadge
├── lib/
│   ├── pocketbase.ts + pocketbase-data.ts  # Client and resilient reads
│   ├── supabase/
│   │   ├── client.ts                   # Browser client (auth + storage uploads)
│   │   └── server.ts                   # Server client (SSR, Route Handlers)
│   ├── currency.ts                     # Formateo MXN/USD + toggle
│   ├── whatsapp.ts                     # Generador de links wa.me
│   └── validations/                    # Schemas Zod reutilizables
├── types/index.ts
├── middleware.ts                        # Protección rutas /admin/*
├── PocketBase collections (managed in PocketBase)
└── public/
    ├── logo.svg                         # Provisto por el cliente
    └── og-image.jpg
```

---

## Variables de entorno

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# PocketBase
POCKETBASE_URL=
NEXT_PUBLIC_POCKETBASE_URL=

# Mapas
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
# — o bien Mapbox (sin costo hasta 50k cargas/mes) —
NEXT_PUBLIC_MAPBOX_TOKEN=

# App
NEXT_PUBLIC_SITE_URL=https://andraderealestate.com
NEXT_PUBLIC_DEFAULT_WHATSAPP=521XXXXXXXXXX   # fallback si propiedad no tiene número propio
```


---

## PocketBase collections

properties, contact_forms, testimonials, admins, and uploads are managed in PocketBase. App access goes through lib/pocketbase.ts and lib/pocketbase-data.ts.

---

## Fase 0 — Setup

- [ ] Configurar `ESLint`, `Prettier`, `tsconfig.json` estricto
- [ ] Crear estructura de carpetas completa
- [ ] Crear proyecto en Supabase, obtener credenciales
- [ ] Configure .env.local with the PocketBase URL
- [ ] Configure the PocketBase collections and fields
- [ ] Verificar tablas en Supabase Dashboard
- [ ] Crear buckets en Supabase Storage:
  - `property-images` — público (las fotos se sirven directamente)
  - `contact-uploads` — privado (fotos del formulario de venta, solo admins)
- [ ] Configurar políticas RLS en Supabase Storage:
  - `property-images`: lectura pública, escritura solo con `service_role`
  - `contact-uploads`: lectura y escritura solo con `service_role`
- [ ] Crear los primeros usuarios admin en Supabase Auth (invitación por email)

### PocketBase client

lib/pocketbase.ts configures the SDK; lib/pocketbase-data.ts provides retry, timeout, and stale-read fallback.

## Fase 1 — API base · Día 2–3

### Route Handlers

| Endpoint | Método | Auth | Descripción |
|---|---|---|---|
| `/api/properties` | GET | — | Catálogo con filtros y paginación |
| `/api/properties` | POST | Admin | Crear propiedad |
| `/api/properties/[id]` | GET | — | Detalle de propiedad |
| `/api/properties/[id]` | PUT | Admin | Editar propiedad |
| `/api/properties/[id]` | DELETE | Admin | Eliminar propiedad |
| `/api/contact` | POST | — | Guardar lead |
| `/api/testimonials` | GET | — | Solo aprobados (públicos) |
| `/api/testimonials` | POST | — | Crear testimonio (queda en PENDING) |
| `/api/testimonials/[id]` | PUT | Admin | Cambiar status (aprobar/rechazar) |
| `/api/testimonials/[id]` | DELETE | Admin | Eliminar |

### Parámetros de filtro para GET /api/properties

```
?contractType=SALE|RENT|DEVELOPMENT
&category=HOUSE|APARTMENT|...
&search=texto
&city=guadalajara
&minPrice=500000
&maxPrice=3000000
&bedrooms=3
&featured=true
&page=1
&limit=12
```

### Middleware de autenticación

```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next()
  }
  if (request.nextUrl.pathname === '/admin/login') {
    return NextResponse.next()
  }

  // Verificar sesión Supabase
  const supabase = createServerClient(...)
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
```

### Helper de moneda

```typescript
// lib/currency.ts
// El precio se guarda en MXN. La conversión es solo en frontend.
// Usar una tasa fija actualizable o una API como exchangerate-api.com

export type Currency = 'MXN' | 'USD'

export function formatPrice(priceMXN: number, currency: Currency, usdRate = 17.5): string {
  const amount = currency === 'USD' ? priceMXN / usdRate : priceMXN
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}
```

> ⚠️ El toggle MXN/USD es estado global del cliente (Context o Zustand). No guardar en DB. La tasa de conversión puede ser hardcodeada inicialmente y actualizarse manualmente en `.env` o desde el panel admin en una iteración posterior.

### Helper de WhatsApp

```typescript
// lib/whatsapp.ts
export function buildWhatsappLink(phone: string, propertyTitle: string, propertyUrl: string): string {
  const message = encodeURIComponent(
    `Hola, me interesa la propiedad "${propertyTitle}". Puedes ver más detalles aquí: ${propertyUrl}`
  )
  const clean = phone.replace(/\D/g, '')
  return `https://wa.me/${clean}?text=${message}`
}
```

---

## Fase 2 — Landing page + catálogo público · Día 3–5

### Landing page (/)

Estructura de secciones en orden:

1. **Top bar** — teléfono, email, redes sociales (igual que referencia visual)
2. **Header sticky** — logo + navegación + toggle MXN/USD
3. **Hero** — headline, buscador rápido (nombre o ciudad), CTA principal
4. **Propiedades destacadas en venta** — grid 3 cols, `featured=true AND contractType=SALE`
5. **Propiedades en renta** — grid 3 cols, `featured=true AND contractType=RENT`
6. **Desarrollos** — grid o cards especiales, `contractType=DEVELOPMENT`
7. **Testimonios** — carrusel, solo `status=APPROVED`, con rating de estrellas
8. **Formulario de contacto rápido** — con selector Comprar / Vender
9. **Footer** — datos de contacto, redes, links

**Estrategia de fetching:** SSR con `revalidate: 3600` en la landing (se actualiza cada hora). Los datos cambian pocas veces por semana — no justifica SSR puro en cada request.

### Catálogo (/propiedades)

- Grid responsivo con paginación (12 por página)
- Sidebar o barra de filtros: tipo de contrato, categoría, ciudad, rango de precio, habitaciones
- Buscador por nombre con debounce de 300ms
- El catálogo es **Server Component** que recibe los filtros como `searchParams`
- URL refleja los filtros activos: `/propiedades?contractType=SALE&city=guadalajara&minPrice=1000000`
- Toggle MXN/USD persistente en la sesión (Context en client component wrapper)

### Detalle de propiedad (/propiedades/[id])

- Galería de fotos con lightbox
- Reproductor de video si existe `videoUrl`
- Mapa embebido (Google Maps o Mapbox) con pin en coordenadas de la propiedad
- Características en grid: m², habitaciones, baños, estacionamientos, año
- Lista de amenities con íconos
- Botón WhatsApp fijo en mobile (sticky bottom)
- Formulario de contacto lateral en desktop
- Sección de calificación y dejar reseña (solo nombre, texto, 1–5 estrellas)

### Formulario de contacto (/contacto)

**Comprar:**
```
- Teléfono (requerido)
- Email (requerido)
- Mensaje opcional
```

**Vender:**
```
- Nombre (requerido)
- Teléfono (requerido)
- Email (requerido)
- Dirección del inmueble (requerido)
- Fotos del inmueble (upload múltiple, máx 10 archivos, 5MB c/u)
- Mensaje opcional
```

Las fotos del formulario de venta se suben directamente al bucket `contact-uploads` desde el browser usando el cliente de Supabase con la clave `anon` y políticas RLS que solo permiten inserción autenticada mediante token temporal. El Route Handler solo guarda las URLs resultantes en la DB.

---

## Fase 3 — Panel de administración · Día 5–7

### Autenticación (/admin/login)

- Login con Supabase Auth (email + password)
- Sin registro público — los admins se crean desde el dashboard de Supabase
- Logout limpia la sesión de Supabase

### Dashboard (/admin/dashboard)

M�tricas en tarjetas:
- Total propiedades activas
- Leads pendientes de contactar
- Testimonios en espera de moderación
- Propiedades agregadas este mes

### Gestión de propiedades (/admin/propiedades)

- Tabla con: título, ciudad, tipo, precio MXN, estado (activa/inactiva/destacada), fecha
- Toggle activo/inactivo y toggle destacada inline (sin abrir formulario)
- Filtros: estado, tipo de contrato, categoría
- Botón "Nueva propiedad" → formulario completo en página separada `/admin/propiedades/nueva`
- Editar → `/admin/propiedades/[id]`
- Eliminar con confirmación modal

**Formulario de propiedad (campos completos):**
```
Información básica:  título, descripción, slug (auto-generado desde título, editable)
Clasificación:       tipo de contrato, categoría
Precio:              precio MXN, visible/oculto al público
Ubicación:           dirección, ciudad, estado, CP, latitud, longitud
                     → botón "Obtener coordenadas" via geocoding de Google Maps
Características:     m² construidos, m² terreno, habitaciones, baños, medios baños,
                     estacionamientos, pisos, año de construcción
Amenities:           checkboxes predefinidos + campo libre para agregar
Fotos:               upload múltiple → Supabase Storage, preview con reordenamiento drag
Video:               URL de video (YouTube o directo)
WhatsApp:            número específico de esta propiedad
Estado:              activa, destacada
```

### Gestión de leads (/admin/leads)

- Tabla: nombre, tipo (compra/venta), email, teléfono, fecha, status
- Cambiar status: Pendiente → Contactado → Cerrado / Descartado
- Campo de notas internas por lead
- Para leads de venta: ver fotos adjuntas en modal
- Filtros: tipo, status, rango de fechas

### Gestión de testimonios (/admin/testimonios)

- Tabla: autor, ubicación, rating (estrellas), fecha, status (Pendiente / Aprobado / Rechazado)
- Botones inline: Aprobar · Rechazar · Editar · Eliminar
- Vista previa del texto del testimonio
- Solo los `APPROVED` aparecen en el sitio público

---

## Fase 4 — SEO, GEO y entrega · Día 7–8

### SEO técnico con Next.js Metadata API

```typescript
// app/(public)/propiedades/[id]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const property = await getProperty(params.id)
  return {
    title: `${property.title} | Andrade Real Estate`,
    description: property.description.slice(0, 160),
    openGraph: {
      title: property.title,
      description: property.description.slice(0, 160),
      images: [property.photos[0]],
      type: 'website',
    },
  }
}
```

- `robots.txt`: indexar todo excepto `/admin/*`
- `sitemap.ts`: generación dinámica, incluir todas las propiedades activas con `lastModified`
- Canonical URLs en todas las páginas

### GEO — Generative Engine Optimization

JSON-LD en detalle de propiedad:

```typescript
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateListing',
  name: property.title,
  description: property.description,
  url: `${process.env.NEXT_PUBLIC_SITE_URL}/propiedades/${property.id}`,
  image: property.photos,
  address: {
    '@type': 'PostalAddress',
    streetAddress: property.address,
    addressLocality: property.city,
    addressRegion: property.state,
    postalCode: property.zipCode,
    addressCountry: 'MX',
  },
  offers: property.priceVisible ? {
    '@type': 'Offer',
    price: property.priceMXN,
    priceCurrency: 'MXN',
  } : undefined,
  numberOfRooms: property.bedrooms,
  floorSize: property.areaSqm ? {
    '@type': 'QuantitativeValue',
    value: property.areaSqm,
    unitCode: 'MTK',
  } : undefined,
}
```

JSON-LD en landing:

```typescript
{
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  name: 'Andrade Real Estate',
  url: process.env.NEXT_PUBLIC_SITE_URL,
  logo: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.svg`,
  address: { '@type': 'PostalAddress', addressCountry: 'MX' },
  sameAs: ['https://facebook.com/...', 'https://instagram.com/...'],
}
```

### Performance y responsivo

- Todas las imágenes con `next/image`: `fill` + `sizes` correctos + WebP automático
- Fuente Poppins cargada con `next/font/google` (evita FOUT, mejora CWV)
- QA en breakpoints: 375px · 768px · 1024px · 1280px
- Lazy loading en el grid del catálogo fuera del viewport inicial

### Deploy en Vercel

- [ ] Conectar repositorio a Vercel
- [ ] Configurar todas las variables de entorno de producción
- [ ] Verificar que el build TypeScript pasa sin errores (`tsc --noEmit`)
- [ ] Agregar dominio del cliente en Vercel (el cliente ya lo tiene, solo apuntar DNS)
- [ ] Testing manual de flujos críticos:
  - [ ] Formulario de contacto compra y venta (incluyendo upload de fotos)
  - [ ] Login admin + CRUD completo de propiedad con fotos
  - [ ] Moderación de testimonio: pendiente → aprobado → visible en landing
  - [ ] Toggle MXN/USD en catálogo y detalle
  - [ ] Link de WhatsApp en detalle de propiedad
  - [ ] Mapa en detalle de propiedad
  - [ ] Filtros en catálogo
  - [ ] SEO: verificar meta tags con DevTools y og:image

---

## Decisiones técnicas clave — resumen

| Decisión | Elección | Razón |
|---|---|---|
| Auth de admins | Supabase Auth directo | Sin roles → no justifica otra solución |
| Toggle MXN/USD | Context en frontend | No es dato persistente, es preferencia de sesión |
| Tasa de conversión | `.env` hardcodeada inicialmente | Simple, el cliente puede pedirla dinámica después |
| Imágenes | Supabase Storage | Ya está en el stack, evita agregar S3 o Cloudinary |
| Mapas | Google Maps (preferido) o Mapbox | Google Maps tiene el geocoding más preciso para MX |
| Testimonios | Moderación manual (PENDING → APPROVED) | Evita spam/contenido inadecuado en el sitio público |
| Catálogo | Server Components + `searchParams` | SEO nativo, URLs compartibles con filtros activos |
| Revalidación landing | ISR `revalidate: 3600` | Las props se actualizan pocas veces/semana — no necesita SSR puro |
| Videos | URL externa (YouTube) o Supabase Storage | Flexible: YouTube para embeds, Storage para videos propios |

---

## Notas para Claude Code

- No asumir que Tailwind v4 tiene `tailwind.config.js` — la configuración es via `@theme {}` en CSS. Verificar antes de agregar tokens personalizados.
- El slug de cada propiedad se auto-genera desde el título al crear, pero debe ser editable por el admin para control de URLs.
- Los amenities y características se guardan como `String[]` — esto es intencional para mantener flexibilidad sin bloquear el schema a un enum fijo que el cliente cambiará.
- El video de propiedad puede ser una URL de YouTube (para usar `iframe` embed) o una URL directa de Supabase Storage (para usar `<video>`). Detectar por el dominio en el componente.
- El mapa en el detalle solo renderiza si `lat` y `lng` no son nulos — muchas propiedades pueden cargarse sin coordenadas inicialmente.
