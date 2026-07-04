import { Link } from 'react-router-dom'
import { useUserActionModal } from '../../contexts/UserActionModalContext'

export function LoginPromptModal() {
  const { loginPromptOpen, closeLoginPrompt } = useUserActionModal()

  if (!loginPromptOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-[1.75rem] border border-white/10 bg-slate-950 p-6 shadow-2xl shadow-black/40">
        <h3 className="text-lg font-bold text-white">Cần đăng nhập</h3>
        <p className="mt-2 text-sm text-slate-300">Hãy đăng nhập để thêm phim vào yêu thích, theo dõi hoặc lưu lịch sử cá nhân.</p>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={closeLoginPrompt} className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white">
            Đóng
          </button>
          <Link to="/login" onClick={closeLoginPrompt} className="rounded-xl bg-lime-400 px-4 py-2 text-sm font-bold text-slate-950">
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  )
}
