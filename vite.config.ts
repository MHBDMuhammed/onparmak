import { createHash } from "node:crypto";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

// Precache the actual hashed build; the published app can reopen without a network.
function offline(): Plugin {
  return {
    name: "onparmak-offline",
    apply: "build",
    generateBundle(_options, bundle) {
      const assets = [
        "./",
        "./index.html",
        "./favicon.svg",
        "./robots.txt",
        "./sitemap.xml",
        "./og-image.png",
        "./apple-touch-icon.png",
        ...Object.keys(bundle)
          .filter((k) => !k.endsWith(".map"))
          .map((k) => "./" + k),
      ];
      const revision = createHash("sha256")
        .update(
          Object.entries(bundle)
            .sort(([left], [right]) => left.localeCompare(right))
            .map(
              ([name, entry]) =>
                name +
                (entry.type === "asset" ? String(entry.source) : entry.code),
            )
            .join("\0"),
        )
        .digest("hex")
        .slice(0, 16);
      const cache = `onparmak-${revision}`;
      this.emitFile({
        type: "asset",
        fileName: "sw.js",
        source: `const CACHE=${JSON.stringify(cache)};const FILES=${JSON.stringify(assets)};
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES.map(file=>new Request(file,{cache:'reload'})))).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('onparmak-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;event.respondWith(caches.open(CACHE).then(async cache=>{const stored=await cache.match(event.request,{ignoreVary:true});if(stored)return stored;try{return await fetch(event.request);}catch(error){if(event.request.mode==='navigate')return cache.match('./index.html',{ignoreVary:true});throw error;}}));});`,
      });
    },
  };
}
const securityPolicy: Plugin = {
  name: "onparmak-security-policy",
  apply: "build",
  transformIndexHtml() {
    return [
      {
        tag: "meta",
        attrs: {
          "http-equiv": "Content-Security-Policy",
          content:
            "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; worker-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'",
        },
        injectTo: "head-prepend",
      },
      {
        tag: "meta",
        attrs: { name: "referrer", content: "no-referrer" },
        injectTo: "head-prepend",
      },
    ];
  },
};

export default defineConfig({ plugins: [react(), securityPolicy, offline()] });
