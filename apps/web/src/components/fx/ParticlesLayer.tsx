import React, { useEffect, useRef, useState } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
}

interface ParticlesLayerProps {
  density?: 'low' | 'mid' | 'high'
  interactive?: boolean
  colors?: string[]
  className?: string
}

export function ParticlesLayer({
  density = 'mid',
  interactive = false,
  colors = ['#7C3AED', '#00E5FF', '#FF00E5'],
  className = ''
}: ParticlesLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const animationRef = useRef<number>()
  const [devicePerf, setDevicePerf] = useState<'high' | 'mid' | 'low'>('mid')
  const [isMobile, setIsMobile] = useState(false)

  const particleCount = {
    low: 3,    // Уменьшено с 5
    mid: 8,    // Уменьшено с 15
    high: 15   // Уменьшено с 30
  }

  useEffect(() => {
    // Device performance detection
    const memoryInfo = (navigator as any).deviceMemory || 4
    const userAgent = navigator.userAgent.toLowerCase()
    const mobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
    
    setIsMobile(mobile)
    
    if (mobile) {
      // На мобильных всегда низкая производительность
      setDevicePerf('low')
    } else if (memoryInfo > 6) {
      setDevicePerf('high')
    } else if (memoryInfo < 3) {
      setDevicePerf('low')
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Отключаем частицы на мобильных для экономии ресурсов
    if (isMobile) {
      return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createParticles = () => {
      const count = particleCount[devicePerf === 'high' ? density : 'low']
      particlesRef.current = []

      for (let i = 0; i < count; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3, // Уменьшена скорость
          vy: (Math.random() - 0.5) * 0.3, // Уменьшена скорость
          size: Math.random() * 3 + 1,      // Уменьшен размер
          opacity: Math.random() * 0.4 + 0.1, // Уменьшена прозрачность
          color: colors[Math.floor(Math.random() * colors.length)]
        })
      }
    }

    const updateParticles = () => {
      particlesRef.current.forEach(particle => {
        particle.x += particle.vx
        particle.y += particle.vy

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Interactive mouse effect - только на десктопе
        if (interactive && !isMobile) {
          const dx = mouseRef.current.x - particle.x
          const dy = mouseRef.current.y - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 100) {
            const force = (100 - distance) / 100 * 0.005 // Уменьшена сила
            particle.vx -= dx * force
            particle.vy -= dy * force
          }
        }
      })
    }

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particlesRef.current.forEach(particle => {
        ctx.save()
        ctx.globalAlpha = particle.opacity
        ctx.fillStyle = particle.color
        // Убираем blur для производительности
        // ctx.filter = 'blur(1px)'
        
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
        
        ctx.restore()
      })
    }

    const animate = () => {
      updateParticles()
      drawParticles()
      animationRef.current = requestAnimationFrame(animate)
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isMobile) {
        mouseRef.current.x = e.clientX
        mouseRef.current.y = e.clientY
      }
    }

    resizeCanvas()
    createParticles()
    animate()

    window.addEventListener('resize', resizeCanvas)
    if (interactive && !isMobile) {
      window.addEventListener('mousemove', handleMouseMove)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener('resize', resizeCanvas)
      if (interactive && !isMobile) {
        window.removeEventListener('mousemove', handleMouseMove)
      }
    }
  }, [density, interactive, colors, devicePerf, isMobile])

  // Не рендерим canvas на мобильных
  if (isMobile) {
    return null
  }

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none -z-10 ${className}`}
      style={{ 
        mixBlendMode: 'screen',
        opacity: devicePerf === 'low' ? 0.2 : 0.4 // Уменьшена прозрачность
      }}
    />
  )
}
