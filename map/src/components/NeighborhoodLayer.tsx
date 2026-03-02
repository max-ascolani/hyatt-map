import { useMemo } from 'react'
import { GeoJSON, Marker } from 'react-leaflet'
import L from 'leaflet'
import { NEIGHBORHOODS, NEIGHBORHOOD_CENTROIDS } from '../data/neighborhoods'
import type { FeatureCollection, Polygon, MultiPolygon } from 'geojson'
import type { NeighborhoodProperties } from '../data/neighborhoods'

interface Props {
  activeNeighborhoods: Set<string>
  onToggleNeighborhood: (name: string) => void
}

export default function NeighborhoodLayer({ activeNeighborhoods, onToggleNeighborhood }: Props) {
  const filteredData = useMemo<FeatureCollection<Polygon | MultiPolygon, NeighborhoodProperties>>(() => ({
    type: 'FeatureCollection',
    features: NEIGHBORHOODS.features.filter(f => activeNeighborhoods.has(f.properties.name)),
  }), [activeNeighborhoods])

  if (activeNeighborhoods.size === 0) return null

  // Key must change when the set changes so react-leaflet re-renders the GeoJSON
  const geoKey = [...activeNeighborhoods].sort().join(',')

  return (
    <>
      <GeoJSON
        key={geoKey}
        data={filteredData}
        style={{
          color: '#6366f1',
          fillOpacity: 0.08,
          weight: 1.5,
          dashArray: '4 3',
        }}
        onEachFeature={(feature, layer) => {
          layer.bindTooltip(feature.properties.name, {
            sticky: true,
            className: 'neighborhood-tooltip',
          })
          layer.on('click', () => {
            onToggleNeighborhood(feature.properties.name)
          })
        }}
      />
      {NEIGHBORHOOD_CENTROIDS
        .filter(({ name }) => activeNeighborhoods.has(name))
        .map(({ name, center }) => (
          <Marker
            key={name}
            position={center}
            icon={L.divIcon({
              className: 'neighborhood-label',
              html: name,
              iconSize: [100, 16],
              iconAnchor: [50, 8],
            })}
            interactive={false}
          />
        ))}
    </>
  )
}
