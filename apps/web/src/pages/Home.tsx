import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Building2, Star, Waves, Utensils, MapPin, Phone, Bed, Dumbbell } from 'lucide-react'
import { GradientBackground } from '../components/fx/GradientBackground'
import { ParticlesLayer } from '../components/fx/ParticlesLayer'
import { GlassPanel } from '../components/ui/GlassPanel'
import { Card, CardContent, Button } from '../components/ui'
import { useHapticFeedback } from '../hooks/useHapticFeedback'

export function Home() {
  const navigate = useNavigate()
  const { impact } = useHapticFeedback()

  const quickActions = [
    { 
      icon: Utensils, 
      title: 'Рестораны', 
      desc: '18 ресторанов и баров', 
      color: 'neon-cyan',
      path: '/restaurants'
    },
    { 
      icon: Bed, 
      title: 'Номера', 
      desc: '12 категорий номеров', 
      color: 'gold',
      path: '/rooms'
    },
    { 
      icon: Star, 
      title: 'Услуги', 
      desc: 'Консьерж, прачечная', 
      color: 'neon-purple',
      path: '/services'
    },
    { 
      icon: Dumbbell, 
      title: 'Fitness & SPA', 
      desc: 'Wellness центр 24/7', 
      color: 'neon-magenta',
      path: '/spa'
    }
  ]

  const handleQuickAction = (path: string, title: string) => {
    impact('light')
    navigate(path)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <GradientBackground variant="hero" animated />
      <ParticlesLayer density="mid" interactive />
      
      <div className="relative z-10 space-y-8 p-4 pt-8">
        {/* Hero Section */}
        <motion.div
          className="text-center space-y-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Hero Icon with Glow */}
          <motion.div
            className="w-24 h-24 mx-auto relative"
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 1, 0]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="absolute inset-0 bg-gradient-gold rounded-2xl shadow-neon-strong opacity-80" />
            <div className="relative w-full h-full bg-gradient-gold rounded-2xl flex items-center justify-center shadow-neon">
              <Building2 size={40} className="text-dark-void" />
            </div>
          </motion.div>
          
          {/* Hero Title */}
          <div className="space-y-3">
            <motion.h1 
              className="text-hero font-display font-extrabold bg-gradient-to-r from-text-primary via-neon-cyan to-text-primary bg-clip-text text-transparent tracking-tight"
              animate={{ 
                backgroundPosition: ['0%', '100%', '0%']
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{ backgroundSize: '200% 100%' }}
            >
              Radisson Collection
            </motion.h1>
            <motion.p 
              className="text-lg text-text-secondary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Добро пожаловать в ваш отель
            </motion.p>
          </div>
        </motion.div>

        {/* Quick Actions Grid */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <h2 className="text-xl font-display font-bold text-text-primary text-center tracking-tight">
            Быстрые действия
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  delay: 1 + index * 0.1,
                  duration: 0.4,
                  type: "spring",
                  stiffness: 300
                }}
              >
                <GlassPanel 
                  variant="card" 
                  glowColor={item.color as any}
                  className="group cursor-pointer hover:scale-[1.02] hover:shadow-neon-strong transition-all duration-300 active:scale-[0.98]"
                  onClick={() => handleQuickAction(item.path, item.title)}
                >
                  <CardContent className="text-center space-y-3 p-4">
                    <div className={`w-12 h-12 mx-auto rounded-xl bg-glass-strong border border-${item.color}/30 flex items-center justify-center text-${item.color} group-hover:animate-float group-hover:border-${item.color}/60 transition-all duration-300`}>
                      <item.icon size={24} />
                    </div>
                    <div>
                      <h3 className="font-medium text-text-primary group-hover:text-neon-cyan transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-text-muted">{item.desc}</p>
                    </div>
                  </CardContent>
                </GlassPanel>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          className="grid grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <GlassPanel variant="subtle" className="p-4 text-center">
            <div className="text-2xl font-bold text-neon-cyan mb-1">18</div>
            <div className="text-sm text-text-muted">Ресторанов</div>
          </GlassPanel>
          
          <GlassPanel variant="subtle" className="p-4 text-center">
            <div className="text-2xl font-bold text-gold mb-1">12</div>
            <div className="text-sm text-text-muted">Типов номеров</div>
          </GlassPanel>
          
          <GlassPanel variant="subtle" className="p-4 text-center">
            <div className="text-2xl font-bold text-neon-magenta mb-1">24/7</div>
            <div className="text-sm text-text-muted">Сервис</div>
          </GlassPanel>
        </motion.div>

        {/* Highlights Section */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          <h2 className="text-xl font-display font-bold text-text-primary text-center tracking-tight">
            Особенности отеля
          </h2>
          
          <GlassPanel variant="strong" className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-lg flex items-center justify-center">
                  <MapPin size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-text-primary">Премиум локация</p>
                  <p className="text-sm text-text-secondary">Центр Москвы, у Москвы-реки</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-gold rounded-lg flex items-center justify-center">
                  <Phone size={20} className="text-dark-void" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-text-primary">Консьерж 24/7</p>
                  <p className="text-sm text-text-secondary">+7 (495) 221-55-55</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-neon-magenta to-neon-purple rounded-lg flex items-center justify-center">
                  <Utensils size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-text-primary">Мировая кухня</p>
                  <p className="text-sm text-text-secondary">От тайской до итальянской</p>
                </div>
              </div>
            </div>
          </GlassPanel>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="pt-4 space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.4 }}
        >
          <Button 
            variant="primary" 
            size="lg" 
            fullWidth
            className="bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-semibold shadow-neon hover:shadow-neon-strong transition-all duration-300"
          >
            Связаться с консьержем
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
