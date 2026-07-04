import type { RouteObject } from 'react-router-dom'
import { MainLayout } from '../layouts/MainLayout'
import { HomePage } from '../pages/HomePage'
import { MoviesPage } from '../pages/MoviesPage'
import { SingleMoviesPage } from '../pages/SingleMoviesPage'
import { SeriesMoviesPage } from '../pages/SeriesMoviesPage'
import { AnimePage } from '../pages/AnimePage'
import { SearchPage } from '../pages/SearchPage'
import { MovieDetailPage } from '../pages/MovieDetailPage'
import { WatchPage } from '../pages/WatchPage'
import { LoginPage } from '../pages/LoginPage'
import { RegisterPage } from '../pages/RegisterPage'
import { ProfilePage } from '../pages/ProfilePage'
import { ForbiddenPage } from '../pages/ForbiddenPage'
import { AdminRoute } from './AdminRoute'
import { ProtectedRoute } from './ProtectedRoute'
import { AdminLayout } from '../layouts/AdminLayout'
import { AdminDashboardPage } from '../admin/AdminDashboardPage'
import { AdminMoviesPage } from '../admin/AdminMoviesPage'
import { AdminMovieCreatePage } from '../admin/AdminMovieCreatePage'
import { AdminMovieEditPage } from '../admin/AdminMovieEditPage'
import { AdminCommentsPage } from '../admin/AdminCommentsPage'
import { AdminUsersPage } from '../admin/AdminUsersPage'
import { AdminAnalyticsPage } from '../admin/AdminAnalyticsPage'
import { AdminReportsPage } from '../admin/AdminReportsPage'

export const routesConfig: RouteObject[] = [
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/movies', element: <MoviesPage /> },
      { path: '/movies/single', element: <SingleMoviesPage /> },
      { path: '/movies/series', element: <SeriesMoviesPage /> },
      { path: '/movies/anime', element: <AnimePage /> },
      { path: '/search', element: <SearchPage /> },
      { path: '/movie/:slug', element: <MovieDetailPage /> },
      { path: '/watch/:slug', element: <WatchPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      {
        element: <ProtectedRoute />,
        children: [{ path: '/profile', element: <ProfilePage /> }],
      },
      { path: '/403', element: <ForbiddenPage /> },
    ],
  },
  {
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: '/admin', element: <AdminDashboardPage /> },
          { path: '/admin/movies', element: <AdminMoviesPage /> },
          { path: '/admin/movies/create', element: <AdminMovieCreatePage /> },
          { path: '/admin/movies/edit/:id', element: <AdminMovieEditPage /> },
          { path: '/admin/comments', element: <AdminCommentsPage /> },
          { path: '/admin/reports', element: <AdminReportsPage /> },
          { path: '/admin/users', element: <AdminUsersPage /> },
          { path: '/admin/analytics', element: <AdminAnalyticsPage /> },
        ],
      },
    ],
  },
]
