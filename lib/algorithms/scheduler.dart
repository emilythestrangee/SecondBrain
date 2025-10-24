import '../models/models.dart';

/// Check if a task's dependencies are all completed
bool canScheduleTask(Task task, List<Task> allTasks, Set<String> selectedTaskIds) {
  if (task.dependsOn.isEmpty) {
    return true; // No dependencies
  }

  // Check if all dependencies are either completed or already selected in this schedule
  return task.dependsOn.every((depId) {
    final depTask = allTasks.firstWhere(
      (t) => t.id == depId,
      orElse: () => throw Exception('Dependency task not found: $depId'),
    );
    return depTask.completed || selectedTaskIds.contains(depId);
  });
}

/// Get tasks that are ready to be scheduled (dependencies satisfied and not already selected)
List<Task> getSchedulableTasks(List<Task> tasks, Set<String> selectedTaskIds) {
  return tasks.where((task) =>
      !task.completed &&
      !selectedTaskIds.contains(task.id) &&
      canScheduleTask(task, tasks, selectedTaskIds)).toList();
}

/// Greedy scheduler - sorts tasks by value/duration ratio
/// Time complexity: O(n log n)
/// Space complexity: O(n)
/// 
/// Respects task dependencies: only schedules tasks whose dependencies are completed or scheduled earlier
ScheduleResult scheduleGreedy(
  List<Task> tasks,
  int timeBudgetMinutes,
  int energyBudget,
) {
  final selected = <Task>[];
  final selectedIds = <String>{};
  var timeLeft = timeBudgetMinutes;
  var energyLeft = energyBudget;

  // Keep trying to schedule tasks until no more can fit
  var madeProgress = true;
  while (madeProgress) {
    madeProgress = false;

    // Get tasks that can be scheduled (dependencies satisfied)
    final schedulableTasks = getSchedulableTasks(tasks, selectedIds);

    // Sort by value/duration ratio (descending)
    final sorted = List<Task>.from(schedulableTasks)
      ..sort((a, b) {
        final ratioA = a.value / a.durationMinutes;
        final ratioB = b.value / b.durationMinutes;
        return ratioB.compareTo(ratioA);
      });

    // Try to select the best task that fits
    for (final task in sorted) {
      if (task.durationMinutes <= timeLeft && task.energyCost <= energyLeft) {
        selected.add(task);
        selectedIds.add(task.id);
        timeLeft -= task.durationMinutes;
        energyLeft -= task.energyCost;
        madeProgress = true;
        break; // Restart with updated dependencies
      }
    }
  }

  final totalDuration = selected.fold(0, (sum, t) => sum + t.durationMinutes);
  final totalEnergy = selected.fold(0, (sum, t) => sum + t.energyCost);
  final totalValue = selected.fold(0, (sum, t) => sum + t.value);

  return ScheduleResult(
    selectedTasks: selected,
    totalDuration: totalDuration,
    totalEnergy: totalEnergy,
    totalValue: totalValue,
    algorithm: 'greedy',
    explanation: 'Greedy scheduling selected ${selected.length} task(s) by value/duration ratio, respecting dependencies, to maximize value ($totalValue points) within ${timeBudgetMinutes}min and energy level $energyBudget.',
  );
}

