import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';

class DependenciesScreen extends StatelessWidget {
  const DependenciesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            LucideIcons.network,
            size: 64,
            color: Theme.of(context).colorScheme.primary,
          ),
          const SizedBox(height: 16),
          Text(
            'Dependencies',
            style: Theme.of(context).textTheme.headlineLarge?.copyWith(
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Interactive visualization of task relationships with cycle detection',
            style: Theme.of(context).textTheme.bodyLarge?.copyWith(
              color: Theme.of(context).colorScheme.onSurfaceVariant,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: () {
              // TODO: Implement dependency graph
            },
            icon: const Icon(LucideIcons.network),
            label: const Text('View Dependency Graph'),
          ),
        ],
      ),
    );
  }
}
