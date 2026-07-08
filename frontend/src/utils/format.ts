export function formatViews(views: number) {
  return new Intl.NumberFormat('vi-VN', { notation: 'compact' }).format(views)
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium' }).format(new Date(date))
}

export function formatRating(rating: number) {
  return rating > 0 ? rating.toFixed(1) : 'N/A'
}
