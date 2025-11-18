type PipelineStage = {
  title: string;
  description: string;
  command?: string;
};

const pipelineStages: PipelineStage[] = [
  {
    title: "Checkout",
    description:
      "actions/checkout@v4 pulls the repo so every subsequent step has the exact commit under test.",
  },
  {
    title: "Install dependencies",
    description: "npm ci installs from package-lock.json for deterministic builds.",
    command: "npm ci",
  },
  {
    title: "Lint, test, build",
    description:
      "npm run ci wraps eslint, vitest, and tsc to catch style issues, regressions, and type errors before any deployment step is attempted.",
    command: "npm run ci",
  },
  {
    title: "Archive artifacts",
    description:
      "actions/upload-artifact@v4 stores the dist/ output so it can be inspected or deployed later without rebuilding.",
  },
  {
    title: "Package for npm",
    description:
      "npm run package creates a versioned tarball whenever the main branch builds successfully.",
    command: "npm run package",
  },
  {
    title: "Optional publish",
    description:
      "If NODE_AUTH_TOKEN is set and the branch is main, npm publish ships the artifact to the registry.",
    command: "npm publish --access public dist/*.tgz",
  },
];

const localCommands = [
  { label: "Install dependencies", command: "npm install" },
  { label: "Run full CI locally", command: "npm run ci" },
  { label: "Start this page", command: "npm start" },
];

export type RenderPipelinePageOptions = {
  greeting: string;
  version: string;
  repository: string;
  workflow: string;
  port: number;
};

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export function renderPipelinePage({
  greeting,
  version,
  repository,
  workflow,
  port,
}: RenderPipelinePageOptions): string {
  const stageMarkup = pipelineStages
    .map(
      (stage, index) => `
        <article class="stage">
          <div class="stage-index">Step ${index + 1}</div>
          <h3>${escapeHtml(stage.title)}</h3>
          <p>${escapeHtml(stage.description)}</p>
          ${
            stage.command
              ? `<code class="stage-command">${escapeHtml(stage.command)}</code>`
              : ""
          }
        </article>
      `,
    )
    .join("");

  const localCommandList = localCommands
    .map(
      (item) => `
        <li>
          <span>${escapeHtml(item.label)}</span>
          <code>${escapeHtml(item.command)}</code>
        </li>
      `,
    )
    .join("");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>CI/CD walkthrough</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      :root {
        font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
        color: #0f172a;
        background: #f8fafc;
      }
      body {
        margin: 0;
        line-height: 1.6;
      }
      header {
        padding: 2rem 1rem 1rem;
        text-align: center;
      }
      main {
        max-width: 960px;
        margin: 0 auto;
        padding: 0 1rem 3rem;
      }
      .badge-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 0.75rem;
        margin: 1.5rem auto;
      }
      .badge {
        padding: 0.75rem 1rem;
        border-radius: 0.75rem;
        background: white;
        box-shadow: 0 1px 3px rgba(15, 23, 42, 0.12);
        text-align: left;
      }
      section {
        margin-top: 2rem;
      }
      .stage-list {
        display: grid;
        gap: 1rem;
      }
      @media (min-width: 640px) {
        .stage-list {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
      .stage {
        background: white;
        border-radius: 0.75rem;
        padding: 1rem;
        box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
      }
      .stage-index {
        font-size: 0.8rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #475569;
      }
      .stage-command,
      code {
        display: inline-flex;
        margin-top: 0.5rem;
        padding: 0.25rem 0.5rem;
        border-radius: 0.35rem;
        background: #0f172a;
        color: white;
        font-family: "JetBrains Mono", "Cascadia Code", monospace;
        font-size: 0.85rem;
      }
      .local-commands ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: grid;
        gap: 0.75rem;
      }
      .local-commands li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: white;
        border-radius: 0.75rem;
        padding: 0.75rem 1rem;
        box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.08);
        flex-wrap: wrap;
        gap: 0.5rem;
      }
      footer {
        text-align: center;
        padding: 1.5rem;
        font-size: 0.9rem;
        color: #475569;
      }
    </style>
  </head>
  <body>
    <header>
      <p>${escapeHtml(greeting)}</p>
      <h1>GitHub Actions CI/CD walkthrough</h1>
      <div class="badge-grid">
        <div class="badge"><strong>Repo</strong><br />${escapeHtml(repository)}</div>
        <div class="badge"><strong>Workflow</strong><br />${escapeHtml(workflow)}</div>
        <div class="badge"><strong>Build</strong><br />${escapeHtml(version)}</div>
        <div class="badge"><strong>Local URL</strong><br />http://localhost:${port}</div>
      </div>
    </header>
    <main>
      <section>
        <h2>Pipeline stages</h2>
        <p>Every push or pull request triggers the workflow below. Passing all stages is required before packaging or publishing.</p>
        <div class="stage-list">
          ${stageMarkup}
        </div>
      </section>
      <section class="local-commands">
        <h2>Try it yourself</h2>
        <p>Run the same steps locally before pushing to GitHub Actions.</p>
        <ul>
          ${localCommandList}
        </ul>
      </section>
    </main>
    <footer>
      CI/CD demo generated by GitHub Actions & Node.js.
    </footer>
  </body>
</html>`;
}

export { pipelineStages };
