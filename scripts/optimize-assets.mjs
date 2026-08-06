#!/usr/bin/env node
/**
 * Compress local images and mirror remote proof/gaming assets for offline-friendly loads.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const imagesDir = join(root, "public", "images");
const sourceDir = join(root, "assets", "source-images");
const fontsDir = join(root, "public", "fonts");
const dribbbleDir = join(imagesDir, "dribbble");

mkdirSync(dribbbleDir, { recursive: true });
mkdirSync(sourceDir, { recursive: true });

async function writeWebp(inputPath, outputPath, options) {
  await sharp(inputPath).webp(options).toFile(outputPath);
  console.log(`Wrote ${outputPath}`);
}

async function fetchToFile(url, outputPath) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed ${url}: ${response.status}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  writeFileSync(outputPath, buffer);
  console.log(`Downloaded ${outputPath}`);
  return buffer;
}

const heroSource = join(sourceDir, "hero-visual.png");
const portraitSource = join(sourceDir, "profile-ai.png");

// Hero LCP (~1200px wide WebP)
await writeWebp(heroSource, join(imagesDir, "hero-visual.webp"), {
  quality: 78,
  effort: 6,
});

// About portrait
await writeWebp(portraitSource, join(imagesDir, "profile-portrait.webp"), {
  quality: 80,
  effort: 6,
});

// Tiny header avatar (128px)
await sharp(portraitSource)
  .resize(128, 128, { fit: "cover", position: "top" })
  .webp({ quality: 82, effort: 6 })
  .toFile(join(imagesDir, "avatar.webp"));
console.log("Wrote avatar.webp");

// Floating card / medium avatar
await sharp(portraitSource)
  .resize(256, 256, { fit: "cover", position: "top" })
  .webp({ quality: 82, effort: 6 })
  .toFile(join(imagesDir, "avatar-md.webp"));
console.log("Wrote avatar-md.webp");

const dribbbleShots = [
  {
    id: "22590088",
    url: "https://cdn.dribbble.com/userupload/10148182/file/original-432327ba34cce9252e73a1b43a71618e.png?resize=800x600",
  },
  {
    id: "22558795",
    url: "https://cdn.dribbble.com/userupload/10064319/file/original-58952c4958167b6b39e7f8296719964c.png?resize=800x600",
  },
  {
    id: "22557112",
    url: "https://cdn.dribbble.com/userupload/10060368/file/original-10391ccd957f46a3ebb86dbf98b9c12b.png?resize=800x600",
  },
  {
    id: "22556701",
    url: "https://cdn.dribbble.com/userupload/10059354/file/original-02f93ec73eaf2e896d609ef6f545bfd4.png?resize=800x600",
  },
  {
    id: "22543931",
    url: "https://cdn.dribbble.com/userupload/10026736/file/original-634193911321a447e8aa1f4a850ae747.png?resize=800x600",
  },
  {
    id: "22393381",
    url: "https://cdn.dribbble.com/userupload/9619367/file/original-8b2d9bd46583773e14e13b178b655cfa.png?resize=800x600",
  },
];

for (const shot of dribbbleShots) {
  try {
    const webpPath = join(dribbbleDir, `${shot.id}.webp`);
    const buffer = Buffer.from(await (await fetch(shot.url)).arrayBuffer());
    await sharp(buffer)
      .resize(800, 600, { fit: "cover" })
      .webp({ quality: 75, effort: 6 })
      .toFile(webpPath);
    console.log(`Wrote ${webpPath}`);
  } catch (error) {
    console.warn(`Skip dribbble ${shot.id}:`, error.message);
  }
}

// Press Start 2P — local for gaming mode (no Google Fonts at runtime)
try {
  const cssUrl =
    "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap";
  const cssResponse = await fetch(cssUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });
  const css = await cssResponse.text();
  const fontUrl = css.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/)?.[1];
  if (!fontUrl) throw new Error("Could not parse Press Start 2P font URL");
  await fetchToFile(fontUrl, join(fontsDir, "PressStart2P-Regular.woff2"));
} catch (error) {
  console.warn("Skip Press Start 2P download:", error.message);
}

console.log("Asset optimization complete.");
