
## Required Deliverables (Checklist)

- Setup Instructions
- State Management Decision Justification
- Virtual Scrolling Implementation Explanation
- Drag-and-Drop Approach Explanation
- Lighthouse screenshot reference
- Explanation field (150–250 words)

## Setup Instructions

1. Clone repo: `git clone https://github.com/<Ankit-kumar2764>/TaskNova.git`
2. `cd TaskNova`
3. `npm install`
4. `npm run dev`
5. Open `http://localhost:5173`
6. For production preview:
   - `npm run build`
   - `npm run preview`

## State Management Decision Justification

I chose Zustand with persisted localStorage middleware for its minimal API, global store patterns, and easy mutation semantics from React components. Zustand keeps state updates efficient (shallow subscription), reduces rerenders, and gives direct access to shared state across Kanban/List/Timeline views without prop drilling. Persisting to localStorage supports offline state across refreshes while keeping the UI responsive.

## Virtual Scrolling Implementation

`useListRendering` calculates `startIndex` and `endIndex` based on `scrollTop`, `containerHeight`, and `rowHeight`, then renders only visible items plus buffer. Container height is fixed at `itemCount * rowHeight` and each row is absolutely positioned using `top = index * rowHeight`, ensuring constant DOM size and avoiding browser repaint thrash for 500+ tasks.

## Drag-and-Drop Approach

`useDragDrop` uses pointer events and a drag overlay. On `pointerdown`, it captures source item and dimensions; `pointermove` updates drag preview and detects target via `document.elementsFromPoint`; `pointerup` performs drop, updates Zustand store order, and clears active state. We render a fixed-size placeholder in target column so swapping items does not cause layout shift.

## Lighthouse Screenshot

See `docs/lighthouse-tasknova.png` (or `screenshots/lighthouse-mobile.png` + `screenshots/lighthouse-desktop.png`).

## Explanation (150–250 words)

The hardest UI challenge was building smooth, bug-free drag-and-drop while keeping three synchronized views updated in real time. I created a dedicated drag state layer using `useDragDrop` and mapped pointer movements to the nearest drop zone without relying on the browser iOS/Android natively; the complexity was ensuring `document.elementsFromPoint` logic did not misclassify elements during fast gestures.

To prevent layout shift during drag, I reserve a placeholder slot in the target list/column at the same size as the dragged card. The placeholder is always present during drag, so the UI does not jump when an item is removed from source and inserted into target. I additionally keep the original source card visually hidden (not removed) until `pointerup`, which avoids interim renders that cause reflow.

With more time, I would refactor the current drag drop mechanism into a shared query/stateful service layer and extract common reordering logic into pure utility functions. This would make the feature easier to test with unit tests and support future multi-user/sync operations without duplicating business logic.
