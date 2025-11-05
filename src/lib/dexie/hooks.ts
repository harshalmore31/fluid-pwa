// React hooks for Fluid-PWA CRUD operations
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { getFluidPWADatabase } from './database'
import { CRUDOptions, CRUDResult, QueryOptions, SyncStatus, OfflineItem } from './types'

/**
 * Hook for adding new items to an offline store with automatic sync status tracking
 *
 * @template T - The type of item being added (should extend OfflineItem)
 * @param {string} storeName - The name of the Dexie store to add items to
 * @param {CRUDOptions} options - Optional callbacks (onBeforeAdd, onAfterAdd)
 *
 * @returns A function that adds an item and returns a CRUDResult with the new localId
 *
 * @example
 * ```typescript
 * interface Note extends OfflineItem {
 *   title: string;
 *   content: string;
 * }
 *
 * function MyComponent() {
 *   const addNote = useAddItem<Note>('notes', {
 *     onBeforeAdd: (item) => {
 *       // Validate or transform before adding
 *       return { ...item, title: item.title?.trim() };
 *     }
 *   });
 *
 *   const handleAdd = async () => {
 *     const result = await addNote({
 *       title: 'New Note',
 *       content: 'Content'
 *     });
 *     if (result.success) {
 *       console.log('Added with ID:', result.data);
 *     }
 *   };
 * }
 * ```
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
 * Hook for retrieving a single item by its localId with live updates
 *
 * Uses Dexie's useLiveQuery to automatically re-render when the item changes
 *
 * @template T - The type of item being retrieved
 * @param {string} storeName - The name of the Dexie store
 * @param {string} [localId] - The localId of the item to retrieve (optional)
 *
 * @returns The item with OfflineItem fields, or undefined if not found or loading
 *
 * @example
 * ```typescript
 * function NoteDetail({ noteId }: { noteId: string }) {
 *   const note = useGetItem<Note>('notes', noteId);
 *
 *   if (!note) return <div>Loading...</div>;
 *
 *   return (
 *     <div>
 *       <h1>{note.title}</h1>
 *       <p>{note.content}</p>
 *       <span>Status: {note.syncStatus}</span>
 *     </div>
 *   );
 * }
 * ```
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
 * Hook for retrieving all items from a store with live updates, filtering, and pagination
 *
 * Supports ordering, pagination (limit/offset), and custom filtering with automatic re-rendering
 *
 * @template T - The type of items being retrieved
 * @param {string} storeName - The name of the Dexie store
 * @param {QueryOptions} [queryOptions] - Optional query configuration
 * @param {number} [queryOptions.limit] - Maximum number of items to return
 * @param {number} [queryOptions.offset] - Number of items to skip
 * @param {string} [queryOptions.orderBy] - Field name to sort by
 * @param {boolean} [queryOptions.reverse] - Reverse sort order
 * @param {Function} [queryOptions.filter] - Custom filter function
 *
 * @returns Array of items with OfflineItem fields, or undefined while loading
 *
 * @example
 * ```typescript
 * function NotesList() {
 *   const notes = useGetAllItems<Note>('notes', {
 *     orderBy: 'lastModifiedOffline',
 *     reverse: true,
 *     limit: 20,
 *     filter: (note) => note.syncStatus !== 'PENDING_DELETE'
 *   });
 *
 *   if (!notes) return <div>Loading...</div>;
 *
 *   return (
 *     <ul>
 *       {notes.map(note => (
 *         <li key={note.localId}>{note.title}</li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
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
 * Hook for updating existing items with automatic sync status tracking
 *
 * Automatically sets syncStatus to PENDING_UPDATE for synced items and updates lastModifiedOffline
 *
 * @template T - The type of item being updated
 * @param {string} storeName - The name of the Dexie store
 * @param {CRUDOptions} [options] - Optional callbacks (onBeforeUpdate, onAfterUpdate)
 *
 * @returns A function that updates an item and returns a CRUDResult
 *
 * @example
 * ```typescript
 * function EditNote({ noteId }: { noteId: string }) {
 *   const updateNote = useUpdateItem<Note>('notes');
 *
 *   const handleSave = async (title: string, content: string) => {
 *     const result = await updateNote(noteId, { title, content });
 *     if (result.success) {
 *       console.log('Updated successfully');
 *     }
 *   };
 * }
 * ```
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
 * Hook for deleting items with smart soft/hard delete based on sync status
 *
 * - Hard deletes: Items with NEW or PENDING_CREATE status (never synced)
 * - Soft deletes: Items with SYNCED status (marks as PENDING_DELETE)
 *
 * @param {string} storeName - The name of the Dexie store
 * @param {CRUDOptions} [options] - Optional callbacks (onBeforeDelete, onAfterDelete)
 * @returns A function that deletes an item and returns a CRUDResult
 *
 * @example
 * ```typescript
 * const deleteNote = useDeleteItem('notes');
 * await deleteNote(noteId);
 * ```
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
 * Hook for retrieving items filtered by sync status with live updates
 *
 * @template T - The type of items being retrieved
 * @param {string} storeName - The name of the Dexie store
 * @param {SyncStatus | SyncStatus[]} syncStatus - Single status or array of statuses to filter by
 * @returns Array of items matching the sync status(es)
 *
 * @example
 * ```typescript
 * // Get all items that failed to sync
 * const erroredNotes = useGetItemsBySyncStatus<Note>('notes', 'ERROR');
 *
 * // Get all items waiting to be synced
 * const pendingNotes = useGetItemsBySyncStatus<Note>('notes', ['PENDING_CREATE', 'PENDING_UPDATE']);
 * ```
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
 * Hook for retrieving all items that need to be synced from a specific store
 *
 * Convenience hook that filters for PENDING_CREATE, PENDING_UPDATE, and PENDING_DELETE statuses
 *
 * @template T - The type of items being retrieved
 * @param {string} storeName - The name of the Dexie store
 * @returns Array of items with pending sync status
 *
 * @example
 * ```typescript
 * const pendingNotes = useGetPendingItems<Note>('notes');
 * console.log(`${pendingNotes?.length} notes waiting to sync`);
 * ```
 */
