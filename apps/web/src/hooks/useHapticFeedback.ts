import { useCallback, useEffect, useState } from 'react'

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        HapticFeedback?: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy') => void
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void
          selectionChanged: () => void
        }
        isVersionAtLeast: (version: string) => boolean
      }
    }
  }
}

type HapticStyle = 'light' | 'medium' | 'heavy'
type NotificationType = 'error' | 'success' | 'warning'

interface HapticFeedback {
  impact: (style?: HapticStyle) => void
  notification: (type: NotificationType) => void
  selection: () => void
  isSupported: boolean
}

export function useHapticFeedback(): HapticFeedback {
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    // Check if we're in Telegram WebApp and haptic feedback is supported
    const telegram = window.Telegram?.WebApp
    const hasHapticSupport = telegram?.HapticFeedback && 
                            telegram?.isVersionAtLeast('6.1')
    
    setIsSupported(!!hasHapticSupport)
  }, [])

  const impact = useCallback((style: HapticStyle = 'light') => {
    if (isSupported && window.Telegram?.WebApp?.HapticFeedback) {
      try {
        window.Telegram.WebApp.HapticFeedback.impactOccurred(style)
      } catch (error) {
        console.warn('Haptic feedback failed:', error)
      }
    }
  }, [isSupported])

  const notification = useCallback((type: NotificationType) => {
    if (isSupported && window.Telegram?.WebApp?.HapticFeedback) {
      try {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred(type)
      } catch (error) {
        console.warn('Haptic notification failed:', error)
      }
    }
  }, [isSupported])

  const selection = useCallback(() => {
    if (isSupported && window.Telegram?.WebApp?.HapticFeedback) {
      try {
        window.Telegram.WebApp.HapticFeedback.selectionChanged()
      } catch (error) {
        console.warn('Haptic selection failed:', error)
      }
    }
  }, [isSupported])

  return {
    impact,
    notification,
    selection,
    isSupported
  }
}

// Convenience hooks for specific interactions
export function useButtonHaptic() {
  const { impact } = useHapticFeedback()
  
  return useCallback((style: HapticStyle = 'light') => {
    impact(style)
  }, [impact])
}

export function useSuccessHaptic() {
  const { notification } = useHapticFeedback()
  
  return useCallback(() => {
    notification('success')
  }, [notification])
}

export function useErrorHaptic() {
  const { notification } = useHapticFeedback()
  
  return useCallback(() => {
    notification('error')
  }, [notification])
}

export function useSelectionHaptic() {
  const { selection } = useHapticFeedback()
  
  return selection
} 