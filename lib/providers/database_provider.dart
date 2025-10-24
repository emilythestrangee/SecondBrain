import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';
import 'package:flutter/foundation.dart';

class DatabaseProvider {
  static final DatabaseProvider instance = DatabaseProvider._internal();
  DatabaseProvider._internal();

  Database? _database;

  Database get database {
    if (_database != null) return _database!;
    throw Exception('Database not initialized. Call init() first.');
  }

  Future<void> init() async {
    // Skip database initialization on web platform
    if (kIsWeb) {
      return;
    }

    final databasesPath = await getDatabasesPath();
    final path = join(databasesPath, 'secondbrain.db');

    _database = await openDatabase(
      path,
      version: 1,
      onCreate: _onCreate,
      onUpgrade: _onUpgrade,
    );
  }

  Future<void> _onCreate(Database db, int version) async {
    // Tasks table
    await db.execute('''
      CREATE TABLE tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        notes TEXT,
        due_date INTEGER,
        duration_minutes INTEGER NOT NULL DEFAULT 30,
        energy_cost INTEGER NOT NULL DEFAULT 3,
        value INTEGER NOT NULL DEFAULT 50,
        depends_on TEXT NOT NULL DEFAULT '[]',
        completed INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL
      )
    ''');

    // Focus Sessions table
    await db.execute('''
      CREATE TABLE focus_sessions (
        id TEXT PRIMARY KEY,
        started_at INTEGER NOT NULL,
        ended_at INTEGER,
        total_duration INTEGER NOT NULL DEFAULT 0,
        tasks_completed INTEGER NOT NULL DEFAULT 0,
        interruptions INTEGER NOT NULL DEFAULT 0,
        pause_count INTEGER NOT NULL DEFAULT 0,
        task_ids TEXT NOT NULL DEFAULT '[]'
      )
    ''');

    // Session Telemetry table
    await db.execute('''
      CREATE TABLE session_telemetry (
        id TEXT PRIMARY KEY,
        session_id TEXT NOT NULL,
        task_id TEXT NOT NULL,
        estimated_minutes INTEGER NOT NULL,
        actual_seconds INTEGER NOT NULL,
        completed_in_session INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL
      )
    ''');

    // Security Metrics table
    await db.execute('''
      CREATE TABLE security_metrics (
        id TEXT PRIMARY KEY,
        date INTEGER NOT NULL,
        health_score INTEGER NOT NULL DEFAULT 100,
        security_tasks_completed INTEGER NOT NULL DEFAULT 0,
        late_night_work_sessions INTEGER NOT NULL DEFAULT 0,
        sensitive_data_exposures INTEGER NOT NULL DEFAULT 0
      )
    ''');

    // Users table (for future auth)
    await db.execute('''
      CREATE TABLE users (
        id TEXT PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      )
    ''');

    // Insert sample data
    await _insertSampleData(db);
  }

  Future<void> _onUpgrade(Database db, int oldVersion, int newVersion) async {
    // Handle database migrations here
  }

  Future<void> _insertSampleData(Database db) async {
    final now = DateTime.now().millisecondsSinceEpoch;

    // Sample tasks
    await db.insert('tasks', {
      'id': '1',
      'title': 'Implement AES-256 encryption for local storage',
      'notes': 'Use Web Crypto API for client-side encryption',
      'due_date': DateTime(2025, 10, 30).millisecondsSinceEpoch,
      'duration_minutes': 120,
      'energy_cost': 4,
      'value': 90,
      'depends_on': '[]',
      'completed': 0,
      'created_at': now,
    });

    await db.insert('tasks', {
      'id': '2',
      'title': 'Design dependency graph visualization',
      'notes': 'Interactive graph with cycle detection',
      'due_date': DateTime(2025, 10, 28).millisecondsSinceEpoch,
      'duration_minutes': 90,
      'energy_cost': 3,
      'value': 75,
      'depends_on': '[]',
      'completed': 0,
      'created_at': now,
    });

    await db.insert('tasks', {
      'id': '3',
      'title': 'Write unit tests for scheduler algorithm',
      'notes': 'Cover greedy and knapsack variants',
      'due_date': null,
      'duration_minutes': 60,
      'energy_cost': 2,
      'value': 85,
      'depends_on': '["4"]',
      'completed': 0,
      'created_at': now,
    });

    await db.insert('tasks', {
      'id': '4',
      'title': 'Implement greedy scheduler',
      'notes': 'Sort by value/duration ratio',
      'due_date': DateTime(2025, 10, 26).millisecondsSinceEpoch,
      'duration_minutes': 45,
      'energy_cost': 3,
      'value': 95,
      'depends_on': '[]',
      'completed': 1,
      'created_at': now,
    });

    // Initial security metric
    await db.insert('security_metrics', {
      'id': 'initial',
      'date': now,
      'health_score': 95,
      'security_tasks_completed': 8,
      'late_night_work_sessions': 1,
      'sensitive_data_exposures': 0,
    });
  }

  Future<void> close() async {
    await _database?.close();
    _database = null;
  }
}
