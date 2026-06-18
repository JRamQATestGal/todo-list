# To-Do React + Testing Strategy Demonstration (or To-Do React app but "make it fancy")

This is a small to-do list app built to demostrate the following:

- that I can write clean performance-minded React Application.  
- that I can build a AI-assisted test Suite that I can trust in production

# Teck Stack
- React (web framework)
- Tailwind CSS (because I have better things to do than to create a CSS framework from scratch)
- Playwright (with MS Copilot and MCP Playwright in the loop)

# The Problem
A To-Do App is trivial to build, but deceptively hard to test well.  The interesting failures don't
live in the happy path -- they are in the edge cases: empty states, rapid doublt-submits, partial
network failures, stale UI after an async write.

This project is always "in-progress."

# Build & Dev
```bash
npm run dev      # Vite dev server with Tailwind HMR
npm run build    # Production build with optimized CSS

# Run Playwright Tests
npx playwright test tests/todo.spec.js --reporter=list,html   # Run Playwright Test
npx playwright show-report                                    # Show report after test

CI: trigger workflow (minor commit)
