import { TemplateConfig } from '../types'

export const basicTemplate: TemplateConfig = {
  name: 'basic',
  description: 'Minimal setup with essential Fluid PWA features',
  features: ['core'],
  dependencies: {
    'dexie': '^4.0.11',
    'dexie-react-hooks': '^1.1.7',
    'uuid': '^11.1.0'
  },
  devDependencies: {
    '@types/uuid': '^10.0.0',
    'tailwindcss': '^4.0.0'
  },
  scripts: {
    'build:package': 'tsup src/lib/index.ts --format cjs,esm --dts'
  },
  files: [
    {
      path: 'src/app/page.tsx',
      content: `'use client'

import { FluidPWAProvider, useAddItem, useGetAllItems, FluidPWAConfig } from 'fluid-pwa'
import { useState } from 'react'

const schema = {
  notes: '++localId, title, content, syncStatus, lastModifiedOffline, userId'
}

const config: FluidPWAConfig = {
  databaseName: '{{PROJECT_NAME}}',
  schema,
  version: 1,
  enableLogging: true
}

interface Note {
  title: string
  content: string
}

function NotesApp() {
  const [newNote, setNewNote] = useState({ title: '', content: '' })
  const addNote = useAddItem<Note>('notes')
  const notes = useGetAllItems<Note>('notes')

  const handleAdd = async () => {
    if (!newNote.title.trim()) return
    
    const result = await addNote(newNote)
    if (result.success) {
      setNewNote({ title: '', content: '' })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{{PROJECT_NAME}}</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Note</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Note title..."
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="Note content..."
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
            />
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Note
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {notes?.map((note) => (
            <div key={note.localId} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{note.title}</h3>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {note.syncStatus}
                </span>
              </div>
              <p className="text-gray-700">{note.content}</p>
              <p className="text-sm text-gray-500 mt-2">
                {new Date(note.lastModifiedOffline).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <FluidPWAProvider config={config}>
      <NotesApp />
    </FluidPWAProvider>
  )
}`,
      template: true
    },
    {
      path: 'src/app/layout.tsx',
      content: `import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '{{PROJECT_NAME}}',
  description: 'A Fluid PWA application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}`,
      template: true
    },
    {
      path: 'src/app/globals.css',
      content: `@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html,
body {
  max-width: 100vw;
  overflow-x: hidden;
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    )
    rgb(var(--background-start-rgb));
}

a {
  color: inherit;
  text-decoration: none;
}

@media (prefers-color-scheme: dark) {
  html {
    color-scheme: dark;
  }
}`
    },
    {
      path: 'tailwind.config.js',
      content: `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}`
    },
    {
      path: 'next.config.js',
      content: `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Enable Service Worker support
    swcMinify: true,
  },
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate'
          },
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8'
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig`
    },
    {
      path: 'public/manifest.json',
      content: `{
  "name": "{{PROJECT_NAME}}",
  "short_name": "{{PROJECT_NAME}}",
  "description": "A Fluid PWA application",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}`,
      template: true
    },
    {
      path: 'README.md',
      content: `# {{PROJECT_NAME}}

This is a [Fluid PWA](https://fluid-pwa.dev) project bootstrapped with \`create-fluid-pwa\`.

## Getting Started

First, run the development server:

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

This project includes:
- 📱 Offline-first PWA functionality
- 🗄️ Local data management with Dexie.js
- 🔄 Automatic sync status tracking
- 🎨 Tailwind CSS for styling
- ✅ TypeScript support

## Learn More

To learn more about Fluid PWA, take a look at the following resources:

- [Fluid PWA Repository](https://github.com/harshalmore31/fluid-pwa) - learn about Fluid PWA features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy

The easiest way to deploy your Fluid PWA app is to use the [Vercel Platform](https://vercel.com/new).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.`,
      template: true
    }
  ]
} 