import React from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  variant?: 'subtle' | 'strong' | 'card'
  glowColor?: 'neon-purple' | 'neon-cyan' | 'neon-magenta' | 'gold'
  animated?: boolean
}

export function GlassPanel({
  children,
  className,
  variant = 'subtle',
  glowColor = 'neon-cyan',
  animated = true,
  ...rest
}: GlassPanelProps) {
  const baseClasses = [
    'relative',
    'backdrop-blur-xs',
    'border border-glass',
    'rounded-xl',
    'overflow-hidden'
  ]

  const variantClasses = {
    subtle: [
      'bg-glass',
      'shadow-glass'
    ],
    strong: [
      'bg-glass-strong',
      'shadow-glass-strong'
    ],
    card: [
      'bg-glass',
      'shadow-glass',
      'border-glass-strong'
    ]
  }

  const glowClasses = {
    'neon-purple': 'shadow-neon text-neon-purple',
    'neon-cyan': 'shadow-neon text-neon-cyan',
    'neon-magenta': 'shadow-neon text-neon-magenta',
    'gold': 'shadow-neon text-gold'
  }

  return (
    <motion.div
      className={clsx(
        baseClasses,
        variantClasses[variant],
        className
      )}
      whileHover={animated ? {
        scale: 1.02,
        boxShadow: `0 0 20px var(--${glowColor})`,
      } : undefined}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
      {...rest}
    >
      {/* Shimmer effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Border glow */}
      <div className={clsx(
        'absolute inset-0 rounded-xl border-2 opacity-0 transition-opacity duration-300 pointer-events-none',
        'group-hover:opacity-100',
        glowClasses[glowColor]
      )} />
    </motion.div>
  )
}
