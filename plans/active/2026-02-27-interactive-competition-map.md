# Interactive Competition Map

**Created:** 2026-02-27
**Status:** active
**Type:** feature

## Context

We're building a pitch to Hyatt about creating a private members club at the Hyatt Regency Newport Beach (1107 Jamboree Rd, Newport Beach, CA 92660). **Target demo: 25–40 year olds.**

This map is a core piece of that pitch. The goal is to show: **"Here's everything that exists around the Hyatt, category by category — and here's where the gaps are that a members club could fill."**

The map should:

- Center on the Hyatt property (33.6178, -117.8894)
- Show distance rings from the Hyatt (0.5 mi, 1 mi, 2 mi, 3 mi)
- Display categories of nearby competitors with color-coded markers
- Allow toggling categories on/off via filter chips
- Use a light theme — clean, corporate, readable with blue accents
- Be deployable as a standalone page (no backend required)

**Expected outcome:** A React single-page app with a Leaflet map, toggleable curated competitor markers, distance rings, and a side panel with filters and location list.

---

## Technology Decision

### Map Library: **Leaflet.js + OpenStreetMap tiles**

- **Free** — no API key, no account, no usage fees
- **Lightweight** — ~42 KB, works on mobile
- **Well-documented** — large community, extensive plugins
- Leaflet site: https://leafletjs.com

### Places Data: **Curated JSON (primary) + Overpass API (supplementary)**

We have a thoroughly researched competitor dataset with exact lat/lng, ratings, pricing, and notes from `hyatt-competitive-map-brief.md`. This is far more useful than raw OSM data. Strategy:

- **Primary:** Load curated competitor data from a JSON file embedded in the app. This is the core dataset — ~60 hand-researched locations across 9 categories.
- **Supplementary (optional):** Overpass API can fill in additional generic POIs (e.g., all restaurants in the radius) if we want density on the map. But the curated data is the star.

### Why not Google Maps / Google Places?

- Google Maps JS API requires an API key and billing account
- Google Places Nearby Search costs $32 per 1,000 requests (Advanced tier)
- We already have curated data that's better than what Google would return
- Leaflet + OSM is completely free

### Tech Stack

- **React** + Vite for component structure
- **Leaflet** via `react-leaflet` for the map
- **Tailwind CSS** for styling
- **No backend** — all data is bundled in the app

### Distance Rings

Use straight-line radius circles from the Hyatt at 0.5 mi, 1 mi, 2 mi, and 3 mi. Semi-transparent, labeled, individually toggleable. These are simpler and more presentation-friendly than isochrone polygons — a stakeholder can instantly see "this competitor is within 1 mile."

If stakeholders later want true drive-time isochrones, OpenRouteService has a free tier (500 req/day, no credit card).

---

## Curated Competitor Data

All data sourced from `hyatt-competitive-map-brief.md`. This is the primary dataset for the map.

### Gyms & Fitness (Red)
**Hyatt has:** Basic hotel fitness center
**Gap:** No classes, no recovery amenities, no community

| Name | Lat | Lng | Rating | Note |
|------|-----|-----|--------|------|
| Equinox Newport Beach | 33.6590 | -117.8604 | 3.5 | $250+/mo, premium brand, poor local reviews |
| Barry's Newport Beach | 33.6151 | -117.8772 | 4.9 | $40/class, boutique HIIT, very popular with 25-40 demo |
| Newport Beach Athletic Club | 33.6116 | -117.8717 | 4.6 | ~$80/mo, since 1971, cold plunge/sauna, loyal older crowd |
| Kinetic | 33.6177 | -117.8721 | 4.4 | ~$60/mo, Fashion Island, clean, no-frills |
| Iron Body | 33.6161 | -117.8688 | 4.9 | PT rates, private studio, DEXA scans |
| Shape-Up Health Club | 33.6059 | -117.8769 | 4.7 | ~$100/mo, Corona del Mar, infrared sauna, classes |
| Curl Fitness | 33.6190 | -117.9292 | 4.8 | ~$70/mo, Balboa Peninsula, saunas, red light therapy |
| Momentum CDM | 33.5943 | -117.8683 | 5.0 | Premium, new boutique in CDM, cold plunge, yoga, PT |

### Pickleball / Tennis (Green)
**Hyatt has:** Tennis courts on property (Palisades Tennis Club, 16 lighted courts)
**Gap:** No pickleball, no padel, no leagues, no social play programming

