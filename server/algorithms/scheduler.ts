import type { Task, ScheduleResult } from "@shared/schema";

/**
 * Check if a task's dependencies are all completed
 */
function canScheduleTask(task: Task, allTasks: Task[], selectedTaskIds: Set<string>): boolean {
  if (task.dependsOn.length === 0) {
    return true; // No dependencies
  }

  // Check if all dependencies are either completed or already selected in this schedule
  return task.dependsOn.every((depId) => {
    const depTask = allTasks.find((t) => t.id === depId);
    return depTask && (depTask.completed || selectedTaskIds.has(depId));
  });
}

/**
 * Get tasks that are ready to be scheduled (dependencies satisfied and not already selected)
 */
function getSchedulableTasks(tasks: Task[], selectedTaskIds: Set<string>): Task[] {
  return tasks.filter(
    (task) => !task.completed && !selectedTaskIds.has(task.id) && canScheduleTask(task, tasks, selectedTaskIds)
  );
}

/**
 * Greedy scheduler - sorts tasks by value/duration ratio
 * Time complexity: O(n log n)
 * Space complexity: O(n)
 * 
 * Respects task dependencies: only schedules tasks whose dependencies are completed or scheduled earlier
 */
export function scheduleGreedy(
  tasks: Task[],
  timeBudgetMinutes: number,
  energyBudget: number
): ScheduleResult {
  const selected: Task[] = [];
  const selectedIds = new Set<string>();
  let timeLeft = timeBudgetMinutes;
  let energyLeft = energyBudget;

  // Keep trying to schedule tasks until no more can fit
  let madeProgress = true;
  while (madeProgress) {
    madeProgress = false;

    // Get tasks that can be scheduled (dependencies satisfied)
    const schedulableTasks = getSchedulableTasks(tasks, selectedIds);

    // Sort by value/duration ratio (descending)
    const sorted = [...schedulableTasks].sort((a, b) => {
      const ratioA = a.value / a.durationMinutes;
      const ratioB = b.value / b.durationMinutes;
      return ratioB - ratioA;
    });

    // Try to select the best task that fits
    for (const task of sorted) {
      if (task.durationMinutes <= timeLeft && task.energyCost <= energyLeft) {
        selected.push(task);
        selectedIds.add(task.id);
        timeLeft -= task.durationMinutes;
        energyLeft -= task.energyCost;
        madeProgress = true;
        break; // Restart with updated dependencies
      }
    }
  }

  const totalDuration = selected.reduce((sum, t) => sum + t.durationMinutes, 0);
  const totalEnergy = selected.reduce((sum, t) => sum + t.energyCost, 0);
  const totalValue = selected.reduce((sum, t) => sum + t.value, 0);

  return {
    selectedTasks: selected,
    totalDuration,
    totalEnergy,
    totalValue,
    algorithm: "greedy",
    explanation: `Greedy scheduling selected ${selected.length} task(s) by value/duration ratio, respecting dependencies, to maximize value (${totalValue} points) within ${timeBudgetMinutes}min and energy level ${energyBudget}.`,
  };
}

/**
 * 2D Knapsack Dynamic Programming scheduler with dependency awareness
 * Optimizes for both time and energy constraints while respecting task dependencies
 * Time complexity: O(n × T × E) where T=time budget, E=energy budget
 * Space complexity: O(n × T × E)
 * 
 * Only used for small task sets (n ≤ 40) for optimal solutions
 */
