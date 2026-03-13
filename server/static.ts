import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const distPath = path.join(__dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}. Make sure to run 'npm run build' first.`
    );
  }

  // serve static files
  app.use(express.static(distPath));

  // SPA fallback (IMPORTANT FIX)
  app.use(/.*/, (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}
