'use client'

export function ReloadButton() {
  const handleReload = () => {
    window.location.reload()
  }

  return (
    <button
      onClick={handleReload}
      className="
        w-full h-12 px-6 bg-gray-900 text-white rounded-md font-medium
        hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500
        focus:ring-offset-2 transition-colors text-base min-w-[3rem]
      "
      aria-label="Reload page and try to reconnect"
    >
      Try Again
    </button>
  )
} 