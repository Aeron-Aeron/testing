# GitHub Actions CI/CD Demo

Minimal Node.js + TypeScript service that compiles, lints, tests, packages, and publishes entirely through GitHub Actions. Use it as a template when you need a lightweight pipeline that does not rely on any external CI service.

## Tech stack
- Node.js 18+
- TypeScript for source
- Vitest for unit tests
- ESLint for static analysis
- Built-in Node HTTP server for the web walkthrough page

## Project layout
- `src/` – application code (entry point `src/index.ts`)
- `test/` – Vitest unit tests
- `.github/workflows/ci.yml` – CI/CD pipeline running on every push & PR
- `dist/` – build artifacts (generated)

## Local development
```bash
npm install
npm run lint
npm test
npm run build
npm start
# open http://localhost:4173 or add ?name=YourName to customize the greeting
```

The server renders a lightweight HTML dashboard (`renderPipelinePage`) that summarizes every CI/CD stage. It is the same markup captured as an artifact inside GitHub Actions, so stakeholders can see what changed without running the code locally.

## How it works
1. `src/index.ts` exposes a friendly `handler(name)` used by tests **and** the webpage.
2. When you run `npm start`, a Node HTTP server responds on `PORT` (default 4173) with the generated CI/CD walkthrough page in `src/web/pipeline-page.ts`.
3. The HTML includes the current build metadata (`buildVersionString` derived from env vars), lists every workflow stage, and shows the exact npm commands to reproduce those stages locally.
4. Tests (`vitest`) cover both the handler and the HTML renderer so that any accidental change to the explanation is caught before merge.

## CI/CD pipeline
Workflow summary from `.github/workflows/ci.yml`:
1. Trigger: push or pull request targeting `main`/`master`.
2. Checkout + dependency cache via `actions/setup-node` with npm caching.
3. `npm ci` followed by `npm run ci` to lint, test, and type-check.
4. Upload `dist/` as `build-dist` for debugging or deployment promotion.
5. On main/master, run `npm run package` and upload the `.tgz` bundle.
6. If `NPM_TOKEN` is configured, publish the package straight from CI (guarded by the branch + token check).

Secrets (optional): set `NPM_TOKEN` to enable the final `npm publish` step. Without it, the workflow still produces artifacts for manual download.

Add a status badge once the workflow lands:
`![CI](https://github.com/Aeron-Aeron/testing/actions/workflows/ci.yml/badge.svg)`

## Extending the pipeline
- Add integration tests by appending new jobs in `.github/workflows/ci.yml`.
- Add deploy stages gated on `tags` or environments.
- Use environments + required reviewers for production gates.

## Troubleshooting
- Check the GitHub Actions logs for the exact failing command.
- Ensure `node-version` in the workflow matches local development version.
- If `npm ci` fails, delete `package-lock.json` and reinstall to resolve lock skew.