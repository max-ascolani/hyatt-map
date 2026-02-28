import { useState, useMemo, useCallback } from 'react'
import { MapContainer, TileLayer, CircleMarker, Circle, Popup, useMap, Marker } from 'react-leaflet'
import L from 'leaflet'
import { HYATT_COORDS, CATEGORIES, SUPER_CATEGORIES, COMPETITORS, type CategoryId, type SuperCategoryId, type CuisineTag, type Competitor, type PriceTier, type DayOfWeek, type WeeklyHours } from './data/competitors'
import Sidebar from './components/Sidebar'

const DISTANCE_RINGS = [
  { miles: 0.5, meters: 805, label: '0.5 mi', angle: 90 },
  { miles: 1, meters: 1609, label: '1 mi', angle: 45 },
  { miles: 2, meters: 3219, label: '2 mi', angle: 45 },
  { miles: 3, meters: 4828, label: '3 mi', angle: 45 },
]

// Calculate a point on a circle at a given angle from center
function pointOnCircle(center: [number, number], radiusMeters: number, angleDeg: number): [number, number] {
  const R = 6371000
  const lat1 = (center[0] * Math.PI) / 180
  const lng1 = (center[1] * Math.PI) / 180
  const bearing = (angleDeg * Math.PI) / 180
  const d = radiusMeters / R
  const lat2 = Math.asin(Math.sin(lat1) * Math.cos(d) + Math.cos(lat1) * Math.sin(d) * Math.cos(bearing))
  const lng2 = lng1 + Math.atan2(Math.sin(bearing) * Math.sin(d) * Math.cos(lat1), Math.cos(d) - Math.sin(lat1) * Math.sin(lat2))
  return [(lat2 * 180) / Math.PI, (lng2 * 180) / Math.PI]
}

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function renderStars(rating: number | null): string {
  if (rating === null) return 'No rating'
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5 ? 1 : 0
  return '\u2605'.repeat(full) + (half ? '\u00bd' : '') + ` ${rating}`
}

function isOpenDuring(
  hours: WeeklyHours | null,
  days: Set<DayOfWeek>,
  startHour: number,
  endHour: number,
): boolean | null {
  if (!hours || days.size === 0) return null
  let hasKnownDay = false
  for (const day of days) {
    const dayHours = hours[day]
    if (!dayHours) continue // closed that day, check next
    hasKnownDay = true
    const bizOpen = parseInt(dayHours[0].split(':')[0])
    const bizClose = parseInt(dayHours[1].split(':')[0])
    // Point check when start === end
    if (startHour === endHour) {
      if (bizClose <= bizOpen) {
        if (startHour >= bizOpen || startHour < bizClose) return true
      } else {
        if (startHour >= bizOpen && startHour < bizClose) return true
      }
      continue
    }
    // Interval overlap check
    if (bizClose <= bizOpen) {
      // Midnight crossover: open [bizOpen,24) and [0,bizClose)
      if (bizOpen < endHour || startHour < bizClose) return true
    } else {
      // Normal hours
      if (startHour < bizClose && bizOpen < endHour) return true
    }
  }
  return hasKnownDay ? false : null
}

