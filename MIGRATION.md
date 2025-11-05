# Migration Guide

This guide helps you migrate between major versions of Fluid PWA.

## Table of Contents

- [General Migration Steps](#general-migration-steps)
- [Version-Specific Migrations](#version-specific-migrations)
  - [Migrating to 2.0.0 (Future)](#migrating-to-200-future)
  - [Migrating to 1.0.0](#migrating-to-100)

---

## General Migration Steps

Before migrating to a new major version:

1. **Backup your data**: Export your IndexedDB data before upgrading
2. **Review breaking changes**: Read the CHANGELOG.md for your target version
3. **Update dependencies**: Update `fluid-pwa` and peer dependencies
4. **Run tests**: Ensure your application works after the update
5. **Test offline functionality**: Verify PWA features still work correctly

---

## Version-Specific Migrations

### Migrating to 2.0.0 (Future)

> **Note**: Version 2.0.0 is not yet released. This section will be updated when breaking changes are introduced.

**Estimated Release**: Q2 2025

**Expected Breaking Changes**:
- Background sync API changes
- Conflict resolution strategy updates
- Schema migration system

**Migration Steps**: TBD

---

### Migrating to 1.0.0

**From**: Beta versions (0.x.x)
**To**: 1.0.0

#### Breaking Changes

No breaking changes from beta to 1.0.0. The API is stable and backward compatible.

#### New Features

- Automatic sync status tracking
- Smart soft/hard delete
- Bulk operations hooks
- Database statistics dashboard
- TypeScript strict mode support

#### Migration Steps

1. **Update package**:
   ```bash
   npm install fluid-pwa@latest
   ```

2. **No code changes required** - All beta APIs are maintained in 1.0.0

3. **Optional enhancements**:
   ```typescript
   // Take advantage of new bulk operations
   import { useBulkOperations } from 'fluid-pwa';

   const { bulkAdd, bulkUpdate, bulkDelete } = useBulkOperations('notes');
   ```

4. **Update peer dependencies** (if needed):
   ```bash
   npm install next@latest react@latest react-dom@latest
   ```

---

## Common Migration Scenarios

### Scenario 1: Updating Schema

When you need to add new fields or stores:

```typescript
// Old schema (v1)
const schema = {
  notes: '++localId, title, syncStatus, lastModifiedOffline'
};

// New schema (v2) - Add new field
const schema = {
  notes: '++localId, title, content, syncStatus, lastModifiedOffline'
};

// Update config
const config: FluidPWAConfig = {
  databaseName: 'myapp',
  schema,
  version: 2, // Increment version number
};
```

**Important**: Incrementing the `version` number triggers Dexie's schema upgrade.

### Scenario 2: Migrating Existing Data

Use Dexie's `upgrade()` method for data migrations:

```typescript
import Dexie from 'dexie';

const db = new Dexie('myapp');

db.version(1).stores({
  notes: '++localId, title, syncStatus'
});

db.version(2).stores({
  notes: '++localId, title, content, syncStatus, lastModifiedOffline'
}).upgrade(tx => {
  return tx.table('notes').toCollection().modify(note => {
    note.content = note.content || ''; // Add default content
  });
});
```

### Scenario 3: Changing Store Names

```typescript
// Old
const schema = { todos: '++localId, ...' };

// New - Renaming store
const schema = { tasks: '++localId, ...' };

// Migration: Copy data from old store to new store
db.version(2).stores({
  tasks: '++localId, title, completed, syncStatus',
  todos: null // Delete old store
}).upgrade(tx => {
  return tx.table('todos').toArray().then(items => {
    return tx.table('tasks').bulkAdd(items);
  });
});
```

---

## Data Export/Import

### Exporting Data Before Migration

```typescript
async function exportData(storeName: string) {
  const db = getFluidPWADatabase();
  const table = db.getTable(storeName);
  const data = await table.toArray();

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `${storeName}-backup-${Date.now()}.json`;
  a.click();
}
```

### Importing Data After Migration

```typescript
async function importData(storeName: string, file: File) {
  const text = await file.text();
  const data = JSON.parse(text);

  const { bulkAdd } = useBulkOperations(storeName);
  await bulkAdd(data);
}
```

---

## Rollback Strategy

If migration fails, you can rollback:

1. **Reinstall previous version**:
   ```bash
   npm install fluid-pwa@1.0.0
   ```

2. **Restore from backup**:
   - Use the export/import functions above
   - Or restore IndexedDB from browser backup

3. **Clear database** (last resort):
   ```typescript
   await Dexie.delete('myDatabaseName');
   ```

---

## Testing Migrations

### Local Testing

```typescript
import { FluidPWADatabase } from 'fluid-pwa';

describe('Database Migration', () => {
  it('should migrate from v1 to v2', async () => {
    // Create v1 database
    const dbV1 = new FluidPWADatabase({
      databaseName: 'test-db',
      schema: { notes: '++localId, title' },
      version: 1
    });

    await dbV1.createItem('notes', { title: 'Test' });

    // Upgrade to v2
    const dbV2 = new FluidPWADatabase({
      databaseName: 'test-db',
      schema: { notes: '++localId, title, content' },
      version: 2
    });

    const items = await dbV2.getTable('notes').toArray();
    expect(items[0]).toHaveProperty('title');
  });
});
```

---

## Getting Help

- **Issues**: [GitHub Issues](https://github.com/harshalmore31/fluid-pwa/issues)
- **Discussions**: [GitHub Discussions](https://github.com/harshalmore31/fluid-pwa/discussions)
- **Documentation**: [README.md](./README.md)

---

## Contributing

Found a migration issue? Please:
1. Report it in [GitHub Issues](https://github.com/harshalmore31/fluid-pwa/issues)
2. Include your source and target versions
3. Provide error messages and stack traces
4. Share your schema configuration

We'll update this guide based on community feedback!
