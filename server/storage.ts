import fs from "fs";
import path from "path";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";
import { insertAppSchema, type App, type InsertApp, type User, type InsertUser } from "@shared/schema";
import { z } from "zod";

const PostgresSessionStore = connectPg(session);

export function setupAuth(app: import("express").Express) {
  app.use(
    session({
      store: new PostgresSessionStore({ pool, createTableIfMissing: true }),
      secret: process.env.SESSION_SECRET || "dev-tools-store-secret",
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
    })
  );
}

export interface IStorage {
  // Apps
  getApps(): Promise<App[]>;
  getApp(id: number): Promise<App | undefined>;
  createApp(app: InsertApp): Promise<App>;
  updateApp(id: number, updates: Partial<InsertApp>): Promise<App>;
  deleteApp(id: number): Promise<void>;
  incrementDownloadCount(id: number): Promise<App>;

  // Stats
  getStats(): Promise<{ visitorCount: number; totalDownloads: number }>;
  incrementVisitorCount(): Promise<{ visitorCount: number }>;

  // Users
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

const APPS_FILE = path.join(process.cwd(), "apps.json");
const STATS_FILE = path.join(process.cwd(), "stats.json");
const USERS_FILE = path.join(process.cwd(), "users.json");

function readAppsFile(): App[] {
  try {
    if (!fs.existsSync(APPS_FILE)) {
      return [];
    }
    const data = fs.readFileSync(APPS_FILE, "utf-8");
    return JSON.parse(data) || [];
  } catch (err) {
    console.error("Error reading apps.json:", err);
    return [];
  }
}

function writeAppsFile(apps: App[]): void {
  try {
    fs.writeFileSync(APPS_FILE, JSON.stringify(apps, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing apps.json:", err);
  }
}

function readStatsFile(): { visitorCount: number } {
  try {
    if (!fs.existsSync(STATS_FILE)) {
      return { visitorCount: 0 };
    }
    const data = fs.readFileSync(STATS_FILE, "utf-8");
    return JSON.parse(data) || { visitorCount: 0 };
  } catch (err) {
    console.error("Error reading stats.json:", err);
    return { visitorCount: 0 };
  }
}

function writeStatsFile(stats: { visitorCount: number }): void {
  try {
    fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing stats.json:", err);
  }
}

function readUsersFile(): User[] {
  try {
    if (!fs.existsSync(USERS_FILE)) {
      return [];
    }
    const data = fs.readFileSync(USERS_FILE, "utf-8");
    return JSON.parse(data) || [];
  } catch (err) {
    console.error("Error reading users.json:", err);
    return [];
  }
}

function writeUsersFile(users: User[]): void {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing users.json:", err);
  }
}

export class FileStorage implements IStorage {
  async getApps(): Promise<App[]> {
    return readAppsFile();
  }

  async getApp(id: number): Promise<App | undefined> {
    const apps = readAppsFile();
    return apps.find(app => app.id === id);
  }

  async createApp(app: InsertApp): Promise<App> {
    const apps = readAppsFile();
    const nextId = apps.length > 0 ? Math.max(...apps.map(a => a.id)) + 1 : 1;
    const newApp: App = {
      id: nextId,
      name: app.name,
      iconUrl: app.iconUrl,
      downloadLink: app.downloadLink,
      downloadCount: 0
    };
    apps.push(newApp);
    writeAppsFile(apps);
    return newApp;
  }

  async updateApp(id: number, updates: Partial<InsertApp>): Promise<App> {
    const apps = readAppsFile();
    const index = apps.findIndex(app => app.id === id);
    if (index === -1) throw new Error("App not found");
    
    const updated = {
      ...apps[index],
      ...updates
    };
    apps[index] = updated;
    writeAppsFile(apps);
    return updated;
  }

  async deleteApp(id: number): Promise<void> {
    const apps = readAppsFile();
    const filtered = apps.filter(app => app.id !== id);
    writeAppsFile(filtered);
  }

  async incrementDownloadCount(id: number): Promise<App> {
    const apps = readAppsFile();
    const index = apps.findIndex(app => app.id === id);
    if (index === -1) throw new Error("App not found");
    
    apps[index].downloadCount += 1;
    writeAppsFile(apps);
    return apps[index];
  }

  async getStats(): Promise<{ visitorCount: number; totalDownloads: number }> {
    const stats = readStatsFile();
    const apps = readAppsFile();
    const totalDownloads = apps.reduce((acc, app) => acc + app.downloadCount, 0);
    
    return {
      visitorCount: stats.visitorCount,
      totalDownloads
    };
  }

  async incrementVisitorCount(): Promise<{ visitorCount: number }> {
    const stats = readStatsFile();
    stats.visitorCount += 1;
    writeStatsFile(stats);
    return { visitorCount: stats.visitorCount };
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const users = readUsersFile();
    return users.find(user => user.username === username);
  }

  async createUser(user: InsertUser): Promise<User> {
    const users = readUsersFile();
    const nextId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const newUser: User = {
      id: nextId,
      username: user.username,
      password: user.password
    };
    users.push(newUser);
    writeUsersFile(users);
    return newUser;
  }
}

export const storage = new FileStorage();