export function scheduleKnapsackDP(
  tasks: Task[],
  timeBudgetMinutes: number,
  energyBudget: number
): ScheduleResult {
  const activeTasks = tasks.filter((t) => !t.completed);
  const n = activeTasks.length;

  if (n === 0) {
    return {
      selectedTasks: [],
      totalDuration: 0,
      totalEnergy: 0,
      totalValue: 0,
      algorithm: "knapsack_dp",
      explanation: "No active tasks available.",
    };
  }

  // Sort tasks in topological order (dependencies first)
  // This ensures we consider prerequisites before dependents
  const sortedTasks = topologicalSortForScheduling(activeTasks, tasks);

  // DP table: dp[i][t][e] = { maxValue, selectedMask }
  // We'll use a 3D structure tracking which tasks were selected
  type DPState = { value: number; mask: Set<number> };
  
  const dp: DPState[][][] = Array.from({ length: n + 1 }, () =>
    Array.from({ length: timeBudgetMinutes + 1 }, () =>
      Array.from({ length: energyBudget + 1 }, () => ({ value: 0, mask: new Set() }))
    )
  );

  // Fill DP table
  for (let i = 1; i <= n; i++) {
    const task = sortedTasks[i - 1];
    
    for (let t = 0; t <= timeBudgetMinutes; t++) {
      for (let e = 0; e <= energyBudget; e++) {
        // Option 1: Don't take this task
        dp[i][t][e] = { ...dp[i - 1][t][e], mask: new Set(dp[i - 1][t][e].mask) };

        // Option 2: Take this task (if it fits AND dependencies are satisfied)
        if (t >= task.durationMinutes && e >= task.energyCost) {
          const prevState = dp[i - 1][t - task.durationMinutes][e - task.energyCost];
          
          // Check if all dependencies are in the previous state's mask
          const depsInMask = task.dependsOn.every((depId) => {
            const depIndex = sortedTasks.findIndex((t) => t.id === depId);
            return depIndex === -1 || prevState.mask.has(depIndex) || tasks.find(t => t.id === depId)?.completed;
          });

          if (depsInMask) {
            const valueWithTask = prevState.value + task.value;
            if (valueWithTask > dp[i][t][e].value) {
              const newMask = new Set(prevState.mask);
              newMask.add(i - 1);
              dp[i][t][e] = { value: valueWithTask, mask: newMask };
            }
          }
        }
      }
    }
  }

  // Extract selected tasks
  const finalState = dp[n][timeBudgetMinutes][energyBudget];
  const selectedTasks = Array.from(finalState.mask).map((idx) => sortedTasks[idx]);

  const totalDuration = selectedTasks.reduce((sum, t) => sum + t.durationMinutes, 0);
  const totalEnergy = selectedTasks.reduce((sum, t) => sum + t.energyCost, 0);
  const totalValue = selectedTasks.reduce((sum, t) => sum + t.value, 0);

  return {
    selectedTasks,
    totalDuration,
    totalEnergy,
    totalValue,
    algorithm: "knapsack_dp",
    explanation: `Dynamic programming found optimal solution with dependency respect: ${selectedTasks.length} task(s) with maximum value (${totalValue} points) within ${timeBudgetMinutes}min and energy ${energyBudget}.`,
  };
}

/**
 * Topological sort for scheduling - orders tasks so dependencies come first
 * Returns tasks with no dependencies first, then those that depend on them, etc.
 */
function topologicalSortForScheduling(activeTasks: Task[], allTasks: Task[]): Task[] {
  const sorted: Task[] = [];
  const visited = new Set<string>();
  const taskMap = new Map(activeTasks.map((t) => [t.id, t]));

  function visit(taskId: string) {
    if (visited.has(taskId)) return;
    visited.add(taskId);

    const task = taskMap.get(taskId);
    if (!task) return;

    // Visit dependencies first
    for (const depId of task.dependsOn) {
      const depTask = allTasks.find((t) => t.id === depId);
      // Only visit if dependency is active (not completed)
      if (depTask && !depTask.completed && taskMap.has(depId)) {
        visit(depId);
      }
    }

    sorted.push(task);
  }

  // Visit all active tasks
  for (const task of activeTasks) {
    visit(task.id);
  }

  return sorted;
}

/**
 * Smart scheduler - chooses between greedy and DP based on task count
 */
export function scheduleOptimal(
  tasks: Task[],
  timeBudgetMinutes: number,
  energyBudget: number
): ScheduleResult {
  const activeTasks = tasks.filter((t) => !t.completed);

  // Use DP for small task sets (optimal solution)
  if (activeTasks.length <= 40) {
    return scheduleKnapsackDP(tasks, timeBudgetMinutes, energyBudget);
  }

  // Use greedy for larger task sets (fast, good approximation)
  return scheduleGreedy(tasks, timeBudgetMinutes, energyBudget);
}
