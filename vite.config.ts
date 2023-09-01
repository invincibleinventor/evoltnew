import { defineConfig } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikCity } from "@builder.io/qwik-city/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import netlifyEdge from "@netlify/vite-plugin-netlify-edge";
import { qwikReact } from "@builder.io/qwik-react/vite";

export default defineConfig(() => {
  return {
    
    resolve: {
      alias: {
        assert: "assert",
        buffer: "buffer",
        events: "events",
        http: "stream-http",
        https: "https-browserify",
        punycode: "punycode",
        stream: "stream-browserify",
        url: "url",
        util: "util",
        zlib: "browserify-zlib",
      },
    },
    
    plugins: [
      qwikCity(),
      qwikVite({
        ssr: { outDir: "netlify/edge-functions/entry.netlify-edge" },
      }),
      tsconfigPaths(),
      netlifyEdge({
        functionName: "entry.netlify-edge",
      }),
      qwikReact(),
    ],
  };
});
