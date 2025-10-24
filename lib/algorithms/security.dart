import '../models/models.dart';

/// Calculate security health score based on user behavior
/// Score: 0-100, higher is better
SecurityHealthData calculateSecurityHealth(
  List<Task> tasks,
  List<FocusSession> sessions,
) {
  var score = 100;
  final recommendations = <String>[];
  
  // Count security-related tasks
  const securityKeywords = ['security', 'encrypt', 'auth', 'secure', 'vulnerability', 'audit'];
  final securityTasks = tasks.where((t) =>
    securityKeywords.any((keyword) => t.title.toLowerCase().contains(keyword))
  ).toList();
  final completedSecurityTasks = securityTasks.where((t) => t.completed).length;
  final totalSecurityTasks = securityTasks.length;

  // Count late-night sessions (after 11 PM or before 6 AM)
  final lateNightSessions = sessions.where((s) {
    final hour = DateTime.fromMillisecondsSinceEpoch(s.startedAt.millisecondsSinceEpoch).hour;
    return hour >= 23 || hour < 6;
  }).length;

  // Calculate metrics
  final totalCompleted = tasks.where((t) => t.completed).length;
  final securityTaskRatio = totalSecurityTasks > 0
      ? completedSecurityTasks / totalSecurityTasks
      : 1;

  // Deductions
  if (securityTaskRatio < 0.5) {
    score -= 15;
    recommendations.add('Complete more security-related tasks to improve awareness');
  }

  if (lateNightSessions > 2) {
    score -= 10;
    recommendations.add('Reduce late-night work sessions to maintain security focus');
  }

  if (sessions.any((s) => s.interruptions > 3)) {
    score -= 5;
    recommendations.add('Minimize interruptions during focus sessions for better security practices');
  }

  // Check for sensitive data in task notes
  const sensitivePatterns = ['password', 'api key', 'secret', 'token', 'credential'];
  final tasksWithSensitiveData = tasks.where((t) =>
    sensitivePatterns.any((pattern) => t.notes?.toLowerCase().contains(pattern) ?? false)
  ).toList();

  if (tasksWithSensitiveData.isNotEmpty) {
    score -= 20;
    recommendations.add('${tasksWithSensitiveData.length} task(s) contain potentially sensitive data - enable encryption');
  }

  // Bonuses
  if (completedSecurityTasks >= 5) {
    score = (score + 5).clamp(0, 100);
  }

  if (lateNightSessions == 0 && sessions.isNotEmpty) {
    score = (score + 5).clamp(0, 100);
  }

  // Ensure score is within bounds
  score = score.clamp(0, 100);

  // Add positive recommendations if score is high
  if (score >= 90) {
    recommendations.insert(0, 'Excellent security hygiene - keep it up!');
  }

  // Define badges
  final badges = [
    SecurityBadge(
      name: 'No Interruptions',
      description: 'Completed 5 focus sessions without interruption',
      earned: sessions.where((s) => s.interruptions == 0).length >= 5,
    ),
    SecurityBadge(
      name: 'Encryption Master',
      description: 'Enabled encryption for all sensitive data',
      earned: tasksWithSensitiveData.isEmpty && tasks.isNotEmpty,
    ),
    SecurityBadge(
      name: 'Security Conscious',
      description: 'Completed 10 security-related tasks',
      earned: completedSecurityTasks >= 10,
    ),
    SecurityBadge(
      name: 'Consistent Worker',
      description: 'No late-night work sessions this week',
      earned: lateNightSessions == 0 && sessions.isNotEmpty,
    ),
  ];

  return SecurityHealthData(
    currentScore: score,
    recommendations: recommendations.isNotEmpty
        ? recommendations
        : ['No recommendations - you\'re doing great!'],
    recentActivity: RecentActivity(
      securityTasksCompleted: completedSecurityTasks,
      totalTasksCompleted: totalCompleted,
      lateNightSessions: lateNightSessions,
    ),
    badges: badges,
  );
}

/// Generate security recommendations based on task patterns
List<String> getSecurityRecommendations(List<Task> tasks) {
  final recommendations = <String>[];

  // Check for tasks with dependencies that might expose workflow
  final complexDependencies = tasks.where((t) => t.dependsOn.length > 3).toList();
  if (complexDependencies.isNotEmpty) {
    recommendations.add('Simplify task dependencies to reduce workflow complexity');
  }

  // Check for overdue high-value tasks
  final overdueHighValue = tasks.where(
    (t) =>
        !t.completed &&
        t.value >= 80 &&
        t.dueDate != null &&
        t.dueDate!.isBefore(DateTime.now()),
  ).toList();
  if (overdueHighValue.isNotEmpty) {
    recommendations.add('${overdueHighValue.length} high-value task(s) are overdue - prioritize completion');
  }

  // Check for estimation accuracy (compare with historical data)
  final highEnergyTasks = tasks.where((t) => t.energyCost >= 4).toList();
  if (highEnergyTasks.length > tasks.length * 0.5) {
    recommendations.add('Many tasks require high energy - consider breaking them down');
  }

  return recommendations;
}
