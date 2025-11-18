import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { handler } from "../index.js";
import { buildVersionString } from "../lib/version.js";
import { renderPipelinePage } from "../web/pipeline-page.js";

const defaultRepo = process.env.GITHUB_REPOSITORY ?? "Aeron-Aeron/testing";
const defaultWorkflow = process.env.GITHUB_WORKFLOW ?? "CI";
const visitorName = process.env.PIPELINE_VISITOR ?? "world";
const outputDir = process.env.STATIC_DIR ?? "static-site";
const outputFile = resolve(process.cwd(), outputDir, "index.html");
const port = Number(process.env.PORT ?? 4173);

const html = renderPipelinePage({
  greeting: handler(visitorName),
  version: buildVersionString(),
  repository: defaultRepo,
  workflow: defaultWorkflow,
  port,
});

mkdirSync(dirname(outputFile), { recursive: true });
writeFileSync(outputFile, html, "utf-8");

console.log(`Static pipeline page written to ${outputFile}`);
