import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { ChevronUp } from 'lucide-react'
import { LoginPromptModal } from '../components/common/LoginPromptModal'
import { ChatbotWidget } from '../components/chatbot/ChatbotWidget'
import { Footer } from './Footer'
import { Header } from './Header'


export function MainLayout() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true)
      } else {
        setShowScrollTop(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app-shell relative">
      <Header />
      <main className="animate-page-in mx-auto w-full max-w-7xl px-4 pb-14 pt-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <Footer />
      <LoginPromptModal />

      {/* Floating Back to Top Button - đặt bên trái chatbot button để không chồng lên nhau */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-24 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500 text-white shadow-lg shadow-cyan-500/30 hover:bg-cyan-400 hover:shadow-cyan-400/40 border border-white/15 transition-all duration-300 active:scale-95 cursor-pointer ${
          showScrollTop
            ? 'opacity-100 translate-y-0 pointer-events-auto scale-100'
            : 'opacity-0 translate-y-4 pointer-events-none scale-75'
        }`}
        aria-label="Cuộn lên đầu trang"
      >
        <ChevronUp className="h-6 w-6" />
      </button>

      {/* ChillFilm AI Chatbot Widget */}
      <ChatbotWidget />
    </div>
  )
}
