import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  // In production, the bundled server and public directory are in the same dist folder
  // __dirname will be the dist directory when the code is bundled by esbuild
  const distPath = path.join(__dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}. Make sure to run 'npm run build' first.`
    );
  }

  // Serve static files
  app.use(express.static(distPath));

  // SPA fallback route
  app.use("/*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}
