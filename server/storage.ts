import {
  type Task,
  type InsertTask,
  type FocusSession,
  type InsertFocusSession,
  type SessionTelemetry,
  type InsertSessionTelemetry,
  type SecurityMetric,
  type InsertSecurityMetric,
  type User,
  type InsertUser,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Task operations
  getTasks(): Promise<Task[]>;
  getTask(id: string): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, task: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: string): Promise<boolean>;

  // Focus Session operations
  getFocusSessions(): Promise<FocusSession[]>;
  getFocusSession(id: string): Promise<FocusSession | undefined>;
  createFocusSession(session: InsertFocusSession): Promise<FocusSession>;
  updateFocusSession(id: string, session: Partial<InsertFocusSession>): Promise<FocusSession | undefined>;

  // Session Telemetry operations
  getSessionTelemetry(sessionId: string): Promise<SessionTelemetry[]>;
  createSessionTelemetry(telemetry: InsertSessionTelemetry): Promise<SessionTelemetry>;

  // Security Metrics operations
  getSecurityMetrics(): Promise<SecurityMetric[]>;
  getLatestSecurityMetric(): Promise<SecurityMetric | undefined>;
  createSecurityMetric(metric: InsertSecurityMetric): Promise<SecurityMetric>;

  // User operations (existing)
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class MemStorage implements IStorage {
  private tasks: Map<string, Task>;
  private focusSessions: Map<string, FocusSession>;
  private sessionTelemetry: Map<string, SessionTelemetry>;
  private securityMetrics: Map<string, SecurityMetric>;
  private users: Map<string, User>;

  constructor() {
    this.tasks = new Map();
    this.focusSessions = new Map();
    this.sessionTelemetry = new Map();
    this.securityMetrics = new Map();
    this.users = new Map();

    // Initialize with some sample data for development
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample tasks
    const sampleTasks: Task[] = [
      {
        id: "1",
        title: "Implement AES-256 encryption for local storage",
        notes: "Use Web Crypto API for client-side encryption",
        dueDate: new Date("2025-10-30"),
        durationMinutes: 120,
        energyCost: 4,
        value: 90,
        dependsOn: [],
        completed: false,
        createdAt: new Date("2025-10-24"),
      },
      {
        id: "2",
        title: "Design dependency graph visualization",
        notes: "Interactive graph with cycle detection",
        dueDate: new Date("2025-10-28"),
        durationMinutes: 90,
        energyCost: 3,
        value: 75,
        dependsOn: [],
        completed: false,
        createdAt: new Date("2025-10-24"),
      },
      {
        id: "3",
        title: "Write unit tests for scheduler algorithm",
        notes: "Cover greedy and knapsack variants",
        dueDate: null,
        durationMinutes: 60,
        energyCost: 2,
        value: 85,
        dependsOn: ["4"],
        completed: false,
        createdAt: new Date("2025-10-23"),
      },
      {
        id: "4",
        title: "Implement greedy scheduler",
        notes: "Sort by value/duration ratio",
        dueDate: new Date("2025-10-26"),
        durationMinutes: 45,
        energyCost: 3,
        value: 95,
        dependsOn: [],
        completed: true,
        createdAt: new Date("2025-10-22"),
      },
    ];

    sampleTasks.forEach((task) => this.tasks.set(task.id, task));

    // Initial security metric
    const initialMetric: SecurityMetric = {
      id: randomUUID(),
      date: new Date(),
      healthScore: 95,
      securityTasksCompleted: 8,
      lateNightWorkSessions: 1,
      sensitiveDataExposures: 0,
    };
    this.securityMetrics.set(initialMetric.id, initialMetric);
  }

  // Task operations
  async getTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getTask(id: string): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = randomUUID();
    const task: Task = {
      ...insertTask,
      id,
      createdAt: new Date(),
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: string, updates: Partial<InsertTask>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;

    const updatedTask = { ...task, ...updates };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: string): Promise<boolean> {
    return this.tasks.delete(id);
  }

  // Focus Session operations
  async getFocusSessions(): Promise<FocusSession[]> {
    return Array.from(this.focusSessions.values()).sort(
      (a, b) => b.startedAt.getTime() - a.startedAt.getTime()
    );
  }

  async getFocusSession(id: string): Promise<FocusSession | undefined> {
    return this.focusSessions.get(id);
  }

  async createFocusSession(insertSession: InsertFocusSession): Promise<FocusSession> {
    const id = randomUUID();
    const session: FocusSession = {
      ...insertSession,
      id,
      startedAt: new Date(),
    };
    this.focusSessions.set(id, session);
    return session;
  }

  async updateFocusSession(
    id: string,
    updates: Partial<InsertFocusSession>
  ): Promise<FocusSession | undefined> {
    const session = this.focusSessions.get(id);
    if (!session) return undefined;

    const updatedSession = { ...session, ...updates };
    this.focusSessions.set(id, updatedSession);
    return updatedSession;
  }

  // Session Telemetry operations
  async getSessionTelemetry(sessionId: string): Promise<SessionTelemetry[]> {
    return Array.from(this.sessionTelemetry.values())
      .filter((t) => t.sessionId === sessionId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async createSessionTelemetry(insertTelemetry: InsertSessionTelemetry): Promise<SessionTelemetry> {
    const id = randomUUID();
    const telemetry: SessionTelemetry = {
      ...insertTelemetry,
      id,
      createdAt: new Date(),
    };
    this.sessionTelemetry.set(id, telemetry);
    return telemetry;
  }

  // Security Metrics operations
  async getSecurityMetrics(): Promise<SecurityMetric[]> {
    return Array.from(this.securityMetrics.values()).sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    );
  }

  async getLatestSecurityMetric(): Promise<SecurityMetric | undefined> {
    const metrics = await this.getSecurityMetrics();
    return metrics[0];
  }

  async createSecurityMetric(insertMetric: InsertSecurityMetric): Promise<SecurityMetric> {
    const id = randomUUID();
    const metric: SecurityMetric = {
      ...insertMetric,
      id,
      date: new Date(),
    };
    this.securityMetrics.set(id, metric);
    return metric;
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
}

export const storage = new MemStorage();
