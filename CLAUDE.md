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

## Brand Manual — Andrade & Co Real Estate

Source of truth: original PDF `Manual Marca Andrade & Co Real State`; project summary: `docs/manual_marca_andrade_co.md`. If they conflict, follow the PDF.

- Official colors only: Prussian Blue `#0D1A2D` and Silver `#B3B3B3`. Other shades in project UI are supporting colors, not official brand colors; do not claim the manual specifies them.
- Typography: General Sans is primary; Poppins Medium is secondary. Use the supplied logo artwork as a graphic asset; do not rebuild its lettering with a substitute font or text.
- Use the logo versions shown in the manual: blue on light backgrounds and silver on dark backgrounds. Preserve proportions, color treatment, and legibility; no distortion or arbitrary recoloring.
- Brand character and copy: strategic, trustworthy, professional, preventive, solid, elegant; use a restrained, clear, precise tone.
- Use the manual's pattern and mockups as visual references. Do not invent exact spacing, logo clear-space, gradient values, or extra brand tokens.
- Keep interfaces restrained and legible. Meet contrast needs through implementation choices without misrepresenting derived colors as official brand specifications.
- Never create an SVG design unless explicitly requested.

## Skills

| Task | Skill | Model |
|------|-------|-------|
| Supabase / DB | `supabase/agent-skills` + Supabase MCP | sonnet |
| Browser testing | playwright skill + `/caveman ultra` | haiku |
| Code review / audit | `code-simplifier`, `code-reviewer` | haiku |
| Commits / GitHub | `commit-commands`, GitHub MCP | — |
| Components / Design | `frontend-design`, `brainstorming` (superpowers), `ui-ux-pro-max`, `expo-design` | — |
