# Product

## Register

brand

## Users

Personas organizando una boda o evento (novios, familiares, organizadores) que buscan alquilar
rubros para el evento: toldos, mobiliario, cristalería, mantelería, catering, pistas de baile.
Navegan `/catalogo` desde mobile en su mayoría, comparando categorías y productos antes de
contactar a Grupo Chalita para cotizar. Fuera de alcance actual: carrito, checkout, wedding
planner sidebar — solo exploración de catálogo + contacto.

## Product Purpose

Catálogo "Arma tu Boda": vidriera de rubros y productos disponibles para alquiler de eventos,
organizada en 6 categorías (Toldos, Mobiliario, Cristalería, Mantelería, Catering, Pistas de
Baile), algunas con subcategorías filtrables. Éxito = el usuario entiende rápido qué hay
disponible por categoría y llega a contacto/cotización sin fricción.

## Brand Personality

Elegante, cálida, confiable. Dorado oscuro sobre fondo dark — "dorado elegante" (ver
`docs/manual_marca_andrade_co.md`). No genérico-corporativo, no frío.

## Anti-references

Nada de plantillas SaaS genéricas (cards idénticas, hero-metric, gradientes decorativos).
No usar SVG custom salvo íconos ya presentes en el proyecto (lucide).

## Design Principles

- Fondo oscuro + un solo acento dorado por vista: no diluir `--accent` en múltiples elementos.
- Mobile-first: la mayoría navega el catálogo desde el celular.
- Alcance mínimo: solo vista + navegación de catálogo, sin features de checkout/carrito.
- Reusar variables CSS y tipografías del proyecto (General Sans / Poppins), nunca hardcodear hex.

## Accessibility & Inclusion

Contraste AAA ya validado para `--accent` sobre `--bg` (9.21:1). Mantener ese estándar en
cualquier combinación nueva de color/texto del catálogo.
