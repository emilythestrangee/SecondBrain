# SecondBrain

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

## Screenshots

<img width="717" height="830" alt="image" src="https://github.com/user-attachments/assets/dd7eb6fd-3b16-46f2-994c-576edb144f5f" />

<img width="727" height="825" alt="image" src="https://github.com/user-attachments/assets/eb9837d9-017b-45b0-a7bd-e15bf106f452" />

<img width="740" height="832" alt="image" src="https://github.com/user-attachments/assets/d0e60d08-4195-4dd7-87d1-2e76a890f032" />

<img width="741" height="828" alt="image" src="https://github.com/user-attachments/assets/24e0bf5e-b960-40a5-b31f-5981001e059f" />

<img width="722" height="828" alt="image" src="https://github.com/user-attachments/assets/8e3b7bd2-8926-42e8-b80f-e8e6832b3664" />

<img width="735" height="826" alt="image" src="https://github.com/user-attachments/assets/7577bb3a-7763-4272-9e09-9c506a4d3fe8" />

<img width="753" height="699" alt="image" src="https://github.com/user-attachments/assets/cb19ffac-bfd9-476e-b62b-809a13410127" />

<img width="1132" height="449" alt="image" src="https://github.com/user-attachments/assets/996e0166-64cf-4339-8c17-cf8972b99b33" />

<img width="990" height="649" alt="image" src="https://github.com/user-attachments/assets/0af81ed9-1e94-477b-b7df-1aa7c2967d28" />



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
cd SecondBrain
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
