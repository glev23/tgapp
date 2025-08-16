import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { TabBar } from './TabBar'

export function Layout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Main content */}
      <main className="pb-20 pt-safe-top">
        <Outlet />
      </main>
      
      {/* Bottom navigation */}
      <TabBar />
    </div>
  )
} 