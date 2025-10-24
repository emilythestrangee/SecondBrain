import 'package:json_annotation/json_annotation.dart';

part 'models.g.dart';

@JsonSerializable()
class Task {
  final String id;
  final String title;
  final String? notes;
  final DateTime? dueDate;
  @JsonKey(name: 'durationMinutes')
  final int durationMinutes;
  @JsonKey(name: 'energyCost')
  final int energyCost;
  final int value;
  @JsonKey(name: 'dependsOn')
  final List<String> dependsOn;
  final bool completed;
  @JsonKey(name: 'createdAt')
  final DateTime createdAt;

  Task({
    required this.id,
    required this.title,
    this.notes,
    this.dueDate,
    required this.durationMinutes,
    required this.energyCost,
    required this.value,
    required this.dependsOn,
    required this.completed,
    required this.createdAt,
  });

  factory Task.fromJson(Map<String, dynamic> json) => _$TaskFromJson(json);
  Map<String, dynamic> toJson() => _$TaskToJson(this);

  Task copyWith({
    String? id,
    String? title,
    String? notes,
    DateTime? dueDate,
    int? durationMinutes,
    int? energyCost,
    int? value,
    List<String>? dependsOn,
    bool? completed,
    DateTime? createdAt,
  }) {
    return Task(
      id: id ?? this.id,
      title: title ?? this.title,
      notes: notes ?? this.notes,
      dueDate: dueDate ?? this.dueDate,
      durationMinutes: durationMinutes ?? this.durationMinutes,
      energyCost: energyCost ?? this.energyCost,
      value: value ?? this.value,
      dependsOn: dependsOn ?? this.dependsOn,
      completed: completed ?? this.completed,
      createdAt: createdAt ?? this.createdAt,
    );
  }
}

@JsonSerializable()
class FocusSession {
  final String id;
  @JsonKey(name: 'startedAt')
  final DateTime startedAt;
  @JsonKey(name: 'endedAt')
  final DateTime? endedAt;
  @JsonKey(name: 'totalDuration')
  final int totalDuration;
  @JsonKey(name: 'tasksCompleted')
  final int tasksCompleted;
  final int interruptions;
  @JsonKey(name: 'pauseCount')
  final int pauseCount;
  @JsonKey(name: 'taskIds')
  final List<String> taskIds;

  FocusSession({
    required this.id,
    required this.startedAt,
    this.endedAt,
    required this.totalDuration,
    required this.tasksCompleted,
    required this.interruptions,
    required this.pauseCount,
    required this.taskIds,
  });

  factory FocusSession.fromJson(Map<String, dynamic> json) => _$FocusSessionFromJson(json);
  Map<String, dynamic> toJson() => _$FocusSessionToJson(this);
}

@JsonSerializable()
class SessionTelemetry {
  final String id;
  @JsonKey(name: 'sessionId')
  final String sessionId;
  @JsonKey(name: 'taskId')
  final String taskId;
  @JsonKey(name: 'estimatedMinutes')
  final int estimatedMinutes;
  @JsonKey(name: 'actualSeconds')
  final int actualSeconds;
  @JsonKey(name: 'completedInSession')
  final bool completedInSession;
  @JsonKey(name: 'createdAt')
  final DateTime createdAt;

  SessionTelemetry({
    required this.id,
    required this.sessionId,
    required this.taskId,
    required this.estimatedMinutes,
    required this.actualSeconds,
    required this.completedInSession,
    required this.createdAt,
  });

  factory SessionTelemetry.fromJson(Map<String, dynamic> json) => _$SessionTelemetryFromJson(json);
  Map<String, dynamic> toJson() => _$SessionTelemetryToJson(this);
}

@JsonSerializable()
class SecurityMetric {
  final String id;
  final DateTime date;
  @JsonKey(name: 'healthScore')
  final int healthScore;
  @JsonKey(name: 'securityTasksCompleted')
  final int securityTasksCompleted;
  @JsonKey(name: 'lateNightWorkSessions')
  final int lateNightWorkSessions;
  @JsonKey(name: 'sensitiveDataExposures')
  final int sensitiveDataExposures;

