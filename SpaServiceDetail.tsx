import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Clock, Users, Star, Calendar, Phone, MapPin, Heart, Shield, Info } from 'lucide-react'
import { GradientBackground } from '../components/fx/GradientBackground'
import { ParticlesLayer } from '../components/fx/ParticlesLayer'
import { GlassPanel } from '../components/ui/GlassPanel'
import { Button, Calendar as CustomCalendar } from '../components/ui'
import { SpaService } from '../types'
import spaService from '../services/spaService'

export function SpaServiceDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [service, setService] = useState<SpaService | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showCalendarModal, setShowCalendarModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [bookingData, setBookingData] = useState({
    name: '',
    phone: '',
    email: '',
    guests: '1',
    specialRequests: '',
    preferredTime: ''
  })

  useEffect(() => {
    const loadService = async () => {
      if (!id) return
      
      console.log('Loading service with ID:', id)
      setIsLoading(true)
      try {
        await spaService.loadServices()
        const serviceData = spaService.getServiceById(id)
        console.log('Found service:', serviceData)
        setService(serviceData || null)
      } catch (error) {
        console.error('Error loading service:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadService()
  }, [id])

  // Сброс позиции прокрутки при загрузке страницы
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  const getServiceIcon = (category: string) => {
    if (category === 'Массажные процедуры') return '💆‍♀️'
    if (category === 'Банные процедуры') return '🧖‍♀️'
    if (category === 'Салонные услуги') return '💇‍♀️'
    if (category === 'Уходовые процедуры') return '🧴'
    if (category === 'Аппаратные процедуры') return '⚙️'
    return '✨'
  }

  const resetBookingForm = () => {
    setBookingData({
      name: '',
      phone: '',
      email: '',
      guests: '1',
      specialRequests: '',
      preferredTime: ''
    })
    setSelectedDate(null)
    setSelectedTime('')
  }

  const handleCloseBookingForm = () => {
    setShowBookingForm(false)
    resetBookingForm()
  }

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDate) {
      alert('Пожалуйста, выберите дату')
      return
    }
    setShowSuccessModal(true)
    setShowBookingForm(false)
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
            <p className="text-text-secondary">Загружаем услугу...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <GradientBackground variant="subtle" animated />
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <GlassPanel variant="strong" className="p-6 text-center">
            <h2 className="text-xl font-semibold text-neon-pink mb-2">Услуга не найдена</h2>
            <p className="text-text-secondary mb-4">Запрашиваемая услуга не существует</p>
            <Button onClick={() => navigate('/spa')}>
              Вернуться к списку
            </Button>
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
            onClick={() => navigate('/spa')}
            className="p-2 hover:bg-glass"
          >
            <ArrowLeft size={24} className="text-text-primary" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">{service.name}</h1>
            <p className="text-text-secondary text-sm">{service.category}</p>
          </div>
        </motion.div>

        {/* Service Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <GlassPanel variant="strong" className="p-6">
            <div className="flex items-start space-x-6">
              {/* Service Icon */}
              <div className="text-6xl flex-shrink-0">
                {getServiceIcon(service.category)}
              </div>
              
              {/* Service Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-text-primary mb-2">{service.name}</h2>
                  <p className="text-text-secondary leading-relaxed">{service.description}</p>
                </div>
                
                {/* Key Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Clock size={20} className="text-neon-cyan" />
                    <span className="text-text-secondary">{service.duration}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Star size={20} className="text-gold" />
                    <span className="text-text-secondary">
                      от {service.priceRange?.split('-')[0]} ₽
                    </span>
                  </div>
                </div>

                {/* Features */}
                {service.features && (
                  <div className="flex flex-wrap gap-2">
                    {service.features.map(feature => (
                      <span 
                        key={feature}
                        className="px-3 py-1 text-sm bg-glass rounded-full text-text-primary border border-glass-strong"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </GlassPanel>
        </motion.div>

        {/* Service Details */}
        <motion.div
          className="grid gap-6 md:grid-cols-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {/* Suitable For */}
          {service.suitableFor && (
            <GlassPanel variant="card" className="p-6">
              <div className="flex items-start space-x-3">
                <Heart size={24} className="text-neon-cyan flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">Подходит для</h3>
                  <p className="text-text-secondary">{service.suitableFor}</p>
                </div>
              </div>
            </GlassPanel>
          )}

          {/* Contraindications */}
          {service.contraindications && (
            <GlassPanel variant="card" className="p-6">
              <div className="flex items-start space-x-3">
                <Shield size={24} className="text-neon-pink flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">Противопоказания</h3>
                  <p className="text-text-secondary">{service.contraindications}</p>
                </div>
              </div>
            </GlassPanel>
          )}

          {/* Before Procedure */}
          {service.beforeProcedure && (
            <GlassPanel variant="card" className="p-6">
              <div className="flex items-start space-x-3">
                <Info size={24} className="text-gold flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">Подготовка</h3>
                  <p className="text-text-secondary">{service.beforeProcedure}</p>
                </div>
              </div>
            </GlassPanel>
          )}

          {/* Recommendations */}
          {service.recommendations && (
            <GlassPanel variant="card" className="p-6">
              <div className="flex items-start space-x-3">
                <Star size={24} className="text-neon-purple flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">Рекомендации</h3>
                  <p className="text-text-secondary">{service.recommendations}</p>
                </div>
              </div>
            </GlassPanel>
          )}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <GlassPanel variant="strong" className="p-8 text-center">
            <h3 className="text-2xl font-bold text-text-primary mb-4">
              Записаться на {service.name}
            </h3>
            <p className="text-text-secondary mb-6">
              Выберите удобное время и оставьте заявку. Мы свяжемся с вами для подтверждения.
            </p>
            <div
              className="w-full px-6 py-3 bg-gradient-to-r from-neon-magenta to-neon-purple text-white font-semibold shadow-neon hover:shadow-neon-strong hover:scale-[1.02] transition-all duration-300 rounded-xl cursor-pointer flex items-center justify-center"
              onClick={() => setShowBookingForm(true)}
            >
              <Calendar size={20} className="mr-2 flex-shrink-0" />
              <span className="whitespace-nowrap">Записаться</span>
            </div>
          </GlassPanel>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <GlassPanel variant="subtle" className="p-6">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold text-text-primary">
                Контакты SPA центра
              </h3>
              <div className="flex items-center justify-center space-x-2">
                <Phone size={20} className="text-neon-magenta" />
                <span className="text-text-secondary">+7 495 221 5580</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <MapPin size={20} className="text-neon-cyan" />
                <span className="text-text-secondary">2 этаж, SPA центр</span>
              </div>
              <p className="text-sm text-text-muted">
                Работаем ежедневно с 07:00 до 23:00
              </p>
            </div>
          </GlassPanel>
        </motion.div>
      </div>

      {/* Booking Form Modal */}
      <AnimatePresence>
        {showBookingForm && (
          <motion.div
            className="fixed inset-0 bg-dark-void/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-md max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <GlassPanel variant="strong" className="p-6">
                <div className="space-y-6">
                  {/* Header */}
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-text-primary mb-2">
                      Запись на {service.name}
                    </h3>
                    <p className="text-text-secondary text-sm">
                      Выберите дату и время, заполните контактные данные
                    </p>
                  </div>

                  <form className="space-y-4" onSubmit={handleBookingSubmit}>
                    {/* Date Selection */}
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Дата процедуры
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowCalendarModal(true)}
                        className="w-full px-3 py-2 bg-glass border border-glass-strong rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-neon-magenta focus:border-transparent text-left flex items-center justify-between"
                      >
                        <span className={selectedDate ? 'text-text-primary' : 'text-text-muted'}>
                          {selectedDate ? new Date(selectedDate).toLocaleDateString('ru-RU') : 'Выберите дату'}
                        </span>
                        <Calendar size={20} className="text-neon-magenta" />
                      </button>
                    </div>

                    {/* Time Selection */}
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Предпочтительное время
                      </label>
                      <input
                        type="text"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="w-full px-3 py-2 bg-glass border border-glass-strong rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-neon-magenta focus:border-transparent"
                        placeholder="Например: 14:30 или 18:00"
                      />
                    </div>

                    {/* Number of Guests */}
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Количество человек
                      </label>
                      <input
                        type="text"
                        required
                        value={bookingData.guests}
                        onChange={(e) => setBookingData({...bookingData, guests: e.target.value})}
                        className="w-full px-3 py-2 bg-glass border border-glass-strong rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-neon-magenta focus:border-transparent"
                        placeholder="1"
                      />
                    </div>

                    {/* Guest Name */}
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Имя и фамилия
                      </label>
                      <input
                        type="text"
                        required
                        value={bookingData.name}
                        onChange={(e) => setBookingData({...bookingData, name: e.target.value})}
                        className="w-full px-3 py-2 bg-glass border border-glass-strong rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-neon-magenta focus:border-transparent"
                        placeholder="Введите ваше полное имя"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Телефон
                      </label>
                      <input
                        type="tel"
                        required
                        value={bookingData.phone}
                        onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                        className="w-full px-3 py-2 bg-glass border border-glass-strong rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-neon-magenta focus:border-transparent"
                        placeholder="+7 (999) 123-45-67"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Email (необязательно)
                      </label>
                      <input
                        type="email"
                        value={bookingData.email}
                        onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
                        className="w-full px-3 py-2 bg-glass border border-glass-strong rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-neon-magenta focus:border-transparent"
                        placeholder="your@email.com"
                      />
                    </div>

                    {/* Special Requests */}
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Особые пожелания (необязательно)
                      </label>
                      <textarea
                        rows={3}
                        value={bookingData.specialRequests}
                        onChange={(e) => setBookingData({...bookingData, specialRequests: e.target.value})}
                        className="w-full px-3 py-2 bg-glass border border-glass-strong rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-neon-magenta focus:border-transparent resize-none"
                        placeholder="Например: предпочтительный мастер, аллергии, особые требования"
                      />
                    </div>

                    {/* Submit Button */}
                    <div 
                      className="w-full px-6 py-3 bg-gradient-to-r from-neon-magenta to-neon-purple text-white font-semibold shadow-neon hover:shadow-neon-strong hover:scale-[1.02] transition-all duration-300 rounded-xl cursor-pointer flex items-center justify-center"
                      onClick={(e) => {
                        e.preventDefault()
                        handleBookingSubmit(e)
                      }}
                    >
                      <Calendar size={20} className="mr-2 flex-shrink-0" />
                      <span className="whitespace-nowrap">Отправить заявку</span>
                    </div>
                  </form>

                  {/* Close Button */}
                  <div className="text-center">
                    <Button
                      variant="ghost"
                      onClick={handleCloseBookingForm}
                      className="text-text-muted hover:text-text-primary"
                    >
                      Отмена
                    </Button>
                  </div>
                </div>
              </GlassPanel>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            className="fixed inset-0 bg-dark-void/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <GlassPanel variant="strong" className="p-8 text-center">
                <div className="space-y-6">
                  {/* Success Icon */}
                  <motion.div
                    className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mx-auto flex items-center justify-center shadow-lg"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <motion.svg
                      className="w-10 h-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </motion.svg>
                  </motion.div>

                  {/* Success Message */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="text-2xl font-bold text-text-primary mb-2">
                      Заявка отправлена!
                    </h3>
                    <p className="text-text-secondary leading-relaxed">
                      Мы получили вашу заявку на {service.name}. В ближайшее время наш менеджер свяжется с вами для подтверждения.
                    </p>
                  </motion.div>

                  {/* Next Steps */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <p className="text-text-secondary text-sm mb-4">
                      Время работы SPA центра: ежедневно с 07:00 до 23:00
                    </p>
                    <div className="flex items-center justify-center space-x-2 text-neon-magenta">
                      <Phone size={16} />
                      <span className="text-sm font-medium">
                        +7 495 221 5580
                      </span>
                    </div>
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.div
                    className="space-y-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Button
                      fullWidth
                      size="lg"
                      onClick={() => setShowSuccessModal(false)}
                      className="bg-gradient-to-r from-neon-magenta to-neon-purple text-white font-semibold shadow-neon hover:shadow-neon-strong hover:scale-[1.02] transition-all duration-300"
                    >
                      Отлично!
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setShowSuccessModal(false)
                        setShowBookingForm(true)
                      }}
                      className="text-text-muted hover:text-text-primary"
                    >
                      Записаться еще
                    </Button>
                  </motion.div>
                </div>
              </GlassPanel>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Calendar Modal */}
      <CustomCalendar
        value={selectedDate || ''}
        onChange={(date) => {
          setSelectedDate(date)
          setShowCalendarModal(false)
        }}
        onClose={() => setShowCalendarModal(false)}
        isOpen={showCalendarModal}
      />
    </div>
  )
} 