type PaginationProps = {
  currentPage: number
  totalPages: number
  onPrev: () => void
  onNext: () => void
}

export function Pagination({ currentPage, totalPages, onPrev, onNext }: PaginationProps) {
  return (
    <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300 sm:flex-row">
      <button
        type="button"
        onClick={onPrev}
        disabled={currentPage <= 1}
        className="w-full rounded-xl border border-white/10 px-4 py-2 font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
      >
        Trang trước
      </button>
      <span>
        Trang <strong className="text-cyan-300">{currentPage}</strong> / {totalPages}
      </span>
      <button
        type="button"
        onClick={onNext}
        disabled={currentPage >= totalPages}
        className="w-full rounded-xl border border-white/10 px-4 py-2 font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
      >
        Trang sau
      </button>
    </div>
  )
}
