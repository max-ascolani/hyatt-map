import type { DayOfWeek } from '../data/competitors'

interface TimeSliderProps {
  enabled: boolean
  onToggle: () => void
  selectedDays: Set<DayOfWeek>
  onDayToggle: (day: DayOfWeek) => void
  startHour: number
  endHour: number
  onStartHourChange: (hour: number) => void
  onEndHourChange: (hour: number) => void
}

const DAYS: { id: DayOfWeek; label: string }[] = [
  { id: 'mon', label: 'Mon' },
  { id: 'tue', label: 'Tue' },
  { id: 'wed', label: 'Wed' },
  { id: 'thu', label: 'Thu' },
  { id: 'fri', label: 'Fri' },
  { id: 'sat', label: 'Sat' },
  { id: 'sun', label: 'Sun' },
]

function formatHour(hour: number): string {
  if (hour === 0 || hour === 24) return '12am'
  if (hour === 12) return '12pm'
  if (hour < 12) return `${hour}am`
  return `${hour - 12}pm`
}

export default function TimeSlider({
  enabled,
  onToggle,
  selectedDays,
  onDayToggle,
  startHour,
  endHour,
  onStartHourChange,
  onEndHourChange,
}: TimeSliderProps) {
  const dayLabels = DAYS.filter(d => selectedDays.has(d.id)).map(d => d.label)
  const badgeText = dayLabels.length > 0
    ? `${dayLabels.join(', ')} ${formatHour(startHour)}–${formatHour(endHour)}`
    : 'No days selected'

  return (
    <div className="pt-2 border-t border-slate-200 mt-3">
      <button
        onClick={onToggle}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer text-left ${
          enabled
            ? 'bg-slate-100 ring-1 ring-slate-300'
            : 'bg-white hover:bg-slate-50'
        }`}
      >
        <div
          className="w-3.5 h-3.5 rounded-full shrink-0 flex items-center justify-center text-[8px] font-bold"
          style={{
            backgroundColor: enabled ? '#8b5cf6' : '#e2e8f0',
            color: enabled ? '#ffffff' : '#94a3b8',
          }}
        >
          T
        </div>
        <span className={`text-sm flex-1 ${enabled ? 'text-slate-800' : 'text-slate-400'}`}>
          Time Filter
        </span>
        {enabled && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 font-medium max-w-[160px] truncate">
            {badgeText}
          </span>
        )}
      </button>

      {enabled && (
        <div className="mt-3 px-1 space-y-3">
          {/* Day selector — multi-select */}
          <div className="flex gap-1">
            {DAYS.map(day => {
              const active = selectedDays.has(day.id)
              return (
                <button
                  key={day.id}
                  onClick={() => onDayToggle(day.id)}
                  className={`flex-1 text-[10px] py-1.5 rounded-md transition-all cursor-pointer font-medium ${
                    active
                      ? 'bg-violet-100 text-violet-700 ring-1 ring-violet-300'
                      : 'bg-slate-100 text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {day.label}
                </button>
              )
            })}
          </div>

          {/* Time range — two sliders */}
          <div className="space-y-2">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-slate-400">From</span>
                <span className="text-[11px] font-medium text-violet-700">{formatHour(startHour)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={24}
                step={1}
                value={startHour}
                onChange={e => {
                  const v = Number(e.target.value)
                  onStartHourChange(v)
                  if (v > endHour) onEndHourChange(v)
                }}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-slate-400">To</span>
                <span className="text-[11px] font-medium text-violet-700">{formatHour(endHour)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={24}
                step={1}
                value={endHour}
                onChange={e => {
                  const v = Number(e.target.value)
                  onEndHourChange(v)
                  if (v < startHour) onStartHourChange(v)
                }}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 px-0.5">
              <span>12am</span>
              <span>6am</span>
              <span>12pm</span>
              <span>6pm</span>
              <span>12am</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
