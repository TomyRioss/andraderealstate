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

## Skills

| Task | Skill | Model |
|------|-------|-------|
| Supabase / DB | `supabase/agent-skills` + Supabase MCP | sonnet |
| Browser testing | playwright skill + `/caveman ultra` | haiku |
| Code review / audit | `code-simplifier`, `code-reviewer` | haiku |
| Commits / GitHub | `commit-commands`, GitHub MCP | — |
| Components / Design | `frontend-design`, `brainstorming` (superpowers), `ui-ux-pro-max`, `expo-design` | — |
