import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'card' | 'image' | 'button' | 'avatar' | 'custom'
  lines?: number
  width?: string | number
  height?: string | number
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  animate?: boolean
}

const variantStyles = {
  text: 'h-4 w-full rounded-md',
  card: 'h-32 w-full rounded-xl',
  image: 'aspect-square w-full rounded-lg',
  button: 'h-10 w-24 rounded-lg',
  avatar: 'h-10 w-10 rounded-full',
  custom: ''
}

const roundedStyles = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full'
}

const pulseAnimation = {
  initial: { opacity: 0.6 },
  animate: { 
    opacity: [0.6, 0.9, 0.6],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

const shimmerAnimation = {
  initial: { 
    backgroundPosition: '-200px 0'
  },
  animate: {
    backgroundPosition: '200px 0',
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear"
    }
  }
}

export function Skeleton({ 
  className, 
  variant = 'text', 
  lines = 1,
  width,
  height,
  rounded = 'md',
  animate = true,
  ...props 
}: SkeletonProps) {
  const baseClasses = cn(
    'bg-gradient-to-r from-glass/30 via-glass/50 to-glass/30',
    'backdrop-blur-sm border border-glass/20',
    'relative overflow-hidden',
    variantStyles[variant],
    rounded !== 'md' && roundedStyles[rounded],
    className
  )

  const style = {
    width: width || undefined,
    height: height || undefined,
    backgroundSize: '400px 100%'
  }

  // For text variant with multiple lines
  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }, (_, i) => (
          <motion.div
            key={i}
            className={cn(
              baseClasses,
              i === lines - 1 && 'w-3/4' // Last line shorter
            )}
            style={style}
            {...(animate && pulseAnimation)}
            {...props}
          >
            {animate && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                {...shimmerAnimation}
              />
            )}
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <motion.div
      className={baseClasses}
      style={style}
      {...(animate && pulseAnimation)}
      {...props}
    >
      {animate && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          {...shimmerAnimation}
        />
      )}
    </motion.div>
  )
}

// Preset skeleton components for common use cases
export function CardSkeleton({ className, ...props }: Omit<SkeletonProps, 'variant'>) {
  return (
    <div className={cn("space-y-4 p-4", className)} {...props}>
      <Skeleton variant="image" className="h-48" />
      <div className="space-y-2">
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" lines={2} />
      </div>
      <Skeleton variant="button" />
    </div>
  )
}

export function RestaurantCardSkeleton({ className, ...props }: Omit<SkeletonProps, 'variant'>) {
  return (
    <div className={cn("space-y-3 p-4", className)} {...props}>
      <Skeleton variant="image" className="aspect-[4/3]" />
      <div className="space-y-2">
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="60%" />
        <div className="flex items-center gap-2">
          <Skeleton variant="avatar" className="h-6 w-6" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
    </div>
  )
}

export function MenuItemSkeleton({ className, ...props }: Omit<SkeletonProps, 'variant'>) {
  return (
    <div className={cn("flex items-center space-x-4 p-4", className)} {...props}>
      <Skeleton variant="image" className="h-16 w-16" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" width="70%" />
        <Skeleton variant="text" width="90%" />
        <div className="flex items-center justify-between">
          <Skeleton variant="text" width="30%" />
          <Skeleton variant="button" className="h-8 w-16" />
        </div>
      </div>
    </div>
  )
}

export function ServiceSkeleton({ className, ...props }: Omit<SkeletonProps, 'variant'>) {
  return (
    <div className={cn("space-y-4 p-6", className)} {...props}>
      <div className="flex items-center space-x-4">
        <Skeleton variant="avatar" className="h-16 w-16" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
      <Skeleton variant="text" lines={3} />
      <div className="flex justify-between items-center">
        <Skeleton variant="text" width="25%" />
        <Skeleton variant="button" />
      </div>
    </div>
  )
} 