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

  app.get(api.apps.list.path, async (req, res) => {
    const allApps = await storage.getApps();
    res.status(200).json(allApps);
  });

  app.get(api.apps.get.path, async (req, res) => {
    const appData = await storage.getApp(Number(req.params.id));
    if (!appData) {
      return res.status(404).json({ message: "App not found" });
    }
    res.status(200).json(appData);
  });

  app.post(api.apps.create.path, async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ message: "Unauthorized" });
    try {
      const input = api.apps.create.input.parse(req.body);
      const newApp = await storage.createApp(input);
      res.status(201).json(newApp);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  app.put(api.apps.update.path, async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ message: "Unauthorized" });
    try {
      const input = api.apps.update.input.parse(req.body);
      const updated = await storage.updateApp(Number(req.params.id), input);
      res.status(200).json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      if (err instanceof Error && err.message === "App not found") {
        return res.status(404).json({ message: "App not found" });
      }
      throw err;
    }
  });

  app.delete(api.apps.delete.path, async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ message: "Unauthorized" });
    await storage.deleteApp(Number(req.params.id));
    res.status(204).send();
  });

  app.post(api.apps.incrementDownload.path, async (req, res) => {
    try {
      const updated = await storage.incrementDownloadCount(Number(req.params.id));
      res.status(200).json(updated);
    } catch (err) {
      return res.status(404).json({ message: "App not found" });
    }
  });

  app.get(api.stats.get.path, async (req, res) => {
    const st = await storage.getStats();
    res.status(200).json(st);
  });

  app.post(api.stats.incrementVisitor.path, async (req, res) => {
    const st = await storage.incrementVisitorCount();
    res.status(200).json(st);
  });

  app.post(api.auth.login.path, async (req, res) => {
    const { username, password } = req.body;
    const user = await storage.getUserByUsername(username);
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    req.session.userId = user.id;
    res.status(200).json({ message: "Logged in successfully" });
  });

  app.post(api.auth.logout.path, (req, res) => {
    req.session.destroy(() => {
      res.status(200).json({ message: "Logged out successfully" });
    });
  });

  app.get(api.auth.me.path, async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    res.status(200).json({ username: "admin" });
  });

  async function seedDatabase() {
    const existingAdmin = await storage.getUserByUsername("admin");
    if (!existingAdmin) {
      await storage.createUser({ username: "admin", password: "password123" });
    }

    const existingApps = await storage.getApps();
    if (existingApps.length === 0) {
      const sampleApps = [
        { name: "Termux", iconUrl: "https://upload.wikimedia.org/wikipedia/commons/4/45/Termux-logo.png", downloadLink: "https://f-droid.org/repo/com.termux_118.apk", downloadCount: 80 },
        { name: "NP Manager", iconUrl: "https://play-lh.googleusercontent.com/yvjD-bS9J_JvBXZr128y0NnOq20G9B22MvA7l07tX8zN54b9w_R300VwA3u9fQ=w240-h480-rw", downloadLink: "https://example.com/npmanager.apk", downloadCount: 51 },
        { name: "ZArchiver", iconUrl: "https://play-lh.googleusercontent.com/1GZOqA5-aT4-nS4Z90j3D4zBf6Bw8I7y9M16cZfA8H35a-w4bV3w0vV8D_q1D9Fq=w240-h480-rw", downloadLink: "https://example.com/zarchiver.apk", downloadCount: 18 },
        { name: "Lucky Patcher", iconUrl: "https://www.luckypatchers.com/wp-content/uploads/2016/12/lucky-patcher-icon-150x150.png", downloadLink: "https://example.com/luckypatcher.apk", downloadCount: 56 },
        { name: "APK Editor", iconUrl: "https://play-lh.googleusercontent.com/P4wZ-1aX-xV9pW100D58K_P3h3aY8I_B8I1E6G44Z_C5tE3Q4x_J3Z757tW=w240-h480-rw", downloadLink: "https://example.com/apkeditor.apk", downloadCount: 91 },
        { name: "MT Manager", iconUrl: "https://play-lh.googleusercontent.com/4J10X5Q_O6_33D72Q_g4aG9S1B_U2B5N8c3n9G2K_6v6w2N4u03X92W5M0x3eQ=w240-h480-rw", downloadLink: "https://example.com/mtmanager.apk", downloadCount: 63 },
        { name: "Bot X Dialog", iconUrl: "https://i.ibb.co/L5Q2G8W/botx.png", downloadLink: "https://example.com/botxdialog.apk", downloadCount: 84 },
        { name: "APK Tool M", iconUrl: "https://i.ibb.co/3sDZXkG/apktoolm.png", downloadLink: "https://example.com/apktoolm.apk", downloadCount: 109 }
      ];
      for (const app of sampleApps) {
        await storage.createApp(app);
      }
    }
  }

  seedDatabase().catch(console.error);

  return httpServer;
}
