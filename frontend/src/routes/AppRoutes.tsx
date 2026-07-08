import { Navigate, useRoutes } from 'react-router-dom'
import { routesConfig } from './routesConfig'

export function AppRoutes() {
  return useRoutes([...routesConfig, { path: '*', element: <Navigate to="/" replace /> }])
}
