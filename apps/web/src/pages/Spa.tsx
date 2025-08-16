import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Dumbbell, Heart, Waves, Sparkles, Clock, Users, Star, Calendar } from 'lucide-react'
import { GradientBackground } from '../components/fx/GradientBackground'
import { ParticlesLayer } from '../components/fx/ParticlesLayer'
import { GlassPanel } from '../components/ui/GlassPanel'
import { Button } from '../components/ui'
import { SpaService as SpaServiceType } from '../types'
import spaService from '../services/spaService'

export function Spa() {
  const navigate = useNavigate()
  const [services, setServices] = useState<SpaServiceType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    const loadServices = async () => {
      setIsLoading(true)
      try {
        const result = await spaService.loadServices()
        if (result.success) {
          setServices(result.data)
        } else {
          setError(result.error || 'Ошибка загрузки SPA услуг')
        }
      } catch (err) {
        setError('Ошибка загрузки данных')
      } finally {
        setIsLoading(false)
      }
    }

    loadServices()
  }, [])

  const getFilteredServices = () => {
    if (selectedCategory === 'all') {
      return services
    }
    return spaService.getServicesByCategory(selectedCategory)
  }

  const categories = spaService.getCategories()
  const filteredServices = getFilteredServices()

  // Get service icon based on category
  const getServiceIcon = (service: SpaServiceType) => {
    if (service.category === 'Массажные процедуры') return '💆‍♀️'
    if (service.category === 'Банные процедуры') return '🧖‍♀️'
    if (service.category === 'Салонные услуги') return '💇‍♀️'
    if (service.category === 'Уходовые процедуры') return '🧴'
    if (service.category === 'Аппаратные процедуры') return '⚙️'
    return '✨'
  }

  // Determine aspect ratio for adaptive grid
  const determineAspectRatio = (index: number) => {
    // Adaptive grid pattern: mix of landscape and portrait for visual interest
    const patterns = ['aspect-[4/3]', 'aspect-square', 'aspect-[4/3]', 'aspect-[3/4]', 'aspect-[4/3]', 'aspect-square']
    return patterns[index % patterns.length]
  }

  if (isLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <GradientBackground variant="subtle" animated />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <motion.div
              className="w-12 h-12 bg-gradient-purple-cyan rounded-full mx-auto"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <p className="text-text-secondary">Загружаем SPA услуги...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <GradientBackground variant="subtle" animated />
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <GlassPanel variant="strong" className="p-6 text-center">
            <h2 className="text-xl font-semibold text-neon-pink mb-2">Ошибка загрузки</h2>
            <p className="text-text-secondary">{error}</p>
          </GlassPanel>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <GradientBackground variant="subtle" animated />
      <ParticlesLayer density="low" />
      
      <div className="relative z-10 space-y-6 p-4">
        {/* Header */}
        <motion.div
          className="flex items-center space-x-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="p-2 hover:bg-glass"
          >
            <ArrowLeft size={24} className="text-text-primary" />
          </Button>
          <div>
            <h1 className="text-display font-display font-black bg-gradient-to-r from-neon-magenta via-neon-purple to-neon-cyan bg-clip-text text-transparent tracking-tight">
              Fitness & SPA
            </h1>
            <p className="text-text-secondary">
              Премиальный центр здоровья и красоты
            </p>
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="flex space-x-2 overflow-x-auto pt-5 pb-5 px-5 scrollbar-hide">
            <motion.button
              onClick={() => setSelectedCategory('all')}
              className={`px-10 py-2 rounded-xl font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-neon-magenta to-neon-purple text-white shadow-neon'
                  : 'bg-glass border border-glass text-text-secondary hover:text-text-primary'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              Все услуги
            </motion.button>
            
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all flex-shrink-0 text-sm ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-neon-magenta to-neon-purple text-white shadow-neon'
                    : 'bg-glass border border-glass text-text-secondary hover:text-text-primary'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Services Grid - Adaptive Layout */}
        <motion.div
          className="grid gap-4 sm:grid-cols-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          {filteredServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group"
            >
              <GlassPanel 
                variant="card" 
                glowColor="neon-magenta"
                className="cursor-pointer hover:scale-[1.02] transition-transform duration-300"
              >
                <div className="relative">
                  {/* Service Image */}
                  <div className="relative w-full h-48 rounded-t-xl overflow-hidden">
                    {service.images && service.images[0] ? (
                      <img
                        src={service.images[0]}
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-dark-navy via-dark-indigo to-dark-void flex items-center justify-center">
                        <span className="text-2xl">{getServiceIcon(service)}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Service Details */}
                  <div className="p-4 space-y-4">
                    <p className="text-text-secondary text-sm line-clamp-2">
                      {service.description}
                    </p>
                    
                    {/* Key Features */}
                    <div className="flex flex-wrap gap-2">
                      {service.features?.slice(0, 3).map(feature => (
                        <span 
                          key={feature}
                          className="px-2 py-1 text-xs bg-glass rounded-full text-text-muted border border-glass"
                        >
                          {feature}
                        </span>
                      ))}
                      {service.features && service.features.length > 3 && (
                        <span className="px-2 py-1 text-xs bg-glass rounded-full text-text-muted border border-glass">
                          +{service.features.length - 3}
                        </span>
                      )}
                    </div>
                    
                    {/* Service Info */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <Clock size={16} className="text-neon-cyan" />
                        <span className="text-text-secondary line-clamp-1">{service.duration}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm">
                        <Star size={16} className="text-gold" />
                        <span className="text-text-secondary">
                          от {service.priceRange.split('-')[0]} ₽
                        </span>
                      </div>
                    </div>
                    
                    {/* CTA Button */}
                    <Button 
                      fullWidth
                      className="bg-gradient-to-r from-neon-magenta to-neon-purple text-white font-medium shadow-neon hover:shadow-neon-strong hover:scale-[1.02] transition-all duration-300"
                      onClick={(e) => {
                        e.stopPropagation()
                        console.log('Navigating to service:', service.id)
                        console.log('Full URL:', `/spa/service/${service.id}`)
                        navigate(`/spa/service/${service.id}`)
                      }}
                    >
                      Подробнее
                    </Button>
                  </div>
                </div>
              </GlassPanel>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          className="grid grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          <GlassPanel variant="subtle" className="p-4 text-center">
            <div className="text-2xl font-bold text-neon-magenta mb-1">
              {categories.length}
            </div>
            <div className="text-sm text-text-muted">Категорий</div>
          </GlassPanel>
          
          <GlassPanel variant="subtle" className="p-4 text-center">
            <div className="text-2xl font-bold text-neon-cyan mb-1">20</div>
            <div className="text-sm text-text-muted">мин. мин.</div>
          </GlassPanel>
          
          <GlassPanel variant="subtle" className="p-4 text-center">
            <div className="text-2xl font-bold text-neon-purple mb-1">24/7</div>
            <div className="text-sm text-text-muted">Фитнес</div>
          </GlassPanel>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <GlassPanel variant="strong" className="p-6">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold text-text-primary">
                Запись на процедуры
              </h3>
              <div className="flex items-center justify-center space-x-2">
                <Users size={20} className="text-neon-magenta" />
                <span className="text-text-secondary">+7 (495) 221-55-55 доб. 3</span>
              </div>
              <p className="text-sm text-text-muted">
                SPA центр работает ежедневно с 07:00 до 23:00
              </p>
            </div>
          </GlassPanel>
        </motion.div>
      </div>
    </div>
  )
} 