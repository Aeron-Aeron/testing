const build = process.env.GITHUB_RUN_NUMBER ?? "local";
const commit = process.env.GITHUB_SHA?.slice(0, 7) ?? "dev";
const version = process.env.npm_package_version ?? "0.0.0";

export function buildVersionString(): string {
  return `${version}+${build}.${commit}`;
}
