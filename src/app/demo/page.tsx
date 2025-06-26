'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  FluidPWAProvider, 
  FluidPWAStatus,
  useAddItem,
  useGetAllItems,
  useUpdateItem,
  useDeleteItem,
  useFluidPWAStats,
  FluidPWAConfig
} from '@/lib/dexie'
import { ThemeToggle } from '@/components/ThemeToggle'

// Define the schema for our demo
const demoSchema = {
  notes: '++localId, title, content, syncStatus, lastModifiedOffline, userId',
  tasks: '++localId, title, completed, priority, syncStatus, lastModifiedOffline, userId'
}

// Configuration for Fluid-PWA
const fluidConfig: FluidPWAConfig = {
  databaseName: 'FluidPWADemo',
  schema: demoSchema,
  version: 1,
  enableLogging: true,
  userId: 'demo-user' // In real app, this would come from auth
}

// Types for our demo data
interface Note {
  title: string
  content: string
}

interface Task {
  title: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
}

function NotesDemo() {
  const [newNote, setNewNote] = useState({ title: '', content: '' })
  const [editingNote, setEditingNote] = useState<string | null>(null)
  const [editData, setEditData] = useState({ title: '', content: '' })

  // Use Fluid-PWA hooks
  const addNote = useAddItem<Note>('notes')
  const notes = useGetAllItems<Note>('notes', { orderBy: 'lastModifiedOffline', reverse: true })
  const updateNote = useUpdateItem<Note>('notes')
  const deleteNote = useDeleteItem('notes')

  const handleAddNote = async () => {
    if (!newNote.title.trim()) return
    
    const result = await addNote(newNote)
    if (result.success) {
      setNewNote({ title: '', content: '' })
    } else {
      alert(`Error: ${result.error}`)
    }
  }

  const handleUpdateNote = async (localId: string) => {
    const result = await updateNote(localId, editData)
    if (result.success) {
      setEditingNote(null)
      setEditData({ title: '', content: '' })
    } else {
      alert(`Error: ${result.error}`)
    }
  }

  const handleDeleteNote = async (localId: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      const result = await deleteNote(localId)
      if (!result.success) {
        alert(`Error: ${result.error}`)
      }
    }
  }

  const startEditing = (note: any) => {
    setEditingNote(note.localId)
    setEditData({ title: note.title, content: note.content })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Interactive Notes Demo</h2>
        <div className="text-sm text-muted-foreground">
          {notes?.length || 0} notes • All operations work offline
        </div>
      </div>
      
      {/* Add new note */}
      <div className="card p-6 rounded-xl shadow-sm animate-fade-in">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-white">✏️</span>
          </div>
          <h3 className="text-lg font-semibold text-card-foreground">Create New Note</h3>
        </div>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter note title..."
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            className="w-full px-4 py-3 bg-input border border-border rounded-lg focus-ring focus:border-ring text-foreground placeholder:text-muted-foreground transition-colors"
          />
          <textarea
            placeholder="Write your note content here..."
            value={newNote.content}
            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 bg-input border border-border rounded-lg focus-ring focus:border-ring text-foreground placeholder:text-muted-foreground resize-none transition-colors"
          />
          <button
            onClick={handleAddNote}
            disabled={!newNote.title.trim()}
            className="btn-primary px-6 py-3 rounded-lg font-medium inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Note
          </button>
        </div>
      </div>

      {/* Notes list */}
      <div className="space-y-4">
        {notes?.map((note) => (
          <div key={note.localId} className="card p-6 rounded-xl shadow-sm hover:shadow-md transition-all animate-fade-in">
            {editingNote === note.localId ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus-ring focus:border-ring text-foreground"
                />
                <textarea
                  value={editData.content}
                  onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus-ring focus:border-ring text-foreground resize-none"
                />
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleUpdateNote(note.localId)}
                    className="inline-flex items-center px-4 py-2 gradient-primary text-white rounded-lg text-sm font-medium hover:transform hover:scale-105 transition-all"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditingNote(null)}
                    className="btn-secondary px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold text-card-foreground text-lg">{note.title}</h4>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${
                      note.syncStatus === 'SYNCED' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                      note.syncStatus === 'PENDING_CREATE' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' :
                      note.syncStatus === 'PENDING_UPDATE' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                      note.syncStatus === 'PENDING_DELETE' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' :
                      'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
                    }`}>
                      {note.syncStatus === 'PENDING_CREATE' && '📤'}
                      {note.syncStatus === 'PENDING_UPDATE' && '🔄'}
                      {note.syncStatus === 'PENDING_DELETE' && '🗑️'}
                      {note.syncStatus === 'SYNCED' && '✅'}
                      {note.syncStatus === 'ERROR' && '❌'}
                      {' '}
                      {note.syncStatus.replace('PENDING_', '')}
                    </span>
                  </div>
                </div>
                
                {note.content && (
                  <p className="text-muted-foreground mb-4 whitespace-pre-wrap">{note.content}</p>
                )}
                
                <div className="flex justify-between items-center">
                  <small className="text-muted-foreground">
                    Modified: {new Date(note.lastModifiedOffline).toLocaleString()}
                  </small>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEditing(note)}
                      className="inline-flex items-center text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.localId)}
                      className="inline-flex items-center text-destructive hover:text-destructive/80 text-sm font-medium transition-colors"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {notes?.length === 0 && (
          <div className="text-center py-12 card rounded-xl border-2 border-dashed border-border">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-card-foreground mb-2">No notes yet</h3>
            <p className="text-muted-foreground">Create your first note above to see Fluid PWA in action!</p>
          </div>
        )}
      </div>
    </div>
  )
}

function StatsDemo() {
  const stats = useFluidPWAStats()

  return (
    <div className="card p-6 rounded-xl shadow-sm animate-fade-in">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
          <span className="text-white">📊</span>
        </div>
        <h3 className="text-lg font-semibold text-card-foreground">Real-time Database Statistics</h3>
      </div>
      
      {stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(stats).map(([storeName, storeStats]) => (
            <div key={storeName} className="bg-muted rounded-lg p-4 border border-border">
              <h4 className="font-medium capitalize text-foreground mb-3 flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                {storeName} Store
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{storeStats.total}</div>
                  <div className="text-muted-foreground">Total Items</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{storeStats.pending}</div>
                  <div className="text-muted-foreground">Pending Sync</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{storeStats.synced}</div>
                  <div className="text-muted-foreground">Synced</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-destructive">{storeStats.errors}</div>
                  <div className="text-muted-foreground">Errors</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span className="ml-3 text-muted-foreground">Loading statistics...</span>
        </div>
      )}
    </div>
  )
}

function DemoContent() {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header */}
      <div className="card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg font-bold">F</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Fluid PWA</h1>
                  <p className="text-sm text-muted-foreground">Framework Demo</p>
                </div>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <a 
                href="https://github.com/fluid-pwa/fluid-pwa"
                className="inline-flex items-center px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                View Source
              </a>
              <Link 
                href="/"
                className="btn-primary px-4 py-2 rounded-lg"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            <span>Live Interactive Demo</span>
          </div>
          
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Experience Fluid PWA in Action
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-8">
            This interactive demo showcases the power of offline-first data management. 
            Create, edit, and delete notes while monitoring real-time sync status. 
            <span className="font-semibold text-foreground">Try going offline!</span>
          </p>

          {/* Feature highlights */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="card rounded-lg p-4">
              <div className="text-2xl mb-2">🚀</div>
              <h3 className="font-semibold text-card-foreground mb-1">Zero Configuration</h3>
              <p className="text-sm text-muted-foreground">Just define your schema and start building</p>
            </div>
            <div className="card rounded-lg p-4">
              <div className="text-2xl mb-2">📱</div>
              <h3 className="font-semibold text-card-foreground mb-1">Offline-First</h3>
              <p className="text-sm text-muted-foreground">All operations work seamlessly offline</p>
            </div>
            <div className="card rounded-lg p-4">
              <div className="text-2xl mb-2">🔄</div>
              <h3 className="font-semibold text-card-foreground mb-1">Sync Status Tracking</h3>
              <p className="text-sm text-muted-foreground">Real-time sync status for every change</p>
            </div>
          </div>
        </div>

        <FluidPWAStatus>
          <div className="space-y-8">
            <StatsDemo />
            <NotesDemo />
            
            {/* Code snippet */}
            <div className="gradient-dark rounded-xl p-6 animate-fade-in">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-white">💻</span>
                </div>
                <h3 className="text-lg font-semibold text-white">How It's Built</h3>
              </div>
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`// This demo uses these simple hooks:
const addNote = useAddItem<Note>('notes')
const notes = useGetAllItems<Note>('notes')
const updateNote = useUpdateItem<Note>('notes')
const deleteNote = useDeleteItem('notes')

// Add a note with automatic sync status
const result = await addNote({
  title: 'My Note',
  content: 'Works offline!'
})

// ✅ Automatic sync status tracking included!`}
              </pre>
            </div>

            {/* Try offline section */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800 animate-fade-in">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg flex items-center justify-center">
                  <span className="text-yellow-600 dark:text-yellow-400">🌐</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-yellow-100">Test Offline Functionality</h3>
              </div>
              <p className="text-gray-700 dark:text-yellow-200 mb-4">
                Want to see the real power of Fluid PWA? Try these steps:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-yellow-200">
                <li>Create a few notes using the form above</li>
                <li>Open DevTools → Network tab → Check "Offline"</li>
                <li>Try creating, editing, and deleting notes</li>
                <li>Notice how everything still works and sync status updates</li>
                <li>Go back online and watch the magic happen!</li>
              </ol>
            </div>
          </div>
        </FluidPWAStatus>
      </div>
    </div>
  )
}

export default function DemoPage() {
  return (
    <FluidPWAProvider config={fluidConfig}>
      <DemoContent />
    </FluidPWAProvider>
  )
} 