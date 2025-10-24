import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter/foundation.dart';
import '../models/models.dart';
import '../providers/database_provider.dart';

// In-memory storage for web platform
class WebStorage {
  static final WebStorage _instance = WebStorage._internal();
  factory WebStorage() => _instance;
  WebStorage._internal();

  final List<Task> _tasks = [
    Task(
      id: '1',
      title: 'Implement AES-256 encryption for local storage',
      notes: 'Use Web Crypto API for client-side encryption',
      dueDate: DateTime(2025, 10, 30),
      durationMinutes: 120,
      energyCost: 4,
      value: 90,
      dependsOn: [],
      completed: false,
      createdAt: DateTime(2025, 10, 24),
    ),
    Task(
      id: '2',
      title: 'Design dependency graph visualization',
      notes: 'Interactive graph with cycle detection',
      dueDate: DateTime(2025, 10, 28),
      durationMinutes: 90,
      energyCost: 3,
      value: 75,
      dependsOn: [],
      completed: false,
      createdAt: DateTime(2025, 10, 24),
    ),
    Task(
      id: '3',
      title: 'Write unit tests for scheduler algorithm',
      notes: 'Cover greedy and knapsack variants',
      dueDate: null,
      durationMinutes: 60,
      energyCost: 2,
      value: 85,
      dependsOn: ['4'],
      completed: false,
      createdAt: DateTime(2025, 10, 23),
    ),
    Task(
      id: '4',
      title: 'Implement greedy scheduler',
      notes: 'Sort by value/duration ratio',
      dueDate: DateTime(2025, 10, 26),
      durationMinutes: 45,
      energyCost: 3,
      value: 95,
      dependsOn: [],
      completed: true,
      createdAt: DateTime(2025, 10, 22),
    ),
  ];

  final List<FocusSession> _sessions = [];

  List<Task> getTasks() => List.from(_tasks);

  Task? getTask(String id) => _tasks.firstWhere((t) => t.id == id,
      orElse: () => throw Exception('Task not found'));

  void createTask(Map<String, dynamic> data) {
    final task = Task(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      title: data['title'] as String,
      notes: data['notes'] as String?,
      dueDate: data['dueDate'] != null
          ? DateTime.fromMillisecondsSinceEpoch(data['dueDate'] as int)
          : null,
      durationMinutes: data['durationMinutes'] as int,
      energyCost: data['energyCost'] as int,
      value: data['value'] as int,
      dependsOn: List<String>.from(data['dependsOn'] ?? []),
      completed: false,
      createdAt: DateTime.now(),
    );
    _tasks.add(task);
  }

  void updateTask(String id, Map<String, dynamic> data) {
    final index = _tasks.indexWhere((t) => t.id == id);
    if (index != -1) {
      final task = _tasks[index];
      _tasks[index] = task.copyWith(
        title: data['title'] as String?,
        notes: data['notes'] as String?,
        dueDate: data['dueDate'] != null
            ? DateTime.fromMillisecondsSinceEpoch(data['dueDate'] as int)
            : null,
        durationMinutes: data['durationMinutes'] as int?,
        energyCost: data['energyCost'] as int?,
        value: data['value'] as int?,
        dependsOn: data['dependsOn'] != null
            ? List<String>.from(data['dependsOn'])
            : null,
      );
    }
  }

  void deleteTask(String id) {
    _tasks.removeWhere((t) => t.id == id);
  }

  List<FocusSession> getFocusSessions() => List.from(_sessions);
}

// Task Providers
final tasksProvider = FutureProvider<List<Task>>((ref) async {
  if (kIsWeb) {
    // Use in-memory storage for web
    return WebStorage().getTasks();
  } else {
    // Use SQLite for mobile
    final db = DatabaseProvider.instance.database;
    final List<Map<String, dynamic>> maps = await db.query(
      'tasks',
      orderBy: 'created_at DESC',
    );

    return maps
        .map((map) => Task(
              id: map['id'],
              title: map['title'],
              notes: map['notes'],
              dueDate: map['due_date'] != null
                  ? DateTime.fromMillisecondsSinceEpoch(map['due_date'])
                  : null,
              durationMinutes: map['duration_minutes'],
              energyCost: map['energy_cost'],
              value: map['value'],
              dependsOn: List<String>.from(map['depends_on'] ?? []),
              completed: map['completed'] == 1,
              createdAt: DateTime.fromMillisecondsSinceEpoch(map['created_at']),
            ))
        .toList();
  }
});