| Name | Lat | Lng | Rating | Note |
|------|-----|-----|--------|------|
| Tennis & Pickleball Club at NB | 33.6105 | -117.8798 | 4.1 | 30+ courts, biggest facility, mixed reviews on quality |
| Palisades Tennis Club | 33.6188 | -117.8867 | 4.7 | RIGHT NEXT to Hyatt (0.2mi), boutique tennis, great vibe |
| Newport Beach Tennis Club | 33.6417 | -117.8749 | 4.5 | Large club with restaurant, easy app booking, social scene |
| Bonita Canyon Pickleball | 33.6281 | -117.8610 | 4.8 | Public, 4 courts only, challenge court system, very social |
| Newport Coast Pickleball | 33.6090 | -117.8275 | 4.4 | Public, 6 courts, wind issues, bring your own group |
| Bonita Canyon Sports Park East | 33.6275 | -117.8522 | 4.6 | Public park with pickleball, easy pickup games |

### Golf (Purple)
**Hyatt has:** 9-hole Back Bay Golf Course (par-3 executive, casual)
**Gap:** No golf simulator, no social golf events, no TopGolf-style experience

| Name | Lat | Lng | Rating | Note |
|------|-----|-----|--------|------|
| Back Bay Golf Course (Hyatt) | 33.6178 | -117.8878 | 4.2 | ON-SITE, 9-hole par 3, hole #8 overlooks bay |
| Newport Beach Golf Course | 33.6593 | -117.8811 | 3.9 | Public 18-hole executive, affordable but rough condition |
| Pelican Hill Golf Club | 33.5849 | -117.8419 | 4.6 | $250+/round, world-class resort golf, ocean views |
| Newport Beach Country Club | 33.6112 | -117.8815 | 4.7 | Private, $40M clubhouse, hosts Hoag Classic PGA event |
| Big Canyon Country Club | 33.6201 | -117.8694 | 4.8 | Ultra-exclusive private, $150K–$200K initiation, 0.5mi from Hyatt |
| Rancho San Joaquin GC | 33.6643 | -117.8316 | 3.7 | Public 18-hole, challenging greens, pace of play issues |
| Strawberry Farms GC | 33.6493 | -117.7957 | 4.5 | Higher-end public, beautiful scenery, popular for events |

### Working Cafe / Cowork (Amber/Yellow)
**Hyatt has:** NOTHING — lobby lounge only, not designed for work
**Gap:** No dedicated workspace — huge gap for the 25-40 entrepreneur/remote worker demo

| Name | Lat | Lng | Rating | Note |
|------|-----|-----|--------|------|
| Kéan Coffee | 33.6277 | -117.9084 | 4.7 | Newport's best coffee, 1,395 reviews, gets crowded |
| Stereoscope Coffee | 33.6561 | -117.8678 | 4.3 | Creative vibe, limited seating, 2hr validated parking |
| Coffee Dose | 33.6586 | -117.8855 | 4.9 | Instagram-famous, more cafe than workspace |
| Blk Dot Coffee | 33.6390 | -117.8604 | 4.4 | Near UCI, good for work, plaza outdoor seating |
| Freelance Coffee Project | 33.6313 | -117.9354 | 4.6 | Named for freelancers, no outlets reported |
| Herst Coffee Roasters | 33.6183 | -117.9285 | 4.3 | Lido Peninsula, NO WiFi |
| HanaHaus | 33.6177 | -117.9277 | 4.5 | $4/hr coworking, harbor views, Blue Bottle on-site |
| Rogue Collective | 33.6314 | -117.9343 | 4.9 | Creative coworking, podcast studio, events space |
| Colab Space | 33.6729 | -117.8628 | 4.9 | Irvine, modern social coworking, events |

### Pool & Day Scene (Cyan)
**Hyatt has:** 3 pools + 3 hot tubs, cabanas, firepits — 26-acre setting
**Gap:** Not curated as a social scene yet. Single biggest competitive advantage and opportunity.

| Name | Lat | Lng | Rating | Note |
|------|-----|-----|--------|------|
| Hyatt Regency (on-site) | 33.6178 | -117.8894 | 4.3 | ON-SITE, 3 pools, cabanas, hot tubs, firepits |
| Pendry (Elwood Club) | 33.6199 | -117.8756 | 4.2 | Single rooftop-style pool, Elwood Club members only |
| VEA Newport Beach (Marriott) | 33.6163 | -117.8795 | 4.4 | Good pool + pool bar, fire pits, hotel guests |
| Balboa Bay Club | 33.6093 | -117.9097 | — | $15K–50K initiation, waterfront heated pool + private beach |
| Resort at Pelican Hill | 33.5886 | -117.8440 | 4.8 | Iconic Coliseum Pool, ultra-luxury, $1,000+/night |
| Marriott Newport Coast Villas | 33.5826 | -117.8427 | 4.6 | Multiple pools, timeshare/resort, family oriented |

