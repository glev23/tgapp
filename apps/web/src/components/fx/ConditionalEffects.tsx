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
  const { performance, isMobile, memory, cores, gpu } = useDevicePerformance()

  // Умная логика рендеринга эффектов
  const shouldShowParticles = showParticles && (
    // На десктопе - всегда показываем
    !isMobile ||
    // На мобильных - только если устройство достаточно мощное
    (isMobile && performance === 'high' && memory >= 6 && cores >= 6)
  )
  
  const shouldShowGradient = showGradient
  const shouldAnimate = !isMobile || (isMobile && performance === 'high')
  
  // Определяем качество эффектов
  const particlesDensity = performance === 'high' ? 'high' : 'low'
  const particlesInteractive = performance === 'high' && !isMobile

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
          density={particlesDensity}
          interactive={particlesInteractive}
          className={className}
        />
      )}
      
      {/* Debug информация в development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 left-4 bg-black bg-opacity-80 text-white p-2 rounded text-xs z-50">
          <div>Device: {isMobile ? 'Mobile' : 'Desktop'}</div>
          <div>Performance: {performance}</div>
          <div>Memory: {memory}GB</div>
          <div>Cores: {cores}</div>
          <div>GPU: {gpu.substring(0, 30)}...</div>
          <div>Particles: {shouldShowParticles ? 'ON' : 'OFF'}</div>
          <div>Animation: {shouldAnimate ? 'ON' : 'OFF'}</div>
        </div>
      )}
    </>
  )
} 