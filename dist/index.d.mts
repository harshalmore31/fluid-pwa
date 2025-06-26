import Dexie, { Table } from 'dexie';
import React, { ReactNode } from 'react';

/**
 * Sync status for offline items
 */
type SyncStatus = 'NEW' | 'PENDING_CREATE' | 'PENDING_UPDATE' | 'PENDING_DELETE' | 'SYNCED' | 'ERROR';
/**
 * Base interface for all offline items managed by Fluid-PWA
 */
interface OfflineItem {
    localId: string;
    serverId?: string | number;
    syncStatus: SyncStatus;
    lastModifiedOffline: number;
    userId?: string;
    errorMessage?: string;
}
/**
 * Schema definition for Dexie stores
 * Key = store name, Value = Dexie schema string
 */
interface FluidPWASchema {
    [storeName: string]: string;
}
/**
 * Configuration for initializing Fluid-PWA
 */
interface FluidPWAConfig {
    databaseName: string;
    schema: FluidPWASchema;
    version?: number;
    userId?: string;
    enableLogging?: boolean;
}
/**
 * Query options for retrieving items
 */
interface QueryOptions {
    limit?: number;
    offset?: number;
    orderBy?: string;
    reverse?: boolean;
    filter?: (item: any) => boolean;
}
/**
 * Options for CRUD operations
 */
interface CRUDOptions {
    onBeforeAdd?: (item: any) => any | Promise<any>;
    onAfterAdd?: (item: any, result: any) => void | Promise<void>;
    onBeforeUpdate?: (item: any, updates: any) => any | Promise<any>;
    onAfterUpdate?: (item: any, result: any) => void | Promise<void>;
    onBeforeDelete?: (itemId: string) => boolean | Promise<boolean>;
    onAfterDelete?: (itemId: string) => void | Promise<void>;
}
/**
 * Result type for CRUD operations
 */
interface CRUDResult<T = any> {
    success: boolean;
    data?: T;
    error?: string;
}
/**
 * Batch operation result
 */
interface BatchResult {
    success: boolean;
    processed: number;
    errors: Array<{
        item: any;
        error: string;
    }>;
}
/**
 * Sync queue item for service worker
 */
interface SyncQueueItem extends OfflineItem {
    storeName: string;
    operation: 'CREATE' | 'UPDATE' | 'DELETE';
    payload: any;
    attempts: number;
    lastAttempt?: number;
}
/**
 * Type helper to ensure store items extend OfflineItem
 */
type FluidStore<T> = T & OfflineItem;
/**
 * Database instance type with typed tables
 */
interface FluidDatabase {
    [storeName: string]: Table<any, string>;
}

/**
 * Fluid-PWA Database class extending Dexie
 */
declare class FluidPWADatabase extends Dexie {
    private config;
    private isInitialized;
    constructor(config: FluidPWAConfig);
    private setupDatabase;
    private setupHooks;
    /**
     * Populate required offline fields for new items
     */
    private populateOfflineFields;
    /**
     * Get all stores defined in the schema
     */
    getStoreNames(): string[];
    /**
     * Get a table by name with type safety
     */
    getTable<T = any>(storeName: string): Table<T & OfflineItem, string>;
    /**
     * Check if database is properly initialized
     */
    isReady(): boolean;
    /**
     * Get configuration
     */
    getConfig(): FluidPWAConfig;
    /**
     * Create a new item with proper offline fields
     */
    createItem<T>(storeName: string, payload: Partial<T>, syncStatus?: SyncStatus): Promise<string>;
    /**
     * Update an item and mark for sync
     */
    updateItem<T>(storeName: string, localId: string, updates: Partial<T>): Promise<number>;
    /**
     * Delete an item (soft delete with sync status)
     */
    deleteItem(storeName: string, localId: string): Promise<void>;
    /**
     * Get items by sync status
     */
    getItemsBySyncStatus(storeName: string, syncStatus: SyncStatus | SyncStatus[]): Promise<any[]>;
    /**
     * Get all pending items across all stores (for sync queue)
     */
    getAllPendingItems(): Promise<any[]>;
}
/**
 * Initialize the Fluid-PWA database
 */
declare function initializeFluidPWA(config: FluidPWAConfig): FluidPWADatabase;
/**
 * Get the current database instance
 */
