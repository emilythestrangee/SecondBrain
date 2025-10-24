import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/models.dart';
import '../algorithms/security.dart';
import 'task_provider.dart';

final securityHealthProvider = FutureProvider<SecurityHealthData>((ref) async {
  final tasks = await ref.watch(tasksProvider.future);
  final sessions = await ref.watch(focusSessionsProvider.future);
  
  return calculateSecurityHealth(tasks, sessions);
});

final securityRecommendationsProvider = FutureProvider<List<String>>((ref) async {
  final tasks = await ref.watch(tasksProvider.future);
  return getSecurityRecommendations(tasks);
});
