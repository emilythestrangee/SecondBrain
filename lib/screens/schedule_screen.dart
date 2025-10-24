import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../models/models.dart';
import '../algorithms/scheduler.dart';
import '../providers/task_provider.dart';

class ScheduleScreen extends ConsumerStatefulWidget {
  const ScheduleScreen({super.key});

  @override
  ConsumerState<ScheduleScreen> createState() => _ScheduleScreenState();
}

class _ScheduleScreenState extends ConsumerState<ScheduleScreen> {
  int _timeBudget = 90;
  int _energyBudget = 3;
  ScheduleResult? _scheduleResult;

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
              Row(
                children: [
                  Icon(
                    LucideIcons.sparkles,
                    color: Theme.of(context).colorScheme.primary,
                    size: 24,
                  ),
                  const SizedBox(width: 12),
                  Text(
                    'Smart Queue',
                    style: Theme.of(context).textTheme.headlineLarge?.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 4),
              Text(
                'AI-powered task scheduling using knapsack optimization and greedy heuristics',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: Theme.of(context).colorScheme.onSurfaceVariant,
                ),
              ),
            ],
          ),
        ),

        Expanded(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Column(
              children: [
                // Configuration Card
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Schedule Configuration',
                          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 24),

                        // Time Budget
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Time Budget: $_timeBudget minutes',
                              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Slider(
                              value: _timeBudget.toDouble(),
                              min: 15,
                              max: 240,
                              divisions: 15,
                              onChanged: (value) {
                                setState(() {
                                  _timeBudget = value.round();
                                });
                              },
                            ),
                            Text(
                              'How much time do you have available?',
                              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                color: Theme.of(context).colorScheme.onSurfaceVariant,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 24),

                        // Energy Budget
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Energy Level: ${_getEnergyLabel(_energyBudget)}',
                              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Slider(
                              value: _energyBudget.toDouble(),
                              min: 1,
                              max: 5,
                              divisions: 4,
                              onChanged: (value) {
                                setState(() {
                                  _energyBudget = value.round();
                                });
                              },
                            ),
                            Text(
                              'How much mental/physical energy do you have?',
                              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                color: Theme.of(context).colorScheme.onSurfaceVariant,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 24),

                        // Generate Button
                        SizedBox(
                          width: double.infinity,
                          child: ElevatedButton.icon(
                            onPressed: () => _generateSchedule(tasksAsync),
                            icon: const Icon(LucideIcons.sparkles),
                            label: const Text('Generate Optimal Schedule'),
                            style: ElevatedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(vertical: 16),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

                // Results
                if (_scheduleResult != null) ...[
                  const SizedBox(height: 24),

                  // Algorithm Info
                  Card(
                    color: Theme.of(context).colorScheme.primaryContainer,
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Row(
                        children: [
                          Icon(
                            LucideIcons.info,
                            color: Theme.of(context).colorScheme.onPrimaryContainer,
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              _scheduleResult!.explanation,
                              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                color: Theme.of(context).colorScheme.onPrimaryContainer,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Summary Stats
                  Row(
                    children: [
                      Expanded(
                        child: _buildStatCard(
                          context,
                          LucideIcons.clock,
                          'Total Duration',
                          '${_scheduleResult!.totalDuration}',
                          'minutes of $_timeBudget',
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _buildStatCard(
                          context,
                          LucideIcons.zap,
                          'Avg Energy',
                          _getAverageEnergy().toStringAsFixed(1),
                          'out of $_energyBudget',
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _buildStatCard(
                          context,
                          LucideIcons.trendingUp,
                          'Total Value',
                          '${_scheduleResult!.totalValue}',
                          'priority points',
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 24),

                  // Selected Tasks
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(24),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                'Selected Tasks (${_scheduleResult!.selectedTasks.length})',
                                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              if (_scheduleResult!.selectedTasks.isNotEmpty)
                                ElevatedButton.icon(
                                  onPressed: () {
                                    // TODO: Navigate to focus session
                                  },
                                  icon: const Icon(LucideIcons.playCircle),
                                  label: const Text('Start Focus Session'),
                                ),
                            ],
                          ),
                          const SizedBox(height: 16),

                          if (_scheduleResult!.selectedTasks.isEmpty)
                            Center(
                              child: Padding(
                                padding: const EdgeInsets.all(32),
                                child: Text(
                                  'No tasks match your constraints. Try adjusting your time or energy budget.',
                                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                    color: Theme.of(context).colorScheme.onSurfaceVariant,
                                  ),
                                  textAlign: TextAlign.center,
                                ),
                              ),
                            )
                          else
                            ..._scheduleResult!.selectedTasks.asMap().entries.map((entry) {
                              final index = entry.key;
                              final task = entry.value;
                              return Column(
                                children: [
                                  if (index > 0) const Divider(),
                                  _buildTaskItem(context, task, index + 1),
                                ],
                              );
                            }),
                        ],
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildStatCard(
    BuildContext context,
    IconData icon,
    String label,
    String value,
    String subtitle,
  ) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  icon,
                  size: 16,
                  color: Theme.of(context).colorScheme.primary,
                ),
                const SizedBox(width: 8),
                Text(
                  label,
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              value,
              style: Theme.of(context).textTheme.displaySmall?.copyWith(
                fontFamily: 'JetBrainsMono',
                fontWeight: FontWeight.bold,
              ),
            ),
            Text(
              subtitle,
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                color: Theme.of(context).colorScheme.onSurfaceVariant,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTaskItem(BuildContext context, Task task, int index) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Text(
            '#$index',
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
              fontFamily: 'JetBrainsMono',
              color: Theme.of(context).colorScheme.onSurfaceVariant,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  task.title,
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 8,
                  runSpacing: 4,
                  children: [
                    _buildBadge(
                      context,
                      LucideIcons.clock,
                      '${task.durationMinutes}m',
                      Theme.of(context).colorScheme.primary,
                    ),
                    _buildBadge(
                      context,
                      LucideIcons.zap,
                      'Energy ${task.energyCost}/5',
                      _getEnergyColor(context, task.energyCost),
                    ),
                    _buildBadge(
                      context,
                      LucideIcons.star,
                      'Value ${task.value}',
                      Theme.of(context).colorScheme.secondary,
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBadge(BuildContext context, IconData icon, String text, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: color.withOpacity(0.3),
          width: 1,
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            icon,
            size: 12,
            color: color,
          ),
          const SizedBox(width: 4),
          Text(
            text,
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
              color: color,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  String _getEnergyLabel(int energy) {
    if (energy <= 2) return 'Low Energy';
    if (energy == 3) return 'Medium Energy';
    if (energy == 4) return 'High Energy';
    return 'Maximum Energy';
  }

  Color _getEnergyColor(BuildContext context, int energy) {
    if (energy <= 2) return Colors.green;
    if (energy <= 3) return Colors.orange;
    return Colors.red;
  }

  double _getAverageEnergy() {
    if (_scheduleResult!.selectedTasks.isEmpty) return 0;
    return _scheduleResult!.selectedTasks
        .fold(0, (sum, task) => sum + task.energyCost) /
        _scheduleResult!.selectedTasks.length;
  }

  void _generateSchedule(AsyncValue<List<Task>> tasksAsync) {
    tasksAsync.whenData((tasks) {
      final result = scheduleOptimal(tasks, _timeBudget, _energyBudget);
      setState(() {
        _scheduleResult = result;
      });
    });
  }
}
