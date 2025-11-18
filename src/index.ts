import { buildVersionString } from "./lib/version.js";

export function handler(name: string): string {
  const greetingTarget = name.trim() || "world";
  return `Hello, ${greetingTarget}! Running build ${buildVersionString()}.`;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const nameArg = process.argv[2] ?? "world";
  console.log(handler(nameArg));
}
