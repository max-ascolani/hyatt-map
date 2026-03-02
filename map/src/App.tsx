import { useState, useMemo, useCallback, useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, Circle, Popup, useMap, Marker } from 'react-leaflet'
import L from 'leaflet'
import { HYATT_COORDS, CATEGORIES, SUPER_CATEGORIES, COMPETITORS, type CategoryId, type SuperCategoryId, type CuisineTag, type Competitor, type PriceTier, type DayOfWeek, type WeeklyHours } from './data/competitors'
import { NEIGHBORHOOD_NAMES } from './data/neighborhoods'
import { type DemographicMetric } from './data/demographics'
import Sidebar from './components/Sidebar'
import NeighborhoodLayer from './components/NeighborhoodLayer'
import DemographicLayer from './components/DemographicLayer'
import CategoryLegend from './components/CategoryLegend'

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

const DEFAULT_ZOOM = 14

function RecenterButton() {
  const map = useMap()
  const handleClick = () => {
    map.setView(HYATT_COORDS, DEFAULT_ZOOM)
  }
  return (
    <button
      onClick={handleClick}
      title="Re-center on Hyatt"
      style={{
        position: 'absolute',
        top: 80,
        right: 10,
        zIndex: 1000,
        background: '#fff',
        border: '2px solid rgba(0,0,0,0.2)',
        borderRadius: 4,
        width: 34,
        height: 34,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 18,
        color: '#333',
        lineHeight: 1,
        padding: 0,
        boxShadow: 'none',
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="8" cy="8" r="3" />
        <line x1="8" y1="0" x2="8" y2="3" />
        <line x1="8" y1="13" x2="8" y2="16" />
        <line x1="0" y1="8" x2="3" y2="8" />
        <line x1="13" y1="8" x2="16" y2="8" />
      </svg>
    </button>
  )
}

function InvalidateSize({ sidebarCollapsed }: { sidebarCollapsed: boolean }) {
  const map = useMap()
  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 350)
    return () => clearTimeout(timer)
  }, [map, sidebarCollapsed])
  return null
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
            The Newporter
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
  const [activeCategories, setActiveCategories] = useState<Set<CategoryId>>(new Set(CATEGORIES.map(c => c.id)))
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
  const [activeNeighborhoods, setActiveNeighborhoods] = useState<Set<string>>(new Set())
  const [showDemographics, setShowDemographics] = useState(false)
  const [demographicMetric, setDemographicMetric] = useState<DemographicMetric>('medianIncome')
  const [flyTo, setFlyTo] = useState<{ lat: number; lng: number } | null>(null)
  const [highlightedCategory, setHighlightedCategory] = useState<CategoryId | SuperCategoryId | null>(null)

  // Determine which sub-categories are highlighted (null = all normal)
  const highlightedSubCategories = useMemo<Set<CategoryId> | null>(() => {
    if (!highlightedCategory) return null
    // Check if it's a super-category
    const sc = SUPER_CATEGORIES.find(s => s.id === highlightedCategory)
    if (sc) return new Set(sc.children.map(c => c.id))
    // Otherwise it's a sub-category
    return new Set([highlightedCategory as CategoryId])
  }, [highlightedCategory])

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

  const toggleNeighborhood = useCallback((name: string) => {
    setActiveNeighborhoods(prev => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }, [])

  const toggleAllNeighborhoods = useCallback(() => {
    setActiveNeighborhoods(prev =>
      prev.size > 0 ? new Set() : new Set(NEIGHBORHOOD_NAMES)
    )
  }, [])

  const [mobileSheetOpen, setMobileSheetOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-slate-50">
      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileSheetOpen(prev => !prev)}
        className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-[1100] bg-white text-slate-700 shadow-lg rounded-full px-5 py-2.5 text-sm font-semibold border border-slate-200 cursor-pointer flex items-center gap-2"
      >
        <svg className={`w-4 h-4 transition-transform ${mobileSheetOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
        Filters ({competitorsWithDistance.length})
      </button>

      {/* Mobile backdrop */}
      {mobileSheetOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/30 z-[1001]"
          onClick={() => setMobileSheetOpen(false)}
        />
      )}

      <Sidebar
        mobileOpen={mobileSheetOpen}
        onMobileClose={() => setMobileSheetOpen(false)}
        collapsed={sidebarCollapsed}
        onCollapse={() => setSidebarCollapsed(true)}
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
        activeNeighborhoods={activeNeighborhoods}
        onToggleNeighborhood={toggleNeighborhood}
        onToggleAllNeighborhoods={toggleAllNeighborhoods}
        showDemographics={showDemographics}
        onToggleDemographics={() => setShowDemographics(prev => !prev)}
        demographicMetric={demographicMetric}
        onDemographicMetricChange={setDemographicMetric}
      />

      <div className="flex-1 relative order-first md:order-last">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-[1000] pointer-events-none">
          <div className="px-4 md:px-6 py-3 md:py-4 bg-gradient-to-b from-white via-white/80 to-transparent">
            <h1 className="text-base md:text-xl font-bold text-slate-900 tracking-tight">
              The Newporter
              <span className="text-slate-400 font-normal ml-2 text-sm">Competitive Landscape</span>
            </h1>
          </div>
        </div>

        {/* Sidebar expand button (visible when sidebar is collapsed) */}
        {sidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(false)}
            className="hidden md:flex absolute top-[100px] left-[10px] z-[1000] bg-white text-slate-600 hover:text-slate-900 shadow-md rounded-lg w-9 h-9 items-center justify-center border border-slate-200 cursor-pointer transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        <MapContainer
          center={HYATT_COORDS}
          zoom={DEFAULT_ZOOM}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
          attributionControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />

          {/* Demographics choropleth (bottom-most overlay) */}
          <DemographicLayer visible={showDemographics} metric={demographicMetric} />

          {/* Neighborhood boundaries (rendered below rings and markers) */}
          <NeighborhoodLayer activeNeighborhoods={activeNeighborhoods} onToggleNeighborhood={toggleNeighborhood} />

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
            const isGreyed = highlightedSubCategories !== null && !highlightedSubCategories.has(c.category)
            return (
              <CircleMarker
                key={`${c.category}-${i}`}
                center={[c.lat, c.lng]}
                radius={isClosed ? baseRadius - 1 : baseRadius}
                pathOptions={{
                  fillColor: isClosed || isGreyed ? '#94a3b8' : color,
                  fillOpacity: isGreyed ? 0.18 : (isClosed ? 0.25 : (c.rating !== null && c.rating < 4.0 ? 0.55 : 0.85)),
                  color: isClosed || isGreyed ? '#cbd5e1' : '#ffffff',
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
          <InvalidateSize sidebarCollapsed={sidebarCollapsed} />
          <RecenterButton />
        </MapContainer>

        {/* Floating category legend (hidden when demographics overlay is active) */}
        {!showDemographics && (
          <CategoryLegend activeCategories={activeCategories} highlightedCategory={highlightedCategory} onHighlight={setHighlightedCategory} />
        )}
      </div>
    </div>
  )
}
