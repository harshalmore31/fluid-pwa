// React hooks for Fluid-PWA CRUD operations
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { getFluidPWADatabase } from './database'
import { CRUDOptions, CRUDResult, QueryOptions, SyncStatus, OfflineItem } from './types'

/**
 * Hook to add items to a store
 */
export function useAddItem<T = any>(
  storeName: string, 
  options: CRUDOptions = {}
): (payload: Partial<T>, syncStatus?: SyncStatus) => Promise<CRUDResult<string>> {
  const db = getFluidPWADatabase()

  return useCallback(async (payload: Partial<T>, syncStatus: SyncStatus = 'PENDING_CREATE'): Promise<CRUDResult<string>> => {
    try {
      // Call before hook if provided
      let processedPayload = payload
      if (options.onBeforeAdd) {
        processedPayload = await options.onBeforeAdd(payload)
      }

      const localId = await db.createItem<T>(storeName, processedPayload, syncStatus)

      // Call after hook if provided
      if (options.onAfterAdd) {
        await options.onAfterAdd(processedPayload, localId)
      }

      return { success: true, data: localId }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }
    }
  }, [db, storeName, options])
}

/**
 * Hook to get a single item by localId
 */
export function useGetItem<T = any>(
  storeName: string, 
  localId?: string
): T & OfflineItem | undefined {
  return useLiveQuery(
    async () => {
      if (!localId) return undefined
      const db = getFluidPWADatabase()
      const table = db.getTable<T>(storeName)
      return table.get(localId)
    },
    [storeName, localId]
  )
}

/**
 * Hook to get all items from a store with optional filtering
 */
export function useGetAllItems<T = any>(
  storeName: string,
  queryOptions: QueryOptions = {}
): (T & OfflineItem)[] | undefined {
  return useLiveQuery(
    async () => {
      const db = getFluidPWADatabase()
      const table = db.getTable<T>(storeName)
      let query = table.toCollection()

      // Apply ordering
      if (queryOptions.orderBy) {
        query = table.orderBy(queryOptions.orderBy)
        if (queryOptions.reverse) {
          query = query.reverse()
        }
      }

      // Apply offset and limit
      if (queryOptions.offset) {
        query = query.offset(queryOptions.offset)
      }
      if (queryOptions.limit) {
        query = query.limit(queryOptions.limit)
      }

      let results = await query.toArray()

      // Apply filter if provided
      if (queryOptions.filter) {
        results = results.filter(queryOptions.filter)
      }

      return results
    },
    [storeName, queryOptions.orderBy, queryOptions.reverse, queryOptions.offset, queryOptions.limit]
  )
}

/**
 * Hook to update items
 */
export function useUpdateItem<T = any>(
  storeName: string,
  options: CRUDOptions = {}
): (localId: string, updates: Partial<T>) => Promise<CRUDResult<number>> {
  const db = getFluidPWADatabase()

  return useCallback(async (localId: string, updates: Partial<T>): Promise<CRUDResult<number>> => {
    try {
      // Call before hook if provided
      let processedUpdates = updates
      if (options.onBeforeUpdate) {
        const existingItem = await db.getTable<T>(storeName).get(localId)
        processedUpdates = await options.onBeforeUpdate(existingItem, updates)
      }

      const result = await db.updateItem<T>(storeName, localId, processedUpdates)

      // Call after hook if provided
      if (options.onAfterUpdate) {
        const updatedItem = await db.getTable<T>(storeName).get(localId)
        await options.onAfterUpdate(updatedItem, result)
      }

      return { success: true, data: result }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }
    }
  }, [db, storeName, options])
}

/**
 * Hook to delete items
 */
export function useDeleteItem(
  storeName: string,
  options: CRUDOptions = {}
): (localId: string) => Promise<CRUDResult<void>> {
  const db = getFluidPWADatabase()

  return useCallback(async (localId: string): Promise<CRUDResult<void>> => {
    try {
      // Call before hook if provided
      if (options.onBeforeDelete) {
        const shouldDelete = await options.onBeforeDelete(localId)
        if (!shouldDelete) {
          return { success: false, error: 'Delete operation cancelled by before hook' }
        }
      }

      await db.deleteItem(storeName, localId)

      // Call after hook if provided
      if (options.onAfterDelete) {
        await options.onAfterDelete(localId)
      }

      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }
    }
  }, [db, storeName, options])
}

