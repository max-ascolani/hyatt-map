# Sidebar Restructure, Hide/Show & Floating Map Legends

**Created:** 2026-02-28
**Status:** active
**Type:** feature

## Context

The sidebar is currently a single continuous scroll of 10+ sections. During a presentation this is overwhelming — the audience can't quickly see what colors mean on the map, and the presenter has to scroll past irrelevant filters. Three improvements:

1. **Collapsible sidebar** — a button to hide/show the entire sidebar, giving a full-screen map for presentations
2. **Sidebar cleanup** — group the flat list into 4 collapsible sections by purpose
3. **Floating map legends** — a category color legend on the map (bottom-left) + a bigger demographics legend (bottom-right)

## Phase 0 — Investigation & Validation

- [x] Confirm current sidebar sections and their ordering in `Sidebar.tsx`
- [x] Confirm current demographics legend implementation in `DemographicLayer.tsx`
- [x] Identify existing collapsible pattern (super-category accordion uses `expandedGroups` state)
- [x] Verify no z-index conflicts with Leaflet controls for floating legends

## Phase 1 — Sidebar Hide/Show

- [x] `map/src/App.tsx`: Add `sidebarCollapsed: boolean` state (default: `false`)
- [x] Add toggle button visible when sidebar is collapsed — small floating button on the left edge of the map (chevron-right)
- [x] Add collapse button in the sidebar header (top-right) — chevron-left icon
- [x] When collapsed on desktop: sidebar width transitions to 0 with CSS transition (`transition-all duration-300`), map fills full width
- [x] When collapsed on mobile: same behavior as current (bottom sheet already hides)

## Phase 2 — Sidebar Section Grouping

Restructured the sidebar body into 4 collapsible sections using a `SidebarSection` helper component.

### Section 1: Categories (default: open)
- Show All / Hide All buttons
- 6 super-category accordion rows (unchanged)

### Section 2: Filters (default: collapsed)
- Price Tier pills
- Cuisine tag pills (conditional on dining active)
- Time Filter toggle + sliders

### Section 3: Map Layers (default: open)
- Distance Rings + "Only show within ring"
- Neighborhoods toggle + pills
- Demographics toggle + metric pills

### Section 4: Locations (default: collapsed)
- Sort controls (Distance / Rating)
- Scrollable competitor list

Implementation:
- [x] `map/src/components/Sidebar.tsx`: Add `openSections: Set<string>` state initialized to `new Set(['categories', 'layers'])`
- [x] Create `SidebarSection` helper: collapsible header with rotating chevron + content slot + optional badge
- [x] Move Price Tier + Cuisine + TimeSlider into "Filters" section
- [x] Move Distance Rings + Neighborhoods + Demographics into "Map Layers" section
- [x] Move Locations list into "Locations" section
- [x] Add collapsed summary badges: Filters shows active tiers/cuisines, Map Layers shows active layers, Locations shows count

## Phase 3 — Floating Category Legend

- [x] Create `map/src/components/CategoryLegend.tsx`:
  - Shows only active super-categories with color dot + label
  - Positioned bottom-left via `.category-legend` CSS
  - 11px text, frosted glass background (`backdrop-filter: blur`)
  - Hidden when demographics overlay is active (to avoid clutter)
- [x] `map/src/App.tsx`: Render `<CategoryLegend>` inside map div, pass `activeCategories`
- [x] Add `.category-legend` CSS to `map/src/index.css`

## Phase 4 — Bigger Demographics Legend

- [x] `map/src/components/DemographicLayer.tsx`: Enlarged legend:
  - Swatches: 20×14 (was 14×10)
  - Text: 12px (was 10px)
  - Padding: 12px 14px (was 8px 10px)
  - Compact values: "$59K – $90K" instead of "$58,583 – $89,555" via `formatCompact()` helper
  - Purple title with bottom border separator
- [x] Updated `.demographic-legend` CSS: larger with `min-width: 160px`

## Phase 5 — Testing & Review

- [x] `npx tsc --noEmit` — no type errors
- [x] `npx vite build` — build succeeds (501 KB JS, 139 KB gzipped)
- [ ] Sidebar collapse button hides sidebar, floating button brings it back
- [ ] Section headers collapse/expand correctly, badges show summaries
- [ ] Category legend appears on map with correct colors
- [ ] Demographics legend is larger and readable
- [ ] Both legends don't overlap each other (category=bottom-left, demographics=bottom-right)
- [ ] Mobile bottom sheet still works correctly

## Phase 6 — Documentation & Cleanup

- [ ] Verify all tasks across all phases are checked off
- [ ] Remove any temporary files or scaffolding
- [ ] Move plan to `plans/archive/`

## Files

- `map/src/App.tsx` — sidebar collapsed state, category legend rendering
- `map/src/components/Sidebar.tsx` — section grouping, collapse button, SidebarSection helper
- `map/src/components/CategoryLegend.tsx` — new floating legend component
- `map/src/components/DemographicLayer.tsx` — enlarged legend with compact formatting
- `map/src/index.css` — legend CSS
