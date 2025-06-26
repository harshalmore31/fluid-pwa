import { PushNotificationManager } from "@/components/PushNotificationManager"
import { PWAStatus } from "@/components/PWAStatus"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white text-sm md:text-base font-bold">P</span>
              </div>
              <h1 className="text-lg md:text-xl font-semibold text-gray-900">PWA Next App</h1>
            </div>
            <div className="text-xs md:text-sm text-gray-500 font-medium">Template</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Welcome to PWA Next App
          </h2>
          <p className="text-gray-600 mb-4">
            A Progressive Web App template built with Next.js 15, featuring offline support, 
            push notifications, and mobile-first responsive design.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Next.js 15
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              PWA Ready
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Offline Support
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
              Mobile First
            </span>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Offline Support */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Offline Support</h3>
            <p className="text-gray-600 text-sm">
              Works offline with service worker caching. Try disconnecting your internet!
            </p>
          </div>

          {/* Responsive Design */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Mobile First</h3>
            <p className="text-gray-600 text-sm">
              Responsive design with 44px+ touch targets and optimized for mobile devices.
            </p>
          </div>

          {/* Fast Performance */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Performance</h3>
            <p className="text-gray-600 text-sm">
              Optimized with Next.js 15, server components, and performance best practices.
            </p>
          </div>
        </div>

        {/* PWA Status with Badges */}
        <PWAStatus />

        {/* Push Notifications */}
        <PushNotificationManager />

        {/* Getting Started */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 md:mb-6">Getting Started</h3>
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div className="flex-1">
                <h4 className="text-base font-medium text-gray-900 mb-1">Install the App</h4>
                <p className="text-sm md:text-base text-gray-600">Click the install button in your browser&apos;s address bar or use the install prompt</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div className="flex-1">
                <h4 className="text-base font-medium text-gray-900 mb-1">Test Offline</h4>
                <p className="text-sm md:text-base text-gray-600">Disconnect your internet and see the app still works with cached content</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div className="flex-1">
                <h4 className="text-base font-medium text-gray-900 mb-1">Enable Notifications</h4>
                <p className="text-sm md:text-base text-gray-600">Allow notifications to test the push notification feature and stay updated</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 py-6 md:py-8 text-center text-xs md:text-sm text-gray-500">
        <p>PWA Next App Template - Built with Next.js 15, TypeScript, and Tailwind CSS</p>
        <p className="mt-2 text-xs text-gray-400">
          Offline-ready • Mobile-first • Responsive • Push Notifications
        </p>
      </footer>
    </div>
  )
}
