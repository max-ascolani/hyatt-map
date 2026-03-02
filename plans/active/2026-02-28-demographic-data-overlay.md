# Demographic Data Overlay

**Created:** 2026-02-28
**Status:** active
**Type:** feature

## Context

Add a toggleable choropleth overlay to the Leaflet map showing census tract demographics around the Hyatt. This strengthens the members club pitch by quantifying the target market: "The 3-mile radius around the Hyatt contains X households earning $200K+ with Y% of residents aged 25–44."

Data sources:
- **Boundaries**: Census Bureau Cartographic Boundary Files — `cb_2023_06_tract_500k.zip` (4.3 MB shapefile for all California tracts). Download, filter to Orange County tracts near Hyatt, convert to GeoJSON with geopandas.
- **Demographics**: Census ACS 5-Year API (2023) — free, no API key required. Query `api.census.gov/data/2023/acs/acs5` for Orange County (state=06, county=059) tracts.

Verified in Phase 0 investigation:
- ACS API returns 614 tracts for Orange County with all needed variables
- Shapefile is downloadable (4.3 MB) and processable with geopandas + fiona (both installed)
- Relevant ACS variable codes confirmed (see Phase 1)

## Phase 0 — Investigation & Validation

- [x] Confirm ACS 5-Year API returns tract-level data for Orange County (614 tracts, no API key needed)
- [x] Confirm variable codes: `B19013_001E` (median income), `B01003_001E` (population), `B01001_011E–014E` + `B01001_035E–038E` (age 25–44 male/female)
- [x] Confirm Census cartographic boundary shapefile is downloadable: `https://www2.census.gov/geo/tiger/GENZ2023/shp/cb_2023_06_tract_500k.zip` (4.3 MB, HTTP 200)
- [x] Confirm geopandas + fiona are available for shapefile → GeoJSON conversion
- [x] Identify GEOID format: `06059XXXXXX` (state 06, county 059, tract 6 digits)
- [x] Download shapefile, filter to tracts within ~4 miles of Hyatt — **39 tracts** (0.68–3.97 mi)
- [x] Query ACS API for those tracts, validate data quality — **0 nulls/sentinels**, all 39 tracts have complete data
- [x] Determine optimal color scale ranges — quintile breaks: $58K / $96K / $121K / $156K / $189K / $250K+
- [x] Update Phase 1 tasks with concrete tract count and data details

## Phase 1 — Data Preparation

- [x] Download `cb_2023_06_tract_500k.zip` and extract
- [x] Use geopandas to load shapefile, filter to Orange County (`COUNTYFP == '059'`) — 613 tracts
- [x] Compute centroid of each tract, filter to tracts within ~4 miles of HYATT_COORDS [33.6178, -117.8894] — 39 tracts
- [x] Query ACS API for filtered tract GEOIDs with variables:
  - `B19013_001E` — Median household income
  - `B01003_001E` — Total population
  - `B19001_001E` — Total households
  - `B19001_014E` + `B19001_015E` + `B19001_016E` + `B19001_017E` — Households earning $100K+ (breakdown by tier)
  - `B01001_011E–014E` + `B01001_035E–038E` — Population aged 25–44 (male + female)
  - `B15003_022E` + `B15003_023E` + `B15003_024E` + `B15003_025E` — Bachelor's degree or higher
  - `B25001_001E` — Total housing units
- [x] Join ACS data to GeoJSON features by GEOID
- [x] Simplify polygon geometries with Douglas-Peucker (815 → 524 coordinates, 24.9 KB final)
- [x] Create `map/src/data/demographics.ts` exporting:
  - `CENSUS_TRACTS` — GeoJSON FeatureCollection with 39 tracts and 13 demographic properties each
  - `DemographicMetric` type — `'medianIncome' | 'population' | 'pctAge2544' | 'pctHouseholds100k' | 'pctBachelorPlus'`
  - `DEMOGRAPHIC_METRICS` — array of `{ key, label, format }` for the metric selector
- [x] Clean up downloaded shapefile/zip (don't commit raw data)

## Phase 2 — Map Component

- [x] Create `map/src/components/DemographicLayer.tsx`:
  - Props: `visible: boolean`, `metric: DemographicMetric`
  - Returns `null` when `visible=false`
  - Renders `<GeoJSON>` with choropleth coloring based on selected metric
  - Color scale: sequential purple (light → dark) using 5 quantile breaks
  - Style: `fillOpacity: 0.35`, `weight: 0.5`, `color: '#6b7280'` (subtle tract borders)
  - Hover tooltip via `onEachFeature` → shows tract name + formatted metric value
  - Click popup with all demographic details for that tract
- [x] Create color scale helper: `getColor(value, breaks)` → returns hex color from palette
- [x] Add a small map legend component (bottom-right corner) showing the color scale + metric label
- [x] Add CSS to `map/src/index.css`:
  - `.demographic-tooltip` — purple-accented styling consistent with neighborhood tooltips
  - `.demographic-legend` — fixed position, white background, compact

## Phase 3 — Sidebar Toggle & Metric Selector

- [x] Modify `map/src/App.tsx`:
  - Add `showDemographics: boolean` state (default: `false`)
  - Add `demographicMetric: DemographicMetric` state (default: `'medianIncome'`)
  - Pass props to Sidebar and DemographicLayer
  - Render `<DemographicLayer>` after `<TileLayer>`, before neighborhood layer (so it's the bottom-most overlay)
- [x] Modify `map/src/components/Sidebar.tsx`:
  - Add "Demographics" section in map controls area (after Neighborhoods, before TimeSlider)
  - Master toggle checkbox to show/hide the overlay
  - When active, show metric selector pills: Median Income | Population | Age 25–44 | HH $100K+ | Bachelor's+

## Phase 4 — Testing & Review

- [x] Run `npx tsc --noEmit` — confirm no type errors
- [x] Run `npx vite build` — confirm build succeeds (498 KB JS, 138 KB gzipped)
- [ ] Toggle demographics in sidebar — choropleth appears/disappears
- [ ] Switch between metrics — colors update, legend updates
- [ ] Hover over tracts — tooltip shows correct formatted values
- [ ] Verify choropleth renders behind all other layers (neighborhoods, rings, markers)
- [x] Confirm no performance degradation (tract data is 24.9 KB)
- [ ] Spot-check 2–3 tract values against census.gov to verify accuracy

## Phase 5 — Documentation & Cleanup

- [ ] Verify all tasks across all phases are checked off
- [ ] Remove any temporary files or scaffolding
- [ ] Move plan to `plans/archive/`
