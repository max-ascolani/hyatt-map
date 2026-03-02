# The Newporter — Interactive Competition Map

An interactive map visualizing the competitive landscape around the The Newporter (1107 Jamboree Rd, Newport Beach, CA 92660) for a proposed private members club targeting 25–40 year-old professionals.

## Quick Start

```bash
npm install
npm run dev      # Start dev server at http://localhost:5173
npm run build    # Build for production → dist/
```

To deploy, serve the `dist/` folder with any static file server (Netlify, Vercel, GitHub Pages, etc.).

## Tech Stack

- **React 19** + TypeScript + Vite
- **Leaflet / react-leaflet** for mapping (CartoDB Positron tiles)
- **Tailwind CSS v4** via `@tailwindcss/vite`
- **leaflet.heat** for density heatmap overlay
- **Overpass API** for supplementary OpenStreetMap data

## Data Structure

All competitor data lives in `src/data/competitors.ts`.

### Super-Categories & Sub-Categories

The 133 competitors are organized into 6 super-categories containing 20 sub-categories:

| Super-Category | Sub-Categories |
|---|---|
| Fitness | Gyms, Yoga/Pilates/Barre, Tennis/Pickleball, Golf |
| Dining | Fine Dining, Upscale Casual, Sushi/Japanese, Casual/Everyday, Health-Conscious, Brunch |
| Wellness | Spa & Wellness, Juice Bars, Beauty & Grooming |
| Social | Bars & Lounges, Wine Bars, Entertainment |
| Work & Shop | Coworking, Shopping & Retail |
| Outdoors | Pools & Beach Clubs, Water Sports |

### Adding a New Business

Add an entry to the `COMPETITORS` array in `src/data/competitors.ts`:

```typescript
{
  category: 'dining',           // Must be a valid CategoryId
  name: 'Restaurant Name',
  lat: 33.6189,
  lng: -117.9289,
  rating: 4.5,
  reviewCount: 200,
  priceTier: '$$$',             // '$' | '$$' | '$$$' | '$$$$' | null
  note: 'Brief description',
  onSite: false,
  cuisineTag: 'italian',        // Optional — for dining sub-categories only
  website: 'https://...',
  hours: {                      // WeeklyHours — null for closed days
    mon: ['11:00', '22:00'],
    tue: ['11:00', '22:00'],
    wed: ['11:00', '22:00'],
    thu: ['11:00', '22:00'],
    fri: ['11:00', '23:00'],
    sat: ['10:00', '23:00'],
    sun: ['10:00', '21:00'],
  },
  googleMapsUrl: 'https://www.google.com/maps/...',
}
```

## Features

- **Category Accordion** — Expandable super-category groups with bulk toggle and indeterminate state
- **Price Tier Filter** — Toggle $ through $$$$ price tiers
- **Cuisine Tag Filter** — Filter dining venues by cuisine (appears when dining categories are active)
- **Distance Rings** — 0.5, 1, 2, 3 mile rings from the Hyatt
- **Density Heatmap** — Heat overlay showing competitor concentration
- **OSM Places** — Pull supplementary POI data from OpenStreetMap
- **Time Filter** — Filter by day/hour to show what's open
- **Before/After Comparison** — Visualize the competitive gap vs. proposed members club
- **Location List** — Sortable by distance or rating, click to fly to marker
