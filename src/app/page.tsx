import React from 'react'
import Link from "next/link"
import { PushNotificationManager } from "@/components/PushNotificationManager"
import { PWAStatus } from "@/components/PWAStatus"
import { ThemeToggle } from '@/components/ThemeToggle'

export default function Home() {
  return (
    <div className="min-h-screen gradient-dark">
      {/* Navigation */}
      <nav className="relative z-10 px-4 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white text-lg font-bold">F</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Fluid PWA</h1>
              <p className="text-sm text-gray-300">Framework</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <a 
              href="https://github.com/fluid-pwa/fluid-pwa"
              className="hidden md:inline-flex items-center px-4 py-2 text-gray-300 hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
            <a 
              href="https://www.npmjs.com/package/fluid-pwa"
              className="hidden md:inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-all"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H8.595l.01-10.384H5.113z"/>
              </svg>
              npm
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 px-4 py-16">
        <div className="max-w-7xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-medium mb-8 animate-fade-in">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
            <span>v1.0.0 • Production Ready</span>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-slide-up">
            <span className="block">The Ultimate</span>
            <span className="block text-gradient-primary">Offline-First</span>
            <span className="block">PWA Framework</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed animate-fade-in">
            Build powerful Progressive Web Apps with seamless offline data management, 
            automatic sync status tracking, and zero-configuration setup. 
            <span className="text-blue-400 font-semibold">Using Dexie.js for offline storage</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in">
            <Link 
              href="/demo"
              className="btn-primary px-8 py-4 rounded-xl text-lg font-semibold inline-flex items-center group"
            >
              <svg className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              Try Live Demo
            </Link>
            <a 
              href="https://github.com/fluid-pwa/fluid-pwa"
              className="btn-secondary px-8 py-4 rounded-xl text-lg font-semibold inline-flex items-center text-white border-white/20 hover:border-white/40"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              View on GitHub
            </a>
          </div>

          {/* Quick Install */}
          <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 max-w-2xl mx-auto animate-fade-in">
            <p className="text-gray-300 text-sm mb-3 font-medium">Quick Install</p>
            <div className="bg-black/50 rounded-lg p-4 text-left">
              <code className="text-blue-300 font-mono text-sm">
                npm install fluid-pwa dexie dexie-react-hooks uuid
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="relative z-10 px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose Fluid PWA?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to build modern, offline-first applications with zero configuration.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card bg-white/5 backdrop-blur-sm border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-all hover:transform hover:scale-105">
              <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Zero Configuration</h3>
              <p className="text-gray-300 leading-relaxed">
                Get started in minutes with sensible defaults. Just define your schema and start building - no complex setup required.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card bg-white/5 backdrop-blur-sm border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-all hover:transform hover:scale-105">
              <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Offline-First</h3>
              <p className="text-gray-300 leading-relaxed">
                Built from the ground up for offline functionality. Your app works seamlessly without internet connection.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card bg-white/5 backdrop-blur-sm border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-all hover:transform hover:scale-105">
              <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl">🔄</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Automatic Sync Tracking</h3>
              <p className="text-gray-300 leading-relaxed">
                Every data change is automatically tracked with sync statuses. Know exactly what needs to be synchronized.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card bg-white/5 backdrop-blur-sm border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-all hover:transform hover:scale-105">
              <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl">🎣</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">React Hooks</h3>
              <p className="text-gray-300 leading-relaxed">
                Clean, composable API with powerful React hooks that feel natural and integrate seamlessly with your components.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="card bg-white/5 backdrop-blur-sm border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-all hover:transform hover:scale-105">
              <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl">💪</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">TypeScript Ready</h3>
              <p className="text-gray-300 leading-relaxed">
                Full type safety with intelligent inference. Get autocomplete and type checking out of the box.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="card bg-white/5 backdrop-blur-sm border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-all hover:transform hover:scale-105">
              <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">High Performance</h3>
              <p className="text-gray-300 leading-relaxed">
                Optimized for speed with live reactive queries and efficient IndexedDB operations under the hood.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Section */}
      <div className="relative z-10 px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="gradient-surface rounded-3xl p-8 md:p-12 dark:bg-white/5 dark:border dark:border-white/10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                  <span>Interactive Demo</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  See It in Action
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                  Experience the power of Fluid PWA with our interactive demo. Create, edit, and delete notes 
                  while watching real-time sync status updates. Works completely offline!
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 gradient-primary rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Real-time CRUD operations</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 gradient-primary rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Automatic sync status tracking</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 gradient-primary rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Database statistics dashboard</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 gradient-primary rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Full offline functionality</span>
                  </div>
                </div>

                <Link 
                  href="/demo"
                  className="btn-primary px-8 py-4 rounded-xl text-lg font-semibold inline-flex items-center group"
                >
                  <span>Launch Demo</span>
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>

              <div className="relative">
                <div className="bg-gray-900 rounded-2xl p-6 shadow-2xl">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="space-y-3 text-sm font-mono">
                    <div className="text-gray-400">// This is how simple it is:</div>
                    <div className="text-blue-400">const addNote = <span className="text-yellow-300">useAddItem</span>{'<'}<span className="text-green-400">Note</span>{'>'} (<span className="text-orange-300">'notes'</span>)</div>
                    <div className="text-blue-400">const notes = <span className="text-yellow-300">useGetAllItems</span>{'<'}<span className="text-green-400">Note</span>{'>'} (<span className="text-orange-300">'notes'</span>)</div>
                    <div className="text-gray-400 mt-4">// Add a note with automatic sync</div>
                    <div className="text-blue-400">const result = await <span className="text-yellow-300">addNote</span>({'{'}</div>
                    <div className="text-blue-400 pl-4">title: <span className="text-orange-300">'My Note'</span>,</div>
                    <div className="text-blue-400 pl-4">content: <span className="text-orange-300">'Works offline!'</span></div>
                    <div className="text-blue-400">{'})'}</div>
                    <div className="text-gray-400 mt-4">// ✅ Sync status tracked automatically</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Community Section */}
      <div className="relative z-10 px-4 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Join the Community
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            Connect with other developers, get help, and contribute to the future of offline-first PWAs.
          </p>

          <div className="grid md:grid-cols-4 gap-6">
            <a 
              href="https://github.com/harshalmore31/fluid-pwa/discussions"
              className="card bg-white/5 backdrop-blur-sm border-white/10 p-6 rounded-xl hover:bg-white/10 transition-all group text-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="text-3xl mb-3">💬</div>
              <h3 className="text-lg font-semibold text-white mb-2">Discord</h3>
              <p className="text-gray-300 text-sm">Chat with the community</p>
            </a>

            <a 
              href="https://twitter.com/fluid_pwa"
              className="card bg-white/5 backdrop-blur-sm border-white/10 p-6 rounded-xl hover:bg-white/10 transition-all group text-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="text-3xl mb-3">🐦</div>
              <h3 className="text-lg font-semibold text-white mb-2">Twitter</h3>
              <p className="text-gray-300 text-sm">Latest updates</p>
            </a>

            <a 
              href="https://github.com/fluid-pwa/fluid-pwa"
              className="card bg-white/5 backdrop-blur-sm border-white/10 p-6 rounded-xl hover:bg-white/10 transition-all group text-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="text-3xl mb-3">🐙</div>
              <h3 className="text-lg font-semibold text-white mb-2">GitHub</h3>
              <p className="text-gray-300 text-sm">Contribute code</p>
            </a>

            <a 
              href="https://www.npmjs.com/package/fluid-pwa"
              className="card bg-white/5 backdrop-blur-sm border-white/10 p-6 rounded-xl hover:bg-white/10 transition-all group text-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="text-3xl mb-3">📦</div>
              <h3 className="text-lg font-semibold text-white mb-2">npm</h3>
              <p className="text-gray-300 text-sm">Package registry</p>
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 px-4 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">F</span>
            </div>
            <span className="text-xl font-bold text-white">Fluid PWA</span>
          </div>
          <p className="text-gray-400 mb-4">
            Built with ❤️ by the Fluid PWA community
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-400">
            <a href="https://github.com/fluid-pwa/fluid-pwa/blob/main/LICENSE" className="hover:text-white transition-colors">MIT License</a>
            <span>•</span>
            <a href="https://github.com/fluid-pwa/fluid-pwa" className="hover:text-white transition-colors">GitHub</a>
            <span>•</span>
            <a href="https://www.npmjs.com/package/fluid-pwa" className="hover:text-white transition-colors">npm</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
