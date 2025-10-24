import 'package:flutter_test/flutter_test.dart';
import 'package:secondbrain_flutter/algorithms/scheduler.dart';
import 'package:secondbrain_flutter/algorithms/graph.dart';
import 'package:secondbrain_flutter/models/models.dart';

void main() {
  group('Scheduler Algorithms', () {
    test('Greedy scheduler should select tasks by value/duration ratio', () {
      final tasks = [
        Task(
          id: '1',
          title: 'High value task',
          durationMinutes: 30,
          energyCost: 2,
          value: 90,
          dependsOn: [],
          completed: false,
          createdAt: DateTime.now(),
        ),
        Task(
          id: '2',
          title: 'Low value task',
          durationMinutes: 30,
          energyCost: 2,
          value: 30,
          dependsOn: [],
          completed: false,
          createdAt: DateTime.now(),
        ),
      ];

      final result = scheduleGreedy(tasks, 60, 5);
      
      expect(result.selectedTasks.length, 2);
      expect(result.selectedTasks.first.id, '1'); // Higher value/duration ratio
      expect(result.totalValue, 120);
    });

    test('Knapsack DP should find optimal solution for small task sets', () {
      final tasks = [
        Task(
          id: '1',
          title: 'Task 1',
          durationMinutes: 30,
          energyCost: 2,
          value: 60,
          dependsOn: [],
          completed: false,
          createdAt: DateTime.now(),
        ),
        Task(
          id: '2',
          title: 'Task 2',
          durationMinutes: 30,
          energyCost: 3,
          value: 90,
          dependsOn: [],
          completed: false,
          createdAt: DateTime.now(),
        ),
      ];

      final result = scheduleKnapsackDP(tasks, 60, 5);
      
      expect(result.selectedTasks.length, 2);
      expect(result.totalValue, 150);
    });
  });

  group('Graph Algorithms', () {
    test('Cycle detection should identify circular dependencies', () {
      final tasks = [
        Task(
          id: '1',
          title: 'Task 1',
          durationMinutes: 30,
          energyCost: 2,
          value: 60,
          dependsOn: ['2'],
          completed: false,
          createdAt: DateTime.now(),
        ),
        Task(
          id: '2',
          title: 'Task 2',
          durationMinutes: 30,
          energyCost: 2,
          value: 60,
          dependsOn: ['1'], // Circular dependency
          completed: false,
          createdAt: DateTime.now(),
        ),
      ];

      expect(hasCycle(tasks), true);
    });

    test('Cycle detection should return false for valid dependency graph', () {
      final tasks = [
        Task(
          id: '1',
          title: 'Task 1',
          durationMinutes: 30,
          energyCost: 2,
          value: 60,
          dependsOn: [],
          completed: false,
          createdAt: DateTime.now(),
        ),
        Task(
          id: '2',
          title: 'Task 2',
          durationMinutes: 30,
          energyCost: 2,
          value: 60,
          dependsOn: ['1'], // Valid dependency
          completed: false,
          createdAt: DateTime.now(),
        ),
      ];

      expect(hasCycle(tasks), false);
    });

    test('Topological sort should order tasks by dependencies', () {
      final tasks = [
        Task(
          id: '2',
          title: 'Task 2',
          durationMinutes: 30,
          energyCost: 2,
          value: 60,
          dependsOn: ['1'],
          completed: false,
          createdAt: DateTime.now(),
        ),
        Task(
          id: '1',
          title: 'Task 1',
          durationMinutes: 30,
          energyCost: 2,
          value: 60,
          dependsOn: [],
          completed: false,
          createdAt: DateTime.now(),
        ),
      ];

      final sorted = topologicalSort(tasks);
      expect(sorted, isNotNull);
      expect(sorted!.first.id, '1'); // Task 1 should come first
      expect(sorted.last.id, '2'); // Task 2 should come second
    });
  });
}
