# SPEC — Andrade Real Estate

## §G Goal

Build real estate web app for MX market: public catalog+detail+contact, admin CRUD panel, Supabase auth+storage, SEO/GEO optimized. Deploy Vercel in 8 days.

---

## §C Constraints

- C1. Stack locked: Next.js 16 · React 19 · Tailwind v4 · TypeScript · Supabase · Prisma ORM
- C2. Tailwind v4 — no `tailwind.config.js`, tokens via `@theme {}` in CSS
- C3. No raw CSS — Tailwind only, never touch `globals.css` for custom styles (use `@theme` block)
- C4. shadcn/ui for all pre-built components
- C5. Max 500 lines per component file — split if exceeded
- C6. MVC pattern, modular components
- C7. Mobile-first responsive — test at 375 · 768 · 1024 · 1280px
- C8. All errors: console log + visual UX feedback (toast/banner)
- C9. No DB change without explicit user consent
- C10. Prices stored MXN, conversion frontend-only (Context or Zustand, not persisted)
- C11. Images via `next/image` with `fill` + `sizes` + WebP
- C12. Font: Poppins via `next/font/google`
- C13. Palette: `--primary #1e3a5f` · `--accent #10b981` · `--light #f8f9ff` · `--dark #0f172a`
- C14. Never use SVG unless explicitly requested

---

## §I Interfaces

- I.api.properties — `GET/POST /api/properties` · `GET/PUT/DELETE /api/properties/[id]`
- I.api.contact — `POST /api/contact`
- I.api.testimonials — `GET/POST /api/testimonials` · `PUT/DELETE /api/testimonials/[id]`
- I.supabase.auth — Supabase Auth email+password (admin only, no public register)
- I.supabase.storage — bucket `property-images` (public) · `contact-uploads` (private)
- I.prisma — models: Property · ContactForm · Testimonial + enums
- I.middleware — protects `/admin/*` except `/admin/login`
- I.sitemap — `app/sitemap.ts` dynamic, all active properties
- I.env — `NEXT_PUBLIC_SUPABASE_URL` · `NEXT_PUBLIC_SUPABASE_ANON_KEY` · `SUPABASE_SERVICE_ROLE_KEY` · `DATABASE_URL` · `DIRECT_URL` · `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` · `NEXT_PUBLIC_SITE_URL` · `NEXT_PUBLIC_DEFAULT_WHATSAPP`

---

## §V Invariants

- V1. Every API route that mutates data checks admin session before executing
- V2. `DATABASE_URL` uses pgbouncer pooler (port 6543); `DIRECT_URL` used only for migrations
- V3. Prisma singleton in `lib/prisma.ts` — one instance per process
- V4. Slug auto-generated from title on create, editable by admin, unique
- V5. Price always stored in MXN; USD conversion never persisted
- V6. Property map renders only when `lat` AND `lng` are non-null
- V7. Video component detects domain: YouTube → `<iframe>`, other → `<video>`
- V8. Contact-uploads bucket inaccessible publicly — only via service_role
- V9. Testimonials visible publicly only when `status = APPROVED`
- V10. Landing uses ISR `revalidate: 3600`; catalog uses Server Components with `searchParams`
- V11. WhatsApp link falls back to `NEXT_PUBLIC_DEFAULT_WHATSAPP` if property has no `whatsapp`
- V12. File upload: max 10 files · max 5MB each · bucket `contact-uploads`
- V13. Admin users created only via Supabase dashboard — no public signup route exists

---

## §T Tasks

