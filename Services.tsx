import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  Waves, Dumbbell, Sparkles, Heart, Clock, Users, 
  Phone, MapPin, Star, CheckCircle 
} from 'lucide-react'
import { GradientBackground } from '../components/fx/GradientBackground'
import { ParticlesLayer } from '../components/fx/ParticlesLayer'
import { GlassPanel } from '../components/ui/GlassPanel'
import { Card, CardContent, Button } from '../components/ui'

const services = [
  {
    id: 'spa',
    icon: Waves,
    title: 'SPA Center',
    subtitle: 'Премиум спа-процедуры',
    color: 'neon-cyan',
    description: 'Роскошный спа-центр с широким спектром процедур для полного восстановления и релаксации',
    features: [
      'Аква-зона с бассейном',
      'Финская и турецкая сауны',
      'Криотерапия и хамам',
      'Массажные кабинеты',
      'Косметологические процедуры'
    ],
    schedule: {
      weekdays: '06:00 - 23:00',
      weekends: '07:00 - 23:00'
    },
    price: 'от 3000 ₽'
  },
  {
    id: 'fitness',
    icon: Dumbbell,
    title: 'Fitness Club',
    subtitle: 'Современный фитнес-центр',
    color: 'neon-purple',
    description: 'Полностью оборудованный фитнес-клуб с персональными тренерами и групповыми программами',
    features: [
      'Тренажерный зал Technogym',
      'Кардио-зона с видом на город',
      'Зал групповых программ',
      'Персональные тренировки',
      'Детский фитнес'
    ],
    schedule: {
      weekdays: '05:30 - 24:00',
      weekends: '06:00 - 24:00'
    },
    price: 'от 2000 ₽'
  },
  {
    id: 'wellness',
    icon: Heart,
    title: 'Wellness Programs',
    subtitle: 'Программы здоровья',
    color: 'neon-magenta',
    description: 'Комплексные программы оздоровления и поддержания здорового образа жизни',
    features: [
      'Диетология и нутрициология',
      'Йога и медитация',
      'Детокс-программы',
      'Антивозрастные процедуры',
      'Консультации врачей'
    ],
    schedule: {
      weekdays: 'по записи',
      weekends: 'по записи'
    },
    price: 'от 5000 ₽'
  },
  {
    id: 'beauty',
    icon: Sparkles,
    title: 'Beauty Salon',
    subtitle: 'Салон красоты',
    color: 'gold',
    description: 'Премиальный салон красоты с полным спектром услуг для мужчин и женщин',
    features: [
      'Парикмахерские услуги',
      'Маникюр и педикюр',
      'Косметология',
      'Визаж и стайлинг',
      'Барбершоп для мужчин'
    ],
    schedule: {
      weekdays: '09:00 - 21:00',
      weekends: '10:00 - 20:00'
    },
    price: 'от 1500 ₽'
  }
]

const rules = [
  'Посещение в спортивной форме и сменной обуви',
  'Полотенце предоставляется бесплатно',
  'Запись на процедуры рекомендуется заранее',
  'Дети допускаются с 16 лет в сопровождении взрослых',
  'В спа-зоне соблюдается тишина и спокойствие'
]

