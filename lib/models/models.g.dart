// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'models.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Task _$TaskFromJson(Map<String, dynamic> json) => Task(
      id: json['id'] as String,
      title: json['title'] as String,
      notes: json['notes'] as String?,
      dueDate: json['dueDate'] == null
          ? null
          : DateTime.parse(json['dueDate'] as String),
      durationMinutes: (json['durationMinutes'] as num).toInt(),
      energyCost: (json['energyCost'] as num).toInt(),
      value: (json['value'] as num).toInt(),
      dependsOn:
          (json['dependsOn'] as List<dynamic>).map((e) => e as String).toList(),
      completed: json['completed'] as bool,
      createdAt: DateTime.parse(json['createdAt'] as String),
    );

Map<String, dynamic> _$TaskToJson(Task instance) => <String, dynamic>{
      'id': instance.id,
      'title': instance.title,
      'notes': instance.notes,
      'dueDate': instance.dueDate?.toIso8601String(),
      'durationMinutes': instance.durationMinutes,
      'energyCost': instance.energyCost,
      'value': instance.value,
      'dependsOn': instance.dependsOn,
      'completed': instance.completed,
      'createdAt': instance.createdAt.toIso8601String(),
    };

FocusSession _$FocusSessionFromJson(Map<String, dynamic> json) => FocusSession(
      id: json['id'] as String,
      startedAt: DateTime.parse(json['startedAt'] as String),
      endedAt: json['endedAt'] == null
          ? null
          : DateTime.parse(json['endedAt'] as String),
      totalDuration: (json['totalDuration'] as num).toInt(),
      tasksCompleted: (json['tasksCompleted'] as num).toInt(),
      interruptions: (json['interruptions'] as num).toInt(),
      pauseCount: (json['pauseCount'] as num).toInt(),
      taskIds:
          (json['taskIds'] as List<dynamic>).map((e) => e as String).toList(),
    );

Map<String, dynamic> _$FocusSessionToJson(FocusSession instance) =>
    <String, dynamic>{
      'id': instance.id,
      'startedAt': instance.startedAt.toIso8601String(),
      'endedAt': instance.endedAt?.toIso8601String(),
      'totalDuration': instance.totalDuration,
      'tasksCompleted': instance.tasksCompleted,
      'interruptions': instance.interruptions,
      'pauseCount': instance.pauseCount,
      'taskIds': instance.taskIds,
    };

SessionTelemetry _$SessionTelemetryFromJson(Map<String, dynamic> json) =>
    SessionTelemetry(
      id: json['id'] as String,
      sessionId: json['sessionId'] as String,
      taskId: json['taskId'] as String,
      estimatedMinutes: (json['estimatedMinutes'] as num).toInt(),
      actualSeconds: (json['actualSeconds'] as num).toInt(),
      completedInSession: json['completedInSession'] as bool,
      createdAt: DateTime.parse(json['createdAt'] as String),
    );

Map<String, dynamic> _$SessionTelemetryToJson(SessionTelemetry instance) =>
    <String, dynamic>{
      'id': instance.id,
      'sessionId': instance.sessionId,
      'taskId': instance.taskId,
      'estimatedMinutes': instance.estimatedMinutes,
      'actualSeconds': instance.actualSeconds,
      'completedInSession': instance.completedInSession,
      'createdAt': instance.createdAt.toIso8601String(),
    };

SecurityMetric _$SecurityMetricFromJson(Map<String, dynamic> json) =>
    SecurityMetric(
      id: json['id'] as String,
      date: DateTime.parse(json['date'] as String),
      healthScore: (json['healthScore'] as num).toInt(),
      securityTasksCompleted: (json['securityTasksCompleted'] as num).toInt(),
      lateNightWorkSessions: (json['lateNightWorkSessions'] as num).toInt(),
      sensitiveDataExposures: (json['sensitiveDataExposures'] as num).toInt(),
    );

Map<String, dynamic> _$SecurityMetricToJson(SecurityMetric instance) =>
    <String, dynamic>{
      'id': instance.id,
      'date': instance.date.toIso8601String(),
      'healthScore': instance.healthScore,
      'securityTasksCompleted': instance.securityTasksCompleted,
      'lateNightWorkSessions': instance.lateNightWorkSessions,
      'sensitiveDataExposures': instance.sensitiveDataExposures,
    };

