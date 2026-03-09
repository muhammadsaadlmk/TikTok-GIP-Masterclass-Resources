import type { Express } from "express";
import type { Server } from "http";
import { storage, setupAuth } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

declare module "express-session" {
  interface SessionData {
    userId?: number;
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  setupAuth(app);

  // GET ALL APPS
  app.get(api.apps.list.path, async (_req, res) => {
    try {
      const apps = await storage.getApps();
      res.status(200).json(apps);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch apps" });
    }
  });

  // GET SINGLE APP
  app.get(api.apps.get.path, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const appData = await storage.getApp(id);

      if (!appData) {
        return res.status(404).json({ message: "App not found" });
      }

      res.status(200).json(appData);
    } catch {
      res.status(500).json({ message: "Failed to fetch app" });
    }
  });

  // CREATE APP
  app.post(api.apps.create.path, async (req, res) => {

    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const input = api.apps.create.input.parse(req.body);
      const newApp = await storage.createApp(input);

      res.status(201).json(newApp);

    } catch (err) {

      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }

      res.status(500).json({ message: "Failed to create app" });
    }
  });

  // UPDATE APP
  app.put(api.apps.update.path, async (req, res) => {

    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {

      const id = Number(req.params.id);
      const input = api.apps.update.input.parse(req.body);

      const updated = await storage.updateApp(id, input);

      res.status(200).json(updated);

    } catch (err) {

      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }

      if (err instanceof Error && err.message === "App not found") {
        return res.status(404).json({ message: "App not found" });
      }

      res.status(500).json({ message: "Failed to update app" });
    }
  });

  // DELETE APP
  app.delete(api.apps.delete.path, async (req, res) => {

    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const id = Number(req.params.id);

      await storage.deleteApp(id);

      res.status(204).send();

    } catch {
      res.status(500).json({ message: "Failed to delete app" });
    }
  });

  // INCREMENT DOWNLOAD
  app.post(api.apps.incrementDownload.path, async (req, res) => {

    try {
      const id = Number(req.params.id);

      const updated = await storage.incrementDownloadCount(id);

      res.status(200).json(updated);

    } catch {
      res.status(404).json({ message: "App not found" });
    }
  });

  // GET STATS
  app.get(api.stats.get.path, async (_req, res) => {

    try {
      const stats = await storage.getStats();
      res.status(200).json(stats);

    } catch {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // VISITOR COUNT
  app.post(api.stats.incrementVisitor.path, async (_req, res) => {

    try {
      const stats = await storage.incrementVisitorCount();
      res.status(200).json(stats);

    } catch {
      res.status(500).json({ message: "Failed to update visitor count" });
    }
  });

  // LOGIN
  app.post(api.auth.login.path, async (req, res) => {

    const { username, password } = req.body;

    const user = await storage.getUserByUsername(username);

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    req.session.userId = user.id;

    res.status(200).json({ message: "Logged in successfully" });
  });

  // LOGOUT
  app.post(api.auth.logout.path, (req, res) => {

    req.session.destroy(() => {
      res.status(200).json({ message: "Logged out successfully" });
    });
  });

  // CURRENT USER
  app.get(api.auth.me.path, (req, res) => {

    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    res.status(200).json({ username: "admin" });
  });

  // SEED DATA
  async function seedDatabase() {

    const admin = await storage.getUserByUsername("admin");

    if (!admin) {
      await storage.createUser({
        username: "admin",
        password: "password123",
      });
    }

    const apps = await storage.getApps();

    if (apps.length === 0) {

      const sampleApps = [
        {
          name: "Termux",
          iconUrl: "https://upload.wikimedia.org/wikipedia/commons/4/45/Termux-logo.png",
          downloadLink: "https://f-droid.org/repo/com.termux_118.apk",
          downloadCount: 80
        }
      ];

      for (const app of sampleApps) {
        await storage.createApp(app);
      }
    }
  }

  seedDatabase().catch(console.error);

  return httpServer;
}
