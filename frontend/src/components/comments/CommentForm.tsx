import { useState, type FormEvent } from 'react'

type CommentFormProps = {
  onSubmit: (content: string) => void
  placeholder?: string
  buttonLabel?: string
}

export function CommentForm({ onSubmit, placeholder = 'Viết bình luận của bạn...', buttonLabel = 'Gửi bình luận' }: CommentFormProps) {
  const [content, setContent] = useState('')

  const submitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit(content)
    setContent('')
  }

  return (
    <form onSubmit={submitForm} className="space-y-3">
      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder={placeholder}
        className="min-h-24 w-full resize-y rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/60"
        required
      />
      <button type="submit" className="rounded-xl bg-lime-400 px-5 py-3 text-sm font-bold text-slate-950 hover:brightness-110">
        {buttonLabel}
      </button>
    </form>
  )
}
