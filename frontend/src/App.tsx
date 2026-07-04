import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from './contexts/AppContext'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { UserActionModalProvider } from './contexts/UserActionModalContext'
import { AppRoutes } from './routes/AppRoutes'

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <AuthProvider>
          <UserActionModalProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </UserActionModalProvider>
        </AuthProvider>
      </AppProvider>
    </ThemeProvider>
  )
}

export default App
