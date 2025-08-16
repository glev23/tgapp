import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface GradientBackgroundProps {
  variant?: 'hero' | 'subtle' | 'ambient'
  animated?: boolean
  className?: string
}

export function GradientBackground({ 
  variant = 'ambient', 
  animated = true, 
  className = '' 
}: GradientBackgroundProps) {
  const [devicePerf, setDevicePerf] = useState<'high' | 'mid' | 'low'>('mid')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Simple device performance detection
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    const memoryInfo = (navigator as any).deviceMemory || 4
    const userAgent = navigator.userAgent.toLowerCase()
    const mobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
    
    setIsMobile(mobile)
    
    if (mobile) {
      // На мобильных всегда низкая производительность
      setDevicePerf('low')
    } else if (gl && memoryInfo > 6) {
      setDevicePerf('high')
    } else if (memoryInfo < 3) {
      setDevicePerf('low')
    } else {
      setDevicePerf('mid')
    }
  }, [])

  const getGradientClass = () => {
    switch (variant) {
      case 'hero':
        return devicePerf === 'high' 
          ? 'bg-gradient-hero-soft'
          : devicePerf === 'mid'
          ? 'bg-gradient-hero-elegant'
          : 'bg-gradient-purple-cyan'
      case 'subtle':
        return 'bg-gradient-glass opacity-30'
      default:
        return 'bg-gradient-cyan-magenta opacity-20'
    }
  }

  // На мобильных отключаем сложные анимации
  const shouldAnimate = animated && !isMobile

  if (variant === 'hero' && devicePerf === 'high' && !isMobile) {
    // TODO: Three.js implementation for high-performance devices
    return (
      <div className={`fixed inset-0 -z-10 ${className}`}>
        <div className="absolute inset-0 bg-dark-void" />
        <motion.div 
          className={`absolute inset-0 ${getGradientClass()}`}
          style={{ backgroundSize: '200% 200%' }}
          animate={shouldAnimate ? {
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
          } : {}}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      </div>
    )
  }

  return (
    <div className={`fixed inset-0 -z-10 ${className}`}>
      <div className="absolute inset-0 bg-dark-void" />
      <motion.div 
        className={`absolute inset-0 ${getGradientClass()}`}
        style={variant === 'hero' ? { backgroundSize: '200% 200%' } : {}}
        animate={shouldAnimate && variant === 'hero' ? {
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
        } : {}}
        transition={{
          duration: isMobile ? 12 : 8, // Медленнее на мобильных
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
      {/* Noise overlay - только на десктопе */}
      {!isMobile && (
        <div className="absolute inset-0 opacity-5 bg-noise" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '256px 256px'
        }} />
      )}
    </div>
  )
}
