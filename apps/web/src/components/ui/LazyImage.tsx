import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ImageOff } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useLazyImage } from '../../hooks/useIntersectionObserver'

interface LazyImageProps {
  src: string
  alt: string
  placeholder?: string
  className?: string
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
  onLoad?: () => void
  onError?: () => void
  fallback?: React.ReactNode
  blurHash?: string // For progressive loading
}

export function LazyImage({
  src,
  alt,
  placeholder = '/images/placeholder.webp',
  className = '',
  objectFit = 'cover',
  onLoad,
  onError,
  fallback,
  blurHash
}: LazyImageProps) {
  const [showFallback, setShowFallback] = useState(false)
  const { ref, src: imageSrc, isLoaded, isError, hasIntersected } = useLazyImage(src, placeholder)

  const handleLoad = () => {
    onLoad?.()
  }

  const handleError = () => {
    setShowFallback(true)
    onError?.()
  }

  const imageStyle = {
    objectFit: objectFit as any
  }

  if (isError || showFallback) {
    return (
      <div 
        ref={ref}
        className={cn(
          'flex items-center justify-center bg-glass/20 text-text-muted',
          className
        )}
      >
        {fallback || (
          <div className="flex flex-col items-center justify-center space-y-2 p-4">
            <ImageOff size={24} className="text-text-muted/50" />
            <span className="text-xs text-text-muted/70">Изображение недоступно</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)}>
      {/* BlurHash placeholder (if provided) */}
      {blurHash && !isLoaded && hasIntersected && (
        <div 
          className="absolute inset-0 bg-glass/30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 3'%3E%3Crect width='4' height='3' fill='%23${blurHash}'/%3E%3C/svg%3E")`,
            backgroundSize: 'cover'
          }}
        />
      )}

      {/* Skeleton loader */}
      {!isLoaded && hasIntersected && (
        <div className="absolute inset-0 bg-gradient-to-r from-glass/30 via-glass/50 to-glass/30 animate-shimmer" />
      )}

      {/* Actual image */}
      <motion.img
        src={imageSrc}
        alt={alt}
        className={cn(
          'w-full h-full transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0'
        )}
        style={imageStyle}
        onLoad={handleLoad}
        onError={handleError}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        loading="lazy"
        decoding="async"
      />

      {/* Loading overlay */}
      {hasIntersected && !isLoaded && !isError && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-glass/20"
          initial={{ opacity: 1 }}
          animate={{ opacity: isLoaded ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-8 h-8 border-2 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin" />
        </motion.div>
      )}
    </div>
  )
}

// Specialized components for common use cases
export function RestaurantImage({ restaurant, className, ...props }: {
  restaurant: { name: string; imageUrl: string }
  className?: string
} & Partial<LazyImageProps>) {
  return (
    <LazyImage
      src={restaurant.imageUrl}
      alt={`Фото ресторана ${restaurant.name}`}
      placeholder="/images/restaurant-placeholder.webp"
      className={className}
      {...props}
    />
  )
}

export function RoomImage({ room, className, ...props }: {
  room: { name: string; imageUrl: string }
  className?: string
} & Partial<LazyImageProps>) {
  return (
    <LazyImage
      src={room.imageUrl}
      alt={`Фото номера ${room.name}`}
      placeholder="/images/room-placeholder.webp"
      className={className}
      {...props}
    />
  )
}

export function ServiceImage({ service, className, ...props }: {
  service: { name: string; imageUrl: string }
  className?: string
} & Partial<LazyImageProps>) {
  return (
    <LazyImage
      src={service.imageUrl}
      alt={`Фото услуги ${service.name}`}
      placeholder="/images/service-placeholder.webp"
      className={className}
      {...props}
    />
  )
} 