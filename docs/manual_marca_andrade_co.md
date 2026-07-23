# Manual de Marca — Grupo Chalita

> **Instrucciones de uso para Claude Code**
> Este archivo es la fuente única de verdad para la identidad visual de Grupo Chalita.
> Cuando implementes UI, componentes o estilos, referencia siempre este documento.
> Prioridad de uso: tokens de color → tipografía → reglas de logo → personalidad de marca.

---

## Índice

1. [Descripción de Marca](#1-descripción-de-marca)
2. [Color](#2-color)
3. [Tipografía](#3-tipografía)
4. [Limitaciones reales](#4-limitaciones-reales)

---

## 1. Descripción de Marca

Grupo Chalita opera en dark mode con un único acento fuerte ("Violeta lujo"). No hay definición de logo, personalidad de marca ni tipografía específica más allá de lo indicado abajo — esta sección se completa cuando el cliente provea esos datos.

---

## 2. Color

### Paleta — Violeta lujo (dark mode)

| Token | HEX | Uso |
|---|---|---|
| `--bg` | `#0E0A12` | Fondo base — page background, superficies grandes |
| `--surface` | `#160F1F` | Un nivel por encima del fondo — separa bloques de contenido sin depender de bordes |
| `--border` | `#2A1D35` | Divisiones sutiles — líneas, separadores, bordes de bajo contraste |
| `--muted` | `#6A5070` | Texto de baja jerarquía — metadatos, labels secundarios, placeholders. **NO** usar en texto crítico |
| `--accent2` | `#7B4F80` | Acento de apoyo — elementos que deben destacar poco (badges, hovers suaves) |
| `--accent` | `#9B6FA0` | Acento principal — reservado para **una sola acción prioritaria por vista** |
| `--text` | `#EDE0F5` | Texto principal — máximo contraste, para todo lo que se tiene que leer sí o sí |

**Regla de oro:** un solo acento fuerte. No diluirlo usándolo en más de un elemento prioritario por vista.

### CSS Variables — Implementación

```css
:root {
  --bg:      #0E0A12;
  --surface: #160F1F;
  --border:  #2A1D35;
  --muted:   #6A5070;
  --accent2: #7B4F80;
  --accent:  #9B6FA0;
  --text:    #EDE0F5;
}
```

---

## 3. Tipografía

- `'General Sans'` para headings (H1–H3)
- `'Poppins'` para body/UI

Sin spacing ni escala tipográfica definidos en la fuente de marca.

---

## 4. Limitaciones reales

> **Para Claude Code:**

- `--accent` sobre blanco (`#ffffff`) da **4.06:1** de contraste → cumple **AA Large** (texto ≥18px o ≥14px bold), **no AA estándar**. Si se usa como fondo con texto chico encima, ese punto específico no es accesible tal cual.
- No hay definición de estados `hover` / `focus` / `disabled` en la fuente original. Cualquier variante derivada de estos colores para esos estados es una extrapolación, no un dato de marca confirmado.
- No hay tipografía ni spacing más allá de lo indicado en §3 — esto es exclusivamente paleta de color.
