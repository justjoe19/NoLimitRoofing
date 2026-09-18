import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://nolimitroofingin.com",
  trailingSlash: "never",
  build: {
    // Keep the current URL shape (/about.html, not /about/) so no
    // redirects are needed for this migration — see README.
    format: "file",
  },
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
