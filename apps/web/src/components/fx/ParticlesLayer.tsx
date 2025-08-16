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
      // На мобильных определяем производительность более точно
      if (memoryInfo >= 8) {
        setDevicePerf('high') // Мощные телефоны
      } else if (memoryInfo >= 6) {
        setDevicePerf('mid')  // Средние телефоны
      } else {
        setDevicePerf('low')  // Бюджетные телефоны
      }
    } else if (memoryInfo > 6) {
      setDevicePerf('high')
    } else if (memoryInfo < 3) {
      setDevicePerf('low')
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Отключаем частицы только на слабых мобильных
    if (isMobile && devicePerf === 'low') {
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
          vx: (Math.random() - 0.5) * (isMobile ? 0.2 : 0.3), // Медленнее на мобильных
          vy: (Math.random() - 0.5) * (isMobile ? 0.2 : 0.3), // Медленнее на мобильных
          size: Math.random() * (isMobile ? 2 : 3) + 1,        // Меньше на мобильных
          opacity: Math.random() * (isMobile ? 0.3 : 0.4) + 0.1, // Меньше прозрачности на мобильных
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

        // Interactive mouse effect - только на десктопе и мощных мобильных
        if (interactive && (!isMobile || devicePerf === 'high')) {
          const dx = mouseRef.current.x - particle.x
          const dy = mouseRef.current.y - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 100) {
            const force = (100 - distance) / 100 * (isMobile ? 0.003 : 0.005) // Меньше силы на мобильных
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
      if (!isMobile || devicePerf === 'high') {
        mouseRef.current.x = e.clientX
        mouseRef.current.y = e.clientY
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (isMobile && devicePerf === 'high' && e.touches[0]) {
        mouseRef.current.x = e.touches[0].clientX
        mouseRef.current.y = e.touches[0].clientY
      }
    }

    resizeCanvas()
    createParticles()
    animate()

    window.addEventListener('resize', resizeCanvas)
    if (interactive && (!isMobile || devicePerf === 'high')) {
      window.addEventListener('mousemove', handleMouseMove)
      if (isMobile) {
        window.addEventListener('touchmove', handleTouchMove)
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener('resize', resizeCanvas)
      if (interactive && (!isMobile || devicePerf === 'high')) {
        window.removeEventListener('mousemove', handleMouseMove)
        if (isMobile) {
          window.removeEventListener('touchmove', handleTouchMove)
        }
      }
    }
  }, [density, interactive, colors, devicePerf, isMobile])

  // Не рендерим canvas на слабых мобильных
  if (isMobile && devicePerf === 'low') {
    return null
  }

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none -z-10 ${className}`}
      style={{ 
        mixBlendMode: 'screen',
        opacity: devicePerf === 'low' ? 0.2 : (isMobile ? 0.3 : 0.4) // Адаптивная прозрачность
      }}
    />
  )
}
