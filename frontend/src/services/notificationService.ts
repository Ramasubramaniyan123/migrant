import notificationsSeed from '@/data/notifications.json'
import type { AppNotification } from '@/types/notification.types'
import { clone } from '@/utils/helpers'
import { mockResponse } from './api'

let notifications: AppNotification[] = clone(notificationsSeed) as unknown as AppNotification[]

export const notificationService = {
  async getForUser(userId: number): Promise<AppNotification[]> {
    const rows = notifications
      .filter((notification) => notification.userId === userId)
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    return mockResponse(rows)
  },

  async markRead(id: number): Promise<AppNotification | undefined> {
    const notification = notifications.find((row) => row.id === id)
    if (notification) notification.isRead = true
    return mockResponse(notification, 60)
  },

  async markAllRead(userId: number): Promise<AppNotification[]> {
    notifications = notifications.map((notification) =>
      notification.userId === userId ? { ...notification, isRead: true } : notification,
    )
    return mockResponse(notifications.filter((row) => row.userId === userId), 80)
  },

  async clear(userId: number): Promise<void> {
    notifications = notifications.filter((notification) => notification.userId !== userId)
    return mockResponse(undefined, 80)
  },
}
