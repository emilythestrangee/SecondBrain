# SecondBrain Flutter

A local-first, encrypted task manager built with Flutter that combines intelligent task scheduling algorithms, dependency graph visualization with cycle detection, and cybersecurity-aware features.

## Features

### 🧠 Smart Task Management
- Full CRUD operations for tasks with rich metadata
- Properties: duration estimates, energy cost (1-5), priority value (1-100), dependencies
- Filter views: All/Active/Completed
- Fuzzy search functionality

### ⚡ Contextual Smart Queue (Algorithm Showcase)
- **Greedy Scheduler**: Sort by value/duration ratio, O(n log n)
- **2D Knapsack DP**: Optimize for time × energy constraints when task count ≤ 40
- Visual explanation of algorithm choices and selected tasks
- Maximizes value within user-specified time and energy budgets

### 🎯 Focus Session Player
- Pomodoro-style timer with sequential task execution
- Real-time telemetry tracking: start time, pauses, interruptions
- Break suggestions: breathing exercises, eye breaks
- Auto-completion of tasks upon timer finish

### 🔗 Task Dependency Graph
- Interactive visualization of task relationships
- **DFS Cycle Detection**: O(V + E) algorithm prevents circular dependencies
- Visual graph with nodes (tasks) and directed edges (dependencies)
- Validation before allowing new dependency links

### 🛡️ Digital Security Health
- Heuristic scoring system (0-100) based on:
  - Security task completion rate
  - Late-night work sessions
  - Encryption usage patterns
- Badge system for secure behaviors
- Actionable recommendations for improvement

### 📊 Session Analytics
- Historical telemetry data visualization
- Estimation accuracy tracking (estimated vs actual time)
- Productivity metrics: efficiency, interruption counts, energy usage
- Trend analysis for continuous improvement

## Architecture

```
lib/
  algorithms/
    scheduler.dart      # Greedy and Knapsack DP algorithms
    graph.dart          # DFS cycle detection and topological sort
    security.dart       # Security health calculation
  
  models/
    models.dart         # Data models with JSON serialization
  
  providers/
    database_provider.dart  # SQLite database setup
    task_provider.dart      # Task CRUD operations
    security_provider.dart  # Security health data
  
  screens/
    main_screen.dart        # Main navigation
    tasks_screen.dart       # Task management
    schedule_screen.dart    # Smart Queue scheduler
    focus_screen.dart       # Focus session player
    dependencies_screen.dart # Graph visualization
    security_screen.dart    # Security health dashboard
    analytics_screen.dart   # Session telemetry
  
  widgets/
    app_drawer.dart         # Navigation drawer
    task_list.dart          # Task display component
    task_dialog.dart        # Task creation/editing form
  
  theme/
    app_theme.dart          # Material Design 3 theme
```

## Algorithms Demonstrated

1. **Greedy Scheduling**
   - Sort tasks by value/duration ratio
   - Complexity: O(n log n)
   - Fast and produces good results for most cases

2. **2D Knapsack Dynamic Programming**
   - Optimize across time and energy constraints
   - Complexity: O(n × T × E) where T=time budget, E=energy budget
   - Used as fallback for small task sets (n ≤ 40) for optimal solutions

3. **Depth-First Search (DFS) Cycle Detection**
   - Detect circular dependencies in task graph
   - Complexity: O(V + E) where V=tasks, E=dependencies
   - Uses visited set and recursion stack

## Tech Stack

- **Flutter**: Cross-platform mobile development
- **Riverpod**: State management and dependency injection
- **SQLite**: Local database storage
- **Material Design 3**: Modern UI components
- **Lucide Icons**: Consistent iconography

## Getting Started

### Prerequisites
- Flutter SDK (>=3.10.0)
- Dart SDK (>=3.0.0)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd secondbrain_flutter
```

2. Install dependencies:
```bash
flutter pub get
```

3. Generate code (for JSON serialization):
```bash
flutter packages pub run build_runner build
```

4. Run the app:
```bash
flutter run
```

### Database Setup

The app uses SQLite for local storage. The database is automatically initialized when the app starts, including sample data for development.

## Development Guidelines

- **Schema-first development**: All data models defined in `models/models.dart`
- **Component-driven UI**: Modular, reusable Flutter widgets
- **Type safety**: Full Dart coverage with proper null safety
- **Clean architecture**: Separation of concerns (UI, business logic, data)
- **Accessibility**: Proper semantic labels, keyboard navigation


## Future Enhancements

- **Local Encryption**: Browser-based AES-256-GCM encryption using Flutter's crypto package
- **Offline Sync**: Conflict resolution for multi-device usage
- **Advanced Analytics**: Machine learning for better time estimation
- **Widget Support**: Home screen widgets for quick task access
- **Notifications**: Smart reminders based on energy levels and schedules

## License

MIT License - see LICENSE file for details
