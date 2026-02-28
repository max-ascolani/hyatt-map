import { useState } from 'react'
import { SUPER_CATEGORIES, COMPETITORS, type CategoryId, type SuperCategoryId, type CuisineTag, type Competitor, type PriceTier, type DayOfWeek } from '../data/competitors'
import TimeSlider from './TimeSlider'

interface SidebarProps {
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
}

function renderStars(rating: number | null): string {
  if (rating === null) return '\u2014'
  return `${'★'.repeat(Math.floor(rating))}${rating % 1 >= 0.5 ? '½' : ''} ${rating}`
}

export default function Sidebar({
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
}: SidebarProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<SuperCategoryId>>(new Set())

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

  return (
    <div className="w-[380px] min-w-[380px] bg-white border-r border-slate-200 flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full bg-blue-600" />
          <h2 className="text-sm font-semibold text-slate-800 tracking-wide uppercase">Filters</h2>
        </div>
        <p className="text-xs text-slate-400">Toggle categories to explore the competitive landscape</p>
      </div>

      <div className="flex-1 overflow-y-auto sidebar-scroll">
        {/* Category Filters */}
        <div className="px-5 py-4 space-y-1">
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

          {/* Price tier filter */}
          <div className="pt-2 border-t border-slate-200 mt-3">
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

          {/* Cuisine tag filter — visible when any dining sub-category is active */}
          {anyDiningActive && (
            <div className="pt-2 border-t border-slate-200 mt-3">
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

          {/* Map controls */}
          <div className="pt-2 border-t border-slate-200 mt-4">
            {/* Distance rings — individual toggles */}
            <div className="px-1 mb-3">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
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
              {/* Limit to ring option */}
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
        </div>

        {/* Location List */}
        {competitorsWithDistance.length > 0 && (
          <div className="px-5 py-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Locations ({competitorsWithDistance.length})
              </h3>
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
        )}

      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-slate-200 bg-slate-50">
        <p className="text-[10px] text-slate-400 text-center">
          Hyatt Members Club — Competitive Analysis &middot; {COMPETITORS.length} locations mapped
        </p>
      </div>
    </div>
  )
}
