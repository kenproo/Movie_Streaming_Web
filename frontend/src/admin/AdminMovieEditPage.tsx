import { useParams } from 'react-router-dom'
import { PageShell } from '../pages/PageShell'

export function AdminMovieEditPage() {
  const { id } = useParams()
  return <PageShell title="Sửa phim" description={id ? `ID: ${id}` : 'Trang sửa phim tạm thời.'} />
}
