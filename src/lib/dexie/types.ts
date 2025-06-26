// Core types for Fluid-PWA framework
import { Table } from 'dexie'

/**
 * Sync status for offline items
 */
export type SyncStatus = 
  | 'NEW'              // Newly created locally, not yet marked for sync
  | 'PENDING_CREATE'   // Created offline, waiting to be synced to server
  | 'PENDING_UPDATE'   // Updated offline, waiting to sync changes
  | 'PENDING_DELETE'   // Deleted offline, waiting to sync deletion
  | 'SYNCED'          // Successfully synced with server
  | 'ERROR'           // Error occurred during sync

/**
 * Base interface for all offline items managed by Fluid-PWA
 */
export interface OfflineItem {
  localId: string              // Client-generated UUID
  serverId?: string | number   // Server ID once synced
  syncStatus: SyncStatus
  lastModifiedOffline: number  // Timestamp
  userId?: string             // User-specific data
  errorMessage?: string       // Error details if syncStatus is 'ERROR'
}

/**
 * Schema definition for Dexie stores
 * Key = store name, Value = Dexie schema string
 */
export interface FluidPWASchema {
  [storeName: string]: string
}

/**
 * Configuration for initializing Fluid-PWA
 */
export interface FluidPWAConfig {
  databaseName: string
  schema: FluidPWASchema
  version?: number
  userId?: string
  enableLogging?: boolean
}

/**
 * Query options for retrieving items
 */
export interface QueryOptions {
  limit?: number
  offset?: number
  orderBy?: string
  reverse?: boolean
  filter?: (item: any) => boolean
}

/**
 * Options for CRUD operations
 */
export interface CRUDOptions {
  onBeforeAdd?: (item: any) => any | Promise<any>
  onAfterAdd?: (item: any, result: any) => void | Promise<void>
  onBeforeUpdate?: (item: any, updates: any) => any | Promise<any>
  onAfterUpdate?: (item: any, result: any) => void | Promise<void>
  onBeforeDelete?: (itemId: string) => boolean | Promise<boolean>
  onAfterDelete?: (itemId: string) => void | Promise<void>
}

/**
 * Result type for CRUD operations
 */
export interface CRUDResult<T = any> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Batch operation result
 */
export interface BatchResult {
  success: boolean
  processed: number
  errors: Array<{ item: any; error: string }>
}

/**
 * Sync queue item for service worker
 */
export interface SyncQueueItem extends OfflineItem {
  storeName: string
  operation: 'CREATE' | 'UPDATE' | 'DELETE'
  payload: any
  attempts: number
  lastAttempt?: number
}

/**
 * Type helper to ensure store items extend OfflineItem
 */
export type FluidStore<T> = T & OfflineItem

/**
 * Database instance type with typed tables
 */
export interface FluidDatabase {
  [storeName: string]: Table<any, string>
} 