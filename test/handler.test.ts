import { describe, expect, it } from "vitest";
import { handler } from "../src/index.js";

describe("handler", () => {
  it("greets world by default", () => {
    expect(handler(" ")).toMatch(/Hello, world!/);
  });

  it("greets provided name", () => {
    expect(handler("Aeron")).toContain("Hello, Aeron!");
  });
});
