# SecondBrain Design Guidelines

## Design Approach

**Reference-Based Approach** drawing inspiration from Linear's clean task management aesthetic, combined with data-dense productivity tools like Notion and analytical dashboards. The design prioritizes clarity, information hierarchy, and efficient workflows over decorative elements.

**Core Principles:**
- Information clarity over visual embellishment
- Dense, scannable layouts that respect user time
- Purposeful spacing that creates breathing room without wasted space
- Typography-driven hierarchy with minimal reliance on visual decoration

---

## Typography System

**Font Families:**
- Primary: Inter (via Google Fonts CDN)
- Monospace: JetBrains Mono (for timers, metrics, technical data)

**Type Scale:**
- Headings: text-2xl (24px), text-xl (20px), text-lg (18px) - font-semibold
- Body: text-base (16px) - font-normal
- Secondary: text-sm (14px) - font-medium for labels, metadata
- Captions: text-xs (12px) - for timestamps, helper text
- Data displays: text-3xl or text-4xl - font-bold for timers, scores

**Line Heights:**
- Headings: leading-tight (1.25)
- Body text: leading-relaxed (1.625)
- Compact lists: leading-normal (1.5)

---

## Layout System

**Spacing Primitives:** Use Tailwind units of **2, 3, 4, 6, 8, 12, 16** consistently
- Micro spacing: p-2, gap-2 (8px) - between related elements
- Standard spacing: p-4, gap-4 (16px) - component padding, card spacing
- Section spacing: p-6, py-8 (24px, 32px) - major sections
- Large spacing: py-12, py-16 (48px, 64px) - page sections