### Bars & Nightlife (Pink)
**Hyatt has:** Lobby Lounge Bar (4.6 rating)
**Gap:** No rooftop bar, no craft cocktail program, no outdoor bar with energy/scene

| Name | Lat | Lng | Rating | Note |
|------|-----|-----|--------|------|
| Hyatt Lobby Lounge Bar (on-site) | 33.6174 | -117.8893 | 4.6 | ON-SITE, open 6am–midnight |
| Bar Pendry | 33.6199 | -117.8756 | 3.2 | Hotel bar, cocktails, live music Thu-Sat, poor reviews |
| thehouse Newport Beach | 33.6192 | -117.9233 | 4.7 | MEMBERS ONLY, dockside, cost+10% pricing, 450 members, waitlisted |
| Class of 47 | 33.6030 | -117.9008 | 4.5 | Dive bar, Balboa, pool tables, very chill |
| Bayshore Cafe Lounge | 33.6164 | -117.9081 | 4.8 | Live music venue, breakfast to late, great food + vibe |
| A Restaurant | 33.6215 | -117.9281 | 4.6 | Crystal Cove, great cocktails, steak, outdoor patio |

### Fine Dining (Orange)
**Hyatt has:** SHOR restaurant (Chef Jae Lee), Sunday brunch, high tea
**Gap:** No members-only supper club, no guest chef series, no outdoor dining on the lawn

| Name | Lat | Lng | Rating | Note |
|------|-----|-----|--------|------|
| Mastro's Ocean Club | 33.5679 | -117.8307 | 4.5 | $$$$ Newport Coast, steak & seafood, live piano |
| Olea | 33.6271 | -117.9078 | 4.7 | $$$ Westcliff, gorgeous room, excellent wine program |
| Marché Moderne | 33.5709 | -117.8335 | 4.5 | $$$ Crystal Cove, French fine dining |
| Javier's | 33.5706 | -117.8343 | 4.4 | $$$ Crystal Cove, upscale Mexican, massive + beautiful |
| The Bungalow | 33.6038 | -117.8740 | 4.5 | $$$ CDM, steak & seafood, live music |
| Basilic | 33.6065 | -117.8899 | 4.7 | $$$ Balboa Island, intimate French, 7 seats inside |
| 21 Oceanfront | 33.6084 | -117.9288 | 4.4 | $$$ On the pier, classic old-school steak & seafood |

### Spa & Wellness (Teal)
**Hyatt has:** NOTHING on property
**Gap:** Every competitor hotel has a spa. No spa = missing a core members club amenity.

| Name | Lat | Lng | Rating | Note |
|------|-----|-----|--------|------|
| SPA VEA | 33.6165 | -117.8794 | 4.8 | Hotel spa at VEA Marriott, eucalyptus sauna, cold foot bath |
| Spa Pendry | 33.6199 | -117.8760 | — | Full-service hotel spa, Elwood Club members access |
| Pause Newport Beach | 33.6277 | -117.9090 | 4.8 | Cryo, infrared sauna, float therapy, compression boots |
| SweatHouz | 33.6101 | -117.9282 | 4.9 | Private infrared sauna + cold plunge suites, $9/day unlimited |

---

## Phase 0 — Investigation & Validation

- [x] Verify Leaflet.js loads correctly with OSM tiles centered on Hyatt (33.6178, -117.8894)
- [x] Confirm `react-leaflet` works with a basic React + Vite setup
- [x] Test that a dark-themed tile layer is available (e.g., CartoDB Dark Matter tiles: `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png` — free, no API key)
- [x] Verify all ~60 curated lat/lng coordinates from the brief render correctly on the map
- [x] Test Overpass API query for a single category (e.g., restaurants) within the Hyatt area — evaluate whether supplementary OSM data adds value or just clutter
- [x] Decide: React + Vite + Tailwind (richer, better for iteration) vs. single HTML file (simpler to share). Recommendation is React based on brief's tech preferences.
- [x] Update Phase 1 with concrete implementation details

## Phase 1 — Project Setup & Base Map

- [x] Create project directory: `map/` at repo root
- [x] Initialize React + Vite project with Tailwind CSS
- [x] Install dependencies: `react-leaflet`, `leaflet`
- [x] Set up light theme with CartoDB Positron tiles (switched from dark after user feedback)
- [x] Create base map component:
  - Initialize Leaflet map centered on Hyatt (33.6178, -117.8894), zoom level ~14
  - Use CartoDB Positron tile layer (light theme, free)
  - Full-viewport map container with light UI chrome