export function Services() {
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleServiceClick = (serviceId: string) => {
    if (serviceId === 'spa' || serviceId === 'fitness' || serviceId === 'wellness') {
      navigate('/spa')
    } else if (serviceId === 'beauty') {
      // Beauty Salon также относится к SPA услугам
      navigate('/spa')
    } else {
      // Для других услуг можно добавить отдельную логику
      console.log('Service clicked:', serviceId)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <GradientBackground variant="subtle" animated />
      <ParticlesLayer density="low" />
      
      <div className="relative z-10 space-y-6 p-4">
        {/* Header */}
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-display font-display font-black bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-magenta bg-clip-text text-transparent tracking-tight">
            Fitness & SPA
          </h1>
          <p className="text-text-secondary">
            Премиальный центр здоровья и красоты
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid gap-4">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <GlassPanel 
                variant="card" 
                glowColor={service.color as any}
                className="group cursor-pointer"
                onClick={() => handleServiceClick(service.id)}
              >
                <CardContent className="p-0">
                  <div className="p-4 space-y-4">
                    {/* Service Header */}
                    <div className="flex items-center space-x-4">
                      <div className={`w-16 h-16 bg-gradient-to-br from-${service.color} to-${service.color}/70 rounded-2xl flex items-center justify-center shadow-neon group-hover:animate-float`}>
                        <service.icon size={28} className="text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-text-primary group-hover:text-neon-cyan transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-sm text-text-secondary">
                          {service.subtitle}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Star size={14} className="text-gold" />
                          <span className="text-sm font-medium text-gold">
                            {service.price}
                          </span>
                        </div>
                      </div>
                      
                      <div className={`w-6 h-6 transition-transform ${selectedService === service.id ? 'rotate-180' : ''}`}>
                        <svg viewBox="0 0 24 24" fill="none" className="text-text-muted">
                          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                    
                    <p className="text-text-secondary text-sm">
                      {service.description}
                    </p>
                    
                    {/* Expandable Details */}
                    <motion.div
                      initial={false}
                      animate={{ 
                        height: selectedService === service.id ? 'auto' : 0,
                        opacity: selectedService === service.id ? 1 : 0
                      }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      {selectedService === service.id && (
                        <div className="space-y-4 pt-4 border-t border-glass">
                          {/* Features */}
                          <div>
                            <h4 className="font-medium text-text-primary mb-2">Услуги включают:</h4>
                            <div className="space-y-2">
                              {service.features.map((feature) => (
                                <div key={feature} className="flex items-center space-x-2">
                                  <CheckCircle size={16} className="text-neon-cyan" />
                                  <span className="text-sm text-text-secondary">{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Schedule */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Button 
                                onClick={() => handleServiceClick(service.id)}
                                className="bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-medium shadow-neon hover:shadow-neon-strong transition-all duration-300"
                              >
                                Подробнее
                              </Button>
                            </div>
                            
                            <div className="text-right">
                              <h4 className="font-medium text-text-primary mb-1">График работы:</h4>
                              <div className="space-y-1 text-sm text-text-secondary">
                                <div className="flex items-center space-x-2">
                                  <Clock size={12} className="text-neon-cyan" />
                                  <span>Пн-Пт: {service.schedule.weekdays}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Clock size={12} className="text-neon-cyan" />
                                  <span>Сб-Вс: {service.schedule.weekends}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </div>
                </CardContent>
              </GlassPanel>
            </motion.div>
          ))}
        </div>

        {/* Rules Section */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <h2 className="text-xl font-semibold text-text-primary text-center">
            Правила посещения
          </h2>
          
          <GlassPanel variant="strong" className="p-6">
            <div className="space-y-3">
              {rules.map((rule, index) => (
                <motion.div
                  key={index}
                  className="flex items-start space-x-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1, duration: 0.3 }}
                >
                  <div className="w-6 h-6 bg-glass rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-xs font-bold text-neon-cyan">{index + 1}</span>
                  </div>
                  <p className="text-sm text-text-secondary">{rule}</p>
                </motion.div>
              ))}
            </div>
          </GlassPanel>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          className="pt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.4 }}
        >
          <GlassPanel variant="strong" className="p-6">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold text-text-primary">
                Запись и консультации
              </h3>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center justify-center space-x-2">
                  <Phone size={20} className="text-neon-cyan" />
                  <span className="text-text-secondary">+7 495 221 5580</span>
                </div>
                
                <div className="flex items-center justify-center space-x-2">
                  <MapPin size={20} className="text-gold" />
                  <span className="text-text-secondary">4-й этаж, Wellness центр</span>
                </div>
              </div>
              
              <p className="text-sm text-text-muted">
                Бронирование доступно 24/7 через консьержа
              </p>
            </div>
          </GlassPanel>
        </motion.div>
      </div>
    </div>
  )
}
