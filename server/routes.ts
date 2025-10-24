import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTaskSchema, insertFocusSessionSchema, insertSessionTelemetrySchema } from "@shared/schema";
import { scheduleOptimal, scheduleGreedy, scheduleKnapsackDP } from "./algorithms/scheduler";
import {
  hasCycle,
  wouldCreateCycle,
  getDependentTasks,
  tasksToGraphNodes,
  topologicalSort,
} from "./algorithms/graph";
import { calculateSecurityHealth, getSecurityRecommendations } from "./algorithms/security";

export async function registerRoutes(app: Express): Promise<Server> {
  // ============================================================================
  // TASK ROUTES
  // ============================================================================

  // Get all tasks
  app.get("/api/tasks", async (_req, res) => {
    try {
      const tasks = await storage.getTasks();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

  // Get single task
  app.get("/api/tasks/:id", async (req, res) => {
    try {
      const task = await storage.getTask(req.params.id);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch task" });
    }
  });

  // Create task
  app.post("/api/tasks", async (req, res) => {
    try {
      const parsed = insertTaskSchema.parse(req.body);
      
      // Check if adding dependencies would create a cycle
      if (parsed.dependsOn && parsed.dependsOn.length > 0) {
        const allTasks = await storage.getTasks();
        const tempTask = {
          id: "temp",
          ...parsed,
          createdAt: new Date(),
        };
        
        if (hasCycle([...allTasks, tempTask])) {
          return res.status(400).json({
            error: "Cannot create task: would create circular dependency",
          });
        }
      }
      
      const task = await storage.createTask(parsed);
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ error: "Invalid task data" });
    }
  });

  // Update task
  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      const parsed = insertTaskSchema.partial().parse(req.body);
      
      // Check for cycle if dependencies are being updated
      if (parsed.dependsOn) {
        const allTasks = await storage.getTasks();
        const updatedTasks = allTasks.map((t) =>
          t.id === req.params.id ? { ...t, dependsOn: parsed.dependsOn! } : t
        );
        
        if (hasCycle(updatedTasks)) {
          return res.status(400).json({
            error: "Cannot update task: would create circular dependency",
          });
        }
      }
      
      const task = await storage.updateTask(req.params.id, parsed);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(400).json({ error: "Invalid task data" });
    }
  });

  // Delete task
  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      // Check if any other tasks depend on this one
      const allTasks = await storage.getTasks();
      const dependents = getDependentTasks(allTasks, req.params.id);
      
      if (dependents.length > 0) {
        return res.status(400).json({
          error: `Cannot delete task: ${dependents.length} other task(s) depend on it`,
          dependents: dependents.map((t) => ({ id: t.id, title: t.title })),
        });
      }
      
      const deleted = await storage.deleteTask(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete task" });
    }
  });

  // ============================================================================
  // SCHEDULER ROUTES
  // ============================================================================

  // Generate optimal schedule
  app.post("/api/schedule", async (req, res) => {
    try {
      const { timeBudgetMinutes, energyBudget, taskIds, algorithm } = req.body;

      if (!timeBudgetMinutes || !energyBudget) {
        return res.status(400).json({ error: "timeBudgetMinutes and energyBudget are required" });
      }

      let tasks = await storage.getTasks();

      // Filter to specific tasks if provided
      if (taskIds && Array.isArray(taskIds)) {
        tasks = tasks.filter((t) => taskIds.includes(t.id));
      }

      // Use specified algorithm or auto-select
      let result;
      if (algorithm === "greedy") {
        result = scheduleGreedy(tasks, timeBudgetMinutes, energyBudget);
      } else if (algorithm === "knapsack") {
        result = scheduleKnapsackDP(tasks, timeBudgetMinutes, energyBudget);
      } else {
        result = scheduleOptimal(tasks, timeBudgetMinutes, energyBudget);
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate schedule" });
    }
  });

  // ============================================================================
  // DEPENDENCY GRAPH ROUTES
  // ============================================================================

  // Get dependency graph
  app.get("/api/graph", async (_req, res) => {
    try {
      const tasks = await storage.getTasks();
      const nodes = tasksToGraphNodes(tasks);
      const hasCycleDetected = hasCycle(tasks);
      const sortedTasks = topologicalSort(tasks);

      res.json({
        nodes,
        hasCycle: hasCycleDetected,
        topologicalOrder: sortedTasks ? sortedTasks.map((t) => t.id) : null,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate graph" });
    }
  });

  // Check if adding dependency would create cycle
  app.post("/api/graph/check-cycle", async (req, res) => {
    try {
      const { taskId, dependencyId } = req.body;

      if (!taskId || !dependencyId) {
        return res.status(400).json({ error: "taskId and dependencyId are required" });
      }

      const tasks = await storage.getTasks();
      const wouldCycle = wouldCreateCycle(tasks, taskId, dependencyId);

      res.json({ wouldCreateCycle: wouldCycle });
    } catch (error) {
      res.status(500).json({ error: "Failed to check cycle" });
    }
  });

  // ============================================================================
  // FOCUS SESSION ROUTES
  // ============================================================================

  // Get all focus sessions
  app.get("/api/sessions", async (_req, res) => {
    try {
      const sessions = await storage.getFocusSessions();
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sessions" });
    }
  });

  // Get single session
  app.get("/api/sessions/:id", async (req, res) => {
    try {
      const session = await storage.getFocusSession(req.params.id);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch session" });
    }
  });

  // Create focus session
  app.post("/api/sessions", async (req, res) => {
    try {
      const parsed = insertFocusSessionSchema.parse(req.body);
      const session = await storage.createFocusSession(parsed);
      res.status(201).json(session);
    } catch (error) {
      res.status(400).json({ error: "Invalid session data" });
    }
  });

  // Update focus session
  app.patch("/api/sessions/:id", async (req, res) => {
    try {
      const parsed = insertFocusSessionSchema.partial().parse(req.body);
      const session = await storage.updateFocusSession(req.params.id, parsed);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(400).json({ error: "Invalid session data" });
    }
  });

  // ============================================================================
  // SESSION TELEMETRY ROUTES
  // ============================================================================

  // Get telemetry for a session
  app.get("/api/sessions/:sessionId/telemetry", async (req, res) => {
    try {
      const telemetry = await storage.getSessionTelemetry(req.params.sessionId);
      res.json(telemetry);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch telemetry" });
    }
  });

  // Create telemetry record
  app.post("/api/telemetry", async (req, res) => {
    try {
      const parsed = insertSessionTelemetrySchema.parse(req.body);
      const telemetry = await storage.createSessionTelemetry(parsed);
      res.status(201).json(telemetry);
    } catch (error) {
      res.status(400).json({ error: "Invalid telemetry data" });
    }
  });

  // ============================================================================
  // SECURITY HEALTH ROUTES
  // ============================================================================

  // Get current security health
  app.get("/api/security/health", async (_req, res) => {
    try {
      const tasks = await storage.getTasks();
      const sessions = await storage.getFocusSessions();
      const healthData = calculateSecurityHealth(tasks, sessions);
      res.json(healthData);
    } catch (error) {
      res.status(500).json({ error: "Failed to calculate security health" });
    }
  });

  // Get security recommendations
  app.get("/api/security/recommendations", async (_req, res) => {
    try {
      const tasks = await storage.getTasks();
      const recommendations = getSecurityRecommendations(tasks);
      res.json({ recommendations });
    } catch (error) {
      res.status(500).json({ error: "Failed to get recommendations" });
    }
  });

  // Get security metrics history
  app.get("/api/security/metrics", async (_req, res) => {
    try {
      const metrics = await storage.getSecurityMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch security metrics" });
    }
  });

  // ============================================================================
  // ANALYTICS ROUTES
  // ============================================================================

  // Get analytics summary
  app.get("/api/analytics/summary", async (_req, res) => {
    try {
      const tasks = await storage.getTasks();
      const sessions = await storage.getFocusSessions();

      const totalSessions = sessions.length;
      const totalTime = sessions.reduce((sum, s) => sum + s.totalDuration, 0);
      const avgSessionTime = totalSessions > 0 ? totalTime / totalSessions / 60 : 0; // Convert to minutes
      const tasksCompleted = tasks.filter((t) => t.completed).length;
      const totalInterruptions = sessions.reduce((sum, s) => sum + s.interruptions, 0);
      
      // Calculate average energy from completed tasks
      const completedTasks = tasks.filter((t) => t.completed);
      const avgEnergy = completedTasks.length > 0
        ? completedTasks.reduce((sum, t) => sum + t.energyCost, 0) / completedTasks.length
        : 0;

      res.json({
        totalSessions,
        totalTime: Math.round(totalTime / 60), // minutes
        avgSessionTime: Math.round(avgSessionTime),
        tasksCompleted,
        interruptions: totalInterruptions,
        avgEnergy: Number(avgEnergy.toFixed(1)),
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate analytics" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
