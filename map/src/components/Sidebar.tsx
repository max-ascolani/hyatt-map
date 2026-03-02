import { useState } from 'react'
import { SUPER_CATEGORIES, COMPETITORS, type CategoryId, type SuperCategoryId, type CuisineTag, type Competitor, type PriceTier, type DayOfWeek } from '../data/competitors'
import { NEIGHBORHOOD_NAMES } from '../data/neighborhoods'
import { DEMOGRAPHIC_METRICS, type DemographicMetric } from '../data/demographics'
import TimeSlider from './TimeSlider'

interface SidebarProps {
  mobileOpen: boolean
  onMobileClose: () => void
  collapsed: boolean
  onCollapse: () => void
  activeCategories: Set<CategoryId>
  toggleCategory: (id: CategoryId) => void
  toggleSuperCategory: (id: SuperCategoryId) => void
  showAll: () => void
  hideAll: () => void
  activeRings: Set<number>
  toggleRing: (miles: number) => void
  distanceLimit: boolean
  setDistanceLimit: (v: boolean) => void
  activePriceTiers: Set<PriceTier>
  togglePriceTier: (tier: PriceTier) => void
  activeCuisineTags: Set<CuisineTag>
  toggleCuisineTag: (tag: CuisineTag) => void
  anyDiningActive: boolean
  clearFilters: () => void
  selectAllCuisine: () => void
  sortBy: 'distance' | 'rating'
  setSortBy: (v: 'distance' | 'rating') => void
  competitorsWithDistance: (Competitor & { distance: number })[]
  categoryColorMap: Record<string, string>
  onListItemClick: (c: Competitor) => void
  timeFilterEnabled: boolean
  onToggleTimeFilter: () => void
  selectedDays: Set<DayOfWeek>
  onDayToggle: (day: DayOfWeek) => void
  startHour: number
  endHour: number
  onStartHourChange: (hour: number) => void
  onEndHourChange: (hour: number) => void
  activeNeighborhoods: Set<string>
  onToggleNeighborhood: (name: string) => void
  onToggleAllNeighborhoods: () => void
  showDemographics: boolean
  onToggleDemographics: () => void
  demographicMetric: DemographicMetric
  onDemographicMetricChange: (metric: DemographicMetric) => void
}

function renderStars(rating: number | null): string {
  if (rating === null) return '\u2014'
  return `${'★'.repeat(Math.floor(rating))}${rating % 1 >= 0.5 ? '½' : ''} ${rating}`
}

