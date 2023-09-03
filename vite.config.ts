import { defineConfig } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikCity} from "@builder.io/qwik-city/vite";
import { qwikReact} from "@builder.io/qwik-react/vite";
import tsconfigPaths from "vite-tsconfig-paths";

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
    
    plugins: [qwikCity(), qwikVite(), qwikReact(), tsconfigPaths(),],
    preview: {
      headers: {
        "Cache-Control": "public, max-age=600",
      },
    },
  };
});
