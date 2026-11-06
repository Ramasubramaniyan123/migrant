import connectionsSeed from '@/data/connections.json'
import type { Connection, ConnectionStatus, MatchReason } from '@/types/connection.types'
import { clone } from '@/utils/helpers'
import { mockResponse, nextId } from './api'

/**
 * In-memory connection store seeded from `src/data/connections.json`.
 * Kept module-scoped so screens stay in sync during a session.
 */
let connections: Connection[] = clone(connectionsSeed) as unknown as Connection[]

export const connectionService = {
  async getForUser(userId: number): Promise<Connection[]> {
    return mockResponse(
      connections.filter(
        (connection) => connection.requesterId === userId || connection.receiverId === userId,
      ),
    )
  },

  async getReceivedRequests(userId: number): Promise<Connection[]> {
    return mockResponse(
      connections.filter(
        (connection) => connection.receiverId === userId && connection.status === 'PENDING',
      ),
    )
  },

  async getSentRequests(userId: number): Promise<Connection[]> {
    return mockResponse(
      connections.filter(
        (connection) => connection.requesterId === userId && connection.status === 'PENDING',
      ),
    )
  },

  async getAccepted(userId: number): Promise<Connection[]> {
    return mockResponse(
      connections.filter(
        (connection) =>
          connection.status === 'ACCEPTED' &&
          (connection.requesterId === userId || connection.receiverId === userId),
      ),
    )
  },

  async sendRequest(
    requesterId: number,
    receiverId: number,
    matchScore: number,
    matchedBy: MatchReason,
  ): Promise<Connection> {
    const existing = connections.find(
      (connection) =>
        (connection.requesterId === requesterId && connection.receiverId === receiverId) ||
        (connection.requesterId === receiverId && connection.receiverId === requesterId),
    )
    if (existing) {
      existing.status = 'PENDING'
      existing.updatedAt = new Date().toISOString()
      return mockResponse(existing)
    }

    const now = new Date().toISOString()
    const created: Connection = {
      id: nextId(connections),
      requesterId,
      receiverId,
      status: 'PENDING',
      matchScore,
      matchedBy,
      createdAt: now,
      updatedAt: now,
    }
    connections = [...connections, created]
    return mockResponse(created)
  },

  async updateStatus(connectionId: number, status: ConnectionStatus): Promise<Connection> {
    const connection = connections.find((row) => row.id === connectionId)
    if (!connection) throw new Error(`Connection ${connectionId} not found`)
    connection.status = status
    connection.updatedAt = new Date().toISOString()
    return mockResponse(connection)
  },

  async acceptRequest(connectionId: number): Promise<Connection> {
    return this.updateStatus(connectionId, 'ACCEPTED')
  },

  async rejectRequest(connectionId: number): Promise<Connection> {
    return this.updateStatus(connectionId, 'REJECTED')
  },

  async cancelRequest(connectionId: number): Promise<Connection> {
    connections = connections.filter((row) => row.id !== connectionId)
    return mockResponse(undefined as unknown as Connection, 120)
  },

  async removeConnection(connectionId: number): Promise<void> {
    connections = connections.filter((row) => row.id !== connectionId)
    return mockResponse(undefined, 120)
  },

  /** Synchronous helper used by the connection context for badge states. */
  statusBetween(userA: number, userB: number): Connection | undefined {
    return connections.find(
      (connection) =>
        (connection.requesterId === userA && connection.receiverId === userB) ||
        (connection.requesterId === userB && connection.receiverId === userA),
    )
  },

  connectedUserIds(userId: number): number[] {
    return connections
      .filter(
        (connection) =>
          connection.status === 'ACCEPTED' &&
          (connection.requesterId === userId || connection.receiverId === userId),
      )
      .map((connection) =>
        connection.requesterId === userId ? connection.receiverId : connection.requesterId,
      )
  },
}