function FlyToMarker({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap()
  useMemo(() => {
    map.flyTo([lat, lng], 16, { duration: 0.8 })
  }, [map, lat, lng])
  return null
}

function HyattMarker() {
  return (
    <CircleMarker
      center={HYATT_COORDS}
      radius={14}
      pathOptions={{
        fillColor: '#1e40af',
        fillOpacity: 1,
        color: '#ffffff',
        weight: 3,
      }}
    >
      <Popup>
        <div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#1e40af', marginBottom: 4 }}>
            Hyatt Regency Newport Beach
          </div>
          <div style={{ color: '#64748b', marginBottom: 6 }}>1107 Jamboree Rd, Newport Beach, CA 92660</div>
          <div style={{ color: '#64748b' }}>402 rooms &middot; 26 acres &middot; 3 pools &middot; 16 tennis courts</div>
          <a
            href="https://www.hyatt.com/hyatt-regency/en-US/newpo-hyatt-regency-newport-beach"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#2563eb', fontSize: '12px', display: 'inline-block', marginTop: 6 }}
          >
            hyatt.com &rarr;
          </a>
        </div>
      </Popup>
    </CircleMarker>
  )
}

function HyattMarkerInner() {
  return (
    <CircleMarker
      center={HYATT_COORDS}
      radius={5}
      pathOptions={{
        fillColor: '#ffffff',
        fillOpacity: 1,
        color: '#1e40af',
        weight: 2,
      }}
      interactive={false}
    />
  )
}

export default function App() {
  const [activeCategories, setActiveCategories] = useState<Set<CategoryId>>(new Set())
  const [activeRings, setActiveRings] = useState<Set<number>>(new Set([0.5, 1, 2, 3]))
  const [distanceLimit, setDistanceLimit] = useState(false)
  const [activePriceTiers, setActivePriceTiers] = useState<Set<PriceTier>>(new Set(['$', '$$', '$$$', '$$$$']))
  const [sortBy, setSortBy] = useState<'distance' | 'rating'>('distance')
  const [timeFilterEnabled, setTimeFilterEnabled] = useState(false)
  const [selectedDays, setSelectedDays] = useState<Set<DayOfWeek>>(new Set(['fri', 'sun']))
  const [startHour, setStartHour] = useState(14) // 2pm
  const [endHour, setEndHour] = useState(18) // 6pm
  const ALL_CUISINE_TAGS: CuisineTag[] = ['japanese', 'italian', 'mexican', 'seafood', 'american', 'french', 'californian', 'health', 'brunch']
  const DINING_SUB_CATEGORIES: CategoryId[] = ['dining', 'upscale_casual', 'sushi', 'casual', 'health_food', 'brunch']
  const [activeCuisineTags, setActiveCuisineTags] = useState<Set<CuisineTag>>(new Set(ALL_CUISINE_TAGS))
  const [flyTo, setFlyTo] = useState<{ lat: number; lng: number } | null>(null)

  const toggleCategory = useCallback((id: CategoryId) => {
    setActiveCategories(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const toggleSuperCategory = useCallback((scId: SuperCategoryId) => {
    setActiveCategories(prev => {
      const children = SUPER_CATEGORIES.find(sc => sc.id === scId)?.children ?? []
      const childIds = children.map(c => c.id)
      const allActive = childIds.every(id => prev.has(id))
      const next = new Set(prev)
      childIds.forEach(id => {
        if (allActive) next.delete(id)
        else next.add(id)
      })
      return next
    })
  }, [])

  const showAll = useCallback(() => {
    setActiveCategories(new Set(CATEGORIES.map(c => c.id)))
  }, [])

  const hideAll = useCallback(() => {
    setActiveCategories(new Set())
  }, [])

  const toggleRing = useCallback((miles: number) => {
    setActiveRings(prev => {
      const next = new Set(prev)
      if (next.has(miles)) next.delete(miles)
      else next.add(miles)
      return next
    })
  }, [])

  const anyDiningActive = DINING_SUB_CATEGORIES.some(id => activeCategories.has(id))

  const maxRingDistance = useMemo(() => {
    if (!distanceLimit || activeRings.size === 0) return Infinity
    return Math.max(...activeRings)
  }, [distanceLimit, activeRings])

  const visibleCompetitors = useMemo(() => {
    return COMPETITORS.filter(c => {
      if (!activeCategories.has(c.category)) return false
      if (c.priceTier !== null && !activePriceTiers.has(c.priceTier)) return false
      if (DINING_SUB_CATEGORIES.includes(c.category) && c.cuisineTag && !activeCuisineTags.has(c.cuisineTag)) return false
      if (maxRingDistance < Infinity) {
        const dist = getDistance(HYATT_COORDS[0], HYATT_COORDS[1], c.lat, c.lng)
        if (dist > maxRingDistance) return false
      }
      return true
    })
  }, [activeCategories, activePriceTiers, activeCuisineTags, maxRingDistance])

  const competitorsWithDistance = useMemo(() => {
    return visibleCompetitors
      .map(c => ({
        ...c,
        distance: getDistance(HYATT_COORDS[0], HYATT_COORDS[1], c.lat, c.lng),
      }))
      .sort((a, b) => {
        if (sortBy === 'rating') {
          const rA = a.rating ?? 0
          const rB = b.rating ?? 0
          return rB - rA || a.distance - b.distance
        }
        return a.distance - b.distance
      })
  }, [visibleCompetitors, sortBy])

  const categoryColorMap = useMemo(() => {
    const map: Record<string, string> = {}
    CATEGORIES.forEach(c => {
      map[c.id] = c.color
    })
    return map
  }, [])

  const togglePriceTier = useCallback((tier: PriceTier) => {
    setActivePriceTiers(prev => {
      const next = new Set(prev)
      if (next.has(tier)) {
        next.delete(tier)
      } else {
        next.add(tier)
      }
      return next
    })
  }, [])

  const toggleCuisineTag = useCallback((tag: CuisineTag) => {
    setActiveCuisineTags(prev => {
      const next = new Set(prev)
      if (next.has(tag)) next.delete(tag)
      else next.add(tag)
      return next
    })
  }, [])

  const clearFilters = useCallback(() => {
    setActivePriceTiers(new Set())
    setActiveCuisineTags(new Set())
  }, [])

  const selectAllCuisine = useCallback(() => {
    setActiveCuisineTags(new Set(ALL_CUISINE_TAGS))
  }, [])

  const toggleDay = useCallback((day: DayOfWeek) => {
    setSelectedDays(prev => {
      const next = new Set(prev)
      if (next.has(day)) next.delete(day)
      else next.add(day)
      return next
    })
  }, [])

  const handleListClick = useCallback((c: Competitor) => {
    setFlyTo({ lat: c.lat, lng: c.lng })
    setTimeout(() => setFlyTo(null), 1000)
  }, [])

  return (
    <div className="flex h-screen w-screen bg-slate-50">
      <Sidebar
        activeCategories={activeCategories}
        toggleCategory={toggleCategory}
        toggleSuperCategory={toggleSuperCategory}
        showAll={showAll}
        hideAll={hideAll}
        activeRings={activeRings}
        toggleRing={toggleRing}
        distanceLimit={distanceLimit}
        setDistanceLimit={setDistanceLimit}
        activePriceTiers={activePriceTiers}
        togglePriceTier={togglePriceTier}
        activeCuisineTags={activeCuisineTags}
        toggleCuisineTag={toggleCuisineTag}
        anyDiningActive={anyDiningActive}
        clearFilters={clearFilters}
        selectAllCuisine={selectAllCuisine}
        sortBy={sortBy}
        setSortBy={setSortBy}
        competitorsWithDistance={competitorsWithDistance}
        categoryColorMap={categoryColorMap}
        onListItemClick={handleListClick}
        timeFilterEnabled={timeFilterEnabled}
        onToggleTimeFilter={() => setTimeFilterEnabled(prev => !prev)}
        selectedDays={selectedDays}
        onDayToggle={toggleDay}
        startHour={startHour}
        endHour={endHour}
        onStartHourChange={setStartHour}
        onEndHourChange={setEndHour}
      />

      <div className="flex-1 relative">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-[1000] pointer-events-none">
          <div className="px-6 py-4 bg-gradient-to-b from-white via-white/80 to-transparent">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Hyatt Regency Newport Beach
              <span className="text-slate-400 font-normal ml-2 text-sm">Competitive Landscape</span>
            </h1>
          </div>
        </div>

        <MapContainer
          center={HYATT_COORDS}
          zoom={14}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
          attributionControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />

          {/* Distance rings with labels */}
          {DISTANCE_RINGS.filter(ring => activeRings.has(ring.miles)).map(ring => {
              const labelPos = pointOnCircle(HYATT_COORDS, ring.meters, ring.angle)
              const labelIcon = L.divIcon({
                className: 'ring-label',
                html: ring.label,
                iconSize: [40, 16],
                iconAnchor: [20, 8],
              })
              return (
                <span key={ring.miles}>
                  <Circle
                    center={HYATT_COORDS}
                    radius={ring.meters}
                    pathOptions={{
                      color: '#93c5fd',
                      weight: 1.5,
                      fillColor: '#3b82f6',
                      fillOpacity: 0.03,
                      dashArray: '8 5',
                    }}
                  />
                  <Marker position={labelPos} icon={labelIcon} interactive={false} />
                </span>
              )
            })}

          {/* Competitor markers */}
          {visibleCompetitors.map((c, i) => {
            const dist = getDistance(HYATT_COORDS[0], HYATT_COORDS[1], c.lat, c.lng)
            const color = categoryColorMap[c.category]
            const baseRadius = c.onSite ? 10 : (c.rating !== null && c.rating >= 4.5 ? 8 : c.rating !== null && c.rating < 4.0 ? 6 : 7)
            const openStatus = timeFilterEnabled ? isOpenDuring(c.hours, selectedDays, startHour, endHour) : null
            const isClosed = openStatus === false
            return (
              <CircleMarker
                key={`${c.category}-${i}`}
                center={[c.lat, c.lng]}
                radius={isClosed ? baseRadius - 1 : baseRadius}
                pathOptions={{
                  fillColor: isClosed ? '#94a3b8' : color,
                  fillOpacity: isClosed ? 0.25 : (c.rating !== null && c.rating < 4.0 ? 0.55 : 0.85),
                  color: isClosed ? '#cbd5e1' : '#ffffff',
                  weight: c.onSite ? 2.5 : 2,
                }}
                eventHandlers={{
                  mouseover: (e) => {
                    e.target.setRadius(baseRadius + 3)
                  },
                  mouseout: (e) => {
                    e.target.setRadius(isClosed ? baseRadius - 1 : baseRadius)
                  },
                }}
              >
                <Popup>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: isClosed ? '#94a3b8' : color, marginBottom: 2 }}>
                      {c.name}
                      {timeFilterEnabled && openStatus !== null && (
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 600,
                          marginLeft: 8,
                          padding: '1px 6px',
                          borderRadius: 4,
                          backgroundColor: openStatus ? '#dcfce7' : '#fee2e2',
                          color: openStatus ? '#166534' : '#991b1b',
                        }}>
                          {openStatus ? 'OPEN' : 'CLOSED'}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: 4 }}>
                      {SUPER_CATEGORIES.find(sc => sc.children.some(ch => ch.id === c.category))?.label}
                      {' \u203a '}
                      {CATEGORIES.find(cat => cat.id === c.category)?.label}
                      {' \u00b7 '}
                      {dist.toFixed(1)} mi from Hyatt
                      {c.priceTier && (
                        <span style={{ marginLeft: 6, color: c.priceTier === '$$$$' ? '#d97706' : '#64748b' }}>
                          {c.priceTier}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '13px', color: '#f59e0b', marginBottom: 4 }}>
                      {renderStars(c.rating)}
                      {c.reviewCount && (
                        <span style={{ fontSize: '11px', color: '#94a3b8', marginLeft: 6 }}>
                          ({c.reviewCount.toLocaleString()} reviews)
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '12px', color: '#475569' }}>{c.note}</div>
                    {c.onSite && (
                      <div
                        style={{
                          fontSize: '11px',
                          color: '#1e40af',
                          fontWeight: 600,
                          marginTop: 6,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      >
                        On-site at Hyatt
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                      {c.googleMapsUrl && (
                        <a
                          href={c.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#2563eb', fontSize: '11px' }}
                        >
                          Google Maps &rarr;
                        </a>
                      )}
                      {c.website && (
                        <a
                          href={c.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#2563eb', fontSize: '11px' }}
                        >
                          Website &rarr;
                        </a>
                      )}
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            )
          })}

          {/* Hyatt marker */}
          <HyattMarker />
          <HyattMarkerInner />

          {flyTo && <FlyToMarker lat={flyTo.lat} lng={flyTo.lng} />}
        </MapContainer>
      </div>
    </div>
  )
}
