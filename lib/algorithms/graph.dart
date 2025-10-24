import '../models/models.dart';

/// Detect cycles in task dependency graph using DFS
/// Time complexity: O(V + E) where V = number of tasks, E = number of dependencies
/// Space complexity: O(V) for visited and recursion stack sets
/// 
/// Returns true if a cycle is detected, false otherwise
bool hasCycle(List<Task> tasks) {
  // Build adjacency list: taskId -> [dependentTaskIds]
  final graph = <String, List<String>>{};
  
  for (final task in tasks) {
    graph.putIfAbsent(task.id, () => []);
    for (final depId in task.dependsOn) {
      graph.putIfAbsent(depId, () => []);
      // Add edge from dependency to task (reversed for topological sort)
      graph[depId]!.add(task.id);
    }
  }

  final visited = <String>{};
  final recursionStack = <String>{};

  bool dfs(String nodeId) {
    // If node is in recursion stack, we found a cycle
    if (recursionStack.contains(nodeId)) {
      return true;
    }

    // If already visited (and not in recursion stack), no cycle from this node
    if (visited.contains(nodeId)) {
      return false;
    }

    // Mark as visited and add to recursion stack
    visited.add(nodeId);
    recursionStack.add(nodeId);

    // Explore all neighbors
    final neighbors = graph[nodeId] ?? [];
    for (final neighbor in neighbors) {
      if (dfs(neighbor)) {
        return true;
      }
    }

    // Remove from recursion stack when backtracking
    recursionStack.remove(nodeId);
    return false;
  }

  // Run DFS from each unvisited node
  for (final nodeId in graph.keys) {
    if (!visited.contains(nodeId)) {
      if (dfs(nodeId)) {
        return true;
      }
    }
  }

  return false;
}

/// Check if adding a new dependency would create a cycle
bool wouldCreateCycle(
  List<Task> tasks,
  String taskId,
  String newDependencyId,
) {
  // Create a temporary task list with the new dependency
  final updatedTasks = tasks.map((task) {
    if (task.id == taskId) {
      return task.copyWith(
        dependsOn: [...task.dependsOn, newDependencyId],
      );
    }
    return task;
  }).toList();

  return hasCycle(updatedTasks);
}

/// Get all tasks that depend on a given task (directly or indirectly)
List<Task> getDependentTasks(List<Task> tasks, String taskId) {
  final dependents = <String>{};
  
  void findDependents(String id) {
    for (final task in tasks) {
      if (task.dependsOn.contains(id) && !dependents.contains(task.id)) {
        dependents.add(task.id);
        findDependents(task.id);
      }
    }
  }

  findDependents(taskId);
  return tasks.where((t) => dependents.contains(t.id)).toList();
}

/// Convert tasks to graph nodes for visualization
List<DependencyGraphNode> tasksToGraphNodes(List<Task> tasks) {
  return tasks.map((task) => DependencyGraphNode(
    id: task.id,
    title: task.title,
    completed: task.completed,
    value: task.value,
    dependsOn: task.dependsOn,
  )).toList();
}

/// Topological sort of tasks (for scheduling in dependency order)
/// Returns null if graph has a cycle
List<Task>? topologicalSort(List<Task> tasks) {
  if (hasCycle(tasks)) {
    return null;
  }

  final sorted = <Task>[];
  final visited = <String>{};
  final temp = <String>{};

  final taskMap = Map<String, Task>.fromEntries(
    tasks.map((t) => MapEntry(t.id, t)),
  );

  bool visit(String taskId) {
    if (temp.contains(taskId)) return false; // Cycle detected
    if (visited.contains(taskId)) return true; // Already processed

    temp.add(taskId);

    final task = taskMap[taskId];
    if (task != null) {
      // Visit all dependencies first
      for (final depId in task.dependsOn) {
        if (!visit(depId)) return false;
      }
      
      sorted.add(task);
    }

    temp.remove(taskId);
    visited.add(taskId);
    return true;
  }

  for (final task in tasks) {
    if (!visited.contains(task.id)) {
      if (!visit(task.id)) {
        return null;
      }
    }
  }

  return sorted;
}
