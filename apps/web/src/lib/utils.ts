import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Mobile optimization utilities
export const mobileUtils = {
  // Check if device is mobile
  isMobile: () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  },

  // Check if device is iOS
  isIOS: () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent)
  },

  // Check if device is Android
  isAndroid: () => {
    return /Android/.test(navigator.userAgent)
  },

  // Check if running in Telegram WebApp
  isTelegramWebApp: () => {
    return !!window.Telegram?.WebApp
  },

  // Get viewport dimensions
  getViewportSize: () => {
    return {
      width: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
      height: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    }
  },

  // Check if viewport is in target mobile range (360-430px)
  isTargetMobileWidth: () => {
    const { width } = mobileUtils.getViewportSize()
    return width >= 360 && width <= 430
  },

  // Add touch-friendly class names
  touchFriendlyClass: 'min-h-[44px] min-w-[44px]', // iOS HIG recommendation

  // Optimize touch events for mobile
  optimizeTouchEvents: (element: HTMLElement) => {
    // Prevent 300ms tap delay on iOS
    element.style.touchAction = 'manipulation'
    // Improve scroll performance
    element.style.webkitOverflowScrolling = 'touch'
  }
}

// Performance utilities
export const performanceUtils = {
  // Debounce function for search and input handlers
  debounce: <T extends (...args: any[]) => void>(func: T, delay: number): T => {
    let timeoutId: NodeJS.Timeout
    return ((...args: any[]) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func(...args), delay)
    }) as T
  },

  // Throttle function for scroll handlers
  throttle: <T extends (...args: any[]) => void>(func: T, delay: number): T => {
    let lastCall = 0
    return ((...args: any[]) => {
      const now = Date.now()
      if (now - lastCall >= delay) {
        lastCall = now
        func(...args)
      }
    }) as T
  },

  // Measure performance
  measurePerformance: (name: string, fn: () => void) => {
    const start = performance.now()
    fn()
    const end = performance.now()
    console.log(`${name} took ${end - start} milliseconds`)
  },

  // Check if reduce motion is preferred
  prefersReducedMotion: () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  },

  // Optimize images for different screen densities
  getOptimizedImageUrl: (baseUrl: string, width?: number, quality = 85) => {
    const dpr = window.devicePixelRatio || 1
    const targetWidth = width ? Math.round(width * dpr) : undefined
    
    // If using a service like Cloudinary or similar, append optimization params
    if (baseUrl.includes('cloudinary.com')) {
      const params = [`q_${quality}`, targetWidth && `w_${targetWidth}`, 'f_auto'].filter(Boolean).join(',')
      return baseUrl.replace('/upload/', `/upload/${params}/`)
    }
    
    return baseUrl
  },

  // Preload critical resources
  preloadImage: (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve()
      img.onerror = reject
      img.src = src
    })
  },

  // Check if browser supports WebP
  supportsWebP: (): Promise<boolean> => {
    return new Promise((resolve) => {
      const webP = new Image()
      webP.onload = webP.onerror = () => {
        resolve(webP.height === 2)
      }
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
    })
  },

  // Memory usage monitoring (for development)
  getMemoryUsage: () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      return {
        used: Math.round(memory.usedJSHeapSize / 1048576),
        total: Math.round(memory.totalJSHeapSize / 1048576),
        limit: Math.round(memory.jsHeapSizeLimit / 1048576)
      }
    }
    return null
  }
}

// Animation utilities
export const animationUtils = {
  // Spring animation presets
  spring: {
    gentle: { type: 'spring', stiffness: 120, damping: 14 },
    wobbly: { type: 'spring', stiffness: 180, damping: 12 },
    stiff: { type: 'spring', stiffness: 210, damping: 20 },
    slow: { type: 'spring', stiffness: 80, damping: 14 }
  },

  // Easing presets
  easing: {
    easeOutCubic: [0.33, 1, 0.68, 1],
    easeInOutCubic: [0.65, 0, 0.35, 1],
    easeOutQuart: [0.25, 1, 0.5, 1],
    easeInOutQuart: [0.76, 0, 0.24, 1]
  },

  // Page transition variants
  pageVariants: {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  },

  // Card animation variants
  cardVariants: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    hover: { scale: 1.02, y: -4 },
    tap: { scale: 0.98 }
  },

  // Stagger animation for lists
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  },

  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 120,
        damping: 14
      }
    }
  }
}

// Format utilities
export const formatUtils = {
  // Format price in rubles
  formatPrice: (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numPrice)
  },

  // Format time
  formatTime: (time: string) => {
    return time.replace(/(\d{2}):(\d{2})/, '$1:$2')
  },

  // Truncate text with ellipsis
  truncate: (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength - 3) + '...'
  },

  // Format phone number
  formatPhone: (phone: string) => {
    const cleaned = phone.replace(/\D/g, '')
    const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/)
    if (match) {
      return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`
    }
    return phone
  }
} 