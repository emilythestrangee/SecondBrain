import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../models/models.dart';
import '../providers/task_provider.dart';

class TaskDialog extends ConsumerStatefulWidget {
  final Task? task;

  const TaskDialog({
    super.key,
    this.task,
  });

  @override
  ConsumerState<TaskDialog> createState() => _TaskDialogState();
}

class _TaskDialogState extends ConsumerState<TaskDialog> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _titleController;
  late TextEditingController _notesController;
  DateTime? _dueDate;
  int _durationMinutes = 30;
  int _energyCost = 3;
  int _value = 50;
  List<String> _dependsOn = [];

  @override
  void initState() {
    super.initState();
    _titleController = TextEditingController(text: widget.task?.title ?? '');
    _notesController = TextEditingController(text: widget.task?.notes ?? '');
    
    if (widget.task != null) {
      _dueDate = widget.task!.dueDate;
      _durationMinutes = widget.task!.durationMinutes;
      _energyCost = widget.task!.energyCost;
      _value = widget.task!.value;
      _dependsOn = List.from(widget.task!.dependsOn);
    }
  }

  @override
  void dispose() {
    _titleController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isEditing = widget.task != null;

    return Dialog(
      child: Container(
        width: MediaQuery.of(context).size.width * 0.9,
        constraints: const BoxConstraints(maxWidth: 600),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Header
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.primaryContainer,
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(12),
                  topRight: Radius.circular(12),
                ),
              ),
              child: Row(
                children: [
                  Icon(
                    isEditing ? LucideIcons.edit : LucideIcons.plus,
                    color: Theme.of(context).colorScheme.onPrimaryContainer,
                  ),
                  const SizedBox(width: 12),
                  Text(
                    isEditing ? 'Edit Task' : 'Create Task',
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      color: Theme.of(context).colorScheme.onPrimaryContainer,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),

            // Form
            Padding(
              padding: const EdgeInsets.all(24),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Title
                    TextFormField(
                      controller: _titleController,
                      decoration: const InputDecoration(
                        labelText: 'Title',
                        hintText: 'Enter task title',
                      ),
                      validator: (value) {
                        if (value == null || value.trim().isEmpty) {
                          return 'Title is required';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 16),

                    // Notes
                    TextFormField(
                      controller: _notesController,
                      decoration: const InputDecoration(
                        labelText: 'Notes',
                        hintText: 'Additional details (optional)',
                      ),
                      maxLines: 3,
                    ),
                    const SizedBox(height: 16),

                    // Due Date
                    InkWell(
                      onTap: _selectDueDate,
                      child: InputDecorator(
                        decoration: const InputDecoration(
                          labelText: 'Due Date',
                          hintText: 'Select due date (optional)',
                        ),
                        child: Row(
                          children: [
                            Icon(
                              LucideIcons.calendar,
                              color: Theme.of(context).colorScheme.onSurfaceVariant,
                            ),
                            const SizedBox(width: 8),
                            Text(
                              _dueDate != null
                                  ? '${_dueDate!.day}/${_dueDate!.month}/${_dueDate!.year}'
                                  : 'No due date',
                              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                color: _dueDate != null
                                    ? Theme.of(context).colorScheme.onSurface
                                    : Theme.of(context).colorScheme.onSurfaceVariant,
                              ),
                            ),
                            if (_dueDate != null) ...[
                              const Spacer(),
                              IconButton(
                                icon: const Icon(LucideIcons.x),
                                onPressed: () {
                                  setState(() {
                                    _dueDate = null;
                                  });
                                },
                              ),
                            ],
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Duration
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Duration: $_durationMinutes minutes',
                          style: Theme.of(context).textTheme.titleMedium,
                        ),
                        Slider(
                          value: _durationMinutes.toDouble(),
                          min: 5,
                          max: 480,
                          divisions: 95,
                          onChanged: (value) {
                            setState(() {
                              _durationMinutes = value.round();
                            });
                          },
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),

                    // Energy Cost
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Energy Cost: $_energyCost/5',
                          style: Theme.of(context).textTheme.titleMedium,
                        ),
                        Slider(
                          value: _energyCost.toDouble(),
                          min: 1,
                          max: 5,
                          divisions: 4,
                          onChanged: (value) {
                            setState(() {
                              _energyCost = value.round();
                            });
                          },
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),

                    // Value
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Priority Value: $_value/100',
                          style: Theme.of(context).textTheme.titleMedium,
                        ),
                        Slider(
                          value: _value.toDouble(),
                          min: 1,
                          max: 100,
                          divisions: 99,
                          onChanged: (value) {
                            setState(() {
                              _value = value.round();
                            });
                          },
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            // Actions
            Container(
              padding: const EdgeInsets.all(24),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  TextButton(
                    onPressed: () => Navigator.of(context).pop(),
                    child: const Text('Cancel'),
                  ),
                  const SizedBox(width: 8),
                  ElevatedButton(
                    onPressed: _saveTask,
                    child: Text(isEditing ? 'Update' : 'Create'),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _selectDueDate() async {
    final date = await showDatePicker(
      context: context,
      initialDate: _dueDate ?? DateTime.now(),
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365)),
    );

    if (date != null) {
      setState(() {
        _dueDate = date;
      });
    }
  }

  void _saveTask() {
    if (!_formKey.currentState!.validate()) return;

    final taskData = {
      'title': _titleController.text.trim(),
      'notes': _notesController.text.trim().isEmpty ? null : _notesController.text.trim(),
      'dueDate': _dueDate?.millisecondsSinceEpoch,
      'durationMinutes': _durationMinutes,
      'energyCost': _energyCost,
      'value': _value,
      'dependsOn': _dependsOn,
    };

    if (widget.task != null) {
      ref.read(updateTaskProvider((widget.task!.id, taskData)));
    } else {
      ref.read(createTaskProvider(taskData));
    }

    Navigator.of(context).pop();
  }
}
