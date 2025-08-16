import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Clock, Star, MapPin, Phone, Users, CalendarIcon, ChefHat } from 'lucide-react'
import { GradientBackground } from '../components/fx/GradientBackground'
import { ParticlesLayer } from '../components/fx/ParticlesLayer'
import { GlassPanel } from '../components/ui/GlassPanel'
import { Button, Calendar as CustomCalendar } from '../components/ui'
import { Restaurant } from '../types'
import restaurantService from '../services/restaurantService'

export function RestaurantDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    guests: '',
    name: '',
    phone: '',
    specialRequests: '',
    address: ''
  })
  const [showCalendarModal, setShowCalendarModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  useEffect(() => {
    const loadRestaurant = async () => {
      if (!id) return
      
      setIsLoading(true)
      try {
        await restaurantService.loadRestaurants()
        const restaurantData = restaurantService.getRestaurantById(id)
        setRestaurant(restaurantData || null)
      } catch (error) {
        console.error('Error loading restaurant:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadRestaurant()
  }, [id])

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

  const isOpen = restaurant ? restaurantService.isRestaurantOpen(restaurant.id) : false

  const resetBookingForm = () => {
    setBookingData({
      date: '',
      time: '',
      guests: '',
      name: '',
      phone: '',
      specialRequests: '',
      address: ''
    })
  }

  const handleCloseBookingForm = () => {
    setShowBookingForm(false)
    resetBookingForm()
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
            <p className="text-text-secondary">Загружаем информацию...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <GradientBackground variant="subtle" animated />
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <GlassPanel variant="strong" className="p-6 text-center">
            <h2 className="text-xl font-semibold text-neon-pink mb-2">Ресторан не найден</h2>
            <p className="text-text-secondary mb-4">Возможно, ресторан был удален или адрес неверный</p>
            <Button onClick={() => navigate('/restaurants')}>
              Вернуться к списку ресторанов
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
      
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="relative h-80 overflow-hidden">
          {/* Hero Image */}
          {restaurant.imageUrl ? (
            <img
              src={restaurant.imageUrl}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-dark-navy via-dark-indigo to-dark-void">
              {/* Placeholder pattern */}
              <div className="absolute inset-0 opacity-30">
                <div className="w-full h-full bg-gradient-purple-cyan" />
              </div>
            </div>
          )}
          
          {/* Glass overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-void via-dark-void/50 to-transparent" />
          
          {/* Back Button */}
          <motion.button
            className="absolute top-6 left-4 z-20 w-12 h-12 bg-glass-strong backdrop-blur-sm rounded-xl border border-glass-strong shadow-glass flex items-center justify-center"
            onClick={() => navigate(-1)}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={20} className="text-text-primary" />
          </motion.button>

          {/* Restaurant Icon */}
          <div className="absolute top-6 right-4 z-20">
            <div className="w-16 h-16 bg-glass-strong backdrop-blur-sm rounded-2xl border border-neon-cyan/40 shadow-neon flex items-center justify-center">
              <span className="text-3xl">{getRestaurantIcon(restaurant)}</span>
            </div>
          </div>

          {/* Hero Content */}
          <div className="absolute bottom-6 left-4 right-4 z-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl font-black font-display text-white mb-2">
                {restaurant.name}
              </h1>
              <p className="text-xl text-text-secondary mb-4">
                {restaurant.cuisine}
              </p>
              
              <div className="flex items-center space-x-4">
                <div className={`flex items-center space-x-2 px-3 py-2 rounded-full ${
                  isOpen 
                    ? 'bg-green-500/20 border border-green-500/40' 
                    : 'bg-orange-500/20 border border-orange-500/40'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${isOpen ? 'bg-green-400' : 'bg-orange-400'}`} />
                  <span className="text-sm text-white">
                    {isOpen ? 'Открыто' : 'Закрыто'}
                  </span>
                </div>
                
                {restaurant.averageCheck && (
                  <div className="flex items-center space-x-2 px-3 py-2 bg-glass-strong rounded-full border border-glass">
                    <Star size={16} className="text-gold" />
                    <span className="text-sm text-white">{restaurant.averageCheck}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <GlassPanel variant="subtle" className="p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-4">О ресторане</h2>
              <p className="text-text-secondary leading-relaxed">
                {restaurant.description}
              </p>
            </GlassPanel>
          </motion.div>

          {/* Info Cards */}
          <motion.div
            className="grid gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {/* Hours */}
            <GlassPanel variant="subtle" className="p-4">
              <div className="flex items-start space-x-3">
                <Clock size={20} className="text-neon-cyan mt-1" />
                <div>
                  <h3 className="font-semibold text-text-primary mb-1">Часы работы</h3>
                  <p className="text-text-secondary text-sm">{restaurant.hours}</p>
                </div>
              </div>
            </GlassPanel>

            {/* Average Price */}
            {restaurant.averageCheck && (
              <GlassPanel variant="subtle" className="p-4">
                <div className="flex items-start space-x-3">
                  <Star size={20} className="text-gold mt-1" />
                  <div>
                    <h3 className="font-semibold text-text-primary mb-1">Средний чек</h3>
                    <p className="text-text-secondary text-sm">{restaurant.averageCheck}</p>
                  </div>
                </div>
              </GlassPanel>
            )}

            {/* Location */}
            {restaurant.location && (
              <GlassPanel variant="subtle" className="p-4">
                <div className="flex items-start space-x-3">
                  <MapPin size={20} className="text-neon-purple mt-1" />
                  <div>
                    <h3 className="font-semibold text-text-primary mb-1">Расположение</h3>
                    <p className="text-text-secondary text-sm">{restaurant.location}</p>
                  </div>
                </div>
              </GlassPanel>
            )}

            {/* Contact */}
            {restaurant.contact && (
              <GlassPanel variant="subtle" className="p-4">
                <div className="flex items-start space-x-3">
                  <Phone size={20} className="text-neon-cyan mt-1" />
                  <div>
                    <h3 className="font-semibold text-text-primary mb-1">Контакты</h3>
                    <p className="text-text-secondary text-sm">{restaurant.contact}</p>
                  </div>
                </div>
              </GlassPanel>
            )}

            {/* Features */}
            {restaurant.features && restaurant.features.length > 0 && (
              <GlassPanel variant="subtle" className="p-4">
                <div className="flex items-start space-x-3">
                  <ChefHat size={20} className="text-neon-purple mt-1" />
                  <div>
                    <h3 className="font-semibold text-text-primary mb-3">Особенности</h3>
                    <div className="flex flex-wrap gap-2">
                      {restaurant.features.map(feature => (
                        <span 
                          key={feature}
                          className="px-3 py-2 text-sm bg-glass rounded-full text-text-primary border border-glass"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassPanel>
            )}
          </motion.div>

          {/* Booking Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div
              className="w-full px-6 py-3 bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-semibold shadow-neon hover:shadow-neon-strong hover:scale-[1.02] transition-all duration-300 rounded-xl cursor-pointer flex items-center justify-center"
              onClick={() => setShowBookingForm(true)}
            >
              <Users size={20} className="mr-2 flex-shrink-0" />
              <span className="whitespace-nowrap">Забронировать столик</span>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <GlassPanel variant="strong" className="p-6">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold text-text-primary">
                  Контакты и бронирование
                </h3>
                <div className="flex items-center justify-center space-x-2">
                  <Phone size={20} className="text-neon-cyan" />
                  <span className="text-text-secondary">+7 (495) 221-55-55</span>
                </div>
                <p className="text-sm text-text-muted">
                  Звоните для бронирования и уточнения деталей
                </p>
              </div>
            </GlassPanel>
          </motion.div>
        </div>
      </div>

      {/* Booking Form Modal */}
      <AnimatePresence>
        {showBookingForm && (
          <motion.div
            className="fixed inset-0 bg-dark-void/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowBookingForm(false)}
          >
            <motion.div
              className="w-full max-w-md max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <GlassPanel variant="strong" className="p-6">
                <div className="space-y-6">
                  <div className="text-center">
                    <CalendarIcon size={48} className="text-neon-cyan mx-auto mb-3" />
                    <h3 className="text-xl font-semibold text-text-primary mb-2">
                      Бронирование столика
                    </h3>
                    <p className="text-text-secondary text-sm">
                      {restaurant.name}
                    </p>
                  </div>

                  <form className="space-y-4" onSubmit={(e) => {
                    e.preventDefault()
                    if (!selectedDate) {
                      alert('Пожалуйста, выберите дату')
                      return
                    }
                    // Here you would typically send the booking data to your API
                    setShowSuccessModal(true)
                    setShowBookingForm(false)
                  }}>
                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Дата
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowCalendarModal(true)}
                      className="w-full px-3 py-2 bg-glass border border-glass-strong rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-transparent text-left flex items-center justify-between"
                    >
                      <span className={selectedDate ? 'text-text-primary' : 'text-text-muted'}>
                        {selectedDate ? new Date(selectedDate).toLocaleDateString('ru-RU') : 'Выберите дату'}
                      </span>
                      <CalendarIcon size={20} className="text-neon-cyan" />
                    </button>
                  </div>

                    {/* Time */}
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Время
                      </label>
                      <input
                        type="text"
                        required
                        value={bookingData.time}
                        onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                        className="w-full px-3 py-2 bg-glass border border-glass-strong rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-transparent"
                        placeholder="Например: 19:30"
                      />
                    </div>

                    {/* Guests */}
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Количество гостей
                      </label>
                      <input
                        type="text"
                        required
                        value={bookingData.guests}
                        onChange={(e) => setBookingData({...bookingData, guests: e.target.value})}
                        className="w-full px-3 py-2 bg-glass border border-glass-strong rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-transparent"
                        placeholder="Например: 2"
                      />
                    </div>

                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Ваше имя
                      </label>
                      <input
                        type="text"
                        required
                        value={bookingData.name}
                        onChange={(e) => setBookingData({...bookingData, name: e.target.value})}
                        className="w-full px-3 py-2 bg-glass border border-glass-strong rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-transparent"
                        placeholder="Введите ваше имя"
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
                        className="w-full px-3 py-2 bg-glass border border-glass-strong rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-transparent"
                        placeholder="+7 (999) 123-45-67"
                      />
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        <MapPin size={16} className="inline mr-2" />
                        Номер комнаты *
                      </label>
                      <input
                        type="text"
                        required
                        value={bookingData.address}
                        onChange={(e) => setBookingData({...bookingData, address: e.target.value})}
                        className="w-full px-3 py-2 bg-glass border border-glass-strong rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-transparent"
                        placeholder="Например: 205, 301, Presidential Suite"
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
                        className="w-full px-3 py-2 bg-glass border border-glass-strong rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-transparent resize-none"
                        placeholder="Например: столик у окна, детский стул, особые диетические требования"
                      />
                    </div>

                    {/* Submit Button */}
                    <div
                      className="w-full px-6 py-3 bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-semibold shadow-neon hover:shadow-neon-strong hover:scale-[1.02] transition-all duration-300 rounded-xl cursor-pointer flex items-center justify-center"
                      onClick={(e) => {
                        e.preventDefault()
                        // Здесь должна быть логика отправки формы
                        setShowSuccessModal(true)
                        setShowBookingForm(false)
                      }}
                    >
                      <Users size={20} className="mr-2 flex-shrink-0" />
                      <span className="whitespace-nowrap">Забронировать столик</span>
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

                  {/* Contact Info */}
                  <div className="text-center pt-4 border-t border-glass">
                    <p className="text-sm text-text-muted mb-2">
                      Или позвоните напрямую:
                    </p>
                    <p className="text-neon-cyan font-medium">
                      {restaurant.contact || '+7 (495) 221-55-55'}
                    </p>
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
                      Бронирование отправлено!
                    </h3>
                    <p className="text-text-secondary leading-relaxed">
                      Мы получили вашу заявку на бронирование столика в ресторане <span className="font-semibold text-neon-cyan">{restaurant?.name}</span>
                    </p>
                  </motion.div>

                  {/* Booking Details */}
                  <motion.div
                    className="bg-glass/30 rounded-xl p-4 border border-glass"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h4 className="text-sm font-semibold text-text-primary mb-3 text-left">
                      Детали бронирования:
                    </h4>
                    <div className="space-y-2 text-left text-sm">
                      <div className="flex justify-between">
                        <span className="text-text-muted">Дата:</span>
                        <span className="text-text-primary font-medium">
                          {selectedDate ? new Date(selectedDate).toLocaleDateString('ru-RU') : 'Не выбрана'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Время:</span>
                        <span className="text-text-primary font-medium">{bookingData.time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Гости:</span>
                        <span className="text-text-primary font-medium">{bookingData.guests}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Имя:</span>
                        <span className="text-text-primary font-medium">{bookingData.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Номер комнаты:</span>
                        <span className="text-text-primary font-medium">{bookingData.address}</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Next Steps */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <p className="text-text-secondary text-sm mb-4">
                      В ближайшее время наш менеджер свяжется с вами для подтверждения бронирования
                    </p>
                    <div className="flex items-center justify-center space-x-2 text-neon-cyan">
                      <Phone size={16} />
                      <span className="text-sm font-medium">
                        {restaurant?.contact || '+7 (495) 221-55-55'}
                      </span>
                    </div>
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.div
                    className="space-y-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Button
                      fullWidth
                      size="lg"
                      onClick={() => setShowSuccessModal(false)}
                      className="bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-semibold shadow-neon hover:shadow-neon-strong hover:scale-[1.02] transition-all duration-300"
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
                      Забронировать еще
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
          setBookingData({...bookingData, date})
          setShowCalendarModal(false)
        }}
        onClose={() => setShowCalendarModal(false)}
        isOpen={showCalendarModal}
      />
    </div>
  )
} 