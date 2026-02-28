# Hyatt Regency Newport Beach — Competitive Landscape Map

## Project Overview

Build an interactive web-based map centered on the Hyatt Regency Newport Beach (1107 Jamboree Rd, Newport Beach, CA 92660) that visualizes all competing amenities in the local area. This is for a pitch to Hyatt about building a private members club for locals (target demo: 25–40 year olds).

The goal is to show: **"Here's everything that exists around the Hyatt, category by category — and here's where the gaps are that a members club could fill."**

---

## Core Features

### 1. Interactive Map
- **Centered on Hyatt Regency Newport Beach** (33.6178, -117.8894)
- Use a real map (Mapbox, Google Maps, or Leaflet/OpenStreetMap)
- Color-coded dots/markers for each amenity category
- Click/hover on markers to see details (name, rating, price, notes)
- The Hyatt should be prominently marked at center (different marker style — star, larger pin, etc.)

### 2. Category Filters
- Toggle each amenity category on/off independently
- Visual indicator showing how many locations are in each category
- Categories should have distinct, easy-to-read colors
- "Select All" / "Clear All" option

### 3. Radius Rings
- Show concentric distance rings from the Hyatt: **0.5 mi, 1 mi, 2 mi, 3 mi**
- Toggle individual rings on/off
- Semi-transparent, labeled with distance

