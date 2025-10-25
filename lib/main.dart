import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:secondbrain_flutter/providers/database_provider.dart';
import 'package:secondbrain_flutter/providers/theme_provider.dart';
import 'package:secondbrain_flutter/screens/main_screen.dart';
import 'package:secondbrain_flutter/theme/app_theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize database
  await DatabaseProvider.instance.init();
  
  runApp(const ProviderScope(child: SecondBrainApp()));
}

class SecondBrainApp extends ConsumerWidget {
  const SecondBrainApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final themeMode = ref.watch(themeProvider);
    
    return MaterialApp(
      title: 'SecondBrain',
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: themeMode,
      home: const MainScreen(),
      debugShowCheckedModeBanner: false,
    );
  }
}
