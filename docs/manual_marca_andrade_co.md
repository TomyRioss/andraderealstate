# Manual de Marca — Andrade & Co Real Estate

> **Instrucciones de uso para Claude Code**
> Este archivo es la fuente única de verdad para la identidad visual de Andrade & Co Real Estate.
> Cuando implementes UI, componentes o estilos, referencia siempre este documento.
> Prioridad de uso: tokens de color → tipografía → reglas de logo → personalidad de marca.

---

## Índice

1. [Descripción de Marca](#1-descripción-de-marca)
2. [Logo](#2-logo)
3. [Color](#3-color)
4. [Tipografía](#4-tipografía)
5. [Aplicaciones y Mockups](#5-aplicaciones-y-mockups)

---

## 1. Descripción de Marca

### Identidad

**Andrade & Co Real Estate** es una firma especializada en la estructuración, negociación y formalización de operaciones comerciales e inmobiliarias. Su diferenciador no es la intermediación tradicional: acompaña a sus clientes desde el análisis inicial hasta el cierre, integrando conocimientos inmobiliarios, comerciales y jurídicos.

La marca se posiciona como **aliado estratégico** que transforma procesos complejos en operaciones estructuradas, seguras y exitosas mediante un enfoque preventivo orientado a la seguridad jurídica y comercial.

### Propósito

Posicionar a Andrade & Co Real Estate como una firma confiable, estratégica y especializada. Su identidad comunica profesionalismo, solidez y precisión — elementos esenciales en procesos de alto valor patrimonial.

### Personalidad de Marca

| Atributo | Descripción |
|---|---|
| **Estratégica** | Analiza cada operación desde una visión integral, anticipando riesgos y oportunidades |
| **Confiable** | Genera seguridad y certeza mediante procesos estructurados y transparentes |
| **Profesional** | Mantiene altos estándares de atención, documentación y seguimiento |
| **Preventiva** | Resuelve escenarios antes de que se conviertan en problemas |
| **Sólida** | Proyecta estabilidad, experiencia y respaldo en decisiones patrimoniales |
| **Elegante** | Comunica sofisticación y exclusividad mediante imagen sobria y bien estructurada |

> **Para Claude Code:** Al escribir copy de UI (botones, headings, microcopy), el tono debe reflejar estos atributos. Evitar lenguaje informal, emojis o cualquier elemento que contradiga solidez y elegancia.

---

## 2. Logo

### Estructura del logotipo

El logotipo se compone de:
- **Isotipo:** Monograma "AC" en tipografía serif elegante (Castoro Titling), con una barra vertical separadora
- **Wordmark:** "ANDRADE & CO" en mayúsculas, serif, peso display
- **Subtítulo:** "REAL ESTATE" en versalitas espaciadas (tracking amplio), peso semi-bold
- **Elemento decorativo:** Línea horizontal con rombo central que separa wordmark de subtítulo

### Versiones del Logo

#### Versión Principal
- Fondo: blanco / claro (`#F5F5F5` o superior)
- Isotipo: color `#0D1A2D` (Prussian Blue)
- Wordmark "ANDRADE & CO": color `#0D1A2D` (Prussian Blue)
- Subtítulo "REAL ESTATE": color `#0D1A2D`, tracking amplio (~0.25em)
- Línea decorativa y rombo: color `#B3B3B3` (Silver)

#### Versión Secundaria — sobre fondo oscuro (pill/badge)
- Contenedor: rectángulo con border-radius pronunciado (~16px), fondo `#0D1A2D`
- Isotipo: color `#B3B3B3` (Silver)
- Wordmark "ANDRADE & CO": color `#B3B3B3` (Silver)
- Subtítulo "REAL ESTATE": color `#B3B3B3`, tracking amplio
- También disponible sin contenedor, sobre fondos oscuros, misma coloración

#### Versión con Fondo (Degradado)
- Fondo: degradado radial de `#1A2D4A` a `#0D1A2D` (azul profundo)
- Logo: plata/silver — todos los elementos en `#B3B3B3`
- Uso: portadas, headers de alto impacto, materiales premium

### Patrón de Marca (Marca de Agua)
- El wordmark completo y el isotipo se repiten en diagonal como fondo
- Color: versión muy desaturada/transparente del logotipo (`#0D1A2D` al 8–12% de opacidad sobre fondo claro)
- Uso: fondos de documentos, papelería institucional, backgrounds de sección

### Reglas de uso del logo

> **Para Claude Code — instrucciones de implementación:**

```
✅ USAR:
- Sobre fondos blancos o muy claros (#F0F0F0 o superior): versión principal (azul)
- Sobre fondos oscuros (#1A1A2E o similar): versión invertida (silver)
- Respetar área de protección mínima: padding >= 24px alrededor del logo
- Mantener proporciones originales en todo momento (no deformar)

❌ NO USAR:
- No rotar el logo
- No cambiar los colores individuales del logotipo
- No colocar sobre fondos que generen bajo contraste
- No separar isotipo y wordmark salvo en favicon/app icon
- No usar sobre fotografías sin overlay que asegure contraste suficiente
- No recrear el logo con tipografías sustitutes
```

### Favicon / App Icon
- Usar únicamente el isotipo "AC" en `#0D1A2D` sobre fondo blanco
- O isotipo en `#B3B3B3` sobre fondo `#0D1A2D`

---

## 3. Color

### Paleta Principal

#### Prussian Blue — Color Primario

| Formato | Valor |
|---|---|
| **HEX** | `#0D1A2D` |
| **RGB** | `13, 26, 45` |
| **CMYK** | `71, 42, 0, 82` |
| **LAB** | `10, 0, -14` |
| **Grayscale** | `18` |

**Semiótica:** Confianza, solidez y profesionalismo. Asociado a estabilidad, estrategia y toma de decisiones seguras. Representa el respaldo, la estructura y la certeza que Andrade & Co brinda en cada negociación.

**Uso en código:**
```css
--color-primary: #0D1A2D;
--color-primary-rgb: 13, 26, 45;
```

---

#### Silver — Color Secundario

| Formato | Valor |
|---|---|
| **HEX** | `#B3B3B3` |
| **RGB** | `179, 179, 179` |
| **CMYK** | `0, 0, 0, 30` |
| **LAB** | `73, 0, 0` |
| **Grayscale** | `70` |

**Semiótica:** Equilibrio, transparencia y sofisticación. Orden, claridad y profesionalismo. Representa la objetividad con la que Andrade & Co estructura cada operación.

**Uso en código:**
```css
--color-secondary: #B3B3B3;
--color-secondary-rgb: 179, 179, 179;
```

---

### Gamas de Color

Las gamas son variaciones claras/oscuras de los colores principales. Se usan para jerarquía visual, estados de componentes (hover, disabled, active) y versatilidad en redes sociales, papelería y web.

#### Gama Prussian Blue

| Token sugerido | HEX | Uso recomendado |
|---|---|---|
| `--color-primary-lightest` | `#6D7A8F` | Texto deshabilitado, placeholders, bordes sutiles |
| `--color-primary-light` | `#182C4E` | Hover sobre fondo oscuro, secciones secundarias |
| `--color-primary` | `#0D1A2D` | Color base — uso principal |
| `--color-primary-dark` | `#091221` | Fondos muy oscuros, footers, modales |

#### Gama Silver

| Token sugerido | HEX | Uso recomendado |
|---|---|---|
| `--color-secondary-lightest` | `#F8F8F8` | Fondo de página, backgrounds neutros |
| `--color-secondary-light` | `#CCCCCC` | Bordes, divisores, líneas |
| `--color-secondary` | `#B3B3B3` | Color base secundario |
| `--color-secondary-dark` | `#C2C2C2` | Íconos secundarios, texto de baja jerarquía |

> **Nota para Claude Code:** Los valores de las gamas intermedias son aproximaciones extraídas visualmente del PDF. Los valores exactos del manual son los dos colores principales (`#0D1A2D` y `#B3B3B3`). Los intermedios se derivan visualmente; si el cliente provee los valores exactos, reemplazar.

---

### Combinaciones de Fondo — Versiones del Logo

| Fondo | Color logo | Uso |
|---|---|---|
| `#FFFFFF` / `#F5F5F5` | `#0D1A2D` + `#B3B3B3` | Documentos, web light, papelería |
| `#0D1A2D` | `#B3B3B3` (plata) | Tarjetas, banners oscuros, email headers |
| Degradado radial oscuro | `#B3B3B3` | Portadas, materiales premium, presentaciones |

---

### CSS Variables — Implementación Completa

```css
:root {
  /* Colores primarios */
  --color-primary:           #0D1A2D;
  --color-primary-rgb:       13, 26, 45;
  --color-secondary:         #B3B3B3;
  --color-secondary-rgb:     179, 179, 179;

  /* Gama Prussian Blue */
  --color-primary-lightest:  #6D7A8F;
  --color-primary-light:     #182C4E;
  --color-primary-dark:      #091221;

  /* Gama Silver */
  --color-secondary-lightest:#F8F8F8;
  --color-secondary-light:   #CCCCCC;
  --color-secondary-dark:    #C2C2C2;

  /* Fondo por defecto */
  --color-background:        #F5F5F5;
  --color-surface:           #FFFFFF;

  /* Texto */
  --color-text-primary:      #0D1A2D;
  --color-text-secondary:    #6D7A8F;
  --color-text-on-dark:      #F8F8F8;
  --color-text-accent:       #B3B3B3;
}
```

---

## 4. Tipografía

### Tipografía Principal — General Sans

| Propiedad | Valor |
|---|---|
| **Familia** | General Sans |
| **Categoría** | Sans-serif geométrica |
| **Uso** | Títulos, headings H1–H3, display, wordmark del logo |
| **Caracteres** | A B C D E F G H I J K L M N Ñ O P Q R S T U V W X Y Z |
| **Transform** | `uppercase` en el logo; libre en textos editoriales |

**Cómo obtenerla:** Google Fonts / Fontshare — buscar "General Sans".

```css
/* Importar (ejemplo Fontshare) */
@import url('https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap');

--font-primary: 'General Sans', sans-serif;
```

---

### Tipografía Secundaria — Poppins Medium

| Propiedad | Valor |
|---|---|
| **Familia** | Poppins |
| **Peso** | Medium (500) |
| **Categoría** | Sans-serif geométrica |
| **Uso** | Cuerpo de texto, párrafos, UI labels, botones, subtítulos |
| **Caracteres** | a–z, A–Z con soporte de ñ |

```css
/* Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

--font-secondary: 'Poppins', sans-serif;
```

> **Nota:** El PDF usa también **Poppins Bold**, **Poppins SemiBold** y **Poppins Regular** para jerarquías internas. Todos son pesos del mismo family. Se detectó además **Myriad Pro Regular** (Type 1, serif) en elementos internos del manual — no se recomienda para implementación web.

---

### Escala Tipográfica — Recomendación

```css
:root {
  --font-primary:   'General Sans', sans-serif;
  --font-secondary: 'Poppins', sans-serif;

  /* Escala de tamaños */
  --text-xs:   0.75rem;   /* 12px — captions, labels pequeños */
  --text-sm:   0.875rem;  /* 14px — cuerpo pequeño, metadata */
  --text-base: 1rem;      /* 16px — cuerpo principal */
  --text-lg:   1.125rem;  /* 18px — intro, destacados */
  --text-xl:   1.25rem;   /* 20px — subtítulos */
  --text-2xl:  1.5rem;    /* 24px — H3 */
  --text-3xl:  1.875rem;  /* 30px — H2 */
  --text-4xl:  2.25rem;   /* 36px — H1 */
  --text-5xl:  3rem;      /* 48px — Hero display */
}
```

### Reglas de Uso

> **Para Claude Code:**

```
✅ USAR:
- General Sans para H1, H2, H3 y cualquier elemento display/hero
- Poppins Medium (500) para párrafos, labels, botones, nav
- Poppins Bold (700) para CTAs, alertas, badges de estado
- letter-spacing amplio en subtítulos en mayúsculas (tracking: 0.15–0.25em)
- Color de texto: --color-text-primary (#0D1A2D) sobre fondos claros
- Color de texto: --color-text-on-dark (#F8F8F8) sobre fondos oscuros

❌ NO USAR:
- Mezclar más de 2 familias tipográficas en la misma pantalla
- General Sans en cuerpo de texto largo (reduce legibilidad)
- Pesos inferiores a 400 para texto funcional
- Colores de texto que no garanticen ratio de contraste WCAG AA (4.5:1 mínimo)
```

---

## 5. Aplicaciones y Mockups

El manual incluye aplicaciones sobre los siguientes soportes (sin especificaciones detalladas — referencia visual únicamente):

- Tarjetas de presentación
- Papelería corporativa (membrete, sobre)
- Materiales digitales (banners, redes sociales)
- Documentación legal / contratos (header institucional)

> **Para Claude Code:** En ausencia de especificaciones exactas de layout para cada soporte, aplicar los tokens de color y tipografía definidos arriba. El criterio visual dominante es **elegancia contenida**: espacios generosos (whitespace), tipografía en azul profundo sobre fondos claros, o plata sobre fondos oscuros. Evitar saturación de elementos.

---

## Resumen de Tokens — Referencia Rápida

```css
/* ═══════════════════════════════════════════════════
   ANDRADE & CO REAL ESTATE — Design Tokens v1.0
   Fuente: Manual de Marca (junio 2026)
═══════════════════════════════════════════════════ */

:root {
  /* COLORES ─────────────────────────────────────── */
  --color-primary:            #0D1A2D;   /* Prussian Blue — principal */
  --color-primary-light:      #182C4E;   /* Prussian Blue — light */
  --color-primary-lightest:   #6D7A8F;   /* Prussian Blue — muy claro */
  --color-primary-dark:       #091221;   /* Prussian Blue — oscuro */

  --color-secondary:          #B3B3B3;   /* Silver — principal */
  --color-secondary-light:    #CCCCCC;   /* Silver — light */
  --color-secondary-lightest: #F8F8F8;   /* Silver — muy claro / background */
  --color-secondary-dark:     #C2C2C2;   /* Silver — oscuro */

  --color-background:         #F5F5F5;   /* Fondo general */
  --color-surface:            #FFFFFF;   /* Superficie cards/modales */

  --color-text-primary:       #0D1A2D;   /* Texto sobre fondo claro */
  --color-text-secondary:     #6D7A8F;   /* Texto secundario/muted */
  --color-text-on-dark:       #F8F8F8;   /* Texto sobre fondo oscuro */
  --color-text-accent:        #B3B3B3;   /* Texto decorativo/silver */

  /* TIPOGRAFÍA ──────────────────────────────────── */
  --font-primary:             'General Sans', sans-serif;    /* Headings, display */
  --font-secondary:           'Poppins', sans-serif;         /* Body, UI */

  --font-weight-regular:      400;
  --font-weight-medium:       500;
  --font-weight-semibold:     600;
  --font-weight-bold:         700;

  --tracking-tight:           -0.01em;
  --tracking-normal:           0em;
  --tracking-wide:             0.1em;
  --tracking-widest:           0.25em;   /* Para subtítulos en caps tipo "REAL ESTATE" */

  /* BORDES Y RADIOS ─────────────────────────────── */
  --radius-sm:                4px;
  --radius-md:                8px;
  --radius-lg:                16px;      /* Pill del logo versión secundaria */
  --radius-pill:              999px;

  /* SOMBRAS ─────────────────────────────────────── */
  --shadow-subtle:            0 1px 3px rgba(13, 26, 45, 0.08);
  --shadow-card:              0 4px 16px rgba(13, 26, 45, 0.12);
  --shadow-elevated:          0 8px 32px rgba(13, 26, 45, 0.18);
}
```
