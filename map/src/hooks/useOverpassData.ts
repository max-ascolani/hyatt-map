import { useState, useCallback } from 'react'
import type { CategoryId } from '../data/competitors'

export interface OverpassPOI {
  id: number
  name: string
  lat: number
  lng: number
  category: CategoryId
}

// Map our category IDs to Overpass amenity/leisure tags
const CATEGORY_TO_OSM_TAGS: Partial<Record<CategoryId, string[]>> = {
  gyms: ['[leisure=fitness_centre]', '[leisure=sports_centre]'],
  cowork: ['[amenity=cafe]'],
  bars: ['[amenity=bar]', '[amenity=pub]'],
  dining: ['[amenity=restaurant]'],
  spa: ['[leisure=spa]', '[shop=beauty]'],
}

const OVERPASS_API = 'https://overpass-api.de/api/interpreter'

// Bounding box ~3 miles around Hyatt
const BBOX = '33.56,-117.95,33.68,-117.79'

export function useOverpassData() {
  const [osmPOIs, setOsmPOIs] = useState<OverpassPOI[]>([])
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOSMData = useCallback(async () => {
    if (loaded || loading) return
    setLoading(true)
    setError(null)

    try {
      // Build a combined query for all supported categories
      const queries: string[] = []
      for (const [, tags] of Object.entries(CATEGORY_TO_OSM_TAGS)) {
        for (const tag of tags) {
          queries.push(`node${tag}(${BBOX});`)
        }
      }

      const query = `[out:json][timeout:15];(${queries.join('')});out body;`
      const response = await fetch(OVERPASS_API, {
        method: 'POST',
        body: `data=${encodeURIComponent(query)}`,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })

      if (!response.ok) throw new Error(`Overpass API error: ${response.status}`)

      const data = await response.json()
      const pois: OverpassPOI[] = []

      for (const el of data.elements) {
        if (!el.tags?.name || !el.lat || !el.lon) continue

        // Determine category from tags
        let category: CategoryId | null = null
        if (el.tags.leisure === 'fitness_centre' || el.tags.leisure === 'sports_centre') category = 'gyms'
        else if (el.tags.amenity === 'cafe') category = 'cowork'
        else if (el.tags.amenity === 'bar' || el.tags.amenity === 'pub') category = 'bars'
        else if (el.tags.amenity === 'restaurant') category = 'dining'
        else if (el.tags.leisure === 'spa' || el.tags.shop === 'beauty') category = 'spa'

        if (category) {
          pois.push({
            id: el.id,
            name: el.tags.name,
            lat: el.lat,
            lng: el.lon,
            category,
          })
        }
      }

      setOsmPOIs(pois)
      setLoaded(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load OSM data')
    } finally {
      setLoading(false)
    }
  }, [loaded, loading])

  return { osmPOIs, loading, loaded, error, fetchOSMData }
}
