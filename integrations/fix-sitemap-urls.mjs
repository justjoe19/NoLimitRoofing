import { readdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

/**
 * @astrojs/sitemap builds URLs from Astro's route patterns (e.g. "/about"),
 * not from the actual output filenames — it has no awareness of
 * `build.format: "file"`, which this site uses so every page ships as
 * /about.html instead of /about/. Left alone, the sitemap points Google at
 * URLs that 404. This appends .html to every sitemap URL except the
 * homepage, after @astrojs/sitemap has already written its files.
 */
export default function fixSitemapUrls() {
  return {
    name: "fix-sitemap-urls",
    hooks: {
      "astro:build:done": async ({ dir }) => {
        const distDir = fileURLToPath(dir);
        const files = await readdir(distDir);
        for (const file of files) {
          if (!/^sitemap-\d+\.xml$/.test(file)) continue;
          const filePath = join(distDir, file);
          let xml = await readFile(filePath, "utf-8");
          xml = xml.replace(/<loc>(https?:\/\/[^<]+?)<\/loc>/g, (match, url) => {
            if (url.endsWith("/") || url.endsWith(".html")) return match;
            return `<loc>${url}.html</loc>`;
          });
          await writeFile(filePath, xml, "utf-8");
        }
      },
    },
  };
}
