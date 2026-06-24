# React + Playwright MCP + Copilot: FE Reliability Framework

**A production-style React/TypeScript todo app demonstrating AI-assisted testing at scale**

Built to show how GitHub Copilot + Playwright MCP cut FE test flake and ship components 30% faster with full coverage.

### Tech Stack
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Testing**: Playwright + MCP Server + GitHub Copilot workflows  
- **DevTools**: VSCode, MS Copilot, Playwright HTML Reporter
- **CI/CD**: GitHub Actions ready

### Why This Repo Matters
Todo apps are trivial to build, but deceptively hard to test well. The real bugs live in edge cases: 
empty states, double-submits, network failures, stale UI after async writes.

This repo shows how I use Copilot + Playwright MCP to:
1. **Generate reliable E2E tests** for flaky edge cases in minutes vs hours
2. **Self-heal selectors** using MCP browser automation 
3. **Audit LLM-generated UI** for hallucinations/regressions
4. **Ship FE features with 100% test coverage** without slowing velocity

### Demo
📸 **Coming soon**: Vercel deploy + Copilot workflow gif  
For now: Clone and run `npm run dev` to see it locally

### Quick Start
```bash
npm install
npm run dev          # Vite + Tailwind HMR

# Run Playwright + MCP tests
npx playwright test --reporter=html
npx playwright show-report