type LoadMoreButtonProps = {
  onClick: () => void
}

export function LoadMoreButton({ onClick }: LoadMoreButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/10"
    >
      Xem thêm bình luận
    </button>
  )
}
