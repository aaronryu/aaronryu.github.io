// @ts-check
import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";

import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  // (A) Astro-specific options
  // site: 'https://aaronryu.github.io', - Sitemap / Canonocal 생성하여 SEO 가속
  site: "https://aaronryu.netlify.app",
  //
  // (B) Vite-specific options
  // vite: { ... },
  integrations: [preact(), icon()],
});
