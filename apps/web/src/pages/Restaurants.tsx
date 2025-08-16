import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, MapPin, Clock, Star, Users, 
  ChefHat, Utensils, Music, Wine 
} from 'lucide-react'
import { GradientBackground } from '../components/fx/GradientBackground'
import { ParticlesLayer } from '../components/fx/ParticlesLayer'
import { GlassPanel } from '../components/ui/GlassPanel'
import { Button } from '../components/ui'
import { RestaurantCardSkeleton } from '../components/ui/Skeleton'
import { ErrorFallback } from '../components/ui/ErrorBoundary'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'
import { Restaurant } from '../types'
import restaurantService from '../services/restaurantService'

// Unified aspect ratio for all restaurant cards
const CARD_ASPECT = 'aspect-[4/3]' // Change this to 'aspect-square' or 'aspect-[3/4]' if needed

export function Restaurants() {
  const navigate = useNavigate()
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadRestaurants = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        await new Promise(resolve => setTimeout(resolve, 800)) // Simulate network delay
        const result = await restaurantService.loadRestaurants()
        
        if (result.success) {
          setRestaurants(result.data)
        } else {
          setError(result.error || 'Не удалось загрузить рестораны')
        }
      } catch (err) {
        setError('Ошибка загрузки данных')
      } finally {
        setIsLoading(false)
      }
    }

    loadRestaurants()
  }, [])

  const retryLoad = () => {
    setError(null)
    setRestaurants([])
    setIsLoading(true)
    // Trigger reload
    const loadRestaurants = async () => {
      try {
        const result = await restaurantService.loadRestaurants()
        if (result.success) {
          setRestaurants(result.data)
        } else {
          setError(result.error || 'Не удалось загрузить рестораны')
        }
      } catch (err) {
        setError('Ошибка загрузки данных')
      } finally {
        setIsLoading(false)
      }
    }
    loadRestaurants()
  }

  // Get placeholder icon based on restaurant type
  const getRestaurantIcon = (restaurant: Restaurant) => {
    if (restaurant.features?.includes('караоке')) return '🎤'
    if (restaurant.features?.includes('тайская кухня')) return '🥢'
    if (restaurant.features?.includes('итальянская кухня')) return '🍝'
    if (restaurant.features?.includes('китайская кухня')) return '🥟'
    if (restaurant.features?.includes('грузинская кухня')) return '🍷'
    if (restaurant.features?.includes('авторская кухня')) return '👨‍🍳'
    if (restaurant.features?.includes('ночной')) return '🌙'
    return '🍽️'
  }

  // Determine aspect ratio for adaptive grid
  const determineAspectRatio = (index: number) => {
    // Adaptive grid pattern: mix of landscape and portrait for visual interest
    const patterns = ['aspect-[4/3]', 'aspect-square', 'aspect-[4/3]', 'aspect-[3/4]', 'aspect-[4/3]', 'aspect-square']
    return patterns[index % patterns.length]
  }

  if (error) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <GradientBackground variant="subtle" animated />
        <ParticlesLayer density="low" />
        
        <div className="relative z-10 p-4">
          <div className="flex items-center justify-center min-h-[60vh]">
            <ErrorFallback 
              error={new Error(error)}
              retry={retryLoad}
              title="Ошибка загрузки ресторанов"
              message={error}
            />
          </div>
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="p-2"
            hapticFeedback="light"
          >
            <ArrowLeft size={20} />
          </Button>
          
          <div>
            <h1 className="text-display font-display font-black bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-magenta bg-clip-text text-transparent tracking-tight">
              Рестораны
            </h1>
            <p className="text-text-secondary">
              {isLoading ? 'Загружаем рестораны...' : `${restaurants.length} ресторанов и баров`}
            </p>
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid gap-4">
            {Array.from({ length: 6 }, (_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassPanel variant="card" className="overflow-hidden">
                  <RestaurantCardSkeleton />
                </GlassPanel>
              </motion.div>
            ))}
          </div>
        )}

        {/* Restaurant Grid */}
        {!isLoading && restaurants.length > 0 && (
          <div className="grid gap-4">
            {restaurants.map((restaurant, index) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                index={index}
                onClick={() => navigate(`/restaurants/${restaurant.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Separate component for restaurant card with lazy loading
function RestaurantCard({ 
  restaurant, 
  index, 
  onClick 
}: { 
  restaurant: Restaurant
  index: number
  onClick: () => void 
}) {
  const { ref, hasIntersected } = useIntersectionObserver({
    once: true,
    threshold: 0.1
  })

  const getRestaurantIcon = (restaurant: Restaurant) => {
    if (restaurant.features?.includes('караоке')) return '🎤'
    if (restaurant.features?.includes('тайская кухня')) return '🥢'
    if (restaurant.features?.includes('итальянская кухня')) return '🍝'
    if (restaurant.features?.includes('китайская кухня')) return '🥟'
    if (restaurant.features?.includes('грузинская кухня')) return '🍷'
    if (restaurant.features?.includes('авторская кухня')) return '👨‍🍳'
    if (restaurant.features?.includes('ночной')) return '🌙'
    return '🍽️'
  }

  // Using a single aspect ratio for consistency
  const determineAspectRatio = (_index: number) => CARD_ASPECT

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={hasIntersected ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <GlassPanel 
        variant="card" 
        glowColor="neon-cyan"
        className="group overflow-hidden"
      >
        {/* Restaurant card content */}
        <div className="relative">
          {/* Image Container */}
          <div className={`relative ${CARD_ASPECT} overflow-hidden bg-glass/20`}>
            {hasIntersected && (
              <motion.img
                src={restaurant.imageUrl}
                alt={restaurant.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                loading="lazy"
              />
            )}
            
            {/* Glass Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-navy/80 via-transparent to-transparent" />
            
            {/* Restaurant Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-neon-cyan/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  {getRestaurantIcon(restaurant)}
                </div>
                <div>
                  <h3 className="font-semibold text-lg leading-tight group-hover:text-neon-cyan transition-colors">
                    {restaurant.name}
                  </h3>
                  <p className="text-sm text-gray-300">
                    {restaurant.cuisine}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center space-x-1">
                  <Clock size={12} className="text-neon-cyan" />
                  <span>{restaurant.hours}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star size={12} className="text-gold" />
                  <span>{restaurant.averageCheck || restaurant.averagePrice || 'Цена по запросу'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </GlassPanel>
    </motion.div>
  )
}
