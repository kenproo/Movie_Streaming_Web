import { useEffect, useState } from 'react'
import { commentService } from '../services/commentService'
import type { Comment } from '../types/comment'

export function useComments(movieId?: string) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = () => {
    if (movieId) {
      commentService
        .getCommentsByMovieId(movieId)
        .then((data) => setComments(data))
        .catch((err) => console.error(err))
    }
  }

  useEffect(() => {
    if (!movieId) {
      setComments([])
      setLoading(false)
      return
    }

    let active = true
    setLoading(true)

    commentService
      .getCommentsByMovieId(movieId)
      .then((data) => {
        if (active) setComments(data)
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [movieId])

  return { comments, loading, refresh }
}
