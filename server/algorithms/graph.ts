import type { Task, DependencyGraphNode } from "@shared/schema";

/**
 * Detect cycles in task dependency graph using DFS
 * Time complexity: O(V + E) where V = number of tasks, E = number of dependencies
 * Space complexity: O(V) for visited and recursion stack sets
 * 
 * Returns true if a cycle is detected, false otherwise
 */
export function hasCycle(tasks: Task[]): boolean {
  // Build adjacency list: taskId -> [dependentTaskIds]
  const graph = new Map<string, string[]>();
  
  for (const task of tasks) {
    if (!graph.has(task.id)) {
      graph.set(task.id, []);
    }
    for (const depId of task.dependsOn) {
      if (!graph.has(depId)) {
        graph.set(depId, []);
      }
      // Add edge from dependency to task (reversed for topological sort)
      graph.get(depId)!.push(task.id);
    }
  }

  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  function dfs(nodeId: string): boolean {
    // If node is in recursion stack, we found a cycle
    if (recursionStack.has(nodeId)) {
      return true;
    }

    // If already visited (and not in recursion stack), no cycle from this node
    if (visited.has(nodeId)) {
      return false;
    }

    // Mark as visited and add to recursion stack
    visited.add(nodeId);
    recursionStack.add(nodeId);

    // Explore all neighbors
    const neighbors = graph.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (dfs(neighbor)) {
        return true;
      }
    }

    // Remove from recursion stack when backtracking
    recursionStack.delete(nodeId);
    return false;
  }

  // Run DFS from each unvisited node
  for (const nodeId of graph.keys()) {
    if (!visited.has(nodeId)) {
      if (dfs(nodeId)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Check if adding a new dependency would create a cycle
 */
export function wouldCreateCycle(
  tasks: Task[],
  taskId: string,
  newDependencyId: string
): boolean {
  // Create a temporary task list with the new dependency
  const updatedTasks = tasks.map((task) => {
    if (task.id === taskId) {
      return {
        ...task,
        dependsOn: [...task.dependsOn, newDependencyId],
      };
    }
    return task;
  });

  return hasCycle(updatedTasks);
}

/**
 * Get all tasks that depend on a given task (directly or indirectly)
 */
export function getDependentTasks(tasks: Task[], taskId: string): Task[] {
  const dependents = new Set<string>();
  
  function findDependents(id: string) {
    for (const task of tasks) {
      if (task.dependsOn.includes(id) && !dependents.has(task.id)) {
        dependents.add(task.id);
        findDependents(task.id);
      }
    }
  }

  findDependents(taskId);
  return tasks.filter((t) => dependents.has(t.id));
}

/**
 * Convert tasks to graph nodes for visualization
 */
export function tasksToGraphNodes(tasks: Task[]): DependencyGraphNode[] {
  return tasks.map((task) => ({
    id: task.id,
    title: task.title,
    completed: task.completed,
    value: task.value,
    dependsOn: task.dependsOn,
  }));
}

/**
 * Topological sort of tasks (for scheduling in dependency order)
 * Returns null if graph has a cycle
 */
export function topologicalSort(tasks: Task[]): Task[] | null {
  if (hasCycle(tasks)) {
    return null;
  }

  const sorted: Task[] = [];
  const visited = new Set<string>();
  const temp = new Set<string>();

  const taskMap = new Map(tasks.map((t) => [t.id, t]));

  function visit(taskId: string): boolean {
    if (temp.has(taskId)) return false; // Cycle detected
    if (visited.has(taskId)) return true; // Already processed

    temp.add(taskId);

    const task = taskMap.get(taskId);
    if (task) {
      // Visit all dependencies first
      for (const depId of task.dependsOn) {
        if (!visit(depId)) return false;
      }
      
      sorted.push(task);
    }

    temp.delete(taskId);
    visited.add(taskId);
    return true;
  }

  for (const task of tasks) {
    if (!visited.has(task.id)) {
      if (!visit(task.id)) {
        return null;
      }
    }
  }

  return sorted;
}
