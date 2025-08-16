import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { TelegramProvider } from './providers/TelegramProvider'
import { router } from './router'

export function App() {
  return (
    <TelegramProvider>
      <RouterProvider router={router} />
    </TelegramProvider>
  )
} 