### 4. Side Panel / Info Panel
- When a category is active, show a summary of what the Hyatt currently offers (or doesn't) in that category
- Gap analysis: what's missing that a members club could provide
- List view of all locations in active categories, sorted by distance from Hyatt

---

## Amenity Categories & Data

### 🏋️ Gyms & Fitness (Color: Red)
**Hyatt currently has:** Basic hotel fitness center
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

### 🎾 Pickleball / Tennis (Color: Green)
**Hyatt currently has:** Tennis courts on property
**Gap:** No pickleball, no padel, no leagues, no social play programming

| Name | Lat | Lng | Rating | Note |
|------|-----|-----|--------|------|
| Tennis & Pickleball Club at NB | 33.6105 | -117.8798 | 4.1 | 30+ courts, biggest facility, mixed reviews on quality |
| Palisades Tennis Club | 33.6188 | -117.8867 | 4.7 | RIGHT NEXT to Hyatt (0.2mi), boutique tennis, great vibe |
| Newport Beach Tennis Club | 33.6417 | -117.8749 | 4.5 | Large club with restaurant, easy app booking, social scene |
| Bonita Canyon Pickleball | 33.6281 | -117.8610 | 4.8 | Public, 4 courts only, challenge court system, very social |
| Newport Coast Pickleball | 33.6090 | -117.8275 | 4.4 | Public, 6 courts, wind issues, bring your own group |
| Bonita Canyon Sports Park East | 33.6275 | -117.8522 | 4.6 | Public park with pickleball, easy pickup games |

### ⛳ Golf (Color: Purple)
**Hyatt currently has:** 9-hole Back Bay Golf Course (par-3 executive, casual)
**Gap:** No golf simulator, no social golf events, no TopGolf-style experience

| Name | Lat | Lng | Rating | Note |
|------|-----|-----|--------|------|
| Back Bay Golf Course (Hyatt) | 33.6178 | -117.8878 | 4.2 | ON-SITE, 9-hole par 3, fun for quick round, beer available, hole #8 overlooks bay |
| Newport Beach Golf Course | 33.6593 | -117.8811 | 3.9 | Public 18-hole executive, mat tee boxes, affordable but rough condition |
| Pelican Hill Golf Club | 33.5849 | -117.8419 | 4.6 | $250+/round, world-class resort golf, ocean views |
| Newport Beach Country Club | 33.6112 | -117.8815 | 4.7 | Private, $40M clubhouse, hosts Hoag Classic PGA event |
| Big Canyon Country Club | 33.6201 | -117.8694 | 4.8 | Ultra-exclusive private, $150K–$200K initiation, 0.5mi from Hyatt |
| Rancho San Joaquin GC | 33.6643 | -117.8316 | 3.7 | Public 18-hole, challenging greens, pace of play issues |
| Strawberry Farms GC | 33.6493 | -117.7957 | 4.5 | Higher-end public, beautiful scenery, popular for events |

### 💻 Working Café / Cowork (Color: Amber/Yellow)
**Hyatt currently has:** NOTHING — lobby lounge only, not designed for work
**Gap:** No dedicated workspace — this is a huge gap for the 25-40 entrepreneur/remote worker demo

| Name | Lat | Lng | Rating | Note |
|------|-----|-----|--------|------|
| Kéan Coffee | 33.6277 | -117.9084 | 4.7 | Newport's best coffee, 1,395 reviews, gets crowded, limited seating |
| Stereoscope Coffee | 33.6561 | -117.8678 | 4.3 | Creative vibe, limited seating, 2hr validated parking only |
| Coffee Dose | 33.6586 | -117.8855 | 4.9 | Instagram-famous, great food + coffee, more café than workspace |
| Blk Dot Coffee | 33.6390 | -117.8604 | 4.4 | Near UCI, good for work, plaza outdoor seating |
| Freelance Coffee Project | 33.6313 | -117.9354 | 4.6 | Named for freelancers, cool plant-covered exterior, no outlets reported |
| Herst Coffee Roasters | 33.6183 | -117.9285 | 4.3 | Lido Peninsula, good location, NO WiFi, gets crowded/loud |
| HanaHaus | 33.6177 | -117.9277 | 4.5 | $4/hr coworking, harbor views, Blue Bottle on-site |
| Rogue Collective | 33.6314 | -117.9343 | 4.9 | Creative coworking, podcast studio, events space |
| Colab Space | 33.6729 | -117.8628 | 4.9 | Irvine, modern social coworking, events |

### 🏊 Pool & Day Scene (Color: Cyan)
**Hyatt currently has:** 3 pools + 3 hot tubs, cabanas, firepits — 26-acre setting
**Gap:** Not curated as a social scene yet. This is the single biggest competitive advantage and opportunity.

| Name | Lat | Lng | Rating | Note |
|------|-----|-----|--------|------|
| Hyatt Regency (on-site) | 33.6178 | -117.8894 | 4.3 | ON-SITE, 3 pools including Oasis + Indulge, cabanas, hot tubs, firepits |
| Pendry (Elwood Club) | 33.6199 | -117.8756 | 4.2 | Single rooftop-style pool, Elwood Club members only |
| VEA Newport Beach (Marriott) | 33.6163 | -117.8795 | 4.4 | Good pool + pool bar, fire pits, open courtyard, hotel guests |
| Balboa Bay Club | 33.6093 | -117.9097 | — | $15K–50K initiation, waterfront heated pool + private beach, members only |
| Resort at Pelican Hill | 33.5886 | -117.8440 | 4.8 | Iconic Coliseum Pool, ultra-luxury, $1,000+/night |
| Marriott Newport Coast Villas | 33.5826 | -117.8427 | 4.6 | Multiple pools, timeshare/resort, family oriented |

### 🍸 Bars & Nightlife (Color: Pink)
**Hyatt currently has:** Lobby Lounge Bar (4.6 rating, 17 reviews)
**Gap:** No rooftop bar, no craft cocktail program, no outdoor bar with energy/scene

| Name | Lat | Lng | Rating | Note |
|------|-----|-----|--------|------|
| Hyatt Lobby Lounge Bar (on-site) | 33.6174 | -117.8893 | 4.6 | ON-SITE, open 6am–midnight, TVs, decent food |
| Bar Pendry | 33.6199 | -117.8756 | 3.2 | Hotel bar, cocktails, live music Thu-Sat, poor reviews |
| thehouse Newport Beach | 33.6192 | -117.9233 | 4.7 | MEMBERS ONLY, dockside, cost+10% pricing model, 450 members, waitlisted |
| Class of 47 | 33.6030 | -117.9008 | 4.5 | Dive bar, Balboa, pool tables, very chill |
| Bayshore Cafe Lounge | 33.6164 | -117.9081 | 4.8 | Live music venue, breakfast to late, great food + vibe |
| A Restaurant | 33.6215 | -117.9281 | 4.6 | Crystal Cove, great cocktails, steak, outdoor patio |

### 🍽️ Fine Dining (Color: Orange)
**Hyatt currently has:** SHOR restaurant (Chef Jae Lee), Sunday brunch, high tea
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

### 🧖 Spa & Wellness (Color: Teal)
**Hyatt currently has:** NOTHING on property
**Gap:** Every competitor hotel has a spa. No spa = missing a core members club amenity.

| Name | Lat | Lng | Rating | Note |
|------|-----|-----|--------|------|
| SPA VEA | 33.6165 | -117.8794 | 4.8 | Hotel spa at VEA Marriott, eucalyptus sauna, cold foot bath |
| Spa Pendry | 33.6199 | -117.8760 | — | Full-service hotel spa, Elwood Club members access |
| Pause Newport Beach | 33.6277 | -117.9090 | 4.8 | Cryo, infrared sauna, float therapy, compression boots |
| SweatHouz | 33.6101 | -117.9282 | 4.9 | Private infrared sauna + cold plunge suites, $9/day unlimited |

---

## Design Direction

- **Dark theme** — sophisticated, pitch-ready, not corporate. Think: dark navy/charcoal background, colored dots that pop.
- **Centered on Hyatt** with the property clearly marked (star icon or distinct marker style)
- **Clean, minimal UI** — the map should do most of the talking
- Category filters should be easy to toggle on/off (chips/pills with colored dots)
- Radius rings should be toggleable and semi-transparent
- Hover/click on a marker should show: name, category, rating, distance from Hyatt, and the note
- Side panel or bottom panel for the gap analysis summary

## Tech Preferences

- React or Next.js
- Leaflet with OpenStreetMap tiles (free, no API key needed) OR Mapbox if you prefer
- Tailwind CSS for styling
- Should be deployable as a standalone page

---

## Key Insight to Communicate

The map should make it visually obvious that:

1. **Within 1 mile of the Hyatt, there are almost no cafés, coworking spaces, or wellness/spa options** — those are all clustered around Lido, Balboa Peninsula, and Fashion Island
2. **The pool opportunity is unmatched** — 3 pools on 26 acres vs. everyone else's single hotel pool
3. **Pickleball/padel is a white space** — all supply is public courts with no amenities
4. **The Hyatt is surrounded by $150K+ country clubs** (Big Canyon, NB Country Club) but there's nothing in the $300-500/mo accessible-premium tier for younger professionals
5. **No competitor combines all these amenities under one membership** — gym + pool + courts + workspace + dining + bar. That's the pitch.