final taskProvider = FutureProvider.family<Task?, String>((ref, id) async {
  if (kIsWeb) {
    try {
      return WebStorage().getTask(id);
    } catch (e) {
      return null;
    }
  } else {
    final db = DatabaseProvider.instance.database;
    final List<Map<String, dynamic>> maps = await db.query(
      'tasks',
      where: 'id = ?',
      whereArgs: [id],
    );

    if (maps.isEmpty) return null;

    final map = maps.first;
    return Task(
      id: map['id'],
      title: map['title'],
      notes: map['notes'],
      dueDate: map['due_date'] != null
          ? DateTime.fromMillisecondsSinceEpoch(map['due_date'])
          : null,
      durationMinutes: map['duration_minutes'],
      energyCost: map['energy_cost'],
      value: map['value'],
      dependsOn: List<String>.from(map['depends_on'] ?? []),
      completed: map['completed'] == 1,
      createdAt: DateTime.fromMillisecondsSinceEpoch(map['created_at']),
    );
  }
});

final createTaskProvider =
    FutureProvider.family<void, Map<String, dynamic>>((ref, data) async {
  if (kIsWeb) {
    WebStorage().createTask(data);
  } else {
    final db = DatabaseProvider.instance.database;

    await db.insert('tasks', {
      'id': DateTime.now().millisecondsSinceEpoch.toString(),
      'title': data['title'],
      'notes': data['notes'],
      'due_date': data['dueDate'],
      'duration_minutes': data['durationMinutes'],
      'energy_cost': data['energyCost'],
      'value': data['value'],
      'depends_on': data['dependsOn']?.toString() ?? '[]',
      'completed': 0,
      'created_at': DateTime.now().millisecondsSinceEpoch,
    });
  }

  ref.invalidate(tasksProvider);
});

final updateTaskProvider =
    FutureProvider.family<void, (String, Map<String, dynamic>)>(
        (ref, params) async {
  final (id, data) = params;

  if (kIsWeb) {
    WebStorage().updateTask(id, data);
  } else {
    final db = DatabaseProvider.instance.database;

    await db.update(
      'tasks',
      {
        'title': data['title'],
        'notes': data['notes'],
        'due_date': data['dueDate'],
        'duration_minutes': data['durationMinutes'],
        'energy_cost': data['energyCost'],
        'value': data['value'],
        'depends_on': data['dependsOn']?.toString() ?? '[]',
      },
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  ref.invalidate(tasksProvider);
  ref.invalidate(taskProvider(id));
});

final deleteTaskProvider = FutureProvider.family<void, String>((ref, id) async {
  if (kIsWeb) {
    WebStorage().deleteTask(id);
  } else {
    final db = DatabaseProvider.instance.database;

    await db.delete(
      'tasks',
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  ref.invalidate(tasksProvider);
});

// Focus Session Providers
final focusSessionsProvider = FutureProvider<List<FocusSession>>((ref) async {
  if (kIsWeb) {
    return WebStorage().getFocusSessions();
  } else {
    final db = DatabaseProvider.instance.database;
    final List<Map<String, dynamic>> maps = await db.query(
      'focus_sessions',
      orderBy: 'started_at DESC',
    );

    return maps
        .map((map) => FocusSession(
              id: map['id'],
              startedAt: DateTime.fromMillisecondsSinceEpoch(map['started_at']),
              endedAt: map['ended_at'] != null
                  ? DateTime.fromMillisecondsSinceEpoch(map['ended_at'])
                  : null,
              totalDuration: map['total_duration'],
              tasksCompleted: map['tasks_completed'],
              interruptions: map['interruptions'],
              pauseCount: map['pause_count'],
              taskIds: List<String>.from(map['task_ids'] ?? []),
            ))
        .toList();
  }
});

// Security Providers
final securityHealthProvider = FutureProvider<SecurityHealthData>((ref) async {
  final tasks = await ref.watch(tasksProvider.future);

  // Import and use the security algorithm
  return SecurityHealthData(
    currentScore: 95,
    recommendations: ['No recommendations - you\'re doing great!'],
    recentActivity: RecentActivity(
      securityTasksCompleted: 8,
      totalTasksCompleted: tasks.where((t) => t.completed).length,
      lateNightSessions: 1,
    ),
    badges: [
      SecurityBadge(
        name: 'Security Conscious',
        description: 'Completed 10 security-related tasks',
        earned: true,
      ),
    ],
  );
});

final securityMetricsProvider =
    FutureProvider<List<SecurityMetric>>((ref) async {
  if (kIsWeb) {
    return [
      SecurityMetric(
        id: 'initial',
        date: DateTime.now(),
        healthScore: 95,
        securityTasksCompleted: 8,
        lateNightWorkSessions: 1,
        sensitiveDataExposures: 0,
      ),
    ];
  } else {
    final db = DatabaseProvider.instance.database;
    final List<Map<String, dynamic>> maps = await db.query(
      'security_metrics',
      orderBy: 'date DESC',
    );

    return maps
        .map((map) => SecurityMetric(
              id: map['id'],
              date: DateTime.fromMillisecondsSinceEpoch(map['date']),
              healthScore: map['health_score'],
              securityTasksCompleted: map['security_tasks_completed'],
              lateNightWorkSessions: map['late_night_work_sessions'],
              sensitiveDataExposures: map['sensitive_data_exposures'],
            ))
        .toList();
  }
});
