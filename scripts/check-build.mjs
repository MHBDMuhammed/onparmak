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
assert.ok(
  index.includes(`href="${base}apple-touch-icon.png"`),
  "apple touch icon is missing",
);
assert.ok(
  index.includes('<meta name="robots" content="index, follow"'),
  "robots meta is missing",
);
assert.ok(
  index.includes('<meta property="og:url"'),
  "Open Graph URL is missing",
);
assert.ok(
  index.includes('<meta property="og:locale" content="tr_TR"'),
  "Turkish Open Graph locale is missing",
);
assert.ok(
  index.includes('<script type="application/ld+json">'),
  "structured data is missing",
);
assert.ok(
  index.includes('rel="canonical" href="https://onparmak.mhbd.dev/"'),
  "canonical URL is wrong",
);

const assets = [...index.matchAll(/(?:src|href)="([^"?]+\.(?:js|css))"/g)].map(
  ([, asset]) => asset,
);
assert.ok(assets.length >= 2, "Expected bundled script and stylesheet");

for (const asset of assets) {
  assert.ok(asset.startsWith(base), `${asset} escapes the deployment base`);
  const relative = asset.slice(base.length);
  assert.ok(existsSync(join("dist", relative)), `${relative} is missing`);
  assert.ok(worker.includes(`./${relative}`), `${relative} is not precached`);
}

assert.ok(worker.includes("./index.html"));
assert.ok(worker.includes("self.skipWaiting()"));
const indexSource = readFileSync("index.html", "utf8");
for (const [url] of indexSource.matchAll(/https?:\/\/[^\s"'<>]+/g)) {
  if (url.startsWith("https://onparmak.mhbd.dev/")) continue;
  if (url.startsWith("https://github.com/MHBDMuhammed/onparmak")) continue;
  if (url === "https://schema.org") continue;
  if (url === "https://mhbd.dev") continue;
  assert.fail(`source HTML references external runtime URL ${url}`);
}
for (const file of [
  "robots.txt",
  "sitemap.xml",
  "og-image.png",
  "apple-touch-icon.png",
  "_headers",
]) {
  assert.ok(existsSync(join("dist", file)), `${file} is missing`);
  assert.ok(
    worker.includes(`./${file}`) || file === "_headers",
    `${file} is not precached`,
  );
}
const headers = readFileSync("dist/_headers", "utf8");
assert.match(headers, /\/assets\/\*/);
assert.match(headers, /max-age=31536000, immutable/);
assert.match(headers, /\/sw\.js/);
assert.match(headers, /max-age=0, must-revalidate/);
assert.ok(
  !headers.match(/^[^#\n]*Content-Security-Policy/m),
  "CSP must live only in index.html",
);
assert.match(headers, /X-Content-Type-Options: nosniff/);
assert.match(headers, /Referrer-Policy: no-referrer/);
assert.match(headers, /Permissions-Policy:/);
assert.match(headers, /X-Frame-Options: DENY/);
const robots = readFileSync("dist/robots.txt", "utf8");
assert.ok(robots.includes("https://onparmak.mhbd.dev/sitemap.xml"));
const sitemap = readFileSync("dist/sitemap.xml", "utf8");
assert.ok(sitemap.includes("https://onparmak.mhbd.dev/"));
