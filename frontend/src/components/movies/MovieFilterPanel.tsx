import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ChevronDown, X } from 'lucide-react'
import type { MovieFilters } from '../../types/movie'

type FilterKey = keyof MovieFilters

type FilterOption = {
  label: string
  value: string
}

type FilterConfig = {
  key: FilterKey
  label: string
  options: FilterOption[]
}

export type MovieFilterPanelProps = {
  filters: MovieFilters
  onChange: (filters: MovieFilters) => void
  onClear: () => void
  variant?: 'all' | 'single' | 'series' | 'anime'
}

const allOption = { label: 'Tất cả', value: '' }

const genreOptions = [
  allOption,
  { label: 'Hành động', value: 'action' },
  { label: 'Tình cảm', value: 'romance' },
  { label: 'Hài hước', value: 'comedy' },
  { label: 'Kinh dị', value: 'horror' },
  { label: 'Viễn tưởng', value: 'sci-fi' },
  { label: 'Hoạt hình', value: 'animation' },
  { label: 'Tâm lý', value: 'drama' },
  { label: 'Phiêu lưu', value: 'adventure' },
  { label: 'Võ thuật', value: 'martial-arts' },
]

const countryOptions = [
  allOption,
  { label: 'Việt Nam', value: 'Vietnam' },
  { label: 'Hàn Quốc', value: 'Korea' },
  { label: 'Trung Quốc', value: 'China' },
  { label: 'Nhật Bản', value: 'Japan' },
  { label: 'Mỹ', value: 'USA' },
  { label: 'Thái Lan', value: 'Thailand' },
]

const yearOptions = [
  allOption,
  { label: '2026', value: '2026' },
  { label: '2025', value: '2025' },
  { label: '2024', value: '2024' },
  { label: '2023', value: '2023' },
  { label: '2022', value: '2022' },
  { label: '2021', value: '2021' },
  { label: 'Trước 2020', value: 'before-2020' },
]

const qualityOptions = [
  allOption,
  { label: 'HD', value: 'HD' },
  { label: 'FHD', value: 'FHD' },
  { label: '4K', value: '4K' },
  { label: 'Cam', value: 'CAM' },
]

const releaseStatusOptions = [
  allOption,
  { label: 'Hoàn thành', value: 'completed' },
  { label: 'Đang chiếu', value: 'ongoing' },
]

const sortOptions = [
  allOption,
  { label: 'Mới cập nhật', value: 'latest' },
  { label: 'Lượt xem', value: 'views-desc' },
  { label: 'Rating cao', value: 'rating-desc' },
  { label: 'Năm mới nhất', value: 'newest-year' },
]

const baseFilters: FilterConfig[] = [
  { key: 'genre', label: 'Thể loại', options: genreOptions },
  { key: 'country', label: 'Quốc gia', options: countryOptions },
  { key: 'year', label: 'Năm phát hành', options: yearOptions },
  { key: 'quality', label: 'Chất lượng', options: qualityOptions },
  { key: 'releaseStatus', label: 'Trạng thái', options: releaseStatusOptions },
  { key: 'sortBy', label: 'Sắp xếp', options: sortOptions },
]

const configsByVariant: Record<NonNullable<MovieFilterPanelProps['variant']>, FilterConfig[]> = {
  all: baseFilters,
  single: baseFilters,
  series: baseFilters,
  anime: baseFilters,
}

export function MovieFilterPanel({ filters, onChange, onClear, variant = 'all' }: MovieFilterPanelProps) {
  const [searchParams] = useSearchParams()
  const tab = searchParams.get('tab')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (tab === 'genre' || tab === 'country' || tab === 'schedule') {
      setOpen(true)
    }
  }, [tab])

  const configs = configsByVariant[variant]
  const activeEntries = Object.entries(filters).filter(([, value]) => Boolean(value)) as [FilterKey, string][]

  const updateFilter = (key: FilterKey, value: string) => {
    onChange({ ...filters, [key]: value || undefined })
  }

  const removeFilter = (key: FilterKey) => {
    const nextFilters = { ...filters }
    delete nextFilters[key]
    onChange(nextFilters)
  }

  return (
    <section className="app-muted-surface space-y-4 rounded-[1.5rem] border p-4 sm:p-5">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between text-left text-sm font-semibold text-app-primary md:hidden"
      >
        Bộ lọc phim
        <ChevronDown className={`h-5 w-5 transition ${open ? 'rotate-180' : ''}`} />
      </button>

      <div className={`${open ? 'grid animate-tab-in' : 'hidden'} gap-3 md:grid md:grid-cols-2 xl:grid-cols-3`}>
        {configs.map((config) => (
          <label key={config.key} className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-app-muted">{config.label}</span>
            <select
              value={filters[config.key] ?? ''}
              onChange={(event) => updateFilter(config.key, event.target.value)}
              className="w-full rounded-xl border bg-white/5 px-3 py-2.5 text-sm text-app-primary outline-none accent-ring focus:border-cyan-300/60"
            >
              {config.options.map((option) => (
                <option key={option.value || 'all'} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        ))}

        <div className="flex items-end gap-2 md:col-span-2 xl:col-span-3">
          <button
            type="button"
            onClick={onClear}
            className="rounded-xl border px-4 py-2.5 text-sm font-bold text-app-primary transition hover:bg-white/10 accent-ring"
          >
            Xóa bộ lọc
          </button>
        </div>
      </div>

      {activeEntries.length ? (
        <div className="flex flex-wrap gap-2">
          {activeEntries.map(([key, value]) => {
            const config = configs.find((item) => item.key === key)
            const label = key === 'keyword' ? value : config?.options.find((option) => option.value === value)?.label ?? value

            return (
              <button
                key={key}
                type="button"
                onClick={() => removeFilter(key)}
                className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-200"
              >
                {label}
                <X className="h-3 w-3" />
              </button>
            )
          })}
        </div>
      ) : null}
    </section>
  )
}
