import { Metadata } from 'next'
import { ReloadButton } from './components/ReloadButton'

export const metadata: Metadata = {
  title: 'Offline',
  description: 'This page is shown when the app is offline',
}

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25V6m0 12v3.75m9.75-9.75H18m-12 0H2.25"
            />
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          You&apos;re Offline
        </h1>
        <p className="text-gray-600 mb-6">
          It looks like you&apos;re not connected to the internet. Some features may not be available.
        </p>
        <ReloadButton />
      </div>
    </div>
  )
} 