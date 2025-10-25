import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

final themeProvider = StateNotifierProvider<ThemeNotifier, ThemeMode>((ref) {
  return ThemeNotifier();
});

class ThemeNotifier extends StateNotifier<ThemeMode> {
  static const _key = 'theme_mode';
  ThemeNotifier() : super(ThemeMode.system) {
    _loadTheme();
  }

  Future<void> _loadTheme() async {
    final prefs = await SharedPreferences.getInstance();
    final themeIndex = prefs.getInt(_key) ?? 0;
    state = ThemeMode.values[themeIndex];
  }

  Future<void> setThemeMode(ThemeMode mode) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt(_key, mode.index);
    state = mode;
  }
}

class ThemeModeToggle extends ConsumerWidget {
  const ThemeModeToggle({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final themeMode = ref.watch(themeProvider);
    
    return PopupMenuButton<ThemeMode>(
      icon: Icon(
        themeMode == ThemeMode.system
            ? Icons.brightness_auto
            : themeMode == ThemeMode.light
                ? Icons.brightness_5
                : Icons.brightness_2,
      ),
      onSelected: (ThemeMode mode) {
        ref.read(themeProvider.notifier).setThemeMode(mode);
      },
      itemBuilder: (context) => [
        const PopupMenuItem(
          value: ThemeMode.system,
          child: Row(
            children: [
              Icon(Icons.brightness_auto),
              SizedBox(width: 8),
              Text('System'),
            ],
          ),
        ),
        const PopupMenuItem(
          value: ThemeMode.light,
          child: Row(
            children: [
              Icon(Icons.brightness_5),
              SizedBox(width: 8),
              Text('Light'),
            ],
          ),
        ),
        const PopupMenuItem(
          value: ThemeMode.dark,
          child: Row(
            children: [
              Icon(Icons.brightness_2),
              SizedBox(width: 8),
              Text('Dark'),
            ],
          ),
        ),
      ],
    );
  }
}