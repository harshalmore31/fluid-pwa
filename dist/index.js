"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/lib/dexie/index.ts
var index_exports = {};
__export(index_exports, {
  FluidPWADatabase: () => FluidPWADatabase,
  FluidPWAProvider: () => FluidPWAProvider,
  FluidPWAStatus: () => FluidPWAStatus,
  getFluidPWADatabase: () => getFluidPWADatabase,
  initializeFluidPWA: () => initializeFluidPWA,
  isFluidPWAInitialized: () => isFluidPWAInitialized,
  useAddItem: () => useAddItem,
  useBulkOperations: () => useBulkOperations,
  useDeleteItem: () => useDeleteItem,
  useFluidPWA: () => useFluidPWA,
  useFluidPWADatabase: () => useFluidPWADatabase,
  useFluidPWAStats: () => useFluidPWAStats,
  useGetAllItems: () => useGetAllItems,
  useGetAllPendingItems: () => useGetAllPendingItems,
  useGetItem: () => useGetItem,
  useGetItemsBySyncStatus: () => useGetItemsBySyncStatus,
  useGetPendingItems: () => useGetPendingItems,
  useUpdateItem: () => useUpdateItem,
  withFluidPWA: () => withFluidPWA
});
module.exports = __toCommonJS(index_exports);

// src/lib/dexie/database.ts
var import_dexie = __toESM(require("dexie"));
var import_uuid = require("uuid");
var FluidPWADatabase = class extends import_dexie.default {
  constructor(config) {
    super(config.databaseName);
    this.isInitialized = false;
    this.config = config;
    this.setupDatabase();
  }
  setupDatabase() {
    const version = this.config.version || 1;
    this.version(version).stores(this.config.schema);
    this.setupHooks();
    this.isInitialized = true;
    if (this.config.enableLogging) {
      console.log(`Fluid-PWA: Database "${this.config.databaseName}" initialized with schema:`, this.config.schema);
    }
  }
  setupHooks() {
    Object.keys(this.config.schema).forEach((storeName) => {
      const table = this[storeName];
      if (table) {
        table.hook("creating", (primKey, obj, trans) => {
          this.populateOfflineFields(obj, "NEW");
        });
        table.hook("updating", (modifications, primKey, obj, trans) => {
          if (!modifications.lastModifiedOffline) {
            modifications.lastModifiedOffline = Date.now();
          }
          if (!modifications.syncStatus && obj.syncStatus === "SYNCED") {
            modifications.syncStatus = "PENDING_UPDATE";
          }
        });
      }
    });
  }
  /**
   * Populate required offline fields for new items
   */
  populateOfflineFields(item, syncStatus) {
    if (!item.localId) {
      item.localId = (0, import_uuid.v4)();
    }
    if (!item.syncStatus) {
      item.syncStatus = syncStatus;
    }
    if (!item.lastModifiedOffline) {
      item.lastModifiedOffline = Date.now();
    }
    if (this.config.userId && !item.userId) {
      item.userId = this.config.userId;
    }
  }
  /**
   * Get all stores defined in the schema
   */
  getStoreNames() {
    return Object.keys(this.config.schema);
  }
  /**
   * Get a table by name with type safety
   */
  getTable(storeName) {
    const table = this[storeName];
    if (!table) {
      throw new Error(`Store "${storeName}" not found in database schema`);
    }
    return table;
  }
  /**
   * Check if database is properly initialized
   */
  isReady() {
    return this.isInitialized && this.isOpen();
  }
  /**
   * Get configuration
   */
  getConfig() {
    return __spreadValues({}, this.config);
  }
  /**
   * Create a new item with proper offline fields
   */
  async createItem(storeName, payload, syncStatus = "PENDING_CREATE") {
    const table = this.getTable(storeName);
    const item = __spreadValues(__spreadProps(__spreadValues({}, payload), {
      localId: (0, import_uuid.v4)(),
      syncStatus,
      lastModifiedOffline: Date.now()
    }), this.config.userId && { userId: this.config.userId });
    await table.add(item);
    return item.localId;
  }
  /**
   * Update an item and mark for sync
   */
  async updateItem(storeName, localId, updates) {
    const table = this.getTable(storeName);
    const item = await table.get(localId);
    if (!item) {
      throw new Error(`Item with localId "${localId}" not found in store "${storeName}"`);
    }
    const updateData = __spreadProps(__spreadValues({}, updates), {
      lastModifiedOffline: Date.now(),
      syncStatus: item.syncStatus === "SYNCED" ? "PENDING_UPDATE" : item.syncStatus
    });
    return table.update(localId, updateData);
  }
  /**
   * Delete an item (soft delete with sync status)
   */
  async deleteItem(storeName, localId) {
    const table = this.getTable(storeName);
    const item = await table.get(localId);
    if (!item) {
      throw new Error(`Item with localId "${localId}" not found in store "${storeName}"`);
    }
    if (item.syncStatus === "NEW" || item.syncStatus === "PENDING_CREATE") {
      await table.delete(localId);
    } else {
      await table.update(localId, {
        syncStatus: "PENDING_DELETE",
        lastModifiedOffline: Date.now()
      });
    }
  }
  /**
   * Get items by sync status
   */
  async getItemsBySyncStatus(storeName, syncStatus) {
    const table = this.getTable(storeName);
    const statuses = Array.isArray(syncStatus) ? syncStatus : [syncStatus];
    return table.where("syncStatus").anyOf(statuses).toArray();
  }
  /**
   * Get all pending items across all stores (for sync queue)
   */
  async getAllPendingItems() {
    const pendingStatuses = ["PENDING_CREATE", "PENDING_UPDATE", "PENDING_DELETE"];
    const allPending = [];
    for (const storeName of this.getStoreNames()) {
      const items = await this.getItemsBySyncStatus(storeName, pendingStatuses);
      items.forEach((item) => {
        allPending.push(__spreadProps(__spreadValues({}, item), {
          storeName
        }));
      });
    }
    return allPending;
  }
};
var dbInstance = null;
function initializeFluidPWA(config) {
  if (dbInstance) {
    console.warn("Fluid-PWA: Database already initialized. Returning existing instance.");
    return dbInstance;
  }
  dbInstance = new FluidPWADatabase(config);
  return dbInstance;
}
function getFluidPWADatabase() {
  if (!dbInstance) {
    throw new Error("Fluid-PWA: Database not initialized. Call initializeFluidPWA() first.");
  }
  return dbInstance;
}
function isFluidPWAInitialized() {
  return dbInstance !== null && dbInstance.isReady();
}

