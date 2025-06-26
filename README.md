# 🚀 Fluid PWA Framework

> **The Ultimate Offline-First Progressive Web App Framework**  
> Rapid PWA development with multiple batteries for seamless offline experiences

[![npm version](https://badge.fury.io/js/fluid-pwa.svg)](https://badge.fury.io/js/fluid-pwa)
[![Apache 2.0 License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15+-black.svg)](https://nextjs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

---

## ✨ What is Fluid PWA?

Fluid PWA is a **production-ready framework** that makes building offline-first Progressive Web Apps effortless. It provides a robust, configurable, and developer-friendly solution for rapid PWA development with multiple batteries for offline data management and automatic synchronization status tracking.

### 🎯 **Built for Developers, by a Developer**

- **🔧 Zero Configuration** - Works out of the box with sensible defaults
- **🎣 React Hooks** - Clean, composable API that feels natural
- **📱 Offline-First** - Designed to work seamlessly without internet
- **🔄 Sync Management** - Automatic tracking of pending changes
- **💪 TypeScript** - Full type safety with intelligent inference
- **⚡ Performance** - Optimized for speed and efficiency

> **Open Source**: This project is created and maintained by [@harshalmore31](https://github.com/harshalmore31) as an open-source initiative to provide the ultimate offline-first PWA framework.

---

## 🚀 Quick Start

### Installation

```bash
npm install fluid-pwa dexie dexie-react-hooks uuid
# or
yarn add fluid-pwa dexie dexie-react-hooks uuid
# or
pnpm add fluid-pwa dexie dexie-react-hooks uuid
```

### Basic Setup

```typescript
import { FluidPWAProvider, FluidPWAConfig } from 'fluid-pwa'

// 1. Define your data schema
const schema = {
  notes: '++localId, title, content, syncStatus, lastModifiedOffline, userId',
  tasks: '++localId, title, completed, priority, syncStatus, lastModifiedOffline, userId'
}

// 2. Configure Fluid PWA
const config: FluidPWAConfig = {
  databaseName: 'MyApp',
  schema,
  version: 1,
  enableLogging: true
}

// 3. Wrap your app
export default function App() {
  return (
    <FluidPWAProvider config={config}>
      <MyApp />
    </FluidPWAProvider>
  )
}
```

### Use in Components

```typescript
import { useAddItem, useGetAllItems, useUpdateItem, useDeleteItem } from 'fluid-pwa'

function NotesApp() {
  const addNote = useAddItem<Note>('notes')
  const notes = useGetAllItems<Note>('notes')
  const updateNote = useUpdateItem<Note>('notes')
  const deleteNote = useDeleteItem('notes')

  const handleAdd = async () => {
    const result = await addNote({
      title: 'My Note',
      content: 'This works offline!'
    })
    
    if (result.success) {
      console.log('✅ Note saved with ID:', result.data)
    }
  }

  return (
    <div>
      <button onClick={handleAdd}>Add Note</button>
      {notes?.map(note => (
        <div key={note.localId}>
          <h3>{note.title}</h3>
          <span>{note.syncStatus}</span> {/* PENDING_CREATE, SYNCED, etc. */}
        </div>
      ))}
    </div>
  )
}
```

---

## 🌟 Key Features

### **🔄 Automatic Sync Status Management**
Every data change is automatically tracked with sync statuses like `PENDING_CREATE`, `PENDING_UPDATE`, `SYNCED`, making it easy to implement data synchronization.

### **🎣 Powerful React Hooks**
- `useAddItem` - Create new items with validation hooks
- `useGetAllItems` - Reactive queries with filtering and sorting
- `useUpdateItem` - Update with automatic sync status handling
- `useDeleteItem` - Smart deletion (hard/soft delete based on sync status)
- `useGetPendingItems` - Get items that need to be synced
- `useFluidPWAStats` - Database statistics for monitoring

### **⚡ Live Reactive Updates**
Built on Dexie's live queries - your UI automatically updates when data changes, even across browser tabs!

### **🛡️ Type Safety**
Full TypeScript support with intelligent type inference:
```typescript
interface Note {
  title: string
  content: string
}

const notes = useGetAllItems<Note>('notes') // Fully typed!
```

### **🔧 Configurable & Extensible**
```typescript
const addNote = useAddItem<Note>('notes', {
  onBeforeAdd: async (note) => {
    // Validation, transformation, etc.
    return { ...note, slug: generateSlug(note.title) }
  },
  onAfterAdd: async (note, id) => {
    // Analytics, notifications, etc.
    analytics.track('Note Created', { id })
  }
})
```

---

## 📱 Live Demo

Experience Fluid PWA in action:

🌐 **[View the Demo](https://github.com/harshalmore31/fluid-pwa/tree/main/src/app/demo)**

The demo showcases:
- ✅ Creating and managing notes offline
- ✅ Real-time sync status indicators  
- ✅ Database statistics dashboard
- ✅ Works completely offline
- ✅ Multi-tab synchronization

---

## 📚 Documentation

### Core Concepts
- [Getting Started Guide](./src/lib/dexie/README.md)
- [Schema Design](./docs/schema-design.md)
- [Sync Status Management](./docs/sync-status.md)
- [React Hooks API](./docs/hooks-api.md)
- [Best Practices](./docs/best-practices.md)

### Advanced Topics
- [Custom Validation](./docs/validation.md)
- [Performance Optimization](./docs/performance.md)
- [Testing Strategies](./docs/testing.md)
- [Migration Guide](./docs/migration.md)

---

## 🏗️ Architecture

Fluid PWA is built on a solid foundation:

```
┌─────────────────────────────────────┐
│          React Components          │
├─────────────────────────────────────┤
│         Fluid PWA Hooks            │
├─────────────────────────────────────┤
│        Dexie.js Database           │
├─────────────────────────────────────┤
│         IndexedDB API              │
└─────────────────────────────────────┘
```

**Phase 1 (Current)**: Foundation & Core CRUD Operations  
**Phase 2 (Coming)**: Background Sync & Conflict Resolution  
**Phase 3 (Future)**: Real-time Collaboration & Advanced Sync

---

## 🤝 Contributing

We welcome contributions! Fluid PWA is built by the community, for the community.

### 🚀 **Quick Contribution Setup**

```bash
# 1. Fork & Clone
git clone https://github.com/YOUR_USERNAME/fluid-pwa.git
cd fluid-pwa

# 2. Install dependencies
npm install

# 3. Start development
npm run dev

# 4. Make your changes and test
npm run test

# 5. Submit a PR!
```

### 📋 **Contribution Areas**

- 🐛 **Bug Fixes** - Help us squash bugs
- ✨ **New Features** - Add hooks, utilities, or integrations
- 📖 **Documentation** - Improve guides and examples
- 🧪 **Testing** - Add test cases and improve coverage
- 🎨 **Examples** - Create real-world usage examples
- 🚀 **Performance** - Optimize queries and operations

### 📝 **Development Guidelines**

1. **Code Style**: We use ESLint and Prettier
2. **Testing**: Add tests for new features
3. **Documentation**: Update docs for API changes
4. **TypeScript**: Maintain strict type safety
5. **Commits**: Use conventional commit messages

---

## 🛣️ Roadmap

### ✅ **Phase 1: Foundation (Current)**
- [x] Core Dexie.js integration
- [x] React hooks for CRUD operations
- [x] Automatic sync status tracking
- [x] TypeScript support
- [x] Provider pattern
- [x] Comprehensive documentation

### 🚧 **Phase 2: Enhanced Sync (Next)**
- [ ] Background sync with Service Workers
- [ ] Conflict resolution strategies
- [ ] Retry mechanisms with exponential backoff
- [ ] Batch operations optimization
- [ ] Advanced error handling

### 🔮 **Phase 3: Advanced Features (Future)**
- [ ] Real-time collaboration
- [ ] Multi-device synchronization
- [ ] Encryption support
- [ ] Plugin architecture
- [ ] Cloud storage integrations

---

## 📊 Why Choose Fluid PWA?

| Feature | Fluid PWA | Manual Setup | Other Solutions |
|---------|-----------|--------------|-----------------|
| **Setup Time** | 5 minutes | Days/Weeks | Hours |
| **TypeScript** | ✅ Built-in | 🔧 Manual | ❌ Limited |
| **Sync Status** | ✅ Automatic | 🔧 Manual | ❌ None |
| **React Hooks** | ✅ Optimized | 🔧 Build Your Own | ❌ Limited |
| **Offline-First** | ✅ By Design | 🔧 Complex Setup | ❌ Afterthought |
| **Testing** | ✅ Test Utils | 🔧 DIY | ❌ Difficult |

---

## 🌍 Community

Join our growing community of developers building amazing offline-first apps!

- 💬 **[GitHub Discussions](https://github.com/harshalmore31/fluid-pwa/discussions)** - Get help and share ideas
- 🐛 **[GitHub Issues](https://github.com/harshalmore31/fluid-pwa/issues)** - Report bugs and request features

---

## 📄 License

Apache 2.0 License - see the [LICENSE](LICENSE) file for details.

---

## 💝 Sponsors

Fluid PWA is open source and free. If you find it useful, consider sponsoring the project:

[![Sponsor](https://img.shields.io/badge/Sponsor-❤️-pink.svg)](https://github.com/sponsors/fluid-pwa)

---

## 🙏 Acknowledgments

- **[Dexie.js](https://dexie.org/)** - Excellent IndexedDB wrapper used for offline data management
- **[Next.js](https://nextjs.org/)** - The React framework that makes PWAs awesome
- **Open Source Community** - For the amazing tools and libraries that make this possible

---

<div align="center">

**[🌐 Repository](https://github.com/harshalmore31/fluid-pwa)** •
**[📚 Documentation](https://github.com/harshalmore31/fluid-pwa/blob/main/README.md)** •
**[🚀 Demo](https://github.com/harshalmore31/fluid-pwa/tree/main/src/app/demo)** •
**[💬 Discussions](https://github.com/harshalmore31/fluid-pwa/discussions)**

**Built with ❤️ by [Harshal More](https://github.com/harshalmore31)**

</div>