/**
 * Hook to get items by sync status
 */
export function useGetItemsBySyncStatus<T = any>(
  storeName: string,
  syncStatus: SyncStatus | SyncStatus[]
): (T & OfflineItem)[] | undefined {
  return useLiveQuery(
    async () => {
      const db = getFluidPWADatabase()
      return db.getItemsBySyncStatus(storeName, syncStatus)
    },
    [storeName, syncStatus]
  )
}

/**
 * Hook to get pending items (items that need to be synced)
 */
export function useGetPendingItems<T = any>(
  storeName: string
): (T & OfflineItem)[] | undefined {
  const pendingStatuses: SyncStatus[] = ['PENDING_CREATE', 'PENDING_UPDATE', 'PENDING_DELETE']
  return useGetItemsBySyncStatus<T>(storeName, pendingStatuses)
}

/**
 * Hook to get all pending items across all stores
 */
export function useGetAllPendingItems(): any[] | undefined {
  return useLiveQuery(
    async () => {
      const db = getFluidPWADatabase()
      return db.getAllPendingItems()
    },
    []
  )
}

/**
 * Hook to get database statistics
 */
export function useFluidPWAStats() {
  return useLiveQuery(
    async () => {
      const db = getFluidPWADatabase()
      const stats: Record<string, any> = {}
      
      for (const storeName of db.getStoreNames()) {
        const table = db.getTable(storeName)
        const total = await table.count()
        const pending = await db.getItemsBySyncStatus(storeName, ['PENDING_CREATE', 'PENDING_UPDATE', 'PENDING_DELETE'])
        const synced = await db.getItemsBySyncStatus(storeName, 'SYNCED')
        const errors = await db.getItemsBySyncStatus(storeName, 'ERROR')
        
        stats[storeName] = {
          total,
          pending: pending.length,
          synced: synced.length,
          errors: errors.length
        }
      }
      
      return stats
    },
    []
  )
}

/**
 * Hook for bulk operations
 */
export function useBulkOperations(storeName: string) {
  const db = getFluidPWADatabase()

  const bulkAdd = useCallback(async <T>(items: (Partial<T> & { localId?: string })[]): Promise<CRUDResult<string[]>> => {
    try {
      const table = db.getTable<T>(storeName)
      const processedItems = items.map(item => ({
        ...item,
        localId: item.localId || crypto.randomUUID(),
        syncStatus: 'PENDING_CREATE' as SyncStatus,
        lastModifiedOffline: Date.now(),
        ...(db.getConfig().userId && { userId: db.getConfig().userId })
      }))

      await table.bulkAdd(processedItems as any)
      return { 
        success: true, 
        data: processedItems.map(item => item.localId!) 
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Bulk add failed' 
      }
    }
  }, [db, storeName])

  const bulkUpdate = useCallback(async <T>(updates: { localId: string; changes: Partial<T> }[]): Promise<CRUDResult<number>> => {
    try {
      const table = db.getTable<T>(storeName)
      let totalUpdated = 0

      for (const { localId, changes } of updates) {
        const updated = await db.updateItem<T>(storeName, localId, changes)
        totalUpdated += updated
      }

      return { success: true, data: totalUpdated }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Bulk update failed' 
      }
    }
  }, [db, storeName])

  const bulkDelete = useCallback(async (localIds: string[]): Promise<CRUDResult<number>> => {
    try {
      let totalDeleted = 0

      for (const localId of localIds) {
        await db.deleteItem(storeName, localId)
        totalDeleted++
      }

      return { success: true, data: totalDeleted }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Bulk delete failed' 
      }
    }
  }, [db, storeName])

  return {
    bulkAdd,
    bulkUpdate,
    bulkDelete
  }
} 