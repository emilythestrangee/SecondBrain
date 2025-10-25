import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../providers/theme_provider.dart';
import '../screens/tasks_screen.dart';
import '../screens/schedule_screen.dart';
import '../screens/focus_screen.dart';
import '../screens/dependencies_screen.dart';
import '../screens/security_screen.dart';
import '../screens/analytics_screen.dart';
import '../widgets/app_drawer.dart';

class MainScreen extends ConsumerStatefulWidget {
  const MainScreen({super.key});

  @override
  ConsumerState<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends ConsumerState<MainScreen> {
  int _currentIndex = 0;
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  final List<Widget> _screens = [
    const TasksScreen(),
    const ScheduleScreen(),
    const FocusScreen(),
    const DependenciesScreen(),
    const SecurityScreen(),
    const AnalyticsScreen(),
  ];

  final List<NavigationItem> _navigationItems = [
    NavigationItem(
      icon: LucideIcons.listTodo,
      label: 'Tasks',
    ),
    NavigationItem(
      icon: LucideIcons.sparkles,
      label: 'Smart Queue',
    ),
    NavigationItem(
      icon: LucideIcons.timer,
      label: 'Focus Session',
    ),
    NavigationItem(
      icon: LucideIcons.network,
      label: 'Dependencies',
    ),
    NavigationItem(
      icon: LucideIcons.shield,
      label: 'Security',
    ),
    NavigationItem(
      icon: LucideIcons.barChart3,
      label: 'Analytics',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      appBar: AppBar(
        title: Text(_navigationItems[_currentIndex].label),
        leading: IconButton(
          icon: const Icon(LucideIcons.menu),
          onPressed: () => _scaffoldKey.currentState?.openDrawer(),
        ),
        actions: [
          IconButton(
            icon: const Icon(LucideIcons.search),
            onPressed: () {
              // TODO: Implement search
            },
          ),
          const ThemeModeToggle(),
        ],
      ),
      drawer: const AppDrawer(),
      body: _screens[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        items: _navigationItems.map((item) => BottomNavigationBarItem(
          icon: Icon(item.icon),
          label: item.label,
        )).toList(),
      ),
    );
  }
}

class NavigationItem {
  final IconData icon;
  final String label;

  NavigationItem({
    required this.icon,
    required this.label,
  });
}
