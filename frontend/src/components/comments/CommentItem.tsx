import { Flag, Heart, MessageCircle, Pencil, Trash2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import type { Comment } from '../../types/comment'
import { formatDate } from '../../utils/format'
import { CommentForm } from './CommentForm'

type CommentItemProps = {
  comment: Comment
  replies: Comment[]
  onLike: (commentId: string) => void
  onUpdate: (commentId: string, content: string) => void
  onDelete: (commentId: string) => void
  onReply: (parentId: string, content: string) => void
  onReport: (commentId: string, reason: string) => void
}

export function CommentItem({ comment, replies, onLike, onUpdate, onDelete, onReply, onReport }: CommentItemProps) {
  const { currentUser, isAdmin } = useAuth()
  const [editing, setEditing] = useState(false)
  const [replying, setReplying] = useState(false)
  const [showReplies, setShowReplies] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const [content, setContent] = useState(comment.content)
  const [reportReason, setReportReason] = useState('Spam')
  const canManage = isAdmin || currentUser?.id === comment.userId

  const submitEdit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onUpdate(comment.id, content)
    setEditing(false)
  }

  const submitReport = () => {
    onReport(comment.id, reportReason)
    setReportOpen(false)
  }

  return (
    <article className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 sm:p-5">
      <div className="flex gap-3">
        <img
          src={comment.userAvatarUrl ?? 'https://placehold.co/120x120/0f172a/94a3b8?text=U'}
          alt={comment.userName}
          className="h-11 w-11 rounded-xl object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-white">{comment.userName}</p>
            <span className="text-xs text-slate-500">{formatDate(comment.createdAt)}</span>
            {comment.parentId ? <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-cyan-200">Reply</span> : null}
          </div>

          {editing ? (
            <form onSubmit={submitEdit} className="mt-3 space-y-3">
              <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                className="min-h-24 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300/60"
              />
              <div className="flex gap-2">
                <button type="submit" className="rounded-lg bg-cyan-300 px-3 py-2 text-xs font-bold text-slate-950">
                  Lưu
                </button>
                <button type="button" onClick={() => setEditing(false)} className="rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-white">
                  Hủy
                </button>
              </div>
            </form>
          ) : (
            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-300">{comment.content}</p>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onLike(comment.id)}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-white/10"
            >
              <Heart className="h-3.5 w-3.5" /> {comment.likes}
            </button>
            <button
              type="button"
              onClick={() => setReplying((value) => !value)}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-white/10"
            >
              <MessageCircle className="h-3.5 w-3.5" /> Trả lời
            </button>
            <button
              type="button"
              onClick={() => setReportOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-white/10"
            >
              <Flag className="h-3.5 w-3.5" /> Báo cáo
            </button>
            {canManage ? (
              <>
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-white/10"
                >
                  <Pencil className="h-3.5 w-3.5" /> Sửa
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(comment.id)}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-400/20 px-3 py-1.5 text-xs font-semibold text-red-200 transition hover:bg-red-500/10"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Xóa
                </button>
              </>
            ) : null}
          </div>

          {replying ? (
            <div className="mt-4 border-l-2 border-cyan-300/20 pl-4">
              <CommentForm
                placeholder="Viết phản hồi..."
                buttonLabel="Gửi phản hồi"
                onSubmit={(value) => {
                  onReply(comment.id, value)
                  setReplying(false)
                  setShowReplies(true)
                }}
              />
            </div>
          ) : null}

          {replies.length ? (
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setShowReplies((value) => !value)}
                className="text-sm font-semibold text-cyan-300 hover:text-cyan-200"
              >
                {showReplies ? 'Ẩn phản hồi' : `Xem phản hồi (${replies.length})`}
              </button>
              {showReplies ? (
                <div className="mt-3 space-y-3 border-l border-white/10 pl-4">
                  {replies.map((reply) => (
                    <article key={reply.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-white">{reply.userName}</p>
                        <span className="text-xs text-slate-500">{formatDate(reply.createdAt)}</span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-300">{reply.content}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => onLike(reply.id)}
                          className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-white/10"
                        >
                          <Heart className="h-3.5 w-3.5" /> {reply.likes}
                        </button>
                        {isAdmin || currentUser?.id === reply.userId ? (
                          <button
                            type="button"
                            onClick={() => onDelete(reply.id)}
                            className="inline-flex items-center gap-2 rounded-lg border border-red-400/20 px-3 py-1.5 text-xs font-semibold text-red-200 transition hover:bg-red-500/10"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Xóa
                          </button>
                        ) : null}
                      </div>
                    </article>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      {reportOpen ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-[1.75rem] border border-white/10 bg-slate-950 p-5 shadow-2xl shadow-black/40">
            <h3 className="text-lg font-bold text-white">Báo cáo bình luận</h3>
            <div className="mt-4 space-y-2">
              {['Spam', 'Ngôn từ không phù hợp', 'Spoil nội dung', 'Khác'].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setReportReason(option)}
                  className={[
                    'w-full rounded-xl border px-4 py-3 text-left text-sm transition',
                    reportReason === option
                      ? 'border-cyan-300/40 bg-cyan-300/10 text-cyan-100'
                      : 'border-white/10 bg-white/5 text-white hover:bg-white/10',
                  ].join(' ')}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setReportOpen(false)} className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white">
                Hủy
              </button>
              <button
                type="button"
                onClick={submitReport}
                className="rounded-xl bg-lime-400 px-4 py-2 text-sm font-bold text-slate-950"
              >
                Gửi báo cáo
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </article>
  )
}