**Grid Structure:**
- Main application: Two-column layout on desktop (sidebar + main content area)
- Sidebar: Fixed width ~280px (w-70), persistent navigation
- Main content: flex-1 with max-w-7xl constraint
- Dashboard widgets: 3-column grid on desktop (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Mobile: Single column stack, collapsible sidebar as drawer

**Container Strategy:**
- App shell: Full viewport height (h-screen) with overflow management
- Content sections: Natural height with consistent vertical padding (py-6 to py-8)
- Scrollable areas: Independent scroll containers for task lists, focus session queue

---

## Component Library

### Navigation & Shell

**Sidebar Navigation:**
- Width: w-70 (280px), fixed position
- Structure: Logo/branding at top, nav items with icons (Heroicons), security health score widget at bottom
- Nav items: flex items-center gap-3, p-3, rounded-lg, text-sm font-medium
- Active state: distinct treatment without color reference

**Top Bar:**
- Height: h-16, flex items-center justify-between px-6
- Contains: Page title (text-xl font-semibold), search input, user actions
- Search: Expandable input field, w-full md:w-96, with icon prefix

### Task Management

**Task List Item:**
- Structure: Checkbox + content + metadata + actions, p-3 or p-4, rounded-lg
- Layout: flex items-start gap-3
- Content hierarchy: Title (text-base font-medium), notes preview (text-sm), metadata row (text-xs)
- Metadata badges: Inline flex gap-2, rounded-full px-2 py-1 text-xs
- Density options: Compact (p-2) vs comfortable (p-4)

**Task Card (Detailed View):**
- Padding: p-6, rounded-xl
- Header: Title input + status indicators
- Sections: Clear separation with border-b, py-4
- Form fields: Consistent spacing (space-y-4)
- Due date, duration, energy, value fields in 2-column grid on desktop

**Add Task Button:**
- Prominent placement: Fixed bottom-right on mobile (bottom-6 right-6), top of list on desktop
- Size: Large touch target (h-12 w-12 or h-14 w-14)
- Icon: Plus symbol (Heroicons)

### Smart Queue & Scheduler

**Queue Configuration Panel:**
- Card layout: p-6, rounded-xl, space-y-6
- Input fields: Time budget slider, energy budget selector (radio group or segmented control)
- Results display: Grid of selected tasks with explanation text (text-sm italic)
- Explanation box: p-4, rounded-lg, text-sm, includes algorithm insights

**Suggested Tasks Display:**
- List format: space-y-2, max height with scroll
- Each item: Shows task title, duration badge, value/energy indicators
- Action button: "Start Focus Session" - prominent, w-full or w-auto

### Focus Session Player

**Session Interface:**
- Full-screen or modal overlay experience
- Timer display: Center-aligned, text-6xl or text-7xl font-bold (JetBrains Mono)
- Current task: Text-2xl font-semibold above timer
- Task queue: Compact list below, text-sm
- Controls: Large buttons for pause/resume, skip (h-12 px-8)
- Progress indicator: Linear progress bar or circular ring around timer

**Break Prompts:**
- Modal or toast notification: p-6, rounded-2xl, max-w-md
- Icon + message: flex items-center gap-4
- Suggestions: Bulleted list (text-sm), breathing exercises, eye breaks
- Dismiss action: Secondary button

### Dependency Graph

**Graph Visualization:**
- Container: min-h-96 or h-[500px], w-full, rounded-xl
- Node representation: Rounded rectangles with task titles, compact padding
- Edge style: Directed arrows, avoid overlapping with proper layout algorithm
- Controls: Zoom/pan controls (floating buttons), full-screen option
- Legend: Small panel explaining node states (active, completed, blocked)

**Cycle Prevention Dialog:**
- Modal: max-w-lg, p-6, rounded-xl
- Warning icon + heading: flex items-center gap-3
- Explanation: text-sm leading-relaxed
- Affected tasks list: Highlighted in flow diagram or bulleted list

### Security & Analytics

**Digital Security Health Widget:**
- Compact card: p-4 or p-6, rounded-lg
- Score display: Large number (text-4xl font-bold) with label
- Progress bar: Visual representation of score (0-100)
- Recommendation list: space-y-2, text-xs or text-sm
- Action items: Each with icon prefix, clickable

**Telemetry Dashboard:**
- Grid layout: 3-column for stat cards (grid-cols-1 md:grid-cols-3)
- Stat cards: p-4, rounded-lg, min-h-24
  - Value: text-3xl font-bold
  - Label: text-sm
  - Trend indicator: Small inline metric
- Charts: Using fl_chart library or similar
  - Container: h-64 or h-80, p-4
  - Axis labels: text-xs
  - Data points clearly marked

**Session History:**
- Table or card list format
- Columns: Date, tasks completed, duration, interruptions, actual vs estimated
- Row height: h-12 to h-16, adequate touch targets
- Alternating row treatment for scannability

### Forms & Inputs

**Input Fields:**
- Height: h-10 or h-12, consistent across app
- Padding: px-3 or px-4
- Rounded: rounded-md or rounded-lg
- Label: text-sm font-medium, mb-2
- Helper text: text-xs, mt-1

**Buttons:**
- Primary: h-10 or h-12, px-6, rounded-lg, font-medium
- Secondary: Same dimensions, visually distinct treatment
- Icon buttons: h-10 w-10, rounded-lg, centered icon
- Disabled state: reduced opacity (opacity-50), cursor-not-allowed

**Segmented Controls:** (for filters: All/Active/Completed)
- Inline flex, rounded-lg container
- Segments: px-4 py-2, text-sm font-medium
- Active segment: distinct visual treatment

**Sliders:**
- Track height: h-2, rounded-full
- Thumb: h-4 w-4 or h-5 w-5, rounded-full
- Labels: text-sm at min/max values

---

## Page Layouts

### Dashboard/Home View
- Three-column widget grid (desktop): Security health + upcoming tasks + recent sessions
- Quick access: "New Task" and "Start Focus Session" prominent
- Recent activity stream below widgets

### Task List View
- Filters at top: Segmented control (All/Active/Completed) + search input
- Task list: Main scrollable area with consistent item height
- Floating "Add Task" action
- Sidebar: Task count, filters, tags

### Focus Session View
- Centered layout when active session running
- Timer and current task dominate viewport
- Queue preview: Fixed panel or drawer
- Session controls: Bottom bar (mobile) or side panel (desktop)

### Analytics View
- Dashboard grid: 4 stat cards across top
- Charts section: 2-column layout for different metrics
- Session history table below
- Export/filter controls in top bar

### Settings/Profile View
- Single column form layout, max-w-2xl
- Sections separated clearly (py-6, border-b)
- Encryption settings, notification preferences, theme toggle
- Security health detailed breakdown

---

## Animations

**Minimal, Purposeful Only:**
- Task completion: Subtle strikethrough or fade effect
- Modal entry/exit: Quick fade + scale (duration-200)
- Loading states: Simple spinner or skeleton screens
- NO scroll-triggered animations, parallax, or decorative motion

---

## Accessibility

- All interactive elements: min-height h-10 (40px) for touch targets
- Form inputs: Consistent focus states with clear visual indicators
- Icon buttons: Include aria-labels
- Keyboard navigation: Full support with visible focus rings
- Screen reader: Semantic HTML, proper heading hierarchy (h1 > h2 > h3)

---

## Images

**No hero image** - this is a productivity application focused on utility. Images used sparingly:

1. **Empty States:**
   - Illustration when no tasks exist
   - Simple line drawings or icons
   - Center-aligned, max-w-sm

2. **Onboarding (Optional):**
   - Feature explanation graphics
   - 3-4 simple illustrations showing key features
   - Each max-w-md, accompanied by text

3. **Security Feature Icons:**
   - Small icons representing security practices
   - Inline within text or as list prefixes
   - Use icon library (Heroicons) not images

---

**Implementation Note:** Prioritize information density and task completion speed. Users should never feel UI is getting in the way of productivity. Every pixel serves the goal of helping users manage tasks efficiently and securely.