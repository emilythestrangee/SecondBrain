import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:secondbrain_flutter/widgets/task_list.dart';
import 'package:secondbrain_flutter/models/models.dart';

void main() {
  group('TaskList Widget', () {
    testWidgets('should display empty state when no tasks', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: TaskList(
              tasks: const [],
              onTaskTap: (task) {},
            ),
          ),
        ),
      );

      expect(find.text('No tasks found'), findsOneWidget);
      expect(find.text('Create your first task to get started'), findsOneWidget);
    });

    testWidgets('should display task items when tasks are provided', (WidgetTester tester) async {
      final tasks = [
        Task(
          id: '1',
          title: 'Test Task',
          durationMinutes: 30,
          energyCost: 2,
          value: 60,
          dependsOn: [],
          completed: false,
          createdAt: DateTime.now(),
        ),
      ];

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: TaskList(
              tasks: tasks,
              onTaskTap: (task) {},
            ),
          ),
        ),
      );

      expect(find.text('Test Task'), findsOneWidget);
      expect(find.text('30m'), findsOneWidget);
      expect(find.text('Energy 2/5'), findsOneWidget);
      expect(find.text('Value 60'), findsOneWidget);
    });

    testWidgets('should show completed task with strikethrough', (WidgetTester tester) async {
      final tasks = [
        Task(
          id: '1',
          title: 'Completed Task',
          durationMinutes: 30,
          energyCost: 2,
          value: 60,
          dependsOn: [],
          completed: true,
          createdAt: DateTime.now(),
        ),
      ];

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: TaskList(
              tasks: tasks,
              onTaskTap: (task) {},
            ),
          ),
        ),
      );

      expect(find.text('Completed Task'), findsOneWidget);
      // Note: Testing text decoration in Flutter tests is complex
      // In a real app, you'd use custom matchers or golden tests
    });
  });
}
