import connectionsSeed from '@/data/connections.json';
import { clone } from '@/utils/helpers';
import { mockResponse, nextId } from './api';

/**
 * In-memory connection store seeded from `src/data/connections.json`.
 * Kept module-scoped so screens stay in sync during a session.
 */
let connections = clone(connectionsSeed);
export const connectionService = {
  async getForUser(userId) {
    return mockResponse(connections.filter(connection => connection.requesterId === userId || connection.receiverId === userId));
  },
  async getReceivedRequests(userId) {
    return mockResponse(connections.filter(connection => connection.receiverId === userId && connection.status === 'PENDING'));
  },
  async getSentRequests(userId) {
    return mockResponse(connections.filter(connection => connection.requesterId === userId && connection.status === 'PENDING'));
  },
  async getAccepted(userId) {
    return mockResponse(connections.filter(connection => connection.status === 'ACCEPTED' && (connection.requesterId === userId || connection.receiverId === userId)));
  },
  async sendRequest(requesterId, receiverId, matchScore, matchedBy) {
    const existing = connections.find(connection => connection.requesterId === requesterId && connection.receiverId === receiverId || connection.requesterId === receiverId && connection.receiverId === requesterId);
    if (existing) {
      existing.status = 'PENDING';
      existing.updatedAt = new Date().toISOString();
      return mockResponse(existing);
    }
    const now = new Date().toISOString();
    const created = {
      id: nextId(connections),
      requesterId,
      receiverId,
      status: 'PENDING',
      matchScore,
      matchedBy,
      createdAt: now,
      updatedAt: now
    };
    connections = [...connections, created];
    return mockResponse(created);
  },
  async updateStatus(connectionId, status) {
    const connection = connections.find(row => row.id === connectionId);
    if (!connection) throw new Error(`Connection ${connectionId} not found`);
    connection.status = status;
    connection.updatedAt = new Date().toISOString();
    return mockResponse(connection);
  },
  async acceptRequest(connectionId) {
    return this.updateStatus(connectionId, 'ACCEPTED');
  },
  async rejectRequest(connectionId) {
    return this.updateStatus(connectionId, 'REJECTED');
  },
  async cancelRequest(connectionId) {
    connections = connections.filter(row => row.id !== connectionId);
    return mockResponse(undefined, 120);
  },
  async removeConnection(connectionId) {
    connections = connections.filter(row => row.id !== connectionId);
    return mockResponse(undefined, 120);
  },
  /** Synchronous helper used by the connection context for badge states. */
  statusBetween(userA, userB) {
    return connections.find(connection => connection.requesterId === userA && connection.receiverId === userB || connection.requesterId === userB && connection.receiverId === userA);
  },
  connectedUserIds(userId) {
    return connections.filter(connection => connection.status === 'ACCEPTED' && (connection.requesterId === userId || connection.receiverId === userId)).map(connection => connection.requesterId === userId ? connection.receiverId : connection.requesterId);
  }
};
