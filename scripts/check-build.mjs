import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const base = process.argv[2] ?? "/";
assert.match(base, /^\/.*\/$/, "Base path must start and end with a slash");

const index = readFileSync("dist/index.html", "utf8");
const worker = readFileSync("dist/sw.js", "utf8");

assert.match(index, /http-equiv="Content-Security-Policy"/);
assert.match(index, /connect-src (?:'|&#39;)self(?:'|&#39;)/);
assert.ok(index.includes(`href="${base}favicon.svg"`));

const assets = [...index.matchAll(/(?:src|href)="([^"?]+\.(?:js|css))"/g)].map(
  ([, asset]) => asset,
);
assert.equal(assets.length, 2, "Expected one script and one stylesheet");

for (const asset of assets) {
  assert.ok(asset.startsWith(base), `${asset} escapes the deployment base`);
  const relative = asset.slice(base.length);
  assert.ok(existsSync(join("dist", relative)), `${relative} is missing`);
  assert.ok(worker.includes(`./${relative}`), `${relative} is not precached`);
}

assert.ok(worker.includes("./index.html"));
assert.ok(worker.includes("self.skipWaiting()"));
console.log(`Static build verified for ${base}`);
