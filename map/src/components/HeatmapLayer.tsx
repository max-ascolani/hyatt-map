import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet.heat'

interface HeatmapLayerProps {
  points: [number, number][]
}

export default function HeatmapLayer({ points }: HeatmapLayerProps) {
  const map = useMap()

  useEffect(() => {
    if (points.length === 0) return

    const heat = L.heatLayer(points, {
      radius: 35,
      blur: 25,
      maxZoom: 17,
      minOpacity: 0.3,
      gradient: {
        0.2: '#3b82f6',
        0.4: '#06b6d4',
        0.6: '#22c55e',
        0.8: '#f59e0b',
        1.0: '#ef4444',
      },
    })

    heat.addTo(map)
    return () => {
      map.removeLayer(heat)
    }
  }, [map, points])

  return null
}
