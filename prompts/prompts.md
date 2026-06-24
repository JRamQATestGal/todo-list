# Prompts that I have used for this project
These are actual prompts used with GitHub Copilot Chat + Playwright MCP while building this app. I've used prompt for many purposes, including: refactor UI changes, create a test infrastructure and eliminate flaky tests.

##  Self-heal tests after UI refactor: list → table 
Rerun todo.spec.js test cases using Playwright MCP and generate test report.  Show report.  If there are failed tests because of the changes of the to-do list from list to table, use Playwright MCP to heal the test cases and rerun the test case again.

## Scalable structure for Playwright. (Starting from nothing.)
What is a good test scalable structure for Playwright with MCP integration? (followed by "yes" to confirm to build the scaffold that Copilot proposes.)

## Adjust app to use Tailwind, then give the app a head start on converting to use the new Tailwind classes
Install Tailwind CSS.  Adjust app to use Tailwind CSS classes when possible