| id  | status | task | cites |
|-----|--------|------|-------|
| T1  | x      | Setup: ESLint, Prettier, tsconfig strict | C1 |
| T2  | x      | Create full folder structure per plan | C6 |
| T3  | x      | Add Poppins font via next/font/google | C12 |
| T4  | x      | Configure Tailwind v4 @theme tokens (colors, radius, shadows) | C2,C13 |
| T5  | x      | Install shadcn/ui + configure | C4 |
| T6  | x      | Write Prisma schema (Property, ContactForm, Testimonial + enums) | I.prisma,V2 |
| T7  | x      | lib/prisma.ts singleton | V3 |
| T8  | x      | lib/supabase/client.ts + server.ts | I.supabase.auth |
| T9  | x      | lib/currency.ts formatPrice MXN/USD | V5 |
| T10 | x      | lib/whatsapp.ts buildWhatsappLink | V11 |
| T11 | x      | lib/validations/ Zod schemas (property, contact, testimonial) | C8 |
| T12 | x      | types/index.ts — shared TS types | C1 |
| T13 | x      | middleware.ts — Supabase session guard /admin/* | I.middleware,V1,V13 |
| T14 | x      | API: GET/POST /api/properties with filters+pagination | I.api.properties,V1 |
| T15 | x      | API: GET/PUT/DELETE /api/properties/[id] | I.api.properties,V1 |
| T16 | x      | API: POST /api/contact | I.api.contact |
| T17 | x      | API: GET/POST /api/testimonials | I.api.testimonials,V9 |
| T18 | x      | API: PUT/DELETE /api/testimonials/[id] | I.api.testimonials,V1 |
| T19 | x      | Landing page: TopBar + Header sticky + Hero | V10,C7,C13 |
| T20 | x      | Landing: featured properties grids (SALE, RENT, DEVELOPMENT) | V10,I.api.properties |
| T21 | x      | Landing: testimonials carousel (APPROVED only) | V9,V10 |
| T22 | x      | Landing: quick contact form (Comprar/Vender toggle) | I.api.contact |
| T23 | x      | Landing: Footer | C7 |
| T24 | x      | Landing: JSON-LD RealEstateAgent schema | — |
| T25 | x      | Catalog /propiedades: Server Component + searchParams filters | V10,I.api.properties,C7 |
| T26 | x      | Catalog: sidebar filters (contractType, category, city, price, bedrooms) | C7 |
| T27 | x      | Catalog: search debounce 300ms + URL-reflected filters | C7 |
| T28 | x      | Catalog: pagination 12/page | I.api.properties |
| T29 | x      | Detail /propiedades/[id]: photo gallery + lightbox | C11 |
| T30 | x      | Detail: video player (YouTube iframe vs <video> detect) | V7 |
| T31 | x      | Detail: map embed (Google Maps) conditional on lat/lng | V6 |
| T32 | x      | Detail: features grid + amenities list | — |
| T33 | x      | Detail: sticky WhatsApp button mobile + lateral contact form desktop | V11,C7 |
| T34 | x      | Detail: review form (name, text, 1-5 stars) | I.api.testimonials |
| T35 | x      | Detail: generateMetadata + JSON-LD RealEstateListing | — |
| T36 | x      | Contact page /contacto: BUY form | I.api.contact,C8 |
| T37 | x      | Contact page: SELL form with multi-file upload to contact-uploads | V8,V12,I.supabase.storage |
| T38 | x      | Admin login /admin/login: Supabase Auth email+password | I.supabase.auth,V13 |
| T39 | x      | Admin dashboard: 4 metric cards | I.api.properties |
| T40 | x      | Admin properties list: table + inline toggles active/featured | V1,I.api.properties |
| T41 | x      | Admin property form: full CRUD with image upload+reorder | V1,V4,I.supabase.storage |
| T42 | x      | Admin leads list: table + status change + notes + photo modal | V1,I.api.contact |
| T43 | x      | Admin testimonials: table + approve/reject/delete inline | V1,V9 |
| T44 | .      | MXN/USD toggle: Context provider wrapping catalog+detail | V5,C7 |
| T45 | .      | robots.txt — block /admin/*, allow rest | — |
| T46 | .      | sitemap.ts — dynamic, all active properties | I.sitemap |
| T47 | .      | Performance QA: next/image sizes, Poppins font, lazy load catalog | C11,C12 |
| T48 | .      | Responsive QA at 375·768·1024·1280px | C7 |

---

## §B Bugs

| id | date | cause | fix |
|----|------|-------|-----|
