import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Tasks table - core task management
export const tasks = pgTable("tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  notes: text("notes"),
  dueDate: timestamp("due_date"),
  durationMinutes: integer("duration_minutes").notNull().default(30),
  energyCost: integer("energy_cost").notNull().default(3), // 1-5 scale
  value: integer("value").notNull().default(50), // 1-100 priority score
  dependsOn: text("depends_on").array().notNull().default([]), // array of task IDs
  completed: boolean("completed").notNull().default(false),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
}).extend({
  durationMinutes: z.number().min(1).max(480), // 1 min to 8 hours
  energyCost: z.number().min(1).max(5),
  value: z.number().min(1).max(100),
});

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;

// Focus Sessions table - tracking session history
export const focusSessions = pgTable("focus_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  startedAt: timestamp("started_at").notNull().default(sql`now()`),
  endedAt: timestamp("ended_at"),
  totalDuration: integer("total_duration").notNull().default(0), // in seconds
  tasksCompleted: integer("tasks_completed").notNull().default(0),
  interruptions: integer("interruptions").notNull().default(0),
  pauseCount: integer("pause_count").notNull().default(0),
  taskIds: text("task_ids").array().notNull().default([]),
});

export const insertFocusSessionSchema = createInsertSchema(focusSessions).omit({
  id: true,
  startedAt: true,
});

export type InsertFocusSession = z.infer<typeof insertFocusSessionSchema>;
export type FocusSession = typeof focusSessions.$inferSelect;

// Session Telemetry - detailed task-level tracking within sessions
export const sessionTelemetry = pgTable("session_telemetry", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull(),
  taskId: varchar("task_id").notNull(),
  estimatedMinutes: integer("estimated_minutes").notNull(),
  actualSeconds: integer("actual_seconds").notNull(),
  completedInSession: boolean("completed_in_session").notNull().default(false),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertSessionTelemetrySchema = createInsertSchema(sessionTelemetry).omit({
  id: true,
  createdAt: true,
});

export type InsertSessionTelemetry = z.infer<typeof insertSessionTelemetrySchema>;
export type SessionTelemetry = typeof sessionTelemetry.$inferSelect;

// Security Metrics - tracking security health over time
export const securityMetrics = pgTable("security_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: timestamp("date").notNull().default(sql`now()`),
  healthScore: integer("health_score").notNull().default(100), // 0-100
  securityTasksCompleted: integer("security_tasks_completed").notNull().default(0),
  lateNightWorkSessions: integer("late_night_work_sessions").notNull().default(0),
  sensitiveDataExposures: integer("sensitive_data_exposures").notNull().default(0),
});

export const insertSecurityMetricSchema = createInsertSchema(securityMetrics).omit({
  id: true,
  date: true,
});

export type InsertSecurityMetric = z.infer<typeof insertSecurityMetricSchema>;
export type SecurityMetric = typeof securityMetrics.$inferSelect;

// Frontend-only types for scheduling and UI
export interface ScheduleRequest {
  timeBudgetMinutes: number;
  energyBudget: number; // 1-5
  taskIds?: string[]; // optional filter
}

export interface ScheduleResult {
  selectedTasks: Task[];
  totalDuration: number;
  totalEnergy: number;
  totalValue: number;
  algorithm: 'greedy' | 'knapsack_dp';
  explanation: string;
}

export interface DependencyGraphNode {
  id: string;
  title: string;
  completed: boolean;
  value: number;
  dependsOn: string[];
}

export interface SessionState {
  isActive: boolean;
  currentTaskIndex: number;
  tasks: Task[];
  startTime: number;
  elapsedSeconds: number;
  isPaused: boolean;
  interruptions: number;
  pauseCount: number;
}

export interface SecurityHealthData {
  currentScore: number;
  recommendations: string[];
  recentActivity: {
    securityTasksCompleted: number;
    totalTasksCompleted: number;
    lateNightSessions: number;
  };
  badges: {
    name: string;
    earned: boolean;
    description: string;
  }[];
}

// Users (existing, keep for future auth if needed)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
