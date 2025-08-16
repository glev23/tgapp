import React from 'react'
import { useDevicePerformance } from '../../hooks/useDevicePerformance'
import { ParticlesLayer } from './ParticlesLayer'
import { GradientBackground } from './GradientBackground'

interface ConditionalEffectsProps {
  variant?: 'hero' | 'subtle' | 'ambient'
  showParticles?: boolean
  showGradient?: boolean
  className?: string
}

export function ConditionalEffects({
  variant = 'ambient',
  showParticles = true,
  showGradient = true,
  className = ''
}: ConditionalEffectsProps) {
  const { performance, isMobile } = useDevicePerformance()

  // На мобильных отключаем тяжелые эффекты
  const shouldShowParticles = showParticles && !isMobile && performance !== 'low'
  const shouldShowGradient = showGradient
  const shouldAnimate = !isMobile

  return (
    <>
      {shouldShowGradient && (
        <GradientBackground
          variant={variant}
          animated={shouldAnimate}
          className={className}
        />
      )}
      
      {shouldShowParticles && (
        <ParticlesLayer
          density={performance === 'high' ? 'high' : 'low'}
          interactive={performance === 'high'}
          className={className}
        />
      )}
    </>
  )
} 