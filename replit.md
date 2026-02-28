# Hyatt Competitive Map

## Overview

An interactive competitive landscape map for the Hyatt Regency Newport Beach. Built with React, TypeScript, Vite, Leaflet, and Tailwind CSS.

## Project Structure

```
map/          - React/Vite frontend application
  src/
    components/   - React components
    data/         - Location/amenity data
    hooks/        - Custom React hooks
    types/        - TypeScript type definitions
plans/        - Feature planning documents
reference/    - Reference materials (amenities, etc.)
```

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite 7
- **Mapping**: Leaflet, react-leaflet, leaflet.heat
- **Styling**: Tailwind CSS v4
- **Build**: Vite (with @vitejs/plugin-react)

## Development

The app runs on port 5000 via the "Start application" workflow (`cd map && npm run dev`).

Vite is configured with:
- `host: '0.0.0.0'` - binds to all interfaces
- `port: 5000` - required for Replit webview
- `allowedHosts: true` - allows Replit proxy

## Deployment

Configured as a static site deployment:
- Build: `cd map && npm run build`
- Public directory: `map/dist`
