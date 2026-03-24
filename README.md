# TaskNova - Project Tracker

A production-ready React + TypeScript application for project management with three synchronized views: Kanban Board, List View, and Timeline (Gantt).

## Features

- **Three Synchronized Views**: Kanban, List, Timeline - all sharing the same state
- **Custom Drag & Drop**: Built with pointer events, supports mouse and touch
- **Virtual Scrolling**: Handles 500+ tasks efficiently in List View
- **Live Collaboration Simulation**: Shows avatars of users viewing tasks
- **Filters with URL Sync**: Status, Priority, Assignee, Date Range - synced to URL
- **Responsive Design**: Works on desktop and tablet

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Zustand for state management
- React Router for navigation and URL state

## Getting Started

1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Open http://localhost:5173

## Architecture

### State Management

Uses Zustand with persist middleware for localStorage. Store includes tasks, users, filters, sort, and viewing users.

### Drag & Drop Implementation

Custom hook `useDragDrop` using pointer events:
- `pointerdown` to start drag
- `pointermove` for updates (optional)
- `pointerup` to detect drop zone via `document.elementsFromPoint`
- Drop zones marked with `data-drop-zone` attribute

### Virtual Scrolling

`useVirtualScroll` hook:
- Calculates visible range based on scrollTop
- Renders only visible items + buffer
- Uses absolute positioning for items
- Total height set to `itemCount * itemHeight`

### Filters and URL Sync

`useFilters` hook:
- Reads filters from URL on mount
- Updates URL when filters change
- Uses React Router's `useSearchParams`

### Collaboration Simulation

`useCollaboration` hook:
- Sets interval to randomly assign users to tasks
- Updates viewing users every 2-5 seconds

## Project Structure

```
src/
  components/
    Avatar.tsx
    Filters.tsx
    KanbanBoard.tsx
    ListView.tsx
    PriorityBadge.tsx
    TaskCard.tsx
    TimelineView.tsx
  data/
    generator.ts
  hooks/
    useCollaboration.ts
    useDragDrop.ts
    useFilters.ts
    useVirtualScroll.ts
  store/
    useTaskStore.ts
  types/
    index.ts
  App.tsx
  main.tsx
  index.css
```