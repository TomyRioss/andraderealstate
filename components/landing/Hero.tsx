'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import TextType from '@/components/ui/TextType'

const SEARCH_HINTS = [
  'Casa en Puerto Vallarta',
  'Departamento en Zapopan',
  'Casa en Bahía de Banderas',
]

type HeroProperty = {
  id: string
  title: string
  photos: string[]
  priceMXN: number | null
  city: string
  state: string
  slug: string
}

function formatPrice(priceMXN: number | null): string | null {
  if (priceMXN == null || priceMXN <= 0) return null

  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(priceMXN)
}

export default function Hero({ properties = [] }: { properties?: HeroProperty[] }) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [current, setCurrent] = useState(0)
  const activeIndex = properties.length
    ? ((current % properties.length) + properties.length) % properties.length
    : 0
  const activeProperty = properties[activeIndex]
  const activePhoto = activeProperty?.photos.find((photo) => photo.trim()) ?? null
  const activePrice = formatPrice(activeProperty?.priceMXN ?? null)

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = query.trim()
    router.push(trimmed ? `/propiedades?search=${encodeURIComponent(trimmed)}` : '/propiedades')
  }

  function goTo(index: number) {
    if (properties.length === 0) return

    setCurrent(((index % properties.length) + properties.length) % properties.length)
  }

  return (
    <section className="relative isolate overflow-hidden bg-[#0D1A2D] text-white">
      {activePhoto && (
        <Image
          key={activePhoto}
          src={activePhoto}
          alt=""
          aria-hidden="true"
          fill
          preload
          quality={75}
          sizes="100vw"
          className="object-cover object-[58%_50%]"
        />
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,26,45,0.99)_0%,rgba(13,26,45,0.96)_32%,rgba(13,26,45,0.76)_56%,rgba(13,26,45,0.12)_100%)] max-lg:bg-[linear-gradient(90deg,rgba(13,26,45,0.99)_0%,rgba(13,26,45,0.94)_56%,rgba(13,26,45,0.64)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[42%] bg-[linear-gradient(0deg,rgba(13,26,45,0.82)_0%,rgba(13,26,45,0)_100%)]"
      />

      <div className="relative z-10 flex min-h-[700px] w-full flex-col justify-between gap-12 px-6 pb-16 pt-16 sm:px-10 sm:max-lg:pb-16 sm:pt-20 lg:min-h-[clamp(720px,92svh,900px)] lg:px-[6vw] lg:pb-9 lg:pt-16">
        <div className="w-full max-w-[620px] lg:pt-14">
          <h1 className="font-display text-4xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-5xl md:text-6xl lg:text-[4rem] xl:text-[4.5rem]">
            Atención personal.<br />
            <span className="text-[#B3B3B3]">
              Propiedades<br />
              extraordinarias.
            </span>
            <br />
            Atención personal.
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-[#B3B3B3] md:text-lg">
            Encuentra un hogar a la altura de tu estilo de vida
          </p>

          <form
            onSubmit={handleSearch}
            className="mt-8 flex w-full max-w-[560px] items-center rounded-md border border-[#B3B3B3]/70 bg-white p-1.5 focus-within:outline focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-[#B3B3B3]"
          >
            <label htmlFor="property-search" className="sr-only">
              Buscar por nombre o ciudad
            </label>
            <div className="relative min-w-0 flex-1">
              <input
                id="property-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder="Buscar por nombre o ciudad"
                className="min-w-0 w-full bg-transparent px-4 py-3.5 text-base text-[#0D1A2D] outline-none placeholder:text-transparent focus:placeholder:text-[#0D1A2D]"
              />
              {!query && !isSearchFocused && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-4 right-2 flex items-center overflow-hidden text-base text-[#0D1A2D]"
                >
                  <TextType
                    text={SEARCH_HINTS}
                    typingSpeed={30}
                    pauseDuration={1500}
                    deletingSpeed={20}
                    showCursor
                    cursorCharacter="|"
                    cursorBlinkDuration={0.5}
                    className="tracking-tight"
                  />
                </span>
              )}
            </div>
            <button
              type="submit"
              className="shrink-0 rounded-sm bg-[#0D1A2D] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#B3B3B3] hover:text-[#0D1A2D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D1A2D]"
            >
              Buscar
            </button>
          </form>

          <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3">
            <Link
              href="/propiedades"
              className="inline-flex min-h-11 items-center border border-[#B3B3B3] px-5 text-sm font-medium text-white transition-colors hover:bg-[#B3B3B3] hover:text-[#0D1A2D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B3B3B3]"
            >
              Ver catálogo completo
            </Link>
            <Link
              href="/#contacto"
              className="text-sm font-medium text-[#B3B3B3] underline decoration-[#B3B3B3] underline-offset-4 transition-colors hover:text-white hover:decoration-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B3B3B3]"
            >
              Contáctanos
            </Link>
          </div>
        </div>

        <div className="relative flex w-full max-w-[620px] flex-col gap-4 border-t border-white/35 pt-5 md:flex-row md:items-end md:justify-between lg:absolute lg:bottom-9 lg:left-[6vw] lg:right-[calc(6vw+320px)] lg:w-auto lg:max-w-none lg:border-0 lg:pt-0">
          <div className="min-w-0">
            <p className="mb-2 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-[#B3B3B3]">
              Propiedad destacada
            </p>
            {activeProperty && (
              <p className="mb-1 text-xs font-medium uppercase tracking-[0.14em] text-white/80">
                {activeProperty.city}, {activeProperty.state}
              </p>
            )}
            <h2 className="font-display text-lg font-medium leading-snug sm:text-xl">
              {activeProperty?.title ?? 'Propiedades seleccionadas con criterio.'}
            </h2>
            {activePrice && <p className="mt-1 text-sm font-medium text-[#B3B3B3]">{activePrice}</p>}
          </div>

          <div className="flex w-full shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-1 max-lg:pr-16 max-sm:gap-x-1 md:w-auto md:justify-end">
            <Link
              href={activeProperty ? `/propiedades/${activeProperty.slug}` : '/propiedades'}
              className="inline-flex min-h-10 items-center gap-2 text-sm font-medium text-white/90 underline decoration-white/55 underline-offset-4 transition-colors hover:text-white hover:decoration-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B3B3B3]"
            >
              {activeProperty ? 'Ver propiedad' : 'Explorar catálogo'}
              <span aria-hidden="true" className="size-2 rotate-45 border-r border-t border-current" />
            </Link>

            {properties.length > 1 && (
              <div className="flex items-center gap-1" role="group" aria-label="Navegar propiedades destacadas">
                <button
                  type="button"
                  onClick={() => goTo(current - 1)}
                  aria-label="Propiedad anterior"
                  className="flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B3B3B3] max-sm:h-9 max-sm:w-9 max-[380px]:h-7 max-[380px]:w-7"
                >
                  <span aria-hidden="true" className="block size-2 rotate-[-45deg] border-l border-t border-current" />
                </button>
                <div className="flex items-center gap-2 px-1 max-sm:gap-1 max-sm:px-0" role="group" aria-label="Elegir propiedad destacada">
                  {properties.map((property, index) => (
                    <button
                      key={property.id}
                      type="button"
                      onClick={() => goTo(index)}
                      aria-label={`Mostrar propiedad ${index + 1}: ${property.title}`}
                      aria-current={index === activeIndex ? 'true' : undefined}
                      className={`h-1.5 transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B3B3B3] ${
                        index === activeIndex
                          ? 'w-8 bg-[#B3B3B3] max-sm:w-5 max-[380px]:w-4'
                          : 'w-4 bg-white/55 hover:bg-white max-sm:w-2.5 max-[380px]:w-2'
                      }`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => goTo(current + 1)}
                  aria-label="Propiedad siguiente"
                  className="flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B3B3B3] max-sm:h-9 max-sm:w-9 max-[380px]:h-7 max-[380px]:w-7"
                >
                  <span aria-hidden="true" className="block size-2 rotate-[135deg] border-l border-t border-current" />
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}
