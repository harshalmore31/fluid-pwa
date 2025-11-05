# Troubleshooting Guide

Common issues and solutions for Fluid PWA.

## Table of Contents

- [Installation Issues](#installation-issues)
- [Database Issues](#database-issues)
- [Sync Issues](#sync-issues)
- [Service Worker Issues](#service-worker-issues)
- [TypeScript Issues](#typescript-issues)
- [Performance Issues](#performance-issues)
- [Browser Compatibility](#browser-compatibility)

---

## Installation Issues

### npm install fails

**Symptom**: Installation errors or peer dependency warnings

**Solutions**:
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Use legacy peer deps (if peer dependency conflicts)
npm install --legacy-peer-deps

# Check Node.js version (requires 18+)
node --version
```

### TypeScript errors after installation

**Symptom**: `Cannot find module 'fluid-pwa'` or type errors

**Solution**:
```typescript
// Ensure tsconfig.json includes node_modules
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "types": ["node"]
  }
}
```

---

## Database Issues

### Database not initializing

**Symptom**: `Database not initialized` error

**Cause**: FluidPWAProvider not wrapping your component

**Solution**:
```typescript
// Wrap your app with FluidPWAProvider
<FluidPWAProvider config={config}>
  <YourApp />
</FluidPWAProvider>
```

### IndexedDB quota exceeded

**Symptom**: `QuotaExceededError` when adding items

**Solutions**:
1. Check available storage:
   ```typescript
   if (navigator.storage && navigator.storage.estimate) {
     const estimate = await navigator.storage.estimate();
     console.log(`Used: ${estimate.usage}, Quota: ${estimate.quota}`);
   }
   ```

2. Clean up old data:
   ```typescript
   const db = getFluidPWADatabase();
   await db.getTable('myStore')
     .where('lastModifiedOffline')
     .below(Date.now() - 30 * 24 * 60 * 60 * 1000) // Older than 30 days
     .delete();
   ```

3. Request persistent storage:
   ```typescript
   if (navigator.storage && navigator.storage.persist) {
     const isPersisted = await navigator.storage.persist();
     console.log(`Persistent storage: ${isPersisted}`);
   }
   ```

### Store not found error

**Symptom**: `Store "xyz" not found in database schema`

**Cause**: Store not defined in schema

**Solution**:
```typescript
const config: FluidPWAConfig = {
  databaseName: 'myapp',
  schema: {
    myStore: '++localId, title, syncStatus, lastModifiedOffline, userId'
  }
};
```

### Data not persisting

**Symptom**: Data disappears after page refresh

**Possible Causes**:
1. **Private/Incognito mode**: IndexedDB is cleared on close
2. **Browser settings**: User has disabled storage
3. **Service Worker conflict**: Old SW intercepting requests

**Debug**:
```typescript
// Check if IndexedDB is available
if (!window.indexedDB) {
  console.error('IndexedDB not supported');
}

// Check database contents
const db = getFluidPWADatabase();
const count = await db.getTable('myStore').count();
console.log('Items in store:', count);
```

---

## Sync Issues

### Items stuck in PENDING status

**Symptom**: Items remain PENDING_CREATE/PENDING_UPDATE forever

**Cause**: No sync logic implemented yet

**Solution**:
Fluid PWA v1.x tracks sync status but doesn't auto-sync. Implement sync:

```typescript
async function syncPendingItems() {
  const db = getFluidPWADatabase();
  const pending = await db.getAllPendingItems();

  for (const item of pending) {
    try {
      if (item.syncStatus === 'PENDING_CREATE') {
        // POST to server
        const response = await fetch('/api/items', {
          method: 'POST',
          body: JSON.stringify(item)
        });
        const { serverId } = await response.json();

        // Update to SYNCED
        await db.updateItem(item.storeName, item.localId, {
          serverId,
          syncStatus: 'SYNCED'
        });
      }
      // Handle PENDING_UPDATE and PENDING_DELETE similarly
    } catch (error) {
      // Mark as ERROR
      await db.updateItem(item.storeName, item.localId, {
        syncStatus: 'ERROR',
        errorMessage: error.message
      });
    }
  }
}

// Call on network reconnect
window.addEventListener('online', syncPendingItems);
```

### Duplicate items after sync

**Symptom**: Same item appears twice (once local, once from server)

**Cause**: Not properly linking localId with serverId

**Solution**:
```typescript
// After syncing, store the serverId
await db.updateItem('myStore', localId, {
  serverId: serverResponse.id,
  syncStatus: 'SYNCED'
});

// When fetching from server, check for existing localId
const existingItems = await db.getTable('myStore')
  .where('serverId')
  .equals(serverItem.id)
  .toArray();

if (existingItems.length === 0) {
  await db.createItem('myStore', {
    ...serverItem,
    serverId: serverItem.id,
    syncStatus: 'SYNCED'
  });
}
```

---

## Service Worker Issues

### Service Worker not registering

**Symptom**: PWA features don't work offline

**Debug**:
```typescript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(reg => console.log('SW registered:', reg))
    .catch(err => console.error('SW registration failed:', err));
}
```

**Common Fixes**:
- Ensure `sw.js` is in the `/public` folder
- Check browser console for errors
- Verify HTTPS or localhost (required for SW)

### Service Worker caching issues

**Symptom**: Stale content being served

**Solutions**:
1. Clear cache manually:
   ```javascript
   // In sw.js
   self.addEventListener('activate', (event) => {
     event.waitUntil(
       caches.keys().then(keys => {
         return Promise.all(
           keys.map(key => caches.delete(key))
         );
       })
     );
   });
   ```

2. Force update:
   ```typescript
   if ('serviceWorker' in navigator) {
     const registration = await navigator.serviceWorker.ready;
     await registration.update();
   }
   ```

### Install prompt not showing

**Symptom**: `beforeinstallprompt` event not firing

**Requirements**:
- HTTPS (or localhost)
- Valid manifest.json
- Service Worker registered
- PWA criteria met (icons, display mode, etc.)

**Debug**:
```typescript
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('Install prompt fired!');
  e.preventDefault();
  // Save for later
});
```

---

## TypeScript Issues

### Type errors with hooks

**Symptom**: `Type 'X' is not assignable to type 'Y'`

**Solution**: Provide explicit types
```typescript
interface Note extends OfflineItem {
  title: string;
  content: string;
}

const notes = useGetAllItems<Note>('notes');
const addNote = useAddItem<Note>('notes');
```

### Module not found

**Symptom**: `Cannot find module 'fluid-pwa'`

**Solution**:
```bash
# Reinstall types
npm install --save-dev @types/node @types/react

# Restart TypeScript server (VS Code)
Cmd/Ctrl + Shift + P -> "TypeScript: Restart TS Server"
```

---

## Performance Issues

### Slow query performance

**Symptom**: `useGetAllItems` takes too long

**Solutions**:
1. Add indexes to your schema:
   ```typescript
   schema: {
     notes: '++localId, title, *tags, syncStatus, lastModifiedOffline'
     //                      ^ Indexed    ^ Multi-entry index
   }
   ```

2. Use pagination:
   ```typescript
   const notes = useGetAllItems<Note>('notes', {
     limit: 20,
     offset: page * 20
   });
   ```

3. Filter on indexed fields:
   ```typescript
   const synced = useGetItemsBySyncStatus<Note>('notes', 'SYNCED');
   ```

### Memory leaks

**Symptom**: Browser tab consumes increasing memory

**Cause**: useLiveQuery subscriptions not cleaning up

**Solution**: Ensure components unmount properly
```typescript
useEffect(() => {
  // Component cleanup happens automatically with useLiveQuery
  return () => {
    // Any additional cleanup
  };
}, []);
```

---

## Browser Compatibility

### IndexedDB not available

**Browsers**: Safari Private Mode, some mobile browsers

**Detection**:
```typescript
const isIndexedDBAvailable = () => {
  try {
    return !!window.indexedDB;
  } catch {
    return false;
  }
};

if (!isIndexedDBAvailable()) {
  console.warn('IndexedDB not available. Falling back to localStorage or memory.');
}
```

### Service Worker not supported

**Browsers**: IE11, older mobile browsers

**Fallback**:
```typescript
if ('serviceWorker' in navigator) {
  // Register SW
} else {
  console.warn('Service Workers not supported. App will work online only.');
}
```

---

## Still Having Issues?

1. **Check browser console** for errors
2. **Enable debug logging**:
   ```typescript
   const config: FluidPWAConfig = {
     databaseName: 'myapp',
     schema,
     enableLogging: true
   };
   ```
3. **Search existing issues**: [GitHub Issues](https://github.com/harshalmore31/fluid-pwa/issues)
4. **Ask for help**: [GitHub Discussions](https://github.com/harshalmore31/fluid-pwa/discussions)
5. **Report bugs**: Create a new issue with:
   - Fluid PWA version
   - Browser and OS
   - Steps to reproduce
   - Error messages
   - Code sample

---

## Debug Checklist

Use this checklist when debugging:

- [ ] Node.js version >= 18
- [ ] Latest version of Fluid PWA installed
- [ ] FluidPWAProvider wrapping app
- [ ] Schema properly configured
- [ ] Browser console shows no errors
- [ ] IndexedDB visible in DevTools > Application
- [ ] Service Worker registered (if using PWA features)
- [ ] HTTPS or localhost (for PWA features)
- [ ] Tried in different browser
- [ ] Cleared cache and reloaded
