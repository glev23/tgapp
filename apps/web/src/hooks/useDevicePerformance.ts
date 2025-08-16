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
}

export function useDevicePerformance(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    performance: 'mid',
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    hasTouch: false,
    memory: 4,
    cores: 4
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
      
      // Определяем производительность
      let performance: DevicePerformance = 'mid'
      
      if (isMobile || isTablet) {
        // Мобильные устройства всегда считаем низкопроизводительными
        performance = 'low'
      } else if (memory > 6 && cores > 6) {
        performance = 'high'
      } else if (memory < 3 || cores < 4) {
        performance = 'low'
      }
      
      setDeviceInfo({
        performance,
        isMobile,
        isTablet,
        isDesktop,
        hasTouch,
        memory,
        cores
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