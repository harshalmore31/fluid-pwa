// React Provider for Fluid-PWA
'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { FluidPWAConfig } from './types'
import { FluidPWADatabase, initializeFluidPWA, getFluidPWADatabase, isFluidPWAInitialized } from './database'

interface FluidPWAContextType {
  database: FluidPWADatabase | null
  isInitialized: boolean
  isLoading: boolean
  error: string | null
  config: FluidPWAConfig | null
}

const FluidPWAContext = createContext<FluidPWAContextType>({
  database: null,
  isInitialized: false,
  isLoading: true,
  error: null,
  config: null
})

interface FluidPWAProviderProps {
  children: ReactNode
  config: FluidPWAConfig
  onInitialized?: (database: FluidPWADatabase) => void
  onError?: (error: Error) => void
}

/**
 * Provider component for Fluid-PWA that initializes the database
 * and provides it to child components via context
 */
export function FluidPWAProvider({ 
  children, 
  config, 
  onInitialized,
  onError 
}: FluidPWAProviderProps) {
  const [database, setDatabase] = useState<FluidPWADatabase | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initDatabase = async () => {
      try {
        setIsLoading(true)
        setError(null)

        let db: FluidPWADatabase

        if (isFluidPWAInitialized()) {
          // Use existing instance
          db = getFluidPWADatabase()
          if (config.enableLogging) {
            console.log('Fluid-PWA: Using existing database instance')
          }
        } else {
          // Initialize new instance
          if (config.enableLogging) {
            console.log('Fluid-PWA: Initializing database with config:', config)
          }
          db = initializeFluidPWA(config)
        }

        // Wait for database to be ready
        await db.open()
        
        setDatabase(db)
        onInitialized?.(db)

        if (config.enableLogging) {
          console.log('Fluid-PWA: Database successfully initialized and ready')
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize Fluid-PWA database'
        setError(errorMessage)
        onError?.(err instanceof Error ? err : new Error(errorMessage))
        
        if (config.enableLogging) {
          console.error('Fluid-PWA: Database initialization failed:', err)
        }
      } finally {
        setIsLoading(false)
      }
    }

    initDatabase()
  }, [config, onInitialized, onError])

  const contextValue: FluidPWAContextType = {
    database,
    isInitialized: database !== null && database.isReady(),
    isLoading,
    error,
    config
  }

  return (
    <FluidPWAContext.Provider value={contextValue}>
      {children}
    </FluidPWAContext.Provider>
  )
}

/**
 * Hook to access the Fluid-PWA context
 */
export function useFluidPWA(): FluidPWAContextType {
  const context = useContext(FluidPWAContext)
  
  if (!context) {
    throw new Error('useFluidPWA must be used within a FluidPWAProvider')
  }
  
  return context
}

/**
 * Hook to get the database instance with error handling
 */
export function useFluidPWADatabase(): FluidPWADatabase {
  const { database, isInitialized, error } = useFluidPWA()
  
  if (error) {
    throw new Error(`Fluid-PWA Error: ${error}`)
  }
  
  if (!isInitialized || !database) {
    throw new Error('Fluid-PWA: Database not yet initialized')
  }
  
  return database
}

/**
 * Higher-order component for wrapping pages/components with Fluid-PWA
 */
export function withFluidPWA<P extends object>(
  Component: React.ComponentType<P>,
  config: FluidPWAConfig
) {
  return function WrappedComponent(props: P) {
    return (
      <FluidPWAProvider config={config}>
        <Component {...props} />
      </FluidPWAProvider>
    )
  }
}

/**
 * Component to display loading/error states for Fluid-PWA initialization
 */
interface FluidPWAStatusProps {
  children: ReactNode
  loadingComponent?: ReactNode
  errorComponent?: (error: string) => ReactNode
}

export function FluidPWAStatus({ 
  children, 
  loadingComponent,
  errorComponent 
}: FluidPWAStatusProps) {
  const { isInitialized, isLoading, error } = useFluidPWA()

  if (error && errorComponent) {
    return <>{errorComponent(error)}</>
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <h3 className="text-red-800 font-medium">Database Error</h3>
        <p className="text-red-600 text-sm mt-1">{error}</p>
      </div>
    )
  }

  if (isLoading && loadingComponent) {
    return <>{loadingComponent}</>
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Initializing offline database...</span>
      </div>
    )
  }

  if (!isInitialized) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-yellow-800">Database not yet ready...</p>
      </div>
    )
  }

  return <>{children}</>
} 