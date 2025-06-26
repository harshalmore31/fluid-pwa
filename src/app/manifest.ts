import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'PWA Next App Template',
    short_name: 'PWA Next',
    description: 'A Progressive Web App template built with Next.js 15',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'en',
    dir: 'ltr',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icon-192x192.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'any'
      },
      {
        src: '/icon-512x512.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'any'
      }
    ],
    screenshots: [
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        form_factor: 'narrow'
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        form_factor: 'wide'
      }
    ],
    categories: ['productivity', 'utilities', 'developer'],
    related_applications: [],
    prefer_related_applications: false,
    shortcuts: [
      {
        name: 'Home',
        short_name: 'Home',
        description: 'Go to the home page',
        url: '/',
        icons: [{ src: '/icon-192x192.png', sizes: '192x192', type: 'image/png' }]
      },
      {
        name: 'Offline',
        short_name: 'Offline',
        description: 'View offline page',
        url: '/offline',
        icons: [{ src: '/icon-192x192.png', sizes: '192x192', type: 'image/png' }]
      }
    ]
  }
} 