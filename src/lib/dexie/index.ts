// Main export file for Fluid-PWA framework
export * from './types'
export * from './database'
export * from './hooks'
export * from './FluidPWAProvider'

// Re-export commonly used types and functions for convenience
export type {
  SyncStatus,
  OfflineItem,
  FluidPWASchema,
  FluidPWAConfig,
  QueryOptions,
  CRUDOptions,
  CRUDResult,
  FluidStore
} from './types'

export {
  FluidPWADatabase,
  initializeFluidPWA,
  getFluidPWADatabase,
  isFluidPWAInitialized
} from './database'

export {
  useAddItem,
  useGetItem,
  useGetAllItems,
  useUpdateItem,
  useDeleteItem,
  useGetItemsBySyncStatus,
  useGetPendingItems,
  useGetAllPendingItems,
  useFluidPWAStats,
  useBulkOperations
} from './hooks' 