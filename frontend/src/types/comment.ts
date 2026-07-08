export interface Comment {
  id: string
  movieId: string
  parentId?: string
  userId: string
  userName: string
  userAvatarUrl?: string
  content: string
  createdAt: string
  status: 'visible' | 'hidden'
  likes: number
  reports?: number
  reportReason?: string
}
