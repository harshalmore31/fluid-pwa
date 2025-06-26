// Core database initialization for Fluid-PWA
import Dexie, { Table } from 'dexie'
import { v4 as uuidv4 } from 'uuid'
import { FluidPWAConfig, FluidDatabase, OfflineItem, SyncStatus } from './types'

/**
 * Fluid-PWA Database class extending Dexie
 */
export class FluidPWADatabase extends Dexie {
  private config: FluidPWAConfig
  private isInitialized = false

  constructor(config: FluidPWAConfig) {
    super(config.databaseName)
    this.config = config
    this.setupDatabase()
  }

  private setupDatabase() {
    const version = this.config.version || 1
    
    // Set up the schema
    this.version(version).stores(this.config.schema)

    // Set up hooks for automatic field population
    this.setupHooks()

    // Mark as initialized
    this.isInitialized = true

    if (this.config.enableLogging) {
      console.log(`Fluid-PWA: Database "${this.config.databaseName}" initialized with schema:`, this.config.schema)
    }
  }

  private setupHooks() {
    // Hook into all tables to automatically set required fields
    Object.keys(this.config.schema).forEach(storeName => {
      const table = (this as any)[storeName] as Table<any, string>
      
      if (table) {
        // Before creating items, ensure required fields are set
        table.hook('creating', (primKey, obj, trans) => {
          this.populateOfflineFields(obj, 'NEW')
        })

        // Before updating items, update lastModifiedOffline
        table.hook('updating', (modifications: any, primKey, obj, trans) => {
          if (!modifications.lastModifiedOffline) {
            modifications.lastModifiedOffline = Date.now()
          }
          
          // Update sync status if not explicitly set
          if (!modifications.syncStatus && obj.syncStatus === 'SYNCED') {
            modifications.syncStatus = 'PENDING_UPDATE'
          }
        })
      }
    })
  }

  /**
   * Populate required offline fields for new items
   */
  private populateOfflineFields(item: any, syncStatus: SyncStatus) {
    if (!item.localId) {
      item.localId = uuidv4()
    }
    
    if (!item.syncStatus) {
      item.syncStatus = syncStatus
    }
    
    if (!item.lastModifiedOffline) {
      item.lastModifiedOffline = Date.now()
    }
    
    if (this.config.userId && !item.userId) {
      item.userId = this.config.userId
    }
  }

  /**
   * Get all stores defined in the schema
   */
  getStoreNames(): string[] {
    return Object.keys(this.config.schema)
  }

  /**
   * Get a table by name with type safety
   */
  getTable<T = any>(storeName: string): Table<T & OfflineItem, string> {
    const table = (this as any)[storeName] as Table<T & OfflineItem, string>
    if (!table) {
      throw new Error(`Store "${storeName}" not found in database schema`)
    }
    return table
  }

  /**
   * Check if database is properly initialized
   */
  isReady(): boolean {
    return this.isInitialized && this.isOpen()
  }

  /**
   * Get configuration
   */
  getConfig(): FluidPWAConfig {
    return { ...this.config }
  }

  /**
   * Create a new item with proper offline fields
   */
  async createItem<T>(storeName: string, payload: Partial<T>, syncStatus: SyncStatus = 'PENDING_CREATE'): Promise<string> {
    const table = this.getTable<T>(storeName)
    const item = {
      ...payload,
      localId: uuidv4(),
      syncStatus,
      lastModifiedOffline: Date.now(),
      ...(this.config.userId && { userId: this.config.userId })
    }
    
    await table.add(item as any)
    return item.localId
  }

  /**
   * Update an item and mark for sync
   */
  async updateItem<T>(storeName: string, localId: string, updates: Partial<T>): Promise<number> {
    const table = this.getTable<T>(storeName)
    const item = await table.get(localId)
    
    if (!item) {
      throw new Error(`Item with localId "${localId}" not found in store "${storeName}"`)
    }

    const updateData: any = {
      ...updates,
      lastModifiedOffline: Date.now(),
      syncStatus: item.syncStatus === 'SYNCED' ? 'PENDING_UPDATE' as SyncStatus : item.syncStatus
    }

    return table.update(localId, updateData)
  }

  /**
   * Delete an item (soft delete with sync status)
   */
  async deleteItem(storeName: string, localId: string): Promise<void> {
    const table = this.getTable(storeName)
    const item = await table.get(localId)
    
    if (!item) {
      throw new Error(`Item with localId "${localId}" not found in store "${storeName}"`)
    }

    // If item was never synced, we can hard delete
    if (item.syncStatus === 'NEW' || item.syncStatus === 'PENDING_CREATE') {
      await table.delete(localId)
    } else {
      // Soft delete - mark for deletion sync
      await table.update(localId, {
        syncStatus: 'PENDING_DELETE' as SyncStatus,
        lastModifiedOffline: Date.now()
      })
    }
  }

  /**
   * Get items by sync status
   */
  async getItemsBySyncStatus(storeName: string, syncStatus: SyncStatus | SyncStatus[]): Promise<any[]> {
    const table = this.getTable(storeName)
    const statuses = Array.isArray(syncStatus) ? syncStatus : [syncStatus]
    
    return table.where('syncStatus').anyOf(statuses).toArray()
  }

  /**
   * Get all pending items across all stores (for sync queue)
   */
  async getAllPendingItems(): Promise<any[]> {
    const pendingStatuses: SyncStatus[] = ['PENDING_CREATE', 'PENDING_UPDATE', 'PENDING_DELETE']
    const allPending: any[] = []
    
    for (const storeName of this.getStoreNames()) {
      const items = await this.getItemsBySyncStatus(storeName, pendingStatuses)
      items.forEach(item => {
        allPending.push({
          ...item,
          storeName
        })
      })
    }
    
    return allPending
  }
}

// Singleton instance
let dbInstance: FluidPWADatabase | null = null

/**
 * Initialize the Fluid-PWA database
 */
export function initializeFluidPWA(config: FluidPWAConfig): FluidPWADatabase {
  if (dbInstance) {
    console.warn('Fluid-PWA: Database already initialized. Returning existing instance.')
    return dbInstance
  }

  dbInstance = new FluidPWADatabase(config)
  return dbInstance
}

/**
 * Get the current database instance
 */
export function getFluidPWADatabase(): FluidPWADatabase {
  if (!dbInstance) {
    throw new Error('Fluid-PWA: Database not initialized. Call initializeFluidPWA() first.')
  }
  return dbInstance
}

/**
 * Check if database is initialized
 */
export function isFluidPWAInitialized(): boolean {
  return dbInstance !== null && dbInstance.isReady()
} 