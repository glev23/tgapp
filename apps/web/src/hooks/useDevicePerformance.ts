import { useState, useEffect } from 'react'

export type DevicePerformance = 'high' | 'mid' | 'low'

export interface DeviceInfo {
  performance: DevicePerformance
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  hasTouch: boolean
  memory: number
  cores: number
  gpu: string
  userAgent: string
}

export function useDevicePerformance(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    performance: 'mid',
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    hasTouch: false,
    memory: 4,
    cores: 4,
    gpu: 'unknown',
    userAgent: ''
  })

  useEffect(() => {
    const detectDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      
      // Определяем тип устройства
      const isMobile = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
      const isTablet = /ipad|android(?=.*mobile)/i.test(userAgent)
      const isDesktop = !isMobile && !isTablet
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      
      // Определяем характеристики устройства
      const memory = (navigator as any).deviceMemory || 4
      const cores = (navigator as any).hardwareConcurrency || 4
      
      // Определяем GPU
      let gpu = 'unknown'
      try {
        const canvas = document.createElement('canvas')
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
        if (gl) {
          const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
          if (debugInfo) {
            gpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'unknown'
          }
        }
      } catch (e) {
        gpu = 'unknown'
      }
      
      // Умное определение производительности для мобильных
      let performance: DevicePerformance = 'mid'
      
      if (isMobile || isTablet) {
        // Для мобильных устройств - более точная оценка
        if (memory >= 8 && cores >= 8) {
          performance = 'high' // Мощные телефоны (iPhone 14 Pro, Samsung S23 Ultra)
        } else if (memory >= 6 && cores >= 6) {
          performance = 'mid'  // Средние телефоны (iPhone 13, Samsung A53)
        } else {
          performance = 'low'  // Бюджетные телефоны (старые модели)
        }
        
        // Дополнительная проверка по GPU
        if (gpu.includes('Adreno 7') || gpu.includes('Mali-G7') || gpu.includes('Apple A16')) {
          performance = 'high'
        } else if (gpu.includes('Adreno 6') || gpu.includes('Mali-G6') || gpu.includes('Apple A14')) {
          performance = 'mid'
        } else if (gpu.includes('Adreno 5') || gpu.includes('Mali-G5') || gpu.includes('Apple A12')) {
          performance = 'low'
        }
      } else {
        // Для десктопов - старая логика
        if (memory > 6 && cores > 6) {
          performance = 'high'
        } else if (memory < 3 || cores < 4) {
          performance = 'low'
        }
      }
      
      setDeviceInfo({
        performance,
        isMobile,
        isTablet,
        isDesktop,
        hasTouch,
        memory,
        cores,
        gpu,
        userAgent: navigator.userAgent
      })
    }

    detectDevice()
    
    // Переопределяем при изменении размера окна
    window.addEventListener('resize', detectDevice)
    
    return () => {
      window.removeEventListener('resize', detectDevice)
    }
  }, [])

  return deviceInfo
} 