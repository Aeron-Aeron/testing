import http from "node:http";
import { pathToFileURL } from "node:url";
import { buildVersionString } from "./lib/version.js";
import { renderPipelinePage } from "./web/pipeline-page.js";

const defaultPort = Number(process.env.PORT ?? 4173);

export function handler(name: string): string {
  const greetingTarget = name.trim() || "world";
  return `Hello, ${greetingTarget}! Running build ${buildVersionString()}.`;
}

export function startServer(port = defaultPort): http.Server {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url ?? "/", `http://localhost:${port}`);

    if (url.pathname !== "/") {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
      return;
    }

    const visitor = url.searchParams.get("name") ?? "world";
    const html = renderPipelinePage({
      greeting: handler(visitor),
      version: buildVersionString(),
      repository: process.env.GITHUB_REPOSITORY ?? "Aeron-Aeron/testing",
      workflow: process.env.GITHUB_WORKFLOW ?? "CI",
      port,
    });

    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(html);
  });

  return server.listen(port, () => {
    // Helpful log for local dev / Actions artifact debugging.
    console.log(`Pipeline page available at http://localhost:${port}`);
  });
}

const invokedFileUrl = process.argv[1]
  ? pathToFileURL(process.argv[1]).href
  : undefined;

if (invokedFileUrl && import.meta.url === invokedFileUrl) {
  startServer();
}