/// 2D Knapsack Dynamic Programming scheduler with dependency awareness
/// Optimizes for both time and energy constraints while respecting task dependencies
/// Time complexity: O(n × T × E) where T=time budget, E=energy budget
/// Space complexity: O(n × T × E)
/// 
/// Only used for small task sets (n ≤ 40) for optimal solutions
ScheduleResult scheduleKnapsackDP(
  List<Task> tasks,
  int timeBudgetMinutes,
  int energyBudget,
) {
  final activeTasks = tasks.where((t) => !t.completed).toList();
  final n = activeTasks.length;

  if (n == 0) {
    return ScheduleResult(
      selectedTasks: [],
      totalDuration: 0,
      totalEnergy: 0,
      totalValue: 0,
      algorithm: 'knapsack_dp',
      explanation: 'No active tasks available.',
    );
  }

  // Sort tasks in topological order (dependencies first)
  // This ensures we consider prerequisites before dependents
  final sortedTasks = topologicalSortForScheduling(activeTasks, tasks);

  // DP table: dp[i][t][e] = { maxValue, selectedMask }
  // We'll use a 3D structure tracking which tasks were selected
  final dp = List.generate(
    n + 1,
    (_) => List.generate(
      timeBudgetMinutes + 1,
      (_) => List.generate(
        energyBudget + 1,
        (_) => DPState(value: 0, mask: <int>{}),
      ),
    ),
  );

  // Fill DP table
  for (var i = 1; i <= n; i++) {
    final task = sortedTasks[i - 1];
    
    for (var t = 0; t <= timeBudgetMinutes; t++) {
      for (var e = 0; e <= energyBudget; e++) {
        // Option 1: Don't take this task
        dp[i][t][e] = DPState(
          value: dp[i - 1][t][e].value,
          mask: Set<int>.from(dp[i - 1][t][e].mask),
        );

        // Option 2: Take this task (if it fits AND dependencies are satisfied)
        if (t >= task.durationMinutes && e >= task.energyCost) {
          final prevState = dp[i - 1][t - task.durationMinutes][e - task.energyCost];
          
          // Check if all dependencies are in the previous state's mask
          final depsInMask = task.dependsOn.every((depId) {
            final depIndex = sortedTasks.indexWhere((t) => t.id == depId);
            return depIndex == -1 || 
                   prevState.mask.contains(depIndex) || 
                   tasks.any((t) => t.id == depId && t.completed);
          });

          if (depsInMask) {
            final valueWithTask = prevState.value + task.value;
            if (valueWithTask > dp[i][t][e].value) {
              final newMask = Set<int>.from(prevState.mask);
              newMask.add(i - 1);
              dp[i][t][e] = DPState(value: valueWithTask, mask: newMask);
            }
          }
        }
      }
    }
  }

  // Extract selected tasks
  final finalState = dp[n][timeBudgetMinutes][energyBudget];
  final selectedTasks = finalState.mask.map((idx) => sortedTasks[idx]).toList();

  final totalDuration = selectedTasks.fold(0, (sum, t) => sum + t.durationMinutes);
  final totalEnergy = selectedTasks.fold(0, (sum, t) => sum + t.energyCost);
  final totalValue = selectedTasks.fold(0, (sum, t) => sum + t.value);

  return ScheduleResult(
    selectedTasks: selectedTasks,
    totalDuration: totalDuration,
    totalEnergy: totalEnergy,
    totalValue: totalValue,
    algorithm: 'knapsack_dp',
    explanation: 'Dynamic programming found optimal solution with dependency respect: ${selectedTasks.length} task(s) with maximum value ($totalValue points) within ${timeBudgetMinutes}min and energy $energyBudget.',
  );
}

/// Topological sort for scheduling - orders tasks so dependencies come first
/// Returns tasks with no dependencies first, then those that depend on them, etc.
List<Task> topologicalSortForScheduling(List<Task> activeTasks, List<Task> allTasks) {
  final sorted = <Task>[];
  final visited = <String>{};
  final taskMap = Map<String, Task>.fromEntries(
    activeTasks.map((t) => MapEntry(t.id, t)),
  );

  void visit(String taskId) {
    if (visited.contains(taskId)) return;
    visited.add(taskId);

    final task = taskMap[taskId];
    if (task == null) return;

    // Visit dependencies first
    for (final depId in task.dependsOn) {
      final depTask = allTasks.firstWhere(
        (t) => t.id == depId,
        orElse: () => throw Exception('Dependency task not found: $depId'),
      );
      // Only visit if dependency is active (not completed)
      if (!depTask.completed && taskMap.containsKey(depId)) {
        visit(depId);
      }
    }

    sorted.add(task);
  }

  // Visit all active tasks
  for (final task in activeTasks) {
    visit(task.id);
  }

  return sorted;
}

/// Smart scheduler - chooses between greedy and DP based on task count
ScheduleResult scheduleOptimal(
  List<Task> tasks,
  int timeBudgetMinutes,
  int energyBudget,
) {
  final activeTasks = tasks.where((t) => !t.completed).toList();

  // Use DP for small task sets (optimal solution)
  if (activeTasks.length <= 40) {
    return scheduleKnapsackDP(tasks, timeBudgetMinutes, energyBudget);
  }

  // Use greedy for larger task sets (fast, good approximation)
  return scheduleGreedy(tasks, timeBudgetMinutes, energyBudget);
}

/// DP State helper class
class DPState {
  final int value;
  final Set<int> mask;

  DPState({required this.value, required this.mask});
}
