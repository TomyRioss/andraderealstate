@AGENTS.md

## Mode
Always invoke `/caveman ultra` skill at session start.

## Error Handling
All errors must be caught. Provide both console feedback (logs) and visual UX/UI feedback (toast, banner, etc.).

## Third-party Libraries
Before implementing custom logic or UI, research existing third-party libraries. Propose the best option to the user before proceeding.

## UI Components
Use shadcn/ui for all general pre-built components.

## Styling
Use TailwindCSS exclusively. No raw CSS. Never touch `global.css`.

## Database
Always ask before any DB change. Only proceed with explicit user consent in that message.

## Responsive Design
Every UI must be responsive: mobile-first, then desktop breakpoints.

## Architecture
Follow MVC pattern. Use modular components. Max 500 lines per component — split if exceeded.

## Unknown Problems
Search the web (Stack Overflow, Reddit, GitHub Issues, docs) before attempting a solution to unfamiliar problems.

## Color Palette — Grupo Chalita ("Dorado elegante")

Source of truth: `docs/manual_marca_andrade_co.md`. Always use CSS variables. Never hardcode hex values. Dark mode.

```css
:root {
  --bg:       #111009;  /* fondo base — page background, superficies grandes */
  --surface:  #1A1810;  /* un nivel por encima del fondo — separa bloques de contenido */
  --border:  #2E2A18;  /* divisiones sutiles — líneas, separadores, bordes de bajo contraste */
  --muted:    #7A6845;  /* texto de baja jerarquía — metadatos, labels secundarios, placeholders */
  --accent2: #B8912A;  /* acento de apoyo — badges, hovers suaves */
  --accent:   #D4AF6B;  /* acento principal — UNA acción prioritaria por vista */
  --text:     #F5EDD8;  /* texto principal — máximo contraste */
}
```

Rules:
- `--accent`: reservado para una sola acción prioritaria por vista, no diluir usándolo en más de un elemento
- `--accent` sobre fondo oscuro da 9.21:1 (AAA) — se puede usar en texto de cualquier tamaño
- `--muted`: nunca en texto crítico
- `hover`/`focus`/`disabled` no definidos en la fuente — cualquier variante derivada es extrapolación, no dato de marca confirmado
- Fonts: `'General Sans'` for headings (H1–H3), `'Poppins'` for body/UI

## Skills

| Task | Skill | Model |
|------|-------|-------|
| Supabase / DB | `supabase/agent-skills` + Supabase MCP | sonnet |
| Browser testing | playwright skill + `/caveman ultra` | haiku |
| Code review / audit | `code-simplifier`, `code-reviewer` | haiku |
| Commits / GitHub | `commit-commands`, GitHub MCP | — |
| Components / Design | `frontend-design`, `brainstorming` (superpowers), `ui-ux-pro-max`, `expo-design` | — |
