import { adminMovieService } from './adminMovieService'
import { analyticsService } from './analyticsService'
import { commentService } from './commentService'
import { reportService } from './reportService'
import { userService } from './userService'

export const adminService = {
  async getDashboardSummary() {
    const [stats, pendingReports] = await Promise.all([
      analyticsService.getDashboardStats(),
      reportService.getUnreadCount(),
    ])
    return {
      totalMovies: stats.totalMovies,
      totalViews: stats.totalViews,
      totalUsers: stats.totalUsers,
      totalComments: stats.totalComments,
      pendingReports,
    }
  },

  async getMovies() {
    return adminMovieService.getAdminMovies()
  },

  async getComments() {
    return commentService.getAllCommentsForAdmin()
  },

  async getReports() {
    return reportService.getReports()
  },

  async getUsers() {
    return userService.getUsers()
  },
}
