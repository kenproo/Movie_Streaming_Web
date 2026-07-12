import { useRoutes } from 'react-router-dom'
import { routesConfig } from './routesConfig'
import { NotFoundPage } from '../pages/NotFoundPage'

export function AppRoutes() {
  return useRoutes([...routesConfig, { path: '*', element: <NotFoundPage /> }])
}