function SidebarSection({ title, open, onToggle, badge, children }: {
  title: string
  open: boolean
  onToggle: () => void
  badge?: string
  children: React.ReactNode
}) {
  return (
    <div className="border-b border-slate-200">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 px-5 py-2.5 cursor-pointer hover:bg-slate-50 transition-colors text-left"
      >
        <svg
          className={`w-3 h-3 text-slate-400 transition-transform shrink-0 ${open ? 'rotate-90' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex-1">
          {title}
        </span>
        {!open && badge && (
          <span className="text-[10px] text-slate-400 font-medium truncate max-w-[180px]">
            {badge}
          </span>
        )}
      </button>
      {open && (
        <div className="px-5 pb-4">
          {children}
        </div>
      )}
    </div>
  )
}

export default function Sidebar({
  mobileOpen,
  onMobileClose,
  collapsed,
  onCollapse,
  activeCategories,
  toggleCategory,
  toggleSuperCategory,
  showAll,
  hideAll,
  activeRings,
  toggleRing,
  distanceLimit,
  setDistanceLimit,
  activePriceTiers,
  togglePriceTier,
  activeCuisineTags,
  toggleCuisineTag,
  anyDiningActive,
  clearFilters,
  selectAllCuisine,
  sortBy,
  setSortBy,
  competitorsWithDistance,
  categoryColorMap,
  onListItemClick,
  timeFilterEnabled,
  onToggleTimeFilter,
  selectedDays,
  onDayToggle,
  startHour,
  endHour,
  onStartHourChange,
  onEndHourChange,
  activeNeighborhoods,
  onToggleNeighborhood,
  onToggleAllNeighborhoods,
  showDemographics,
  onToggleDemographics,
  demographicMetric,
  onDemographicMetricChange,
}: SidebarProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<SuperCategoryId>>(new Set())
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['categories', 'layers']))

  const countByCategory: Record<string, number> = {}
  COMPETITORS.forEach(c => {
    countByCategory[c.category] = (countByCategory[c.category] || 0) + 1
  })

  const toggleExpanded = (scId: SuperCategoryId) => {
    setExpandedGroups(prev => {
      const next = new Set(prev)
      if (next.has(scId)) next.delete(scId)
      else next.add(scId)
      return next
    })
  }

  const toggleSection = (id: string) => {
    setOpenSections(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // Build summary badges for collapsed sections
  const activeTiers = (['$', '$$', '$$$', '$$$$'] as PriceTier[]).filter(t => activePriceTiers.has(t))
  const filtersBadge = [
    activeTiers.length < 4 ? activeTiers.join(' ') : '',
    anyDiningActive ? `${activeCuisineTags.size} cuisines` : '',
    timeFilterEnabled ? 'Time' : '',
  ].filter(Boolean).join(' · ') || 'All'

  const layersParts: string[] = []
  if (activeRings.size > 0) layersParts.push(`${activeRings.size} rings`)
  if (activeNeighborhoods.size > 0) layersParts.push('Neighborhoods')
  if (showDemographics) layersParts.push('Demographics')
  const layersBadge = layersParts.join(' · ') || 'None'

  return (
    <div className={`
      bg-white flex flex-col
      md:border-r md:border-slate-200 md:h-full
      md:transition-[width,min-width] md:duration-300 md:ease-out
      ${collapsed ? 'md:w-0 md:min-w-0 md:overflow-hidden md:border-r-0' : 'md:w-[380px] md:min-w-[380px]'}
      fixed md:relative inset-x-0 bottom-0 z-[1002] rounded-t-2xl md:rounded-none
      shadow-[0_-4px_24px_rgba(0,0,0,0.12)] md:shadow-none
      max-h-[85vh] md:max-h-none
      transition-transform duration-300 ease-out md:transition-[width,min-width]
      ${mobileOpen ? 'translate-y-0' : 'translate-y-full md:translate-y-0'}
    `}>
      {/* Mobile drag handle */}
      <div className="md:hidden flex justify-center pt-2 pb-1">
        <div className="w-10 h-1 rounded-full bg-slate-300" />
      </div>

      {/* Header */}
      <div className="px-5 py-3 md:py-4 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full bg-blue-600" />
          <h2 className="text-sm font-semibold text-slate-800 tracking-wide uppercase flex-1">Filters</h2>
          {/* Desktop collapse button */}
          <button
            onClick={onCollapse}
            className="hidden md:flex p-1 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
            title="Hide sidebar"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          {/* Mobile close button */}
          <button
            onClick={onMobileClose}
            className="md:hidden p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-slate-400">Toggle categories to explore the competitive landscape</p>
      </div>

      <div className="flex-1 overflow-y-auto sidebar-scroll">

        {/* ── Section 1: Categories (default open) ── */}
        <SidebarSection
          title="Categories"
          open={openSections.has('categories')}
          onToggle={() => toggleSection('categories')}
          badge={`${activeCategories.size} active`}
        >
          <div className="space-y-1">
            {/* Bulk actions */}
            <div className="flex gap-2 mb-3">
              <button
                onClick={showAll}
                className="text-xs text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Show All
              </button>
              <button
                onClick={hideAll}
                className="text-xs text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Hide All
              </button>
            </div>

            {/* Super-category accordion groups */}
            {SUPER_CATEGORIES.map(sc => {
              const childIds = sc.children.map(c => c.id)
              const activeCount = childIds.filter(id => activeCategories.has(id)).length
              const allActive = activeCount === childIds.length
              const someActive = activeCount > 0
              const expanded = expandedGroups.has(sc.id)
              const totalCount = childIds.reduce((sum, id) => sum + (countByCategory[id] || 0), 0)

              return (
                <div key={sc.id} className="rounded-lg overflow-hidden">
                  {/* Super-category header */}
                  <div className="flex items-center">
                    <button
                      onClick={() => toggleSuperCategory(sc.id)}
                      className={`flex-1 flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all cursor-pointer text-left ${
                        someActive
                          ? 'bg-slate-50'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div
                        className="w-3 h-3 rounded-sm shrink-0 transition-opacity flex items-center justify-center"
                        style={{
                          backgroundColor: someActive ? sc.color : '#e2e8f0',
                        }}
                      >
                        {someActive && !allActive && (
                          <div className="w-1.5 h-0.5 bg-white rounded-full" />
                        )}
                        {allActive && (
                          <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-[13px] flex-1 font-semibold ${someActive ? 'text-slate-800' : 'text-slate-400'}`}>
                        {sc.label}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        someActive ? 'bg-slate-200 text-slate-600' : 'bg-slate-100 text-slate-400'
                      }`}>
                        {totalCount}
                      </span>
                    </button>
                    <button
                      onClick={() => toggleExpanded(sc.id)}
                      className="p-2 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                    >
                      <svg
                        className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  {/* Sub-category pills (expanded) */}
                  {expanded && (
                    <div className="pl-5 pr-2 pb-1 space-y-0.5">
                      {sc.children.map(cat => {
                        const active = activeCategories.has(cat.id)
                        return (
                          <button
                            key={cat.id}
                            onClick={() => toggleCategory(cat.id)}
                            className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md transition-all cursor-pointer text-left ${
                              active
                                ? 'bg-slate-100'
                                : 'hover:bg-slate-50'
                            }`}
                          >
                            <div
                              className="w-2.5 h-2.5 rounded-full shrink-0 transition-opacity"
                              style={{
                                backgroundColor: cat.color,
                                opacity: active ? 1 : 0.3,
                              }}
                            />
                            <span className={`text-xs flex-1 ${active ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>
                              {cat.label}
                            </span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                              active ? 'bg-slate-200 text-slate-600' : 'bg-slate-100 text-slate-400'
                            }`}>
                              {countByCategory[cat.id] || 0}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </SidebarSection>

        {/* ── Section 2: Filters (default collapsed) ── */}
        <SidebarSection
          title="Filters"
          open={openSections.has('filters')}
          onToggle={() => toggleSection('filters')}
          badge={filtersBadge}
        >
          <div className="space-y-3">
            {/* Price tier filter */}
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1">
                Price Tier
              </div>
              <div className="flex gap-1.5">
                {(['$', '$$', '$$$', '$$$$'] as PriceTier[]).map(tier => {
                  const active = activePriceTiers.has(tier)
                  return (
                    <button
                      key={tier}
                      onClick={() => togglePriceTier(tier)}
                      className={`flex-1 text-xs py-1.5 rounded-md transition-all cursor-pointer font-medium ${
                        active
                          ? tier === '$$$$' ? 'bg-amber-100 text-amber-800 ring-1 ring-amber-300'
                          : tier === '$$$' ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-300'
                          : 'bg-slate-200 text-slate-700 ring-1 ring-slate-300'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {tier}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Cuisine tag filter */}
            {anyDiningActive && (
              <div>
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Cuisine
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={selectAllCuisine}
                      className="text-[10px] text-blue-500 hover:text-blue-700 cursor-pointer transition-colors"
                    >
                      Select all
                    </button>
                    <button
                      onClick={clearFilters}
                      className="text-[10px] text-blue-500 hover:text-blue-700 cursor-pointer transition-colors"
                    >
                      Clear filters
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {(['japanese', 'italian', 'mexican', 'seafood', 'american', 'french', 'californian', 'health', 'brunch'] as CuisineTag[]).map(tag => {
                    const active = activeCuisineTags.has(tag)
                    return (
                      <button
                        key={tag}
                        onClick={() => toggleCuisineTag(tag)}
                        className={`text-[11px] px-2.5 py-1 rounded-full transition-all cursor-pointer font-medium capitalize ${
                          active
                            ? 'bg-orange-100 text-orange-700 ring-1 ring-orange-300'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {tag}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Time Filter */}
            <TimeSlider
              enabled={timeFilterEnabled}
              onToggle={onToggleTimeFilter}
              selectedDays={selectedDays}
              onDayToggle={onDayToggle}
              startHour={startHour}
              endHour={endHour}
              onStartHourChange={onStartHourChange}
              onEndHourChange={onEndHourChange}
            />
          </div>
        </SidebarSection>

        {/* ── Section 3: Map Layers (default open) ── */}
        <SidebarSection
          title="Map Layers"
          open={openSections.has('layers')}
          onToggle={() => toggleSection('layers')}
          badge={layersBadge}
        >
          <div className="space-y-4">
            {/* Distance rings */}
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1">
                Distance Rings
              </div>
              <div className="flex gap-1.5">
                {[0.5, 1, 2, 3].map(miles => {
                  const active = activeRings.has(miles)
                  return (
                    <button
                      key={miles}
                      onClick={() => toggleRing(miles)}
                      className={`flex-1 text-xs py-1.5 rounded-md transition-all cursor-pointer font-medium ${
                        active
                          ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-300'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {miles} mi
                    </button>
                  )
                })}
              </div>
              <button
                onClick={() => setDistanceLimit(!distanceLimit)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 mt-2 rounded-md transition-all cursor-pointer text-left ${
                  distanceLimit
                    ? 'bg-blue-50 ring-1 ring-blue-200'
                    : 'bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div
                  className="w-3 h-3 rounded-sm shrink-0 flex items-center justify-center"
                  style={{
                    backgroundColor: distanceLimit ? '#3b82f6' : '#e2e8f0',
                  }}
                >
                  {distanceLimit && (
                    <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={`text-[11px] ${distanceLimit ? 'text-blue-700 font-medium' : 'text-slate-400'}`}>
                  Only show within {activeRings.size > 0 ? `${Math.max(...activeRings)} mi` : 'ring'}
                </span>
              </button>
            </div>

            {/* Neighborhoods */}
            <div>
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Neighborhoods
                </span>
                {activeNeighborhoods.size > 0 && (
                  <span className="text-[10px] text-indigo-500 font-medium">
                    {activeNeighborhoods.size}/{NEIGHBORHOOD_NAMES.length}
                  </span>
                )}
              </div>
              <button
                onClick={onToggleAllNeighborhoods}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md transition-all cursor-pointer text-left ${
                  activeNeighborhoods.size > 0
                    ? 'bg-indigo-50 ring-1 ring-indigo-200'
                    : 'bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div
                  className="w-3 h-3 rounded-sm shrink-0 flex items-center justify-center"
                  style={{
                    backgroundColor: activeNeighborhoods.size > 0 ? '#6366f1' : '#e2e8f0',
                  }}
                >
                  {activeNeighborhoods.size > 0 && activeNeighborhoods.size < NEIGHBORHOOD_NAMES.length && (
                    <div className="w-1.5 h-0.5 bg-white rounded-full" />
                  )}
                  {activeNeighborhoods.size === NEIGHBORHOOD_NAMES.length && (
                    <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={`text-[11px] ${activeNeighborhoods.size > 0 ? 'text-indigo-700 font-medium' : 'text-slate-400'}`}>
                  {activeNeighborhoods.size > 0 ? 'Neighborhood boundaries' : 'Show neighborhood boundaries'}
                </span>
              </button>
              {activeNeighborhoods.size > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {NEIGHBORHOOD_NAMES.map(name => {
                    const active = activeNeighborhoods.has(name)
                    return (
                      <button
                        key={name}
                        onClick={() => onToggleNeighborhood(name)}
                        className={`text-[11px] px-2.5 py-1 rounded-full transition-all cursor-pointer font-medium ${
                          active
                            ? 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-300'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {name}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Demographics */}
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1">
                Demographics
              </div>
              <button
                onClick={onToggleDemographics}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md transition-all cursor-pointer text-left ${
                  showDemographics
                    ? 'bg-purple-50 ring-1 ring-purple-200'
                    : 'bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div
                  className="w-3 h-3 rounded-sm shrink-0 flex items-center justify-center"
                  style={{
                    backgroundColor: showDemographics ? '#7c3aed' : '#e2e8f0',
                  }}
                >
                  {showDemographics && (
                    <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={`text-[11px] ${showDemographics ? 'text-purple-700 font-medium' : 'text-slate-400'}`}>
                  {showDemographics ? 'Census tract data' : 'Show census tract data'}
                </span>
              </button>
              {showDemographics && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {DEMOGRAPHIC_METRICS.map(m => (
                    <button
                      key={m.key}
                      onClick={() => onDemographicMetricChange(m.key)}
                      className={`text-[11px] px-2.5 py-1 rounded-full transition-all cursor-pointer font-medium ${
                        demographicMetric === m.key
                          ? 'bg-purple-100 text-purple-700 ring-1 ring-purple-300'
                          : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </SidebarSection>

        {/* ── Section 4: Locations (default collapsed) ── */}
        {competitorsWithDistance.length > 0 && (
          <SidebarSection
            title={`Locations (${competitorsWithDistance.length})`}
            open={openSections.has('locations')}
            onToggle={() => toggleSection('locations')}
          >
            <div>
              <div className="flex items-center justify-end mb-3">
                <div className="flex gap-1">
                  <button
                    onClick={() => setSortBy('distance')}
                    className={`text-[10px] px-2 py-1 rounded cursor-pointer transition-colors ${
                      sortBy === 'distance'
                        ? 'bg-blue-100 text-blue-700 font-semibold'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Distance
                  </button>
                  <button
                    onClick={() => setSortBy('rating')}
                    className={`text-[10px] px-2 py-1 rounded cursor-pointer transition-colors ${
                      sortBy === 'rating'
                        ? 'bg-blue-100 text-blue-700 font-semibold'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Rating
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                {competitorsWithDistance.map((c, i) => (
                  <button
                    key={`${c.category}-${i}`}
                    onClick={() => onListItemClick(c)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100 transition-colors cursor-pointer text-left"
                  >
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: categoryColorMap[c.category] }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-slate-700 truncate">{c.name}</div>
                      <div className="text-xs text-slate-400 truncate">
                        {c.distance.toFixed(1)} mi &middot; {renderStars(c.rating)}
                        {c.reviewCount && ` (${c.reviewCount.toLocaleString()})`}
                      </div>
                    </div>
                    {c.onSite && (
                      <span className="text-[10px] text-blue-600 font-semibold uppercase shrink-0">
                        On-site
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </SidebarSection>
        )}

      </div>

      {/* Footer */}
      <div className="px-5 py-3 pb-6 md:pb-3 border-t border-slate-200 bg-slate-50">
        <p className="text-[10px] text-slate-400 text-center">
          Hyatt Members Club — Competitive Analysis &middot; {COMPETITORS.length} locations mapped
        </p>
      </div>
    </div>
  )
}