declare function getFluidPWADatabase(): FluidPWADatabase;
/**
 * Check if database is initialized
 */
declare function isFluidPWAInitialized(): boolean;

/**
 * Hook to add items to a store
 */
declare function useAddItem<T = any>(storeName: string, options?: CRUDOptions): (payload: Partial<T>, syncStatus?: SyncStatus) => Promise<CRUDResult<string>>;
/**
 * Hook to get a single item by localId
 */
declare function useGetItem<T = any>(storeName: string, localId?: string): T & OfflineItem | undefined;
/**
 * Hook to get all items from a store with optional filtering
 */
declare function useGetAllItems<T = any>(storeName: string, queryOptions?: QueryOptions): (T & OfflineItem)[] | undefined;
/**
 * Hook to update items
 */
declare function useUpdateItem<T = any>(storeName: string, options?: CRUDOptions): (localId: string, updates: Partial<T>) => Promise<CRUDResult<number>>;
/**
 * Hook to delete items
 */
declare function useDeleteItem(storeName: string, options?: CRUDOptions): (localId: string) => Promise<CRUDResult<void>>;
/**
 * Hook to get items by sync status
 */
declare function useGetItemsBySyncStatus<T = any>(storeName: string, syncStatus: SyncStatus | SyncStatus[]): (T & OfflineItem)[] | undefined;
/**
 * Hook to get pending items (items that need to be synced)
 */
declare function useGetPendingItems<T = any>(storeName: string): (T & OfflineItem)[] | undefined;
/**
 * Hook to get all pending items across all stores
 */
declare function useGetAllPendingItems(): any[] | undefined;
/**
 * Hook to get database statistics
 */
declare function useFluidPWAStats(): Record<string, any> | undefined;
/**
 * Hook for bulk operations
 */
declare function useBulkOperations(storeName: string): {
    bulkAdd: <T>(items: (Partial<T> & {
        localId?: string;
    })[]) => Promise<CRUDResult<string[]>>;
    bulkUpdate: <T>(updates: {
        localId: string;
        changes: Partial<T>;
    }[]) => Promise<CRUDResult<number>>;
    bulkDelete: (localIds: string[]) => Promise<CRUDResult<number>>;
};

interface FluidPWAContextType {
    database: FluidPWADatabase | null;
    isInitialized: boolean;
    isLoading: boolean;
    error: string | null;
    config: FluidPWAConfig | null;
}
interface FluidPWAProviderProps {
    children: ReactNode;
    config: FluidPWAConfig;
    onInitialized?: (database: FluidPWADatabase) => void;
    onError?: (error: Error) => void;
}
/**
 * Provider component for Fluid-PWA that initializes the database
 * and provides it to child components via context
 */
declare function FluidPWAProvider({ children, config, onInitialized, onError }: FluidPWAProviderProps): React.JSX.Element;
/**
 * Hook to access the Fluid-PWA context
 */
declare function useFluidPWA(): FluidPWAContextType;
/**
 * Hook to get the database instance with error handling
 */
declare function useFluidPWADatabase(): FluidPWADatabase;
/**
 * Higher-order component for wrapping pages/components with Fluid-PWA
 */
declare function withFluidPWA<P extends object>(Component: React.ComponentType<P>, config: FluidPWAConfig): (props: P) => React.JSX.Element;
/**
 * Component to display loading/error states for Fluid-PWA initialization
 */
interface FluidPWAStatusProps {
    children: ReactNode;
    loadingComponent?: ReactNode;
    errorComponent?: (error: string) => ReactNode;
}
declare function FluidPWAStatus({ children, loadingComponent, errorComponent }: FluidPWAStatusProps): React.JSX.Element;

export { type BatchResult, type CRUDOptions, type CRUDResult, type FluidDatabase, type FluidPWAConfig, FluidPWADatabase, FluidPWAProvider, type FluidPWASchema, FluidPWAStatus, type FluidStore, type OfflineItem, type QueryOptions, type SyncQueueItem, type SyncStatus, getFluidPWADatabase, initializeFluidPWA, isFluidPWAInitialized, useAddItem, useBulkOperations, useDeleteItem, useFluidPWA, useFluidPWADatabase, useFluidPWAStats, useGetAllItems, useGetAllPendingItems, useGetItem, useGetItemsBySyncStatus, useGetPendingItems, useUpdateItem, withFluidPWA };