// src/lib/dexie/hooks.ts
var import_react = require("react");
var import_dexie_react_hooks = require("dexie-react-hooks");
function useAddItem(storeName, options = {}) {
  const db = getFluidPWADatabase();
  return (0, import_react.useCallback)(async (payload, syncStatus = "PENDING_CREATE") => {
    try {
      let processedPayload = payload;
      if (options.onBeforeAdd) {
        processedPayload = await options.onBeforeAdd(payload);
      }
      const localId = await db.createItem(storeName, processedPayload, syncStatus);
      if (options.onAfterAdd) {
        await options.onAfterAdd(processedPayload, localId);
      }
      return { success: true, data: localId };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred"
      };
    }
  }, [db, storeName, options]);
}
function useGetItem(storeName, localId) {
  return (0, import_dexie_react_hooks.useLiveQuery)(
    async () => {
      if (!localId) return void 0;
      const db = getFluidPWADatabase();
      const table = db.getTable(storeName);
      return table.get(localId);
    },
    [storeName, localId]
  );
}
function useGetAllItems(storeName, queryOptions = {}) {
  return (0, import_dexie_react_hooks.useLiveQuery)(
    async () => {
      const db = getFluidPWADatabase();
      const table = db.getTable(storeName);
      let query = table.toCollection();
      if (queryOptions.orderBy) {
        query = table.orderBy(queryOptions.orderBy);
        if (queryOptions.reverse) {
          query = query.reverse();
        }
      }
      if (queryOptions.offset) {
        query = query.offset(queryOptions.offset);
      }
      if (queryOptions.limit) {
        query = query.limit(queryOptions.limit);
      }
      let results = await query.toArray();
      if (queryOptions.filter) {
        results = results.filter(queryOptions.filter);
      }
      return results;
    },
    [storeName, queryOptions.orderBy, queryOptions.reverse, queryOptions.offset, queryOptions.limit]
  );
}
function useUpdateItem(storeName, options = {}) {
  const db = getFluidPWADatabase();
  return (0, import_react.useCallback)(async (localId, updates) => {
    try {
      let processedUpdates = updates;
      if (options.onBeforeUpdate) {
        const existingItem = await db.getTable(storeName).get(localId);
        processedUpdates = await options.onBeforeUpdate(existingItem, updates);
      }
      const result = await db.updateItem(storeName, localId, processedUpdates);
      if (options.onAfterUpdate) {
        const updatedItem = await db.getTable(storeName).get(localId);
        await options.onAfterUpdate(updatedItem, result);
      }
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred"
      };
    }
  }, [db, storeName, options]);
}
function useDeleteItem(storeName, options = {}) {
  const db = getFluidPWADatabase();
  return (0, import_react.useCallback)(async (localId) => {
    try {
      if (options.onBeforeDelete) {
        const shouldDelete = await options.onBeforeDelete(localId);
        if (!shouldDelete) {
          return { success: false, error: "Delete operation cancelled by before hook" };
        }
      }
      await db.deleteItem(storeName, localId);
      if (options.onAfterDelete) {
        await options.onAfterDelete(localId);
      }
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred"
      };
    }
  }, [db, storeName, options]);
}
function useGetItemsBySyncStatus(storeName, syncStatus) {
  return (0, import_dexie_react_hooks.useLiveQuery)(
    async () => {
      const db = getFluidPWADatabase();
      return db.getItemsBySyncStatus(storeName, syncStatus);
    },
    [storeName, syncStatus]
  );
}
function useGetPendingItems(storeName) {
  const pendingStatuses = ["PENDING_CREATE", "PENDING_UPDATE", "PENDING_DELETE"];
  return useGetItemsBySyncStatus(storeName, pendingStatuses);
}
function useGetAllPendingItems() {
  return (0, import_dexie_react_hooks.useLiveQuery)(
    async () => {
      const db = getFluidPWADatabase();
      return db.getAllPendingItems();
    },
    []
  );
}
function useFluidPWAStats() {
  return (0, import_dexie_react_hooks.useLiveQuery)(
    async () => {
      const db = getFluidPWADatabase();
      const stats = {};
      for (const storeName of db.getStoreNames()) {
        const table = db.getTable(storeName);
        const total = await table.count();
        const pending = await db.getItemsBySyncStatus(storeName, ["PENDING_CREATE", "PENDING_UPDATE", "PENDING_DELETE"]);
        const synced = await db.getItemsBySyncStatus(storeName, "SYNCED");
        const errors = await db.getItemsBySyncStatus(storeName, "ERROR");
        stats[storeName] = {
          total,
          pending: pending.length,
          synced: synced.length,
          errors: errors.length
        };
      }
      return stats;
    },
    []
  );
}
function useBulkOperations(storeName) {
  const db = getFluidPWADatabase();
  const bulkAdd = (0, import_react.useCallback)(async (items) => {
    try {
      const table = db.getTable(storeName);
      const processedItems = items.map((item) => __spreadValues(__spreadProps(__spreadValues({}, item), {
        localId: item.localId || crypto.randomUUID(),
        syncStatus: "PENDING_CREATE",
        lastModifiedOffline: Date.now()
      }), db.getConfig().userId && { userId: db.getConfig().userId }));
      await table.bulkAdd(processedItems);
      return {
        success: true,
        data: processedItems.map((item) => item.localId)
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Bulk add failed"
      };
    }
  }, [db, storeName]);
  const bulkUpdate = (0, import_react.useCallback)(async (updates) => {
    try {
      const table = db.getTable(storeName);
      let totalUpdated = 0;
      for (const { localId, changes } of updates) {
        const updated = await db.updateItem(storeName, localId, changes);
        totalUpdated += updated;
      }
      return { success: true, data: totalUpdated };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Bulk update failed"
      };
    }
  }, [db, storeName]);
  const bulkDelete = (0, import_react.useCallback)(async (localIds) => {
    try {
      let totalDeleted = 0;
      for (const localId of localIds) {
        await db.deleteItem(storeName, localId);
        totalDeleted++;
      }
      return { success: true, data: totalDeleted };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Bulk delete failed"
      };
    }
  }, [db, storeName]);
  return {
    bulkAdd,
    bulkUpdate,
    bulkDelete
  };
}

