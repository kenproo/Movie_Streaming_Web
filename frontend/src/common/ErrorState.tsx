import { AlertTriangle, RefreshCw } from 'lucide-react'

type ErrorStateProps = {
  title?: string
  description?: string
  onRetry?: () => void
}

export function ErrorState({
  title = 'Không tải được dữ liệu',
  description = 'Đã có lỗi giả lập trong quá trình tải nội dung.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="rounded-3xl border border-red-400/20 bg-red-500/10 p-6 text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/15 text-red-200">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <h3 className="text-lg font-bold text-white">{title}</h3>
      <p className="mt-2 text-sm text-red-100/80">{description}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
        >
          <RefreshCw className="h-4 w-4" />
          Tải lại
        </button>
      ) : null}
    </div>
  )
}
