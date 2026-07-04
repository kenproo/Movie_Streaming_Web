import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

type UserActionModalContextValue = {
  loginPromptOpen: boolean
  openLoginPrompt: () => void
  closeLoginPrompt: () => void
}

const UserActionModalContext = createContext<UserActionModalContextValue | null>(null)

export function UserActionModalProvider({ children }: { children: ReactNode }) {
  const [loginPromptOpen, setLoginPromptOpen] = useState(false)

  const value = useMemo(
    () => ({
      loginPromptOpen,
      openLoginPrompt: () => setLoginPromptOpen(true),
      closeLoginPrompt: () => setLoginPromptOpen(false),
    }),
    [loginPromptOpen],
  )

  return <UserActionModalContext.Provider value={value}>{children}</UserActionModalContext.Provider>
}

export function useUserActionModal() {
  const context = useContext(UserActionModalContext)

  if (!context) {
    throw new Error('useUserActionModal must be used inside UserActionModalProvider')
  }

  return context
}