// src/lib/dexie/FluidPWAProvider.tsx
var import_react2 = __toESM(require("react"));
var FluidPWAContext = (0, import_react2.createContext)({
  database: null,
  isInitialized: false,
  isLoading: true,
  error: null,
  config: null
});
function FluidPWAProvider({
  children,
  config,
  onInitialized,
  onError
}) {
  const [database, setDatabase] = (0, import_react2.useState)(null);
  const [isLoading, setIsLoading] = (0, import_react2.useState)(true);
  const [error, setError] = (0, import_react2.useState)(null);
  (0, import_react2.useEffect)(() => {
    const initDatabase = async () => {
      try {
        setIsLoading(true);
        setError(null);
        let db;
        if (isFluidPWAInitialized()) {
          db = getFluidPWADatabase();
          if (config.enableLogging) {
            console.log("Fluid-PWA: Using existing database instance");
          }
        } else {
          if (config.enableLogging) {
            console.log("Fluid-PWA: Initializing database with config:", config);
          }
          db = initializeFluidPWA(config);
        }
        await db.open();
        setDatabase(db);
        onInitialized == null ? void 0 : onInitialized(db);
        if (config.enableLogging) {
          console.log("Fluid-PWA: Database successfully initialized and ready");
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to initialize Fluid-PWA database";
        setError(errorMessage);
        onError == null ? void 0 : onError(err instanceof Error ? err : new Error(errorMessage));
        if (config.enableLogging) {
          console.error("Fluid-PWA: Database initialization failed:", err);
        }
      } finally {
        setIsLoading(false);
      }
    };
    initDatabase();
  }, [config, onInitialized, onError]);
  const contextValue = {
    database,
    isInitialized: database !== null && database.isReady(),
    isLoading,
    error,
    config
  };
  return /* @__PURE__ */ import_react2.default.createElement(FluidPWAContext.Provider, { value: contextValue }, children);
}
function useFluidPWA() {
  const context = (0, import_react2.useContext)(FluidPWAContext);
  if (!context) {
    throw new Error("useFluidPWA must be used within a FluidPWAProvider");
  }
  return context;
}
function useFluidPWADatabase() {
  const { database, isInitialized, error } = useFluidPWA();
  if (error) {
    throw new Error(`Fluid-PWA Error: ${error}`);
  }
  if (!isInitialized || !database) {
    throw new Error("Fluid-PWA: Database not yet initialized");
  }
  return database;
}
function withFluidPWA(Component, config) {
  return function WrappedComponent(props) {
    return /* @__PURE__ */ import_react2.default.createElement(FluidPWAProvider, { config }, /* @__PURE__ */ import_react2.default.createElement(Component, __spreadValues({}, props)));
  };
}
function FluidPWAStatus({
  children,
  loadingComponent,
  errorComponent
}) {
  const { isInitialized, isLoading, error } = useFluidPWA();
  if (error && errorComponent) {
    return /* @__PURE__ */ import_react2.default.createElement(import_react2.default.Fragment, null, errorComponent(error));
  }
  if (error) {
    return /* @__PURE__ */ import_react2.default.createElement("div", { className: "p-4 bg-red-50 border border-red-200 rounded-md" }, /* @__PURE__ */ import_react2.default.createElement("h3", { className: "text-red-800 font-medium" }, "Database Error"), /* @__PURE__ */ import_react2.default.createElement("p", { className: "text-red-600 text-sm mt-1" }, error));
  }
  if (isLoading && loadingComponent) {
    return /* @__PURE__ */ import_react2.default.createElement(import_react2.default.Fragment, null, loadingComponent);
  }
  if (isLoading) {
    return /* @__PURE__ */ import_react2.default.createElement("div", { className: "flex items-center justify-center p-8" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" }), /* @__PURE__ */ import_react2.default.createElement("span", { className: "ml-3 text-gray-600" }, "Initializing offline database..."));
  }
  if (!isInitialized) {
    return /* @__PURE__ */ import_react2.default.createElement("div", { className: "p-4 bg-yellow-50 border border-yellow-200 rounded-md" }, /* @__PURE__ */ import_react2.default.createElement("p", { className: "text-yellow-800" }, "Database not yet ready..."));
  }
  return /* @__PURE__ */ import_react2.default.createElement(import_react2.default.Fragment, null, children);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FluidPWADatabase,
  FluidPWAProvider,
  FluidPWAStatus,
  getFluidPWADatabase,
  initializeFluidPWA,
  isFluidPWAInitialized,
  useAddItem,
  useBulkOperations,
  useDeleteItem,
  useFluidPWA,
  useFluidPWADatabase,
  useFluidPWAStats,
  useGetAllItems,
  useGetAllPendingItems,
  useGetItem,
  useGetItemsBySyncStatus,
  useGetPendingItems,
  useUpdateItem,
  withFluidPWA
});
//# sourceMappingURL=index.js.map