  SecurityMetric({
    required this.id,
    required this.date,
    required this.healthScore,
    required this.securityTasksCompleted,
    required this.lateNightWorkSessions,
    required this.sensitiveDataExposures,
  });

  factory SecurityMetric.fromJson(Map<String, dynamic> json) => _$SecurityMetricFromJson(json);
  Map<String, dynamic> toJson() => _$SecurityMetricToJson(this);
}

@JsonSerializable()
class ScheduleRequest {
  @JsonKey(name: 'timeBudgetMinutes')
  final int timeBudgetMinutes;
  @JsonKey(name: 'energyBudget')
  final int energyBudget;
  @JsonKey(name: 'taskIds')
  final List<String>? taskIds;

  ScheduleRequest({
    required this.timeBudgetMinutes,
    required this.energyBudget,
    this.taskIds,
  });

  factory ScheduleRequest.fromJson(Map<String, dynamic> json) => _$ScheduleRequestFromJson(json);
  Map<String, dynamic> toJson() => _$ScheduleRequestToJson(this);
}

@JsonSerializable()
class ScheduleResult {
  @JsonKey(name: 'selectedTasks')
  final List<Task> selectedTasks;
  @JsonKey(name: 'totalDuration')
  final int totalDuration;
  @JsonKey(name: 'totalEnergy')
  final int totalEnergy;
  @JsonKey(name: 'totalValue')
  final int totalValue;
  final String algorithm;
  final String explanation;

  ScheduleResult({
    required this.selectedTasks,
    required this.totalDuration,
    required this.totalEnergy,
    required this.totalValue,
    required this.algorithm,
    required this.explanation,
  });

  factory ScheduleResult.fromJson(Map<String, dynamic> json) => _$ScheduleResultFromJson(json);
  Map<String, dynamic> toJson() => _$ScheduleResultToJson(this);
}

@JsonSerializable()
class DependencyGraphNode {
  final String id;
  final String title;
  final bool completed;
  final int value;
  @JsonKey(name: 'dependsOn')
  final List<String> dependsOn;

  DependencyGraphNode({
    required this.id,
    required this.title,
    required this.completed,
    required this.value,
    required this.dependsOn,
  });

  factory DependencyGraphNode.fromJson(Map<String, dynamic> json) => _$DependencyGraphNodeFromJson(json);
  Map<String, dynamic> toJson() => _$DependencyGraphNodeToJson(this);
}

@JsonSerializable()
class SecurityHealthData {
  @JsonKey(name: 'currentScore')
  final int currentScore;
  final List<String> recommendations;
  @JsonKey(name: 'recentActivity')
  final RecentActivity recentActivity;
  final List<SecurityBadge> badges;

  SecurityHealthData({
    required this.currentScore,
    required this.recommendations,
    required this.recentActivity,
    required this.badges,
  });

  factory SecurityHealthData.fromJson(Map<String, dynamic> json) => _$SecurityHealthDataFromJson(json);
  Map<String, dynamic> toJson() => _$SecurityHealthDataToJson(this);
}

@JsonSerializable()
class RecentActivity {
  @JsonKey(name: 'securityTasksCompleted')
  final int securityTasksCompleted;
  @JsonKey(name: 'totalTasksCompleted')
  final int totalTasksCompleted;
  @JsonKey(name: 'lateNightSessions')
  final int lateNightSessions;

  RecentActivity({
    required this.securityTasksCompleted,
    required this.totalTasksCompleted,
    required this.lateNightSessions,
  });

  factory RecentActivity.fromJson(Map<String, dynamic> json) => _$RecentActivityFromJson(json);
  Map<String, dynamic> toJson() => _$RecentActivityToJson(this);
}

@JsonSerializable()
class SecurityBadge {
  final String name;
  final bool earned;
  final String description;

  SecurityBadge({
    required this.name,
    required this.earned,
    required this.description,
  });

  factory SecurityBadge.fromJson(Map<String, dynamic> json) => _$SecurityBadgeFromJson(json);
  Map<String, dynamic> toJson() => _$SecurityBadgeToJson(this);
}
