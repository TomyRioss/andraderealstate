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

## Color Palette — InmoHub

Always use these CSS variables. Never hardcode color values.

```css
:root {
  --color-anchor: #0D3B66;  /* Primary text, titles, nav, logo, dark hero bg */
  --color-mid:    #1A5F9E;  /* CTA buttons, active interactive elements */
  --color-soft:   #4A7BA7;  /* Secondary text, metadata, captions, dates */
  --color-mist:   #AED6F1;  /* Borders and separators ONLY — never as text */
  --color-ice:    #E8F4FD;  /* Card/input/section backgrounds */
  --color-white:  #FFFFFF;  /* Dominant page background (80%+ viewport) */
}
```

Rules:
- `--color-white`: default `body` background
- `--color-anchor`: dark bg with white text (hero/banner), or text on light bg
- `--color-mid`: CTA buttons; hover → `--color-anchor`
- `--color-soft`: secondary text only (≥18px or bold for WCAG AA on white)
- `--color-mist`: borders/separators only — **never** as text color
- `--color-ice`: alternate section/card/input backgrounds
- State colors (error/success/warning/info) not defined — define separately before use

## Skills

| Task | Skill | Model |
|------|-------|-------|
| Supabase / DB | `supabase/agent-skills` + Supabase MCP | sonnet |
| Browser testing | playwright skill + `/caveman ultra` | haiku |
| Code review / audit | `code-simplifier`, `code-reviewer` | haiku |
| Commits / GitHub | `commit-commands`, GitHub MCP | — |
| Components / Design | `frontend-design`, `brainstorming` (superpowers), `ui-ux-pro-max`, `expo-design` | — |
