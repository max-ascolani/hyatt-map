import { useState, useRef, useEffect, useMemo } from 'react'
import { GeoJSON } from 'react-leaflet'
import L from 'leaflet'
import { CENSUS_TRACTS, DEMOGRAPHIC_METRICS, type DemographicMetric, type TractProperties } from '../data/demographics'
import type { Feature, Polygon, MultiPolygon } from 'geojson'

const PALETTE = ['#ede9fe', '#c4b5fd', '#8b5cf6', '#6d28d9', '#4c1d95']

function getBreaks(metric: DemographicMetric): number[] {
  const vals = CENSUS_TRACTS.features
    .map(f => f.properties[metric] as number)
    .sort((a, b) => a - b)
  const n = vals.length
  return [
    vals[0],
    vals[Math.floor(n * 0.2)],
    vals[Math.floor(n * 0.4)],
    vals[Math.floor(n * 0.6)],
    vals[Math.floor(n * 0.8)],
    vals[n - 1],
  ]
}

function getColor(value: number, breaks: number[]): string {
  if (value <= breaks[1]) return PALETTE[0]
  if (value <= breaks[2]) return PALETTE[1]
  if (value <= breaks[3]) return PALETTE[2]
  if (value <= breaks[4]) return PALETTE[3]
  return PALETTE[4]
}

function formatCompact(value: number, metric: DemographicMetric): string {
  if (metric === 'medianIncome') {
    return value >= 1000 ? `$${Math.round(value / 1000)}K` : `$${value}`
  }
  if (metric === 'population') {
    return value >= 1000 ? `${(value / 1000).toFixed(1)}K` : `${value}`
  }
  return `${Math.round(value)}%`
}

interface Props {
  visible: boolean
  metric: DemographicMetric
}

export default function DemographicLayer({ visible, metric }: Props) {
  const breaks = useMemo(() => getBreaks(metric), [metric])
  const metricInfo = DEMOGRAPHIC_METRICS.find(m => m.key === metric)!
  const [highlightedTract, setHighlightedTract] = useState<string | null>(null)
  const layersRef = useRef<Map<string, L.Path>>(new Map())

  // Reset highlight when metric changes (GeoJSON remounts and onEachFeature overwrites layersRef)
  useEffect(() => {
    setHighlightedTract(null)
  }, [metric])

  // Update all layer styles when highlight changes
  useEffect(() => {
    layersRef.current.forEach((lyr, geoid) => {
      const feature = CENSUS_TRACTS.features.find(f => f.properties.geoid === geoid)
      if (!feature) return
      const val = feature.properties[metric] as number

      if (highlightedTract === null) {
        lyr.setStyle({ fillColor: getColor(val, breaks), fillOpacity: 0.35, weight: 0.5, color: '#6b7280' })
      } else if (geoid === highlightedTract) {
        lyr.setStyle({ fillColor: getColor(val, breaks), fillOpacity: 0.6, weight: 2.5, color: '#4c1d95' })
      } else {
        lyr.setStyle({ fillColor: '#d1d5db', fillOpacity: 0.08, weight: 0.3, color: '#d1d5db' })
      }
    })
  }, [highlightedTract, breaks, metric])

  if (!visible) return null

  return (
    <>
      <GeoJSON
        key={metric}
        data={CENSUS_TRACTS}
        style={(feature) => {
          const val = (feature as Feature<Polygon | MultiPolygon, TractProperties>).properties[metric] as number
          return {
            fillColor: getColor(val, breaks),
            fillOpacity: 0.35,
            weight: 0.5,
            color: '#6b7280',
          }
        }}
        onEachFeature={(feature, layer) => {
          const p = (feature as Feature<Polygon | MultiPolygon, TractProperties>).properties
          const val = p[metric] as number

          // Store layer ref for imperative style updates
          layersRef.current.set(p.geoid, layer as L.Path)

          layer.bindTooltip(
            `<strong>${p.name}</strong><br/>${metricInfo.label}: ${metricInfo.format(val)}`,
            { sticky: true, className: 'demographic-tooltip' }
          )

          layer.on('click', () => {
            // Toggle highlight
            setHighlightedTract(prev => prev === p.geoid ? null : p.geoid)

            // Compact popup — tract name + current metric
            const popup = L.popup({ maxWidth: 240, minWidth: 120, closeButton: false })
              .setLatLng((layer as L.Polygon).getBounds().getCenter())
              .setContent(`
                <div style="text-align:center">
                  <div style="font-weight:700;font-size:14px;color:#4c1d95">${p.name}</div>
                  <div style="font-size:13px;color:#475569;margin-top:2px">${metricInfo.label}: <strong>${metricInfo.format(val)}</strong></div>
                </div>
              `)
            popup.openOn((layer as L.Polygon)._map)
          })
        }}
      />

      {/* Legend */}
      <div className="demographic-legend">
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, color: '#4c1d95', borderBottom: '2px solid #ede9fe', paddingBottom: 6 }}>
          {metricInfo.label}
        </div>
        {PALETTE.map((color, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, color: '#475569', marginBottom: 2 }}>
            <div style={{ width: 28, height: 18, backgroundColor: color, borderRadius: 3, flexShrink: 0 }} />
            <span>
              {i < PALETTE.length - 1
                ? `${formatCompact(breaks[i], metric)} \u2013 ${formatCompact(breaks[i + 1], metric)}`
                : `${formatCompact(breaks[i], metric)}+`}
            </span>
          </div>
        ))}
        {highlightedTract && (
          <div
            onClick={() => setHighlightedTract(null)}
            style={{
              fontSize: 12,
              color: '#94a3b8',
              cursor: 'pointer',
              textAlign: 'center',
              marginTop: 8,
              paddingTop: 6,
              borderTop: '1px solid #ede9fe',
            }}
          >
            Clear highlight
          </div>
        )}
      </div>
    </>
  )
}
