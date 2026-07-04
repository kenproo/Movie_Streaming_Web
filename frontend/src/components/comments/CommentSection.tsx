import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useUserActionModal } from '../../contexts/UserActionModalContext'
import { useLoadMore } from '../../hooks/useLoadMore'
import { commentService } from '../../services/commentService'
import type { Comment } from '../../types/comment'
import { CommentForm } from './CommentForm'
import { CommentItem } from './CommentItem'
import { LoadMoreButton } from './LoadMoreButton'

type CommentSectionProps = {
  movieId: string
}

export function CommentSection({ movieId }: CommentSectionProps) {
  const { currentUser, isAuthenticated } = useAuth()
  const { openLoginPrompt } = useUserActionModal()
  const [comments, setComments] = useState<Comment[]>([])
  const [error, setError] = useState('')
  const loadMore = useLoadMore(comments, 5, 5)

  const refreshComments = () => {
    commentService
      .getCommentsByMovieId(movieId)
      .then((data) => setComments(data))
      .catch((err) => setError(err instanceof Error ? err.message : 'Không tải được bình luận.'))
  }

  useEffect(() => {
    refreshComments()
    loadMore.reset()
  }, [movieId])

  const parentComments = useMemo(() => comments.filter((comment) => !comment.parentId), [comments])
  const repliesByParent = useMemo(() => {
    const map = new Map<string, Comment[]>()
    comments
      .filter((comment) => comment.parentId)
      .forEach((reply) => {
        const list = map.get(reply.parentId!) ?? []
        map.set(reply.parentId!, [...list, reply])
      })
    return map
  }, [comments])

  const runAction = async (action: () => Promise<any> | void) => {
    setError('')
    try {
      await action()
      refreshComments()
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Có lỗi xảy ra.')
    }
  }

  const requireLogin = () => {
    if (!isAuthenticated) {
      openLoginPrompt()
      return true
    }
    return false
  }

  return (
    <section className="space-y-5 rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-4 sm:p-6">
      <div>
        <h2 className="text-xl font-bold text-white sm:text-2xl">Bình luận</h2>
        <p className="mt-1 text-sm text-slate-400">
          Đang hiển thị {loadMore.visibleCount} / {parentComments.length} bình luận
        </p>
      </div>

      {isAuthenticated ? (
        <CommentForm onSubmit={(content) => runAction(() => commentService.createComment(movieId, content, currentUser))} />
      ) : (
        <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm text-cyan-100">
          Vui lòng <Link to="/login" className="font-bold underline">đăng nhập</Link> để bình luận.
        </div>
      )}

      {error ? <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p> : null}

      <div className="space-y-3">
        {loadMore.visibleItems.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            replies={repliesByParent.get(comment.id) ?? []}
            onLike={(commentId) => {
              if (requireLogin()) return
              runAction(() => commentService.likeComment(commentId))
            }}
            onUpdate={(commentId, content) => runAction(() => commentService.updateComment(commentId, content, currentUser))}
            onDelete={(commentId) => runAction(() => commentService.deleteComment(commentId, currentUser))}
            onReply={(parentId, content) => runAction(() => commentService.createComment(movieId, content, currentUser, parentId))}
            onReport={(commentId, reason) => {
              if (requireLogin()) return
              runAction(() => commentService.reportComment(commentId, reason, currentUser))
            }}
          />
        ))}
      </div>

      {loadMore.hasMore ? <LoadMoreButton onClick={loadMore.loadMore} /> : null}
    </section>
  )
}