export function useGetPendingItems<T = any>(
  storeName: string
): (T & OfflineItem)[] | undefined {
  const pendingStatuses: SyncStatus[] = ['PENDING_CREATE', 'PENDING_UPDATE', 'PENDING_DELETE']
  return useGetItemsBySyncStatus<T>(storeName, pendingStatuses)
}

/**
 * Hook for retrieving all pending items across all stores with live updates
 *
 * Useful for building sync queue UI or monitoring overall sync status
 *
 * @returns Array of all pending items from all stores with storeName attached
 *
 * @example
 * ```typescript
 * const allPending = useGetAllPendingItems();
 * return <div>Total items to sync: {allPending?.length}</div>;
 * ```
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
 * Hook for retrieving real-time statistics about all stores in the database
 *
 * Provides counts for total items, pending items, synced items, and error items per store
 *
 * @returns Object with stats per store: { storeName: { total, pending, synced, errors } }
 *
 * @example
 * ```typescript
 * function SyncDashboard() {
 *   const stats = useFluidPWAStats();
 *
 *   if (!stats) return <div>Loading...</div>;
 *
 *   return (
 *     <div>
 *       {Object.entries(stats).map(([store, data]) => (
 *         <div key={store}>
 *           <h3>{store}</h3>
 *           <p>Total: {data.total}</p>
 *           <p>Pending: {data.pending}</p>
 *           <p>Synced: {data.synced}</p>
 *           <p>Errors: {data.errors}</p>
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
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
 * Hook for performing bulk operations (add, update, delete) on multiple items efficiently
 *
 * @param {string} storeName - The name of the Dexie store
 * @returns Object with bulkAdd, bulkUpdate, and bulkDelete functions
 *
 * @example
 * ```typescript
 * function ImportNotes() {
 *   const { bulkAdd, bulkUpdate, bulkDelete } = useBulkOperations('notes');
 *
 *   const handleImport = async (notesData: Partial<Note>[]) => {
 *     const result = await bulkAdd<Note>(notesData);
 *     if (result.success) {
 *       console.log('Added', result.data?.length, 'notes');
 *     }
 *   };
 *
 *   const handleBulkUpdate = async () => {
 *     await bulkUpdate([
 *       { localId: 'id1', changes: { title: 'Updated 1' } },
 *       { localId: 'id2', changes: { title: 'Updated 2' } }
 *     ]);
 *   };
 *
 *   const handleBulkDelete = async (ids: string[]) => {
 *     await bulkDelete(ids);
 *   };
 * }
 * ```
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