- [x] Add prominent Hyatt marker (blue circle with white inner dot) with popup: name, address, "1107 Jamboree Rd, Newport Beach, CA 92660", link to hyatt.com
- [x] Add distance radius circles from Hyatt, semi-transparent blue dashed lines:
  - 0.5 mi (805m) — closest ring
  - 1 mi (1609m)
  - 2 mi (3219m)
  - 3 mi (4828m) — outer ring
- [x] Verify map renders correctly in Chrome, Safari, Firefox

## Phase 2 — Competitor Data Layer

- [x] Create `data/competitors.ts` with all curated competitor data — `map/src/data/competitors.ts`
- [x] Create a color/icon mapping per category (8 categories, each with distinct color)
- [x] Render all ~56 curated competitors as color-coded circle markers on the map
- [x] On-site Hyatt amenities (Back Bay Golf Course, Lobby Lounge Bar, pools) use distinct larger markers with blue border
- [x] Marker popups show: name, category, rating (stars), distance from Hyatt, and the note
- [x] Calculate and display distance from Hyatt for each competitor in the popup (haversine formula)

## Phase 3 — Interactive Controls & Side Panel

- [x] Build a left sidebar panel (light themed — white/gray with blue accents) — `map/src/components/Sidebar.tsx`
  - **Category filters** — pill/chip buttons with colored dots, one per category
  - Click to toggle category markers on/off
  - "Show All" / "Hide All" buttons
  - Count badge on each pill showing number of locations in that category
  - Visual legend built into the filter pills
- [x] Wire up filter state to show/hide Leaflet layer groups per category
- [x] Add toggleable distance rings (toggle button)
- [x] Add a **list view**:
  - All locations in active categories, sorted by distance from Hyatt
  - Clicking a list item flies the map to that marker
- [x] Style everything white/light gray with navy text and blue accents — clean, corporate, readable

## Phase 4 — Polish & Presentation Quality

- [x] Add smooth animations when toggling categories (CSS transition on SVG path opacity)
- [x] Add a header/title bar: "Hyatt Regency Newport Beach — Competitive Landscape"
- [x] Ensure the Hyatt marker is always visible (never hidden by filters) and visually dominant
- [x] Add hover effects on markers (grow on hover via `setRadius`, CSS `drop-shadow` glow)
- [x] Add distance ring labels (0.5 mi, 1 mi, 2 mi, 3 mi) positioned on the ring perimeter
- [x] Test full flow: load page -> see Hyatt marker + rings -> toggle categories on -> see markers appear -> click marker -> see popup with details -> click list item -> map pans -> toggle off -> markers disappear
- [x] Ensure the map looks presentation-quality on a large screen / projector

## Phase 5 — Optional: Overpass API Supplementary Data

- [x] Add an optional "Show all [category]" toggle per category that queries Overpass API for additional OSM POIs
- [x] These supplementary markers should be smaller/dimmer than curated data (visually secondary)
- [x] Only implement this if curated data feels too sparse during Phase 4 review

## Phase 6 — Map Enhancements

### 6a. Ratings & Google Reviews
- [x] Add review count to each competitor entry in `competitors.ts` (e.g., `reviewCount: 1395`)
- [x] Display star rating prominently in each marker popup (e.g., filled star icons or "4.7 / 5.0")
- [x] Show review count alongside rating (e.g., "4.7 — 1,395 reviews")
- [x] Add a direct "View on Google Maps" link in each popup that opens the business's Google Maps page
- [x] Add option to sort the list view by rating (in addition to existing distance sort)
- [x] Visually distinguish high-rated (4.5+) vs. low-rated (<4.0) competitors in marker styling (e.g., slight size or opacity difference)

### 6b. Heatmap / Density Overlay
- [x] Install `leaflet.heat` plugin (or similar Leaflet heatmap library)
- [x] Add a "Heatmap" toggle button to the sidebar controls
- [x] When enabled, render a heatmap layer using existing competitor lat/lng coordinates, weighted by category density
- [x] Heatmap should make gaps around the Hyatt visually obvious — areas with no competitors show as "cold" zones
- [x] Allow filtering the heatmap by active categories (so toggling "Gyms" off removes gym data from the heatmap)
- [x] Ensure heatmap and individual markers can coexist (heatmap as a semi-transparent underlay)
- [x] Tune heatmap radius/blur/intensity so it looks good on the light theme at zoom level ~14

