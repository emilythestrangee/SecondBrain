# SecondBrain

SecondBrain is a local-first, encrypted task manager that combines intelligent task scheduling (knapsack + greedy algorithms), dependency graph visualization with cycle detection, and cybersecurity-aware features. It demonstrates algorithmic thinking, graph algorithms, and clean architecture suitable for technical interviews and portfolio showcasing.

## Project Overview

**Type:** Full-stack web application  
**Status:** In Development  
**Tech Stack:** React + TypeScript, Express.js, Shadcn UI, Tailwind CSS

## Key Features

### 1. Smart Task Management
- Full CRUD operations for tasks with rich metadata
- Properties: duration estimates, energy cost (1-5), priority value (1-100), dependencies
- Filter views: All/Active/Completed
- Fuzzy search functionality

### 2. Contextual Smart Queue (Algorithm Showcase)
- **Greedy Scheduler**: Sort by value/duration ratio, O(n log n)
- **2D Knapsack DP**: Optimize for time × energy constraints when task count ≤ 40
- Visual explanation of algorithm choices and selected tasks
- Maximizes value within user-specified time and energy budgets

### 3. Focus Session Player
- Pomodoro-style timer with sequential task execution
- Real-time telemetry tracking: start time, pauses, interruptions
- Break suggestions: 5s breathing, 20/20/20 eye rule, device lock reminders
- Auto-completion of tasks upon timer finish

### 4. Task Dependency Graph
- Interactive visualization of task relationships
- **DFS Cycle Detection**: O(V + E) algorithm prevents circular dependencies
- Visual graph with nodes (tasks) and directed edges (dependencies)
- Validation before allowing new dependency links

### 5. Digital Security Health
- Heuristic scoring system (0-100) based on:
  - Security task completion rate
  - Late-night work sessions
  - Encryption usage patterns
- Badge system for secure behaviors
- Actionable recommendations for improvement

### 6. Session Analytics
- Historical telemetry data visualization
- Estimation accuracy tracking (estimated vs actual time)
- Productivity metrics: efficiency, interruption counts, energy usage
- Trend analysis for continuous improvement

### 7. Local Encryption (Planned)
- Browser-based AES-256-GCM encryption using Web Crypto API
- Secure key management in localStorage/IndexedDB
- Privacy-first: all data stays local, no cloud required

## Architecture

```
client/
  src/
    components/
      app-sidebar.tsx       # Navigation with security health widget
      task-list.tsx         # Task display with filtering
      task-dialog.tsx       # Task creation/editing form
    pages/
      tasks-page.tsx        # Main task management
      schedule-page.tsx     # Smart Queue scheduler
      focus-page.tsx        # Focus session player
      dependencies-page.tsx # Graph visualization
      security-page.tsx     # Security health dashboard
      analytics-page.tsx    # Session telemetry

shared/
  schema.ts              # Shared TypeScript types and Zod schemas

server/
  routes.ts              # API endpoints
  storage.ts             # In-memory data persistence
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

## Development Guidelines

- **Schema-first development**: All data models defined in `shared/schema.ts`
- **Component-driven UI**: Modular, reusable React components
- **Type safety**: Full TypeScript coverage with Zod validation
- **Clean architecture**: Separation of concerns (UI, business logic, data)
- **Accessibility**: Proper ARIA labels, keyboard navigation, semantic HTML

## Interview Talking Points

- "I modeled task prioritization as a knapsack problem, implementing both greedy (O(n log n)) for speed and DP for correctness on small sets."
- "Used DFS-based cycle detection (O(V+E)) to validate task dependency graphs and prevent circular relationships."
- "Implemented local encryption simulation using Web Crypto API - demonstrating security awareness."
- "Built comprehensive telemetry system to track actual vs estimated time, enabling continuous scheduler improvement."
- "Followed clean architecture principles with clear separation between UI, business logic, and data layers."

## Current Status

**Phase 1 (Current):** Schema & Frontend ✅
- ✅ Complete data models with TypeScript types
- ✅ All React components built with Shadcn UI
- ✅ Responsive design with Tailwind CSS
- ✅ Six distinct pages: Tasks, Schedule, Focus, Dependencies, Security, Analytics

**Phase 2 (Next):** Backend Implementation
- Implement storage interface with CRUD operations
- Build scheduler algorithms (greedy + knapsack)
- Add cycle detection for dependency graph
- Create session telemetry tracking
- Implement security health scoring

**Phase 3 (Final):** Integration & Testing
- Connect frontend to backend APIs
- Add loading states and error handling
- Implement data persistence
- End-to-end testing of user journeys
- Deploy and document

## User Preferences

- Prioritize frontend visual quality
- Follow design guidelines strictly
- Use Inter font for UI, JetBrains Mono for data
- Information-dense layouts with clear hierarchy
- Minimal animations, purposeful interactions only
