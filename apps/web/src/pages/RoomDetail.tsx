import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Bed, Users, Eye, Maximize, Wifi, Coffee, Calendar, Phone, Star, Shield, CalendarIcon, Clock, CreditCard } from 'lucide-react'
import { GradientBackground } from '../components/fx/GradientBackground'
import { ParticlesLayer } from '../components/fx/ParticlesLayer'
import { GlassPanel } from '../components/ui/GlassPanel'
import { Button, Calendar as CustomCalendar } from '../components/ui'
import { Room } from '../types'
import roomService from '../services/roomService'

export function RoomDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [room, setRoom] = useState<Room | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showCalendarModal, setShowCalendarModal] = useState(false)
  const [showCheckOutCalendarModal, setShowCheckOutCalendarModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedCheckOutDate, setSelectedCheckOutDate] = useState<string | null>(null)
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: '',
    name: '',
    phone: '',
    email: '',
    specialRequests: ''
  })

  useEffect(() => {
    const loadRoom = async () => {
      if (!id) return
      
      setIsLoading(true)
      try {
        await roomService.loadRooms()
        const roomData = roomService.getRoomById(id)
        setRoom(roomData || null)
      } catch (error) {
        console.error('Error loading room:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadRoom()
  }, [id])

  const getRoomIcon = (room: Room) => {
    if (room.category === 'Presidential Suite') return '👑'
    if (room.category.includes('Suite')) return '🏰'
    if (room.category === 'Collection Executive') return '💼'
    if (room.category === 'Grand Residential Suite') return '🏠'
    if (room.category === 'Romantic Suite') return '💝'
    if (room.category.includes('Collection')) return '✨'
    return '🛏️'
  }

  const getAmenityIcon = (amenity: string) => {
    if (amenity.includes('Wi‑Fi') || amenity.includes('TV')) return <Wifi size={16} className="text-neon-cyan" />
    if (amenity.includes('кофе') || amenity.includes('бар')) return <Coffee size={16} className="text-neon-purple" />
    if (amenity.includes('сейф') || amenity.includes('климат')) return <Shield size={16} className="text-neon-magenta" />
    return <Star size={16} className="text-gold" />
  }

  const resetBookingForm = () => {
    setBookingData({
      checkIn: '',
      checkOut: '',
      guests: '',
      name: '',
      phone: '',
      email: '',
      specialRequests: ''
    })
    setSelectedDate(null)
    setSelectedCheckOutDate(null)
  }

  const handleCloseBookingForm = () => {
    setShowBookingForm(false)
    resetBookingForm()
  }

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDate) {
      alert('Пожалуйста, выберите дату заезда')
      return
    }
    if (!selectedCheckOutDate) {
      alert('Пожалуйста, выберите дату выезда')
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
            <p className="text-text-secondary">Загружаем информацию...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <GradientBackground variant="subtle" animated />
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <GlassPanel variant="strong" className="p-6 text-center">
            <h2 className="text-xl font-semibold text-neon-pink mb-2">Номер не найден</h2>
            <p className="text-text-secondary mb-4">Возможно, номер был удален или адрес неверный</p>
            <Button onClick={() => navigate('/rooms')}>
              Вернуться к списку номеров
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
          {room.imageUrl ? (
            <img
              src={room.imageUrl}
              alt={room.name}
              className="w-full h-full object-cover"
            />
          ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-dark-navy via-dark-indigo to-dark-void">
            {/* Placeholder pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full bg-gradient-gold opacity-30" />
              </div>
            </div>
          )}
          
          {/* Glass overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-void/80 via-dark-void/20 to-transparent" />
          
          {/* Back Button */}
          <div className="absolute top-4 left-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/rooms')}
              className="p-2 hover:bg-glass"
            >
              <ArrowLeft size={24} className="text-text-primary" />
            </Button>
          </div>

          {/* Room Icon */}
          <div className="absolute top-4 right-4">
            <div className="w-16 h-16 bg-glass-strong backdrop-blur-sm rounded-2xl flex items-center justify-center border border-gold/40 shadow-neon/20">
              <span className="text-3xl">{getRoomIcon(room)}</span>
            </div>
          </div>

          {/* Hero Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl font-display font-bold text-white mb-3">
                {room.name}
              </h1>
              
              <p className="text-xl text-text-secondary mb-4">
                {room.category} • {room.area}
              </p>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 px-3 py-2 bg-glass-strong rounded-full border border-glass">
                  <Users size={16} className="text-neon-cyan" />
                  <span className="text-sm text-white">
                    до {room.capacity} {room.capacity === 1 ? 'гостя' : 'гостей'}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 px-3 py-2 bg-glass-strong rounded-full border border-glass">
                  <Star size={16} className="text-gold" />
                  <span className="text-sm text-white">
                    {room.priceRange === 'по запросу' ? 'По запросу' : `от ${room.priceRange.split('-')[0]} ₽`}
                  </span>
                </div>
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
              <h2 className="text-xl font-semibold text-text-primary mb-4">О номере</h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                {room.description}
              </p>
              <p className="text-text-muted text-sm">
                <strong>Для кого:</strong> {room.targetGuest}
              </p>
            </GlassPanel>
          </motion.div>

          {/* Key Details */}
          <motion.div
            className="grid gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {/* Bed & Area */}
            <GlassPanel variant="subtle" className="p-4">
              <div className="flex items-start space-x-3">
                <Bed size={20} className="text-gold mt-1" />
                <div>
                  <h3 className="font-semibold text-text-primary mb-1">Спальное место</h3>
                  <p className="text-text-secondary text-sm">{room.bedType}</p>
                </div>
              </div>
            </GlassPanel>

            {/* View */}
            <GlassPanel variant="subtle" className="p-4">
              <div className="flex items-start space-x-3">
                <Eye size={20} className="text-neon-cyan mt-1" />
                <div>
                  <h3 className="font-semibold text-text-primary mb-1">Вид из окна</h3>
                  <p className="text-text-secondary text-sm">{room.view}</p>
                </div>
              </div>
            </GlassPanel>

            {/* Area */}
            <GlassPanel variant="subtle" className="p-4">
              <div className="flex items-start space-x-3">
                <Maximize size={20} className="text-neon-purple mt-1" />
                <div>
                  <h3 className="font-semibold text-text-primary mb-1">Площадь</h3>
                  <p className="text-text-secondary text-sm">{room.area}</p>
                </div>
              </div>
            </GlassPanel>
          </motion.div>

          {/* Amenities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <GlassPanel variant="subtle" className="p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-4">Удобства</h2>
              <div className="grid gap-3">
                {room.amenities.map(amenity => (
                  <div key={amenity} className="flex items-center space-x-3 p-3 bg-glass rounded-lg border border-glass">
                    {getAmenityIcon(amenity)}
                    <span className="text-text-secondary text-sm">{amenity}</span>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </motion.div>

          {/* Bathroom */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <GlassPanel variant="subtle" className="p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-4">Ванная комната</h2>
              <p className="text-text-secondary text-sm leading-relaxed">
                {room.bathroom}
              </p>
            </GlassPanel>
          </motion.div>

          {/* Features */}
          {room.features && room.features.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <GlassPanel variant="subtle" className="p-6">
                <h2 className="text-xl font-semibold text-text-primary mb-4">Особенности</h2>
                <div className="flex flex-wrap gap-2">
                  {room.features.map(feature => (
                    <span 
                      key={feature}
                      className="px-3 py-2 text-sm bg-glass rounded-full text-text-primary border border-glass"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </GlassPanel>
            </motion.div>
          )}

          {/* Booking Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <div
              className="w-full px-6 py-3 bg-gradient-to-r from-gold to-neon-cyan text-white font-semibold shadow-neon hover:shadow-neon-strong hover:scale-[1.02] transition-all duration-300 rounded-xl cursor-pointer flex items-center justify-center"
              onClick={() => setShowBookingForm(true)}
            >
              <Calendar size={20} className="mr-2 flex-shrink-0" />
              <span className="whitespace-nowrap">Забронировать номер</span>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <GlassPanel variant="strong" className="p-6">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold text-text-primary">
                  Бронирование номеров
                </h3>
                <div className="flex items-center justify-center space-x-2">
                  <Phone size={20} className="text-gold" />
                  <span className="text-text-secondary">+7 (495) 221-55-55</span>
                </div>
                <p className="text-sm text-text-muted">
                  Служба размещения работает 24/7
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
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <GlassPanel variant="strong" className="p-6">
                <div className="space-y-6">
                  <div className="text-center">
                    <Bed size={48} className="text-gold mx-auto mb-3" />
                    <h3 className="text-xl font-semibold text-text-primary mb-2">
                  Бронирование номера
                </h3>
                    <p className="text-text-secondary text-sm">
                      {room.name}
                    </p>
                  </div>

                  <form className="space-y-4" onSubmit={handleBookingSubmit}>
                    {/* Check-in Date */}
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Дата заезда
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowCalendarModal(true)}
                        className="w-full px-3 py-2 bg-glass border border-glass-strong rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent text-left flex items-center justify-between"
                      >
                        <span className={selectedDate ? 'text-text-primary' : 'text-text-muted'}>
                          {selectedDate ? new Date(selectedDate).toLocaleDateString('ru-RU') : 'Выберите дату заезда'}
                        </span>
                        <CalendarIcon size={20} className="text-gold" />
                      </button>
                    </div>

                    {/* Check-out Date */}
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Дата выезда
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowCheckOutCalendarModal(true)}
                        className="w-full px-3 py-2 bg-glass border border-glass-strong rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent text-left flex items-center justify-between"
                      >
                        <span className={selectedCheckOutDate ? 'text-text-primary' : 'text-text-muted'}>
                          {selectedCheckOutDate ? new Date(selectedCheckOutDate).toLocaleDateString('ru-RU') : 'Выберите дату выезда'}
                        </span>
                        <CalendarIcon size={20} className="text-gold" />
                      </button>
                    </div>

                    {/* Number of Guests */}
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Количество гостей
                      </label>
                      <input
                        type="text"
                        required
                        value={bookingData.guests}
                        onChange={(e) => setBookingData({...bookingData, guests: e.target.value})}
                        className="w-full px-3 py-2 bg-glass border border-glass-strong rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                        placeholder={`Максимум: ${room.capacity} гостей`}
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
                        className="w-full px-3 py-2 bg-glass border border-glass-strong rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
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
                        className="w-full px-3 py-2 bg-glass border border-glass-strong rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                        placeholder="+7 (999) 123-45-67"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={bookingData.email}
                        onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
                        className="w-full px-3 py-2 bg-glass border border-glass-strong rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
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
                        className="w-full px-3 py-2 bg-glass border border-glass-strong rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent resize-none"
                        placeholder="Например: номер на высоком этаже, вид на город, детская кроватка, трансфер из аэропорта"
                      />
                    </div>

                    {/* Submit Button */}
                  <div 
                      className="w-full px-6 py-3 bg-gradient-to-r from-gold to-neon-cyan text-white font-semibold shadow-neon hover:shadow-neon-strong hover:scale-[1.02] transition-all duration-300 rounded-xl cursor-pointer flex items-center justify-center"
                      onClick={(e) => {
                        e.preventDefault()
                        handleBookingSubmit(e)
                      }}
                    >
                      <CreditCard size={20} className="mr-2 flex-shrink-0" />
                      <span className="whitespace-nowrap">Забронировать номер</span>
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
                    <p className="text-gold font-medium">
                      +7 (495) 221-55-55
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
                      Номер забронирован!
                    </h3>
                    <p className="text-text-secondary leading-relaxed">
                      Мы получили вашу заявку на бронирование номера <span className="font-semibold text-gold">{room?.name}</span>
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
                        <span className="text-text-muted">Номер:</span>
                        <span className="text-text-primary font-medium">{room?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Дата заезда:</span>
                        <span className="text-text-primary font-medium">
                          {selectedDate ? new Date(selectedDate).toLocaleDateString('ru-RU') : 'Не выбрана'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Дата выезда:</span>
                        <span className="text-text-primary font-medium">{selectedCheckOutDate ? new Date(selectedCheckOutDate).toLocaleDateString('ru-RU') : 'Не выбрана'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Гости:</span>
                        <span className="text-text-primary font-medium">{bookingData.guests}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Имя:</span>
                        <span className="text-text-primary font-medium">{bookingData.name}</span>
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
                    <div className="flex items-center justify-center space-x-2 text-gold">
                      <Phone size={16} />
                      <span className="text-sm font-medium">
                        +7 (495) 221-55-55
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
                      className="bg-gradient-to-r from-gold to-neon-cyan text-white font-semibold shadow-neon hover:shadow-neon-strong hover:scale-[1.02] transition-all duration-300"
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
          setBookingData({...bookingData, checkIn: date})
          // Автоматически устанавливаем дату выезда через день
          const checkOutDate = new Date(date)
          checkOutDate.setDate(checkOutDate.getDate() + 1)
          const checkOutDateString = checkOutDate.toISOString().split('T')[0]
          setSelectedCheckOutDate(checkOutDateString)
          setBookingData({...bookingData, checkIn: date, checkOut: checkOutDateString})
          setShowCalendarModal(false)
        }}
        onClose={() => setShowCalendarModal(false)}
        isOpen={showCalendarModal}
      />

      {/* Check Out Calendar Modal */}
      <CustomCalendar
        value={selectedCheckOutDate || ''}
        onChange={(date) => {
          // Проверяем, что дата выезда после даты заезда
          if (selectedDate && date <= selectedDate) {
            alert('Дата выезда должна быть после даты заезда')
            return
          }
          setSelectedCheckOutDate(date)
          setBookingData({...bookingData, checkOut: date})
          setShowCheckOutCalendarModal(false)
        }}
        onClose={() => setShowCheckOutCalendarModal(false)}
        isOpen={showCheckOutCalendarModal}
        minDate={selectedDate || undefined}
      />
    </div>
  )
} 