### 6c. Price Tier Filtering
- [x] Add a `priceTier` field to each competitor entry: `"$"`, `"$$"`, `"$$$"`, `"$$$$"`
- [x] Research and tag all ~60 competitors with appropriate price tiers
- [x] Add price tier filter pills to the sidebar (e.g., clickable `$` `$$` `$$$` `$$$$` buttons)
- [x] Filtering by price tier works in combination with category filters (intersection)
- [x] Display price tier in each marker popup alongside rating and note
- [x] Highlight the premium tier ($$$/$$$$ and $200+/mo) to reinforce the pitch

### 6d. Business Links
- [x] Add fields to `competitors.ts`: `website`, `googleMapsUrl` (Google Maps links populated for all 53 competitors)
- [x] Display links in each marker popup (Google Maps + Website where available)
- [x] Links open in new tabs
- [x] Gracefully handle missing links (don't show a link if no URL exists for that field)
- [x] Research and populate website URLs for all ~60 competitors (50 populated, 3 public courts correctly null)

### 6e. Operating Hours & Time Slider
- [x] Add `hours` field to each competitor entry as structured data (e.g., `{"mon": ["6:00", "22:00"], ...}`)
- [x] Research and populate operating hours for all ~53 competitors
- [x] Build a time slider UI component: a draggable range slider for selecting a time window (e.g., 6am–11pm)
- [x] Add a day-of-week selector (Mon–Sun) next to the time slider
- [x] When a time range is selected, filter the map to only show businesses open during that window
- [x] Display current open/closed status in each marker popup (based on slider selection)
- [x] Grey out or dim markers for closed businesses instead of hiding them entirely
- [x] Key pitch moment: set slider to 8pm Tuesday and show how few options remain — especially cafes/coworking all closed by 5pm

---

## Phase 7 — Expanded Data & Super-Categories

Expand the map from ~56 businesses across 8 flat categories to ~140-160 businesses across 6 super-categories (with ~15 sub-categories), with restaurant price/cuisine cross-filtering.

### Super-Category Structure

```
FITNESS & SPORTS (Red family)
  ├── Gyms & Fitness        (existing — 8 businesses)
  ├── Yoga / Pilates / Barre (NEW — ~6 businesses)
  ├── Pickleball / Tennis    (existing — 6 businesses)
  └── Golf                   (existing — 7 businesses)

DINING (Orange family)
  ├── Fine Dining            (existing — 7 businesses)
  ├── Upscale Casual         (NEW — ~15 businesses)
  ├── Casual / Everyday      (NEW — ~6 businesses)
  ├── Health-Conscious       (NEW — ~7 businesses)
  └── Brunch                 (NEW — ~7 businesses)
  [Cross-filter: price tier ($ $$ $$$ $$$$) AND cuisine tag]

WELLNESS & BEAUTY (Teal family)
  ├── Spa & Wellness         (existing — 4 → ~9 businesses)
  ├── Juice Bars / Health    (NEW — ~7 businesses)
  └── Beauty & Grooming      (NEW — ~7 businesses)

SOCIAL & NIGHTLIFE (Pink family)
  ├── Bars & Nightlife       (existing — 6 → ~8 businesses)
  ├── Wine Bars / Tasting    (NEW — ~4 businesses)
  └── Entertainment          (NEW — ~5 businesses)

WORK & LIFESTYLE (Amber family)
  ├── Working Cafe / Cowork  (existing — 9 businesses)
  └── Shopping & Retail      (NEW — ~3 destination entries)

OUTDOORS & WATER (Blue family)
  ├── Pool & Day Scene       (existing — 6 businesses)
  └── Water Sports / Beach   (NEW — ~6 businesses)
```

### 7a. Investigation & Validation

- [x] Read through all current code in `map/src/` to understand component structure, state management, and how categories currently drive rendering
- [x] Evaluate whether the sidebar can accommodate super-category accordions without a major rewrite — YES, it already has scrollable content with collapsible `<details>` sections
- [x] Decide on the TypeScript approach for the new category hierarchy:
  - **Decision: Hybrid B+C** — keep `category` as SubCategoryId on competitors, add `SUPER_CATEGORIES` config with `children: SubCategoryInfo[]` for hierarchy. Minimizes breaking changes.
- [x] Decide on the restaurant cross-filter data model:
  - **Decision:** Add optional `cuisineTag` field. `priceTier` already works for restaurant filtering.
- [x] Check that the color palette for 6 super-categories has enough contrast on the light map tiles — using color families per super-category

### 7b. Data Model & Category Restructure

- [x] Add `SuperCategoryId` type: `'fitness' | 'dining' | 'wellness' | 'social' | 'work' | 'outdoors'`
- [x] Add `SubCategoryId` type covering all ~20 sub-categories (CategoryId expanded)
- [x] Add `CuisineTag` type for restaurant cross-filtering
- [x] Extend the `Competitor` interface with optional `cuisineTag`
- [x] Create `SuperCategoryInfo` config with: id, label, color, and children `CategoryInfo[]`
- [x] Migrate all ~53 existing competitor entries to the new schema (existing IDs are valid sub-category IDs)
- [x] Verify the app still renders correctly with the extended data (build passes, CATEGORIES derived from SUPER_CATEGORIES.flatMap)

### 7c. Add New Business Data (~80-100 entries)

**Yoga / Pilates / Barre (~6 entries)**

| Name | Lat | Lng | Rating | Note |
|------|-----|-----|--------|------|
| CorePower Yoga (Fashion Island) | 33.6561 | -117.8678 | 4.5 | ~$159-199/mo, heated power yoga, national chain |
| Ekam Yoga & Pilates | 33.6163 | -117.9095 | 5.0 | Boutique, custom reformers, tea bar, kombucha on tap |
| LiveMetta Pilates & Yoga | 33.6200 | -117.8720 | 4.8 | Westcliff Plaza, ~1mi from Hyatt, athletic reformer Pilates |
| Eastbluff Pilates | 33.6350 | -117.8560 | 5.0 | Very close to Hyatt, private & small group, since 2012 |
| The Bar Method Newport Beach | 33.6200 | -117.9200 | 4.9 | Barre fitness, 7,500+ ClassPass ratings |
| Villa Pilates & Yoga | 33.6180 | -117.9250 | 5.0 | Cannery Village, sustainable studio, natural light |

- [x] Research exact lat/lng, ratings, review counts, website URLs, Google Maps URLs
- [x] Add all entries to `competitors.ts`

**Restaurants — Upscale Casual (~15 entries)**

| Name | Cuisine | Price | Note |
|------|---------|-------|------|
| Nobu Newport Beach | Japanese | $$$-$$$$ | Lido Marina Village, harbor views |
| Lido Bottle Works | American | $$-$$$ | Waterfront, wine bar, live music |
| Zinque | French | $$-$$$ | Parisian bistro, harbor views |
| Malibu Farm | Californian | $$ | Organic farm-to-table, waterfront |
| JOEY Newport Beach | American | $$ | Fashion Island, open late, buzzy |
| Nick's Newport Beach | American | $$-$$$ | Opened 2025, Westcliff, close to Hyatt |
| The Cannery | Seafood | $$$-$$$$ | 95+ year Newport institution, Rhine Canal |
| Bluewater Grill | Seafood | $$-$$$ | Cannery Village, on the docks |
| Gulfstream | Seafood | $$-$$$ | CDM, oyster bar, wrap-around patio |
| Molo | Italian | $$-$$$ | Handmade pasta, wood-fired pizza |
| SOL Mexican Cocina | Mexican | $$ | Harbor views, Baja cuisine |
| CUCINA enoteca | Italian | $$ | Fashion Island, wine shop + restaurant |
| Sapori Ristorante | Italian | $$-$$$ | Bayside Dr, family-run since 1989, close to Hyatt |
| North Italia | Italian | $$ | The Bluffs, trendy, near Hyatt |
| Starfish Newport | Japanese | $$-$$$ | Asian fusion, extensive sushi + sake |

- [x] Research exact lat/lng, ratings, review counts, cuisine tags
- [x] Add all entries to `competitors.ts`

**Restaurants — Sushi / Japanese (~5 entries)**

| Name | Price | Note |
|------|-------|------|
| Sushi Roku | $$-$$$ | Fashion Island, contemporary sushi |
| sushi ii | $$$$ | Michelin-listed omakase, $150-200+ |
| San Shi Go | $$-$$$ | Balboa, 30+ years, reservation-only |
| Bluefin | $$-$$$ | Newport Coast, Nobu alumnus chef |
| Cafe Sakana | $$ | Westcliff, very close to Hyatt, fresh fish |

- [x] Research exact lat/lng, ratings, review counts
- [x] Add all entries to `competitors.ts`

**Restaurants — Casual / Everyday (~6 entries)**

| Name | Cuisine | Price | Note |
|------|---------|-------|------|
| Bear Flag Fish Co. | Seafood | $ | Lido Village, counter-serve, wave-to-table |
| The Stand | American | $ | Bison Ave, elevated burgers, near Hyatt |
| Chihuahua Cerveza | Mexican | $-$$ | Mexican brewpub, dog-friendly |
| Sancho's Tacos | Mexican | $ | Balboa, cult following, surf culture |
| Buona Forchetta | Italian | $$ | Neapolitan pizza, 5.0 rating |
| Tacos & Co | Mexican | $ | On Jamboree near Hyatt |

- [x] Research exact lat/lng, ratings, review counts
- [x] Add all entries to `competitors.ts`

**Restaurants — Health-Conscious (~6 entries)**

| Name | Price | Note |
|------|-------|------|
| True Food Kitchen | $$ | Fashion Island, Dr. Andrew Weil concept |
| Flower Child | $-$$ | Bison Ave, bowls/salads, near Hyatt |
| Vibe Organic Kitchen | $-$$ | 100% organic, no seed oils |
| Sweetfin | $-$$ | Chef-crafted poke bowls |
| Banzai Bowls | $ | Original acai cafe, near beach |
| TRU Bowl | $-$$ | 4.9 stars, Balboa Peninsula |

- [x] Research exact lat/lng, ratings, review counts
- [x] Add all entries to `competitors.ts`

**Restaurants — Brunch (~6 entries)**

| Name | Price | Note |
|------|-------|------|
| Great Maple | $$ | Fashion Island, maple bacon doughnuts |
| Beachcomber Cafe | $$-$$$ | Crystal Cove, toes-in-sand, 1920s cottage |
| Haute Cakes Caffe | $ | Westcliff, Newport institution since 1990 |
| Lighthouse Cafe | $$ | Marina Park, harbor views, bottomless mimosas |
| Juliette's Cafe | $-$$ | Westcliff, in-house roasted coffee, close to Hyatt |
| C'est Si Bon Bakery | $ | Mariner's Mile, 36+ year institution, French bakery |

- [x] Research exact lat/lng, ratings, review counts
- [x] Add all entries to `competitors.ts`

**Spa & Wellness — New additions (~5 entries)**

| Name | Rating | Note |
|------|--------|------|
| Culture OC | 4.5 | Biohacking club — HBOT, float pods, red light, cold plunge, near Hyatt |
| Newport Float Therapy | 4.8 | OC's original float center, full recovery suite |
| Newport Body Works | 4.5 | All-in-one: float, cryo, sauna, cold plunge, IV therapy |
| OC Well Studio | 4.8 | Chiro + acupuncture + massage, Westcliff, near Hyatt |
| JuveMed Wellness | 5.0 | Integrative medicine, IV therapy, acupuncture, near Hyatt |

- [x] Research exact lat/lng, Google Maps URLs, websites
- [x] Add all entries to `competitors.ts`

**Juice Bars / Health Cafes (~7 entries)**

| Name | Rating | Note |
|------|--------|------|
| Pressed Juicery (Fashion Island) | 4.5 | Cold-pressed juices, acai, wellness shots |
| Nekter Juice Bar | 4.4 | HarborView, close to Hyatt |
| Thrive Juice Lab | 4.8 | Bison Ave, 100% organic, close to Hyatt |
| TRU Bowl Superfood Bar | 4.9 | Balboa, exceptional ratings |
| Banzai Bowls | 4.5 | Original acai cafe, near beach |
| Acai Republic | 4.5 | CDM Plaza, Brazilian-inspired |
| Vibe Organic Kitchen | 4.5 | 100% organic, full menu + juices |

- [x] Research exact lat/lng, ratings, review counts
- [x] Add all entries to `competitors.ts`

**Beauty & Grooming (~7 entries)**

| Name | Type | Note |
|------|------|------|
| Drybar (Fashion Island) | Blow dry bar | $49-55, champagne while you style |
| Forever Ageless | Medspa | Botox, fillers, laser, very close to Hyatt |
| South Coast MedSpa | Medspa | 21+ years, 1M+ treatments |
| Akari Medspa | Medspa | K-beauty-inspired aesthetics |
| CVLICOJVCK | Barbershop | Men's lifestyle, premium cuts |
| Blu Nail Bar (Fashion Island) | Nail salon | Upscale mani/pedi |
| Klou Nail Studio | Nail salon | Luxury Russian/European technique, near Hyatt |

- [x] Research exact lat/lng, ratings, review counts
- [x] Add all entries to `competitors.ts`

**Wine Bars / Tasting Rooms (~4 entries)**

| Name | Rating | Note |
|------|--------|------|
| The Winery Restaurant & Wine Bar | 4.8 | Premier wine destination, waterfront |
| Lido Tasting Room (Bravante) | 4.5 | Hidden gem, marina-chic |
| Newport Beach Vineyards & Winery | 4.0 | On Back Bay, close to Hyatt |
| Hi-Time Wine Cellars | 4.9 | Legendary wine shop, Costa Mesa |

- [x] Research exact lat/lng, ratings, review counts
- [x] Add all entries to `competitors.ts`

**Entertainment / Social (~5 entries)**

| Name | Rating | Note |
|------|--------|------|
| THE LOT (Fashion Island) | 4.0 | Luxury cinema, in-seat dining, cocktails |
| Tavern + Bowl | 4.0 | Upscale bowling, 40 beers on tap, Costa Mesa |
| Slashers Axe Throwing | 4.5 | Horror-themed, craft beer, Costa Mesa |
| UNLOCKED Escape Room | 5.0 | Top-rated in OC, 627 reviews |
| Duffy Electric Boat Rentals | 4.5+ | Quintessential NB social activity, harbor cruises |

- [x] Research exact lat/lng, ratings, review counts
- [x] Add all entries to `competitors.ts`

**Water Sports / Beach Activities (~6 entries)**

| Name | Rating | Note |
|------|--------|------|
| Pirate Coast Paddle Company | 4.5 | Back Bay, RIGHT NEXT to Hyatt, SUP + kayak |
| Newport Aquatic Center | 4.0 | Upper Newport Bay, extremely close to Hyatt |
| Southwind Kayaks | 4.5 | 30+ years, calm waters, free parking |
| Newport Beach Sailing School | — | ASA-certified, private lessons |
| Endless Sun Surf School | — | Since 1963, Newport Pier |
| OCC School of Sailing | 4.5 | Community college pricing, Newport Harbor |

- [x] Research exact lat/lng, ratings, review counts
- [x] Add all entries to `competitors.ts`

**Shopping & Retail (~3 destination entries)**

| Name | Note |
|------|------|
| Fashion Island | ~0.5mi from Hyatt, Neiman Marcus, Nordstrom, alo Yoga, Lululemon, Vuori |
| Lido Marina Village | Waterfront boutiques — elysewalker, Jenni Kayne, Le Labo, Warby Parker |
| Corona Del Mar Plaza | Neighborhood shopping, boutiques, casual dining |

- [x] Research center-point lat/lng for each
- [x] Add all entries to `competitors.ts`

### 7d. Super-Category UI

- [x] Redesign the category filter section as collapsible accordion groups:
  - Each super-category is a row with: colored icon, label, total count badge, expand/collapse chevron
  - Clicking the super-category label toggles ALL sub-categories within it on/off
  - Expanding shows individual sub-category pills (indented) that can be toggled independently
- [x] Update marker colors to use sub-category color shades within each super-category hue family
- [x] Update marker popups to show both super-category and sub-category labels
- [x] Refactor filter state from `Set<CategoryId>` to support super-category on/off, individual sub-category on/off, and indeterminate state

### 7e. Restaurant Cross-Filtering

- [x] Add a cuisine tag filter row below price tier, visible when any Dining sub-category is active
- [x] Cuisine pills: Japanese, Italian, Mexican, Seafood, American, French, Californian, Health, Brunch
- [x] Filters combine: sub-category AND price tier AND cuisine tag (triple intersection)
- [x] Add a "Clear filters" link that resets price and cuisine to all-active

---

## Phase 8 — Testing & Review

- [ ] Open map in Chrome, Safari, Firefox — verify rendering
- [ ] Test on mobile/tablet viewport (sidebar should collapse or become a bottom sheet)
- [ ] Verify all categories toggle correctly
- [ ] Verify all curated competitor markers show correct info in popups
- [ ] Verify distance rings display, toggle, and are labeled
- [ ] Verify list view sorts by distance/rating and clicking pans the map
- [ ] Verify super-category accordion expand/collapse works
- [ ] Verify restaurant price tier + cuisine tag cross-filtering
- [ ] Spot-check 20+ marker locations against Google Maps to verify coordinates
- [ ] Screenshot the map in several states for the pitch deck
- [ ] Check that the map is presentable for stakeholder review

## Phase 9 — Documentation & Cleanup

- [x] Add brief README to `map/` explaining: how to run (`npm run dev`), how to build (`npm run build`), how to deploy (serve `dist/` folder)
- [x] Update `reference/amenities/amenities.md` if any new competitors were discovered during mapping (no updates needed — new entries are supplementary landscape data, not key competitors)
- [x] Add a section to the map README explaining the super-category structure and how to add new businesses
- [ ] Verify all tasks checked off
- [ ] Move this plan to `plans/archive/`
