# TaskNova - Project Tracker

A production-ready React + TypeScript application for project management with three synchronized views: Kanban Board, List View, and Timeline (Gantt).

## Features

- **Three Synchronized Views**: Kanban, List, Timeline - all sharing the same state
- **Custom Drag & Drop**: Built with pointer events, supports mouse and touch
- **Virtual Scrolling**: Handles 500+ tasks efficiently in List View
- **Live Collaboration Simulation**: Shows avatars of users viewing tasks
- **Filters with URL Sync**: Status, Priority, Assignee, Date Range - synced to URL
- **Mobile-First Responsive Design**: Optimized for mobile, tablet, and desktop
- **Authentication System**: Login/Signup with localStorage persistence
- **Protected Routes**: Secure access to dashboard

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Zustand for state management
- React Router for navigation and URL state
- Context API for authentication

## Getting Started

1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Open http://localhost:5173
4. Create an account or login to access the dashboard

## Authentication

- **Login/Signup**: Create account with email, password, and name
- **Protected Routes**: Dashboard requires authentication
- **Persistent Sessions**: User data stored in localStorage
- **Logout**: Secure logout functionality

## Mobile Responsiveness

- **Responsive Grid Layouts**: Adapts from 1 column (mobile) to 4 columns (desktop)
- **Touch-Friendly Interactions**: Optimized drag & drop for touch devices
- **Mobile Navigation**: Collapsible header with user info
- **Adaptive Components**: Task cards and filters adjust to screen size
- **Horizontal Scrolling**: Kanban board scrolls horizontally on mobile

## Architecture

### State Management

Uses Zustand with persist middleware for localStorage. Store includes tasks, users, filters, sort, and viewing users.

### Authentication Context

Context-based auth system with:
- Login/Signup functions
- User state management
- Route protection
- Loading states

### Drag & Drop Implementation

Custom hook `useDragDrop` using pointer events:
- `pointerdown` to start drag
- `pointermove` for updates (optional)
- `pointerup` to detect drop zone via `document.elementsFromPoint`
- Drop zones marked with `data-drop-zone` attribute

### Virtual Scrolling

`useListRendering` hook:
- Calculates visible range based on scrollTop
- Renders only visible items + buffer
- Uses absolute positioning for items
- Total height set to `itemCount * itemHeight`

### Filters and URL Sync

## Getting Started

1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Open http://localhost:5173
4. Create an account or login to access the dashboard

## Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**: `npm install -g vercel`
2. **Deploy**: `vercel` (follow prompts)
3. **Production**: `vercel --prod`

**Vite Config**: Base path set to "/" for proper asset loading.

### Manual Build

```bash
npm run build
npm run preview  # Test production build locally
```

Build outputs to `dist/` directory with optimized assets.

## Authentication

- **Login/Signup**: Create account with email, password, and name
- **Protected Routes**: Dashboard requires authentication
- **Persistent Sessions**: User data stored in localStorage
- **Logout**: Secure logout functionality

## Mobile Responsiveness

- **Responsive Grid Layouts**: Adapts from 1 column (mobile) to 4 columns (desktop)
- **Touch-Friendly Interactions**: Optimized drag & drop for touch devices
- **Mobile Navigation**: Collapsible header with user info
- **Adaptive Components**: Task cards and filters adjust to screen size
- **Horizontal Scrolling**: Kanban board scrolls horizontally on mobile

### State Management

Uses Zustand with persist middleware for localStorage. Store includes tasks, users, filters, sort, and viewing users.

### Drag & Drop Implementation

Custom hook `useDragDrop` using pointer events:
- `pointerdown` to start drag
- `pointermove` for updates (optional)
- `pointerup` to detect drop zone via `document.elementsFromPoint`
- Drop zones marked with `data-drop-zone` attribute

### Virtual Scrolling

`useListRendering` hook:
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
    useListRendering.ts
  store/
    useTaskStore.ts
  types/
    index.ts
  App.tsx
  main.tsx
  index.css
```