ScheduleRequest _$ScheduleRequestFromJson(Map<String, dynamic> json) =>
    ScheduleRequest(
      timeBudgetMinutes: (json['timeBudgetMinutes'] as num).toInt(),
      energyBudget: (json['energyBudget'] as num).toInt(),
      taskIds:
          (json['taskIds'] as List<dynamic>?)?.map((e) => e as String).toList(),
    );

Map<String, dynamic> _$ScheduleRequestToJson(ScheduleRequest instance) =>
    <String, dynamic>{
      'timeBudgetMinutes': instance.timeBudgetMinutes,
      'energyBudget': instance.energyBudget,
      'taskIds': instance.taskIds,
    };

ScheduleResult _$ScheduleResultFromJson(Map<String, dynamic> json) =>
    ScheduleResult(
      selectedTasks: (json['selectedTasks'] as List<dynamic>)
          .map((e) => Task.fromJson(e as Map<String, dynamic>))
          .toList(),
      totalDuration: (json['totalDuration'] as num).toInt(),
      totalEnergy: (json['totalEnergy'] as num).toInt(),
      totalValue: (json['totalValue'] as num).toInt(),
      algorithm: json['algorithm'] as String,
      explanation: json['explanation'] as String,
    );

Map<String, dynamic> _$ScheduleResultToJson(ScheduleResult instance) =>
    <String, dynamic>{
      'selectedTasks': instance.selectedTasks,
      'totalDuration': instance.totalDuration,
      'totalEnergy': instance.totalEnergy,
      'totalValue': instance.totalValue,
      'algorithm': instance.algorithm,
      'explanation': instance.explanation,
    };

DependencyGraphNode _$DependencyGraphNodeFromJson(Map<String, dynamic> json) =>
    DependencyGraphNode(
      id: json['id'] as String,
      title: json['title'] as String,
      completed: json['completed'] as bool,
      value: (json['value'] as num).toInt(),
      dependsOn:
          (json['dependsOn'] as List<dynamic>).map((e) => e as String).toList(),
    );

Map<String, dynamic> _$DependencyGraphNodeToJson(
        DependencyGraphNode instance) =>
    <String, dynamic>{
      'id': instance.id,
      'title': instance.title,
      'completed': instance.completed,
      'value': instance.value,
      'dependsOn': instance.dependsOn,
    };

SecurityHealthData _$SecurityHealthDataFromJson(Map<String, dynamic> json) =>
    SecurityHealthData(
      currentScore: (json['currentScore'] as num).toInt(),
      recommendations: (json['recommendations'] as List<dynamic>)
          .map((e) => e as String)
          .toList(),
      recentActivity: RecentActivity.fromJson(
          json['recentActivity'] as Map<String, dynamic>),
      badges: (json['badges'] as List<dynamic>)
          .map((e) => SecurityBadge.fromJson(e as Map<String, dynamic>))
          .toList(),
    );

Map<String, dynamic> _$SecurityHealthDataToJson(SecurityHealthData instance) =>
    <String, dynamic>{
      'currentScore': instance.currentScore,
      'recommendations': instance.recommendations,
      'recentActivity': instance.recentActivity,
      'badges': instance.badges,
    };

RecentActivity _$RecentActivityFromJson(Map<String, dynamic> json) =>
    RecentActivity(
      securityTasksCompleted: (json['securityTasksCompleted'] as num).toInt(),
      totalTasksCompleted: (json['totalTasksCompleted'] as num).toInt(),
      lateNightSessions: (json['lateNightSessions'] as num).toInt(),
    );

Map<String, dynamic> _$RecentActivityToJson(RecentActivity instance) =>
    <String, dynamic>{
      'securityTasksCompleted': instance.securityTasksCompleted,
      'totalTasksCompleted': instance.totalTasksCompleted,
      'lateNightSessions': instance.lateNightSessions,
    };

SecurityBadge _$SecurityBadgeFromJson(Map<String, dynamic> json) =>
    SecurityBadge(
      name: json['name'] as String,
      earned: json['earned'] as bool,
      description: json['description'] as String,
    );

Map<String, dynamic> _$SecurityBadgeToJson(SecurityBadge instance) =>
    <String, dynamic>{
      'name': instance.name,
      'earned': instance.earned,
      'description': instance.description,
    };
