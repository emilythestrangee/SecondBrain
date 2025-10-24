import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../providers/task_provider.dart';
import '../models/models.dart';
import '../widgets/task_list.dart';
import '../widgets/task_dialog.dart';

class TasksScreen extends ConsumerStatefulWidget {
  const TasksScreen({super.key});

  @override
  ConsumerState<TasksScreen> createState() => _TasksScreenState();
}

class _TasksScreenState extends ConsumerState<TasksScreen> {
  String _searchQuery = '';
  TaskFilter _filter = TaskFilter.all;

  @override
  Widget build(BuildContext context) {
    final tasksAsync = ref.watch(tasksProvider);

    return Column(
      children: [
        // Header
        Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.surface,
            border: Border(
              bottom: BorderSide(
                color: Theme.of(context).colorScheme.outline.withOpacity(0.2),
              ),
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Tasks',
                style: Theme.of(context).textTheme.headlineLarge?.copyWith(
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'Manage your intelligent task system',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: Theme.of(context).colorScheme.onSurfaceVariant,
                ),
              ),
            ],
          ),
        ),

        // Search and Filters
        Container(
          padding: const EdgeInsets.all(24),
          child: Column(
            children: [
              // Search Bar
              TextField(
                decoration: InputDecoration(
                  hintText: 'Search tasks...',
                  prefixIcon: const Icon(LucideIcons.search),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                onChanged: (value) {
                  setState(() {
                    _searchQuery = value;
                  });
                },
              ),
              const SizedBox(height: 16),

              // Filter Tabs
              Row(
                children: [
                  Expanded(
                    child: FilterChip(
                      label: const Text('All'),
                      selected: _filter == TaskFilter.all,
                      onSelected: (selected) {
                        setState(() {
                          _filter = TaskFilter.all;
                        });
                      },
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: FilterChip(
                      label: const Text('Active'),
                      selected: _filter == TaskFilter.active,
                      onSelected: (selected) {
                        setState(() {
                          _filter = TaskFilter.active;
                        });
                      },
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: FilterChip(
                      label: const Text('Completed'),
                      selected: _filter == TaskFilter.completed,
                      onSelected: (selected) {
                        setState(() {
                          _filter = TaskFilter.completed;
                        });
                      },
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),

        // Task List
        Expanded(
          child: tasksAsync.when(
            data: (tasks) {
              final filteredTasks = _filterTasks(tasks, _filter, _searchQuery);
              return TaskList(
                tasks: filteredTasks,
                onTaskTap: (task) => _showTaskDialog(task),
              );
            },
            loading: () => const Center(
              child: CircularProgressIndicator(),
            ),
            error: (error, stack) => Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    LucideIcons.alertCircle,
                    size: 48,
                    color: Theme.of(context).colorScheme.error,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Failed to load tasks',
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    error.toString(),
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: Theme.of(context).colorScheme.onSurfaceVariant,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
          ),
        ),

        // Add Task Button
        Positioned(
          bottom: 24,
          right: 24,
          child: FloatingActionButton(
            onPressed: () => _showTaskDialog(null),
            child: const Icon(LucideIcons.plus),
          ),
        ),
      ],
    );
  }

  List<Task> _filterTasks(List<Task> tasks, TaskFilter filter, String searchQuery) {
    var filteredTasks = tasks;

    // Apply filter
    switch (filter) {
      case TaskFilter.all:
        break;
      case TaskFilter.active:
        filteredTasks = filteredTasks.where((task) => !task.completed).toList();
        break;
      case TaskFilter.completed:
        filteredTasks = filteredTasks.where((task) => task.completed).toList();
        break;
    }

    // Apply search
    if (searchQuery.isNotEmpty) {
      filteredTasks = filteredTasks.where((task) =>
          task.title.toLowerCase().contains(searchQuery.toLowerCase()) ||
          (task.notes?.toLowerCase().contains(searchQuery.toLowerCase()) ?? false)
      ).toList();
    }

    return filteredTasks;
  }

  void _showTaskDialog(Task? task) {
    showDialog(
      context: context,
      builder: (context) => TaskDialog(task: task),
    );
  }
}

enum TaskFilter { all, active, completed }
