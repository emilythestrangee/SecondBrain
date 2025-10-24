import type { Task, FocusSession, SecurityHealthData } from "@shared/schema";

/**
 * Calculate security health score based on user behavior
 * Score: 0-100, higher is better
 */
export function calculateSecurityHealth(
  tasks: Task[],
  sessions: FocusSession[]
): SecurityHealthData {
  let score = 100;
  const recommendations: string[] = [];
  
  // Count security-related tasks
  const securityKeywords = ["security", "encrypt", "auth", "secure", "vulnerability", "audit"];
  const securityTasks = tasks.filter((t) =>
    securityKeywords.some((keyword) => t.title.toLowerCase().includes(keyword))
  );
  const completedSecurityTasks = securityTasks.filter((t) => t.completed).length;
  const totalSecurityTasks = securityTasks.length;

  // Count late-night sessions (after 11 PM or before 6 AM)
  const lateNightSessions = sessions.filter((s) => {
    const hour = new Date(s.startedAt).getHours();
    return hour >= 23 || hour < 6;
  }).length;

  // Calculate metrics
  const totalCompleted = tasks.filter((t) => t.completed).length;
  const securityTaskRatio = totalSecurityTasks > 0
    ? completedSecurityTasks / totalSecurityTasks
    : 1;

  // Deductions
  if (securityTaskRatio < 0.5) {
    score -= 15;
    recommendations.push("Complete more security-related tasks to improve awareness");
  }

  if (lateNightSessions > 2) {
    score -= 10;
    recommendations.push("Reduce late-night work sessions to maintain security focus");
  }

  if (sessions.some((s) => s.interruptions > 3)) {
    score -= 5;
    recommendations.push("Minimize interruptions during focus sessions for better security practices");
  }

  // Check for sensitive data in task notes
  const sensitivePatterns = ["password", "api key", "secret", "token", "credential"];
  const tasksWithSensitiveData = tasks.filter((t) =>
    sensitivePatterns.some((pattern) => t.notes?.toLowerCase().includes(pattern))
  );

  if (tasksWithSensitiveData.length > 0) {
    score -= 20;
    recommendations.push(`${tasksWithSensitiveData.length} task(s) contain potentially sensitive data - enable encryption`);
  }

  // Bonuses
  if (completedSecurityTasks >= 5) {
    score = Math.min(100, score + 5);
  }

  if (lateNightSessions === 0 && sessions.length > 0) {
    score = Math.min(100, score + 5);
  }

  // Ensure score is within bounds
  score = Math.max(0, Math.min(100, score));

  // Add positive recommendations if score is high
  if (score >= 90) {
    recommendations.unshift("Excellent security hygiene - keep it up!");
  }

  // Define badges
  const badges = [
    {
      name: "No Interruptions",
      description: "Completed 5 focus sessions without interruption",
      earned: sessions.filter((s) => s.interruptions === 0).length >= 5,
    },
    {
      name: "Encryption Master",
      description: "Enabled encryption for all sensitive data",
      earned: tasksWithSensitiveData.length === 0 && tasks.length > 0,
    },
    {
      name: "Security Conscious",
      description: "Completed 10 security-related tasks",
      earned: completedSecurityTasks >= 10,
    },
    {
      name: "Consistent Worker",
      description: "No late-night work sessions this week",
      earned: lateNightSessions === 0 && sessions.length > 0,
    },
  ];

  return {
    currentScore: Math.round(score),
    recommendations: recommendations.length > 0
      ? recommendations
      : ["No recommendations - you're doing great!"],
    recentActivity: {
      securityTasksCompleted: completedSecurityTasks,
      totalTasksCompleted: totalCompleted,
      lateNightSessions,
    },
    badges,
  };
}

/**
 * Generate security recommendations based on task patterns
 */
export function getSecurityRecommendations(tasks: Task[]): string[] {
  const recommendations: string[] = [];

  // Check for tasks with dependencies that might expose workflow
  const complexDependencies = tasks.filter((t) => t.dependsOn.length > 3);
  if (complexDependencies.length > 0) {
    recommendations.push("Simplify task dependencies to reduce workflow complexity");
  }

  // Check for overdue high-value tasks
  const overdueHighValue = tasks.filter(
    (t) =>
      !t.completed &&
      t.value >= 80 &&
      t.dueDate &&
      new Date(t.dueDate) < new Date()
  );
  if (overdueHighValue.length > 0) {
    recommendations.push(`${overdueHighValue.length} high-value task(s) are overdue - prioritize completion`);
  }

  // Check for estimation accuracy (compare with historical data)
  const highEnergyTasks = tasks.filter((t) => t.energyCost >= 4);
  if (highEnergyTasks.length > tasks.length * 0.5) {
    recommendations.push("Many tasks require high energy - consider breaking them down");
  }

  return recommendations;
}
