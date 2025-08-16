import React from 'react'
import { motion, type MotionProps } from 'framer-motion'
import clsx from 'clsx'

export interface CardProps extends MotionProps {
  variant?: 'default' | 'elevated' | 'outlined'
  children: React.ReactNode
  className?: string
  clickable?: boolean
  onClick?: () => void
}

export function Card({
  variant = 'default',
  children,
  className,
  clickable = false,
  onClick,
  ...motionProps
}: CardProps) {
  const baseStyles = [
    'bg-surface rounded-xl overflow-hidden',
    'transition-all duration-200 ease-out'
  ]

  const variantStyles = {
    default: ['border border-gray-100'],
    elevated: ['shadow-lg shadow-shadow-strong'],
    outlined: ['border-2 border-gray-200']
  }

  const interactiveStyles = clickable ? [
    'cursor-pointer',
    'hover:shadow-xl hover:shadow-shadow-strong',
    'hover:-translate-y-1',
    'active:translate-y-0 active:shadow-lg'
  ] : []

  return (
    <motion.div
      className={clsx(
        baseStyles,
        variantStyles[variant],
        interactiveStyles,
        className
      )}
      onClick={onClick}
      whileHover={clickable ? { y: -4, scale: 1.02 } : undefined}
      whileTap={clickable ? { y: 0, scale: 0.98 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...motionProps}
    >
      {children}
    </motion.div>
  )
}

export interface CardHeaderProps {
  children: React.ReactNode
  className?: string
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={clsx('px-4 py-3 border-b border-gray-100', className)}>
      {children}
    </div>
  )
}

export interface CardContentProps {
  children: React.ReactNode
  className?: string
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={clsx('px-4 py-3', className)}>
      {children}
    </div>
  )
}

export interface CardFooterProps {
  children: React.ReactNode
  className?: string
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={clsx('px-4 py-3 border-t border-gray-100', className)}>
      {children}
    </div>
  )
} 