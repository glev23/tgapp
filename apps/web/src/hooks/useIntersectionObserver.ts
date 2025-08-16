import { useEffect, useRef, useState, useCallback } from 'react'

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  onIntersect?: (entry: IntersectionObserverEntry) => void
  once?: boolean
}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)
  const targetRef = useRef<HTMLElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const {
    threshold = 0.1,
    root = null,
    rootMargin = '0px',
    onIntersect,
    once = false
  } = options

  const observe = useCallback(() => {
    if (targetRef.current && !observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const isCurrentlyIntersecting = entry.isIntersecting
            
            setIsIntersecting(isCurrentlyIntersecting)
            
            if (isCurrentlyIntersecting && !hasIntersected) {
              setHasIntersected(true)
              onIntersect?.(entry)
              
              if (once && observerRef.current) {
                observerRef.current.disconnect()
                observerRef.current = null
              }
            }
          })
        },
        { threshold, root, rootMargin }
      )

      observerRef.current.observe(targetRef.current)
    }
  }, [threshold, root, rootMargin, onIntersect, once, hasIntersected])

  const unobserve = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
      observerRef.current = null
    }
  }, [])

  useEffect(() => {
    observe()
    return unobserve
  }, [observe, unobserve])

  return {
    ref: targetRef,
    isIntersecting,
    hasIntersected,
    observe,
    unobserve
  }
}

// Specific hook for lazy loading images
export function useLazyImage(src: string, placeholder?: string) {
  const [imageSrc, setImageSrc] = useState(placeholder || '')
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)

  const { ref, hasIntersected } = useIntersectionObserver({
    once: true,
    threshold: 0.1
  })

  useEffect(() => {
    if (hasIntersected && src) {
      const img = new Image()
      
      img.onload = () => {
        setImageSrc(src)
        setIsLoaded(true)
        setIsError(false)
      }
      
      img.onerror = () => {
        setIsError(true)
        setIsLoaded(false)
      }
      
      img.src = src
    }
  }, [hasIntersected, src])

  return {
    ref,
    src: imageSrc,
    isLoaded,
    isError,
    hasIntersected
  }
}

// Hook for lazy loading components
export function useLazyComponent<T = any>(
  loader: () => Promise<T>,
  deps: any[] = []
) {
  const [component, setComponent] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const { ref, hasIntersected } = useIntersectionObserver({
    once: true,
    threshold: 0.1
  })

  useEffect(() => {
    if (hasIntersected && !component && !isLoading) {
      setIsLoading(true)
      setError(null)

      loader()
        .then((loadedComponent) => {
          setComponent(loadedComponent)
          setIsLoading(false)
        })
        .catch((err) => {
          setError(err)
          setIsLoading(false)
        })
    }
  }, [hasIntersected, component, isLoading, loader, ...deps])

  return {
    ref,
    component,
    isLoading,
    error,
    hasIntersected
  }
}

// Hook for triggering animations when element comes into view
export function useScrollAnimation(
  animationClass: string = 'animate-fade-in',
  options?: UseIntersectionObserverOptions
) {
  const [shouldAnimate, setShouldAnimate] = useState(false)

  const { ref, hasIntersected } = useIntersectionObserver({
    once: true,
    threshold: 0.2,
    ...options,
    onIntersect: () => {
      setShouldAnimate(true)
      options?.onIntersect?.(arguments[0])
    }
  })

  return {
    ref,
    shouldAnimate,
    hasIntersected,
    className: shouldAnimate ? animationClass : ''
  }
} 