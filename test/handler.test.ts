import { describe, expect, it } from "vitest";
import { handler } from "../src/index.js";
import { renderPipelinePage } from "../src/web/pipeline-page.js";

describe("handler", () => {
  it("greets world by default", () => {
    expect(handler(" ")).toMatch(/Hello, world!/);
  });

  it("greets provided name", () => {
    expect(handler("Aeron")).toContain("Hello, Aeron!");
  });
});

describe("renderPipelinePage", () => {
  it("mentions greeting and npm run ci", () => {
    const html = renderPipelinePage({
      greeting: "Hello, Aeron!",
      version: "0.1.0+local.dev",
      repository: "Aeron-Aeron/testing",
      workflow: "CI",
      port: 4173,
    });

    expect(html).toContain("Hello, Aeron!");
    expect(html).toContain("npm run ci");
    expect(html).toContain("http://localhost:4173");
  });
});
