# GitHub Actions CI/CD Demo

Minimal Node.js + TypeScript service that compiles, lints, tests, packages, and publishes entirely through GitHub Actions. Use it as a template when you need a lightweight pipeline that does not rely on any external CI service.

## Tech stack
- Node.js 18+
- TypeScript for source
- Vitest for unit tests
- ESLint for static analysis

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
npm start -- Aeron
```

## CI/CD pipeline
The workflow:
1. Triggers on `pull_request` and pushes to `main`.
2. Checks out code and caches dependencies.
3. Runs `npm ci`, `npm run ci` (lint + test + build).
4. Uploads `dist/` as a build artifact for traceability.
5. When running on `main`, it creates an npm package tarball via `npm run package` and publishes it as a workflow artifact named `npm-package`.

Secrets (optional): set `NPM_TOKEN` if you want the workflow to publish to the npm registry. The default workflow only stores artifacts inside GitHub Actions.

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