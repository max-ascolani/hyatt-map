import { useState } from 'react'
import { SUPER_CATEGORIES, type CategoryId, type SuperCategoryId } from '../data/competitors'

interface Props {
  activeCategories: Set<CategoryId>
  highlightedCategory: CategoryId | SuperCategoryId | null
  onHighlight: (id: CategoryId | SuperCategoryId | null) => void
}

export default function CategoryLegend({ activeCategories, highlightedCategory, onHighlight }: Props) {
  const [visible, setVisible] = useState(true)

  const activeSuperCategories = SUPER_CATEGORIES.filter(sc =>
    sc.children.some(c => activeCategories.has(c.id))
  )

  if (activeSuperCategories.length === 0) return null

  if (!visible) {
    return (
      <button
        onClick={() => setVisible(true)}
        className="category-legend-collapsed"
      >
        Legend
      </button>
    )
  }

  const highlightedSuperCat = highlightedCategory
    ? SUPER_CATEGORIES.find(sc => sc.id === highlightedCategory || sc.children.some(c => c.id === highlightedCategory))?.id ?? null
    : null

  return (
    <div className="category-legend">
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>Legend</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {highlightedCategory && (
            <span
              onClick={() => onHighlight(null)}
              style={{ fontSize: 12, color: '#94a3b8', cursor: 'pointer' }}
            >
              Clear highlight
            </span>
          )}
          <button
            onClick={() => setVisible(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 16, lineHeight: 1, padding: 0 }}
          >
            &times;
          </button>
        </div>
      </div>

      {/* Horizontal super-category columns */}
      <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
        {activeSuperCategories.map(sc => {
          const activeChildren = sc.children.filter(c => activeCategories.has(c.id))
          const isSuperHighlighted = highlightedCategory === sc.id
          const isSuperDimmed = highlightedCategory !== null && highlightedSuperCat !== sc.id

          return (
            <div key={sc.id} style={{ minWidth: 0 }}>
              {/* Super-category header */}
              <div
                onClick={() => onHighlight(highlightedCategory === sc.id ? null : sc.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 14,
                  color: isSuperDimmed ? '#b0b8c4' : '#334155',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '2px 5px',
                  margin: '-2px -5px',
                  borderRadius: 5,
                  backgroundColor: isSuperHighlighted ? '#f1f5f9' : 'transparent',
                  transition: 'all 0.15s ease',
                  marginBottom: 3,
                }}
              >
                <div style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: isSuperDimmed ? '#cbd5e1' : sc.color,
                  flexShrink: 0,
                  transition: 'background-color 0.15s ease',
                }} />
                <span style={{ whiteSpace: 'nowrap' }}>{sc.label}</span>
              </div>

              {/* Sub-categories */}
              {activeChildren.map(cat => {
                const isSubHighlighted = highlightedCategory === cat.id
                const isSubDimmed = highlightedCategory !== null && highlightedCategory !== cat.id && highlightedCategory !== sc.id

                return (
                  <div
                    key={cat.id}
                    onClick={() => onHighlight(highlightedCategory === cat.id ? null : cat.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 12,
                      color: isSubDimmed ? '#b0b8c4' : '#64748b',
                      cursor: 'pointer',
                      padding: '1px 5px',
                      margin: '1px -5px 0',
                      borderRadius: 4,
                      backgroundColor: isSubHighlighted ? '#f1f5f9' : 'transparent',
                      transition: 'all 0.15s ease',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <div style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: isSubDimmed ? '#cbd5e1' : cat.color,
                      flexShrink: 0,
                      transition: 'background-color 0.15s ease',
                    }} />
                    <span>{cat.label}</span>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
