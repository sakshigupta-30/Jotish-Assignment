# Employee Insights Dashboard

A four-screen employee insights dashboard built with React, Vite, and Tailwind CSS. Features secure authentication, a custom-virtualized data grid, camera-based identity verification with signature capture, and data visualizations using raw SVG and Leaflet.

## Setup

```bash
npm install
cp .env.example .env   # fill in values
npm run dev
```

### Environment Variables

| Key | Purpose |
|---|---|
| VITE_AUTH_USERNAME | Login username |
| VITE_AUTH_PASSWORD | Login password |
| VITE_API_URL | Employee data API endpoint |
| VITE_API_USERNAME | API auth username |
| VITE_API_PASSWORD | API auth password |

## Screens

1. **Login** - Form authentication with session persistence via localStorage. Protected routes redirect unauthorized users.
2. **Employee List** - Custom-virtualized table rendering only visible rows. Fetches data from the API.
3. **Identity Verification** - Camera capture via getUserMedia, signature drawing on an HTML5 Canvas overlay, and programmatic merge of both into a single image.
4. **Analytics** - Displays the merged audit image, a raw SVG bar chart of average salary per city, and a Leaflet map with city markers.

## Intentional Bug

**Type:** Stale closure

**Location:** `src/hooks/useVirtualScroll.js`, line 7

**What it does:** The `rowHeight` parameter is captured once via `useRef(rowHeight)` on the initial render and stored as `initialRowHeight`. All subsequent scroll offset calculations use `initialRowHeight.current` instead of the live `rowHeight` prop. If `rowHeight` changes after the component mounts (for example, if the table is resized or the row height is dynamically adjusted), the virtualization math will use the stale value. This causes rows to render at incorrect vertical positions, creating visual gaps or overlapping rows.

**Why this bug:** Stale closures are among the most common and hardest-to-diagnose React bugs. This one is particularly subtle because the table appears to work correctly until the row height actually changes, which may not happen during casual testing.

**Fix:** Replace `initialRowHeight.current` with the live `rowHeight` value directly in the scroll calculations.

## Virtualization Math

The custom virtualization logic lives in `src/hooks/useVirtualScroll.js`.

**Inputs:**
- `totalItems` - total number of rows in the dataset
- `rowHeight` - height of each row in pixels
- `containerHeight` - height of the scrollable viewport
- `bufferSize` - number of extra rows to render above and below the viewport (default: 5)

**Calculations:**

The scroll handler tracks `scrollTop` (the current scroll position of the container).

```
startIndex = max(0, floor(scrollTop / rowHeight) - bufferSize)
visibleCount = ceil(containerHeight / rowHeight) + 2 * bufferSize
endIndex = min(totalItems - 1, startIndex + visibleCount)
offsetY = startIndex * rowHeight
totalHeight = totalItems * rowHeight
```

- `totalHeight` is applied to an inner spacer div to create the correct native scrollbar behavior.
- Only `data.slice(startIndex, endIndex + 1)` is rendered in the DOM.
- The visible rows are positioned using `transform: translateY(offsetY)` so they appear at their correct vertical position within the scrollable container.
- The buffer rows prevent flickering during fast scrolling by pre-rendering rows just outside the viewport.

## Tech Stack

- React 19 + Vite
- Tailwind CSS v4
- Leaflet (map only)
- No UI component libraries
- No charting libraries
