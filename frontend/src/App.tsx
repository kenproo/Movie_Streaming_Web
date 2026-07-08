import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from './contexts/AppContext'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { UserActionModalProvider } from './contexts/UserActionModalContext'
import { LibraryProvider } from './contexts/LibraryContext'
import { AppRoutes } from './routes/AppRoutes'
import { ScrollToTop } from './components/common/ScrollToTop'

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <AuthProvider>
          <UserActionModalProvider>
            <LibraryProvider>
              <BrowserRouter>
                <ScrollToTop />
                <AppRoutes />
              </BrowserRouter>
            </LibraryProvider>
          </UserActionModalProvider>
        </AuthProvider>
      </AppProvider>
    </ThemeProvider>
  )
}

export default App
