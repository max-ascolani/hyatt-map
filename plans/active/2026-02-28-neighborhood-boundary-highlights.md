# Neighborhood Boundary Highlights

**Created:** 2026-02-28
**Status:** active
**Type:** feature

## Context

Add toggleable neighborhood boundary overlays to the Leaflet map so users can visually identify which Newport Beach neighborhoods competitors fall within. Neighborhoods like Westcliff, Corona del Mar, Balboa Island, etc. would be rendered as semi-transparent polygons with labels.

Data source: City of Newport Beach's official ArcGIS server publishes a Statistical Areas layer with 52 high-resolution polygons covering the entire city. These can be mapped to human-readable neighborhood names and bundled as static data.

## Phase 0 — Investigation & Validation

- [x] Confirm neighborhood boundary data exists from the City of Newport Beach ArcGIS server
- [x] Verify Statistical Areas endpoint returns GeoJSON: `https://nbgis.newportbeachca.gov/arcgis/rest/services/LandUsePlan_CNB/MapServer/0/query?where=1%3D1&outFields=TAG,STAT_DIVIS&returnGeometry=true&f=geojson`
- [x] Identify TAG-to-neighborhood-name mapping (E1+E3 → Balboa Island, F1-F4 → Corona Del Mar, C1+C2 → Lido Island, etc.)
- [x] Confirm react-leaflet `GeoJSON` component is available (it is — part of react-leaflet v5)
- [x] Confirm `geojson` TypeScript types are available as transitive dependency via `@types/leaflet`
- [x] Review existing codebase patterns: distance ring labels use `L.divIcon` + `Marker` (reuse for neighborhood labels)
- [x] Note gap: "Westcliff" is not in the city's 35 official neighborhoods — available as HOA boundary from Community Associations layer
- [x] Fetch actual GeoJSON data from ArcGIS and validate polygon quality
- [x] Build complete TAG-to-neighborhood mapping by querying parcel data endpoint
- [x] Determine which statistical areas fall within ~3.5 miles of Hyatt
- [x] Update Phase 1 tasks with concrete data details

## Phase 1 — Data Preparation

- [x] Fetch Statistical Areas GeoJSON from ArcGIS endpoint
- [x] Build TAG → neighborhood name mapping using parcel data crosswalk
- [x] Merge statistical areas belonging to the same neighborhood (e.g., E1+E3 → single Balboa Island polygon)
- [x] Filter to neighborhoods within ~3.5 miles of HYATT_COORDS [33.6178, -117.8894]
- [x] Pre-compute centroid [lat, lng] for each neighborhood for label placement
- [x] Create `map/src/data/neighborhoods.ts` exporting:
  - `NEIGHBORHOODS` — GeoJSON FeatureCollection with `{name, tag}` properties per feature
  - `NEIGHBORHOOD_CENTROIDS` — array of `{name, center: [number, number]}`
  - Types: `NeighborhoodProperties`, `NeighborhoodFeature`

## Phase 2 — Map Component

- [x] Create `map/src/components/NeighborhoodLayer.tsx`:
  - Props: `visible: boolean`
  - Returns `null` when `visible=false`
  - Renders `<GeoJSON>` with indigo-colored polygons (distinct from blue distance rings)
    - `color: #6366f1`, `fillOpacity: 0.08`, `weight: 1.5`, `dashArray: '4 3'`
    - Hover tooltip via `onEachFeature` → `layer.bindTooltip(name, {sticky: true})`
  - Renders `<Marker>` with `L.divIcon` at each centroid for permanent labels
    - Follows existing pattern from `App.tsx:367-372` (distance ring labels)
- [x] Add CSS to `map/src/index.css` (after `.ring-label` at line 81):
  - `.neighborhood-label` — indigo, 10px, uppercase, text-shadow for readability
  - `.neighborhood-tooltip` — white bg, indigo border/text, rounded

## Phase 3 — Sidebar Toggle & State

- [x] Modify `map/src/App.tsx`:
  - Add `showNeighborhoods` boolean state (default: `false`) after line 152
  - Add `toggleNeighborhoods` callback
  - Pass `showNeighborhoods` + `onToggleNeighborhoods` props to Sidebar (after line 338)
  - Render `<NeighborhoodLayer visible={showNeighborhoods} />` after `<TileLayer>` before distance rings (line 363) so polygons render underneath everything
- [x] Modify `map/src/components/Sidebar.tsx`:
  - Add `showNeighborhoods: boolean` + `onToggleNeighborhoods: () => void` to `SidebarProps`
  - Add toggle button between distance limit checkbox (line 367) and `<TimeSlider>` (line 369)
  - Style: indigo accent (#6366f1), matches existing toggle button patterns

## Phase 4 — Testing & Review

- [x] Run `npm run dev` from `map/` — confirm no build errors
- [ ] Toggle "Neighborhoods" in sidebar — boundaries appear/disappear
- [ ] Verify neighborhood labels are positioned at polygon centroids
- [ ] Hover over a polygon — tooltip shows neighborhood name
- [ ] Confirm neighborhoods render behind markers and distance rings (correct z-order)
- [ ] Test mobile view — toggle accessible in bottom sheet
- [x] Verify no performance degradation (polygon data should be <300KB)

## Phase 5 — Individual Neighborhood Selection

Replace the all-or-nothing toggle with per-neighborhood selection via sidebar pills and click-to-hide on map polygons.

- [x] `map/src/data/neighborhoods.ts`: Export `NEIGHBORHOOD_NAMES: string[]` for convenience
- [x] `map/src/App.tsx`: Replace `showNeighborhoods: boolean` with `activeNeighborhoods: Set<string>` (default: empty)
  - Add `toggleNeighborhood(name)` callback (add/remove single name from set)
  - Add `toggleAllNeighborhoods()` callback (if any active → clear all; if none → add all 18)
  - Pass `activeNeighborhoods`, `onToggleNeighborhood`, `onToggleAllNeighborhoods` to Sidebar and NeighborhoodLayer
- [x] `map/src/components/NeighborhoodLayer.tsx`: Accept `activeNeighborhoods: Set<string>` + `onToggleNeighborhood`
  - Filter `NEIGHBORHOODS.features` to only those in active set
  - Build filtered FeatureCollection with `useMemo`; use key derived from active set so `<GeoJSON>` re-renders
  - Add click handler in `onEachFeature` → calls `onToggleNeighborhood(name)` to deselect on click
  - Filter `NEIGHBORHOOD_CENTROIDS` labels to only active neighborhoods
- [x] `map/src/components/Sidebar.tsx`: Replace single toggle button with expandable section
  - Master toggle checkbox calls `onToggleAllNeighborhoods` (show all / hide all)
  - When any neighborhoods active, show indigo pill list below (same pattern as cuisine tags)
  - Each pill = neighborhood name, toggles individual neighborhood on/off
  - Update `SidebarProps` to use new prop types

## Phase 6 — Documentation & Cleanup

- [ ] Verify all tasks across all phases are checked off
- [ ] Remove any temporary files or scaffolding
- [ ] Move plan to `plans/archive/`
