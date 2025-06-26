// Fluid-PWA Core Types for Offline Data Management

import { Table } from 'dexie'

/**
 * Sync status indicating the state of an offline item
 */
export type SyncStatus = 
  | 'NEW'              // Newly created, not yet attempted to sync
  | 'PENDING_CREATE'   // Needs to be created on server
  | 'PENDING_UPDATE'   // Needs to be updated on server
  | 'PENDING_DELETE'   // Needs to be deleted on server
  | 'SYNCED'          // Successfully synced with server
  | 'ERROR'           // Sync attempt failed

/**
 * Core structure for items managed by Fluid-PWA
 * All offline items should extend this interface
 */
export interface FluidItem {
  /** Client-generated unique ID (UUID) - primary key for offline items */
  localId: string
  
  /** Server ID once synced (optional until synced) */
  serverId?: string | number
  
  /** Current sync status */
  syncStatus: SyncStatus
  
  /** When this item was last modified offline */
  lastModifiedOffline: number
  
  /** User ID if data is user-specific (optional) */
  userId?: string
  
  /** Error message if sync failed (optional) */
  errorMessage?: string
  
  /** Number of sync attempts (for retry logic) */
  syncAttempts?: number
}

/**
 * Schema definition for a Dexie store
 */
export interface StoreSchema {
  [storeName: string]: string // Dexie schema string format
}

/**
 * Configuration for initializing Fluid-PWA database
 */
export interface FluidDexieConfig {
  /** Database name */
  dbName: string
  
  /** Database version */
  version: number
  
  /** Store schemas defined by the consuming application */
  stores: StoreSchema
  
  /** Optional upgrade function for schema migrations */
  upgrade?: (db: any, oldVersion: number, newVersion: number) => void
}

/**
 * Query options for getting items from stores
 */
export interface QueryOptions {
  /** Filter by user ID */
  userId?: string
  
  /** Filter by sync status */
  syncStatus?: SyncStatus | SyncStatus[]
  
  /** Limit number of results */
  limit?: number
  
  /** Offset for pagination */
  offset?: number
  
  /** Sort by field (ascending by default) */
  orderBy?: string
  
  /** Sort direction */
  reverse?: boolean
  
  /** Additional where clauses */
  where?: Record<string, any>
}

/**
 * Hooks configuration for pre/post operations
 */
export interface HooksConfig<T = any> {
  onBeforeAdd?: (item: T) => T | Promise<T>
  onAfterAdd?: (item: T, id: string) => void | Promise<void>
  onBeforeUpdate?: (updates: Partial<T>, item: T) => Partial<T> | Promise<Partial<T>>
  onAfterUpdate?: (item: T) => void | Promise<void>
  onBeforeDelete?: (item: T) => boolean | Promise<boolean>
  onAfterDelete?: (id: string) => void | Promise<void>
}

/**
 * Result type for operations that might fail
 */
export interface OperationResult<T = any> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Batch operation result
 */
export interface BatchOperationResult {
  successful: number
  failed: number
  errors: Array<{ id: string; error: string }>
}

/**
 * Type for Dexie table with FluidItem structure
 */
export type FluidTable<T extends FluidItem = FluidItem> = Table<T, string> 