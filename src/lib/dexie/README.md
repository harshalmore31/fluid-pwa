# Fluid-PWA Framework

**Phase 1: Foundation & Core Dexie.js Setup**

Fluid-PWA is a reusable, well-configured "offline batteries framework" for Next.js PWAs using Dexie.js. It provides robust, configurable, and easy-to-integrate offline data storage, retrieval, and basic sync-status management for CRUD operations.

## 🚀 Features

- **Configurable Schema**: Define your own data structures easily
- **Automatic Sync Status**: Built-in tracking for offline/online data synchronization
- **React Hooks**: Clean, composable hooks for CRUD operations
- **TypeScript Support**: Full type safety and IntelliSense
- **Provider Pattern**: Easy integration with React context
- **Offline-First**: Works seamlessly offline with automatic field population
- **Error Handling**: Comprehensive error management and logging

## 📦 Installation

The framework is already included in this PWA template. If you want to use it in another project:

```bash
npm install dexie dexie-react-hooks uuid
npm install -D @types/uuid
```

## 🛠️ Quick Start

### 1. Define Your Schema

```typescript
import { FluidPWAConfig } from '@/lib/dexie'

const myAppSchema = {
  // Define your stores with Dexie schema syntax
  notes: '++localId, title, content, syncStatus, lastModifiedOffline, userId',
  tasks: '++localId, title, completed, priority, syncStatus, lastModifiedOffline, userId',
  projects: '++localId, name, description, status, syncStatus, lastModifiedOffline, userId'
}

const config: FluidPWAConfig = {
  databaseName: 'MyAppDB',
  schema: myAppSchema,
  version: 1,
  enableLogging: true,
  userId: 'current-user-id' // Optional: auto-populate userId field
}
```

### 2. Wrap Your App with FluidPWAProvider

```typescript
import { FluidPWAProvider } from '@/lib/dexie'

export default function MyApp() {
  return (
    <FluidPWAProvider config={config}>
      <MyAppContent />
    </FluidPWAProvider>
  )
}
```

### 3. Use Hooks in Your Components

```typescript
import { 
  useAddItem, 
  useGetAllItems, 
  useUpdateItem, 
  useDeleteItem 
} from '@/lib/dexie'

interface Note {
  title: string
  content: string
}

function NotesComponent() {
  // CRUD hooks
  const addNote = useAddItem<Note>('notes')
  const notes = useGetAllItems<Note>('notes', { orderBy: 'lastModifiedOffline', reverse: true })
  const updateNote = useUpdateItem<Note>('notes')
  const deleteNote = useDeleteItem('notes')

  const handleAddNote = async () => {
    const result = await addNote({
      title: 'My Note',
      content: 'Note content here...'
    })
    
    if (result.success) {
      console.log('Note added with ID:', result.data)
    } else {
      console.error('Error:', result.error)
    }
  }

  const handleUpdateNote = async (localId: string) => {
    const result = await updateNote(localId, {
      title: 'Updated Title'
    })
    
    if (!result.success) {
      console.error('Update failed:', result.error)
    }
  }

  const handleDeleteNote = async (localId: string) => {
    const result = await deleteNote(localId)
    
    if (!result.success) {
      console.error('Delete failed:', result.error)
    }
  }

  return (
    <div>
      <button onClick={handleAddNote}>Add Note</button>
      
      {notes?.map((note) => (
        <div key={note.localId}>
          <h3>{note.title}</h3>
          <p>{note.content}</p>
          <span>Status: {note.syncStatus}</span>
          
          <button onClick={() => handleUpdateNote(note.localId)}>
            Edit
          </button>
          <button onClick={() => handleDeleteNote(note.localId)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  )
}
```

## 📚 Core Concepts

### OfflineItem Structure

Every item stored in Fluid-PWA automatically includes these fields:

```typescript
interface OfflineItem {
  localId: string              // Auto-generated UUID
  serverId?: string | number   // Server ID once synced
  syncStatus: SyncStatus       // Current sync state
  lastModifiedOffline: number  // Timestamp of last local change
  userId?: string             // User who owns this data
  errorMessage?: string       // Error details if sync fails
}
```

### Sync Status Values

```typescript
type SyncStatus = 
  | 'NEW'              // Just created, not yet marked for sync
  | 'PENDING_CREATE'   // Created offline, waiting to sync to server
  | 'PENDING_UPDATE'   // Updated offline, waiting to sync changes
  | 'PENDING_DELETE'   // Deleted offline, waiting to sync deletion
  | 'SYNCED'          // Successfully synced with server
  | 'ERROR'           // Error occurred during sync
```

## 🎣 Available Hooks

### CRUD Operations

#### `useAddItem<T>(storeName, options?)`
Creates new items in the specified store.

```typescript
const addItem = useAddItem<MyType>('myStore', {
  onBeforeAdd: async (item) => {
    // Validate or transform item before saving
    return { ...item, validated: true }
  },
  onAfterAdd: async (item, localId) => {
    // Trigger side effects after successful save
    console.log('Item added:', localId)
  }
})

const result = await addItem({ title: 'New Item' })
```

#### `useGetItem<T>(storeName, localId?)`
Retrieves a single item by its localId. Reactively updates when the item changes.

```typescript
const item = useGetItem<MyType>('myStore', itemId)
// item will be undefined if not found or still loading
```

#### `useGetAllItems<T>(storeName, queryOptions?)`
Retrieves all items from a store with optional filtering and sorting.

```typescript
const items = useGetAllItems<MyType>('myStore', {
  orderBy: 'lastModifiedOffline',
  reverse: true,
  limit: 50,
  offset: 0,
  filter: (item) => item.title.includes('search term')
})
```

#### `useUpdateItem<T>(storeName, options?)`
Updates existing items.

```typescript
const updateItem = useUpdateItem<MyType>('myStore', {
  onBeforeUpdate: async (existingItem, updates) => {
    // Validate updates
    return updates
  },
  onAfterUpdate: async (updatedItem, result) => {
    // Handle successful update
  }
})

const result = await updateItem(localId, { title: 'Updated' })
```

#### `useDeleteItem(storeName, options?)`
Deletes items (soft delete for synced items, hard delete for unsynced).

```typescript
const deleteItem = useDeleteItem('myStore', {
  onBeforeDelete: async (localId) => {
    // Return false to cancel deletion
    return confirm('Are you sure?')
  },
  onAfterDelete: async (localId) => {
    // Cleanup after deletion
  }
})
```

### Sync Status Hooks

#### `useGetItemsBySyncStatus<T>(storeName, syncStatus)`
Get items by their sync status.

```typescript
// Get all pending items
const pendingItems = useGetItemsBySyncStatus('myStore', ['PENDING_CREATE', 'PENDING_UPDATE', 'PENDING_DELETE'])

// Get only synced items
const syncedItems = useGetItemsBySyncStatus('myStore', 'SYNCED')

// Get items with errors
const errorItems = useGetItemsBySyncStatus('myStore', 'ERROR')
```

#### `useGetPendingItems<T>(storeName)`
Shortcut to get all items that need to be synced.

```typescript
const pendingItems = useGetPendingItems<MyType>('myStore')
```

#### `useGetAllPendingItems()`
Get all pending items across all stores (useful for sync queue management).

```typescript
const allPending = useGetAllPendingItems()
// Returns items with storeName included
```

### Utility Hooks

#### `useFluidPWAStats()`
Get database statistics for monitoring and debugging.

```typescript
const stats = useFluidPWAStats()
// Returns: { storeName: { total, pending, synced, errors } }
```

#### `useBulkOperations(storeName)`
Perform bulk operations for better performance.

```typescript
const { bulkAdd, bulkUpdate, bulkDelete } = useBulkOperations('myStore')

await bulkAdd([
  { title: 'Item 1' },
  { title: 'Item 2' },
  { title: 'Item 3' }
])
```

## 🔧 Advanced Usage

### Custom Hooks with Side Effects

```typescript
const addNote = useAddItem<Note>('notes', {
  onBeforeAdd: async (note) => {
    // Add validation
    if (!note.title?.trim()) {
      throw new Error('Title is required')
    }
    
    // Transform data
    return {
      ...note,
      title: note.title.trim(),
      createdAt: new Date().toISOString()
    }
  },
  onAfterAdd: async (note, localId) => {
    // Trigger analytics
    analytics.track('Note Created', { localId })
    
    // Show notification
    toast.success('Note saved!')
  }
})
```

### Error Handling

```typescript
const addItem = useAddItem<MyType>('myStore')

const handleAdd = async (data: MyType) => {
  const result = await addItem(data)
  
  if (result.success) {
    // Handle success
    console.log('Created with ID:', result.data)
  } else {
    // Handle error
    console.error('Failed to create:', result.error)
    setErrorMessage(result.error)
  }
}
```

### Custom Queries

```typescript
// Get high priority incomplete tasks
const urgentTasks = useGetAllItems<Task>('tasks', {
  filter: (task) => task.priority === 'high' && !task.completed,
  orderBy: 'dueDate'
})

// Get recent notes
const recentNotes = useGetAllItems<Note>('notes', {
  orderBy: 'lastModifiedOffline',
  reverse: true,
  limit: 10
})
```

## 🎯 Best Practices

### 1. Schema Design
- Always include the required offline fields in your schema
- Use meaningful field names for indexes
- Plan for future schema changes

```typescript
const schema = {
  // Good: Includes all required fields and useful indexes
  tasks: '++localId, title, completed, priority, dueDate, syncStatus, lastModifiedOffline, userId',
  
  // Less optimal: Missing useful indexes
  tasks: '++localId, syncStatus, lastModifiedOffline, userId'
}
```

### 2. Error Handling
- Always check result.success before proceeding
- Provide user-friendly error messages
- Log errors for debugging

### 3. Performance
- Use filtering and limiting in queries
- Consider pagination for large datasets
- Use bulk operations for multiple items

### 4. Sync Status Management
- Don't manually modify syncStatus unless you know what you're doing
- Use the provided hooks to maintain data integrity
- Monitor pending items for sync queue management

## 🔄 Data Flow

1. **Create**: Item gets `PENDING_CREATE` status
2. **Update**: Synced items get `PENDING_UPDATE`, others keep current status
3. **Delete**: 
   - Unsynced items: Hard deleted
   - Synced items: Marked `PENDING_DELETE`
4. **Sync** (Phase 2): Items are synced and marked `SYNCED`

## 🧪 Testing

The framework includes a demo page at `/demo` that showcases:
- Creating and managing notes
- Real-time sync status display
- Database statistics
- Error handling
- Offline functionality

## 🚀 Next Steps (Phase 2)

Phase 2 will add:
- Advanced sync status management
- Offline queue abstraction
- Conflict resolution basics
- Service worker integration
- Background sync preparation
- Enhanced error handling and logging

## 🤝 Contributing

This framework is designed to be extended. Key areas for contribution:
- Additional hook patterns
- Performance optimizations
- Better TypeScript inference
- Testing utilities
- Documentation improvements

---

**Fluid-PWA Framework - Phase 1 Complete** ✅

Ready for offline-first data management in your Next.js PWA! 