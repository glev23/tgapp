import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import { GlassPanel } from './GlassPanel'
import { Button } from './Button'

interface CalendarProps {
  value: string
  onChange: (date: string) => void
  onClose: () => void
  isOpen: boolean
  minDate?: string
}

export function Calendar({ value, onChange, onClose, isOpen, minDate }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(() => {
    if (value) {
      return new Date(value)
    }
    return new Date()
  })

  const [viewMode, setViewMode] = useState<'days' | 'months' | 'years'>('days')

  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days = []
    const currentDateObj = new Date(startDate)
    
    while (currentDateObj <= lastDay || days.length < 42) {
      days.push(new Date(currentDateObj))
      currentDateObj.setDate(currentDateObj.getDate() + 1)
    }
    
    return days
  }, [currentDate])

  const months = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ]

  const years = Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - 10 + i)

  const weekDays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']

  const handleDateSelect = (date: Date) => {
    const dateString = date.toISOString().split('T')[0]
    onChange(dateString)
    onClose()
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSelected = (date: Date) => {
    if (!value) return false
    return date.toISOString().split('T')[0] === value
  }

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth()
  }

  const isPastDate = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // Если указана минимальная дата, используем её
    if (minDate) {
      const minDateObj = new Date(minDate)
      minDateObj.setHours(0, 0, 0, 0)
      return date < minDateObj
    }
    
    return date < today
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1))
      return newDate
    })
  }

  const navigateYear = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setFullYear(prev.getFullYear() + (direction === 'next' ? 1 : -1))
      return newDate
    })
  }

  const renderDaysView = () => (
    <>
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateMonth('prev')}
          className="p-2 hover:bg-glass"
        >
          <ChevronLeft size={16} />
        </Button>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('months')}
            className="text-text-primary hover:text-neon-cyan font-medium"
          >
            {months[currentDate.getMonth()]}
          </button>
          <span className="text-text-muted">•</span>
          <button
            onClick={() => setViewMode('years')}
            className="text-text-primary hover:text-neon-cyan font-medium"
          >
            {currentDate.getFullYear()}
          </button>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateMonth('next')}
          className="p-2 hover:bg-glass"
        >
          <ChevronRight size={16} />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-3">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs font-medium text-text-muted py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarData.map((date, index) => (
          <button
            key={index}
            onClick={() => !isPastDate(date) && handleDateSelect(date)}
            disabled={isPastDate(date)}
            className={`
              w-8 h-8 rounded-lg text-sm font-medium transition-all duration-200
              ${isToday(date) 
                ? 'bg-neon-cyan text-white ring-2 ring-neon-cyan/50' 
                : isSelected(date)
                ? 'bg-neon-purple text-white'
                : isCurrentMonth(date)
                ? 'text-text-primary hover:bg-glass hover:text-neon-cyan'
                : 'text-text-muted hover:bg-glass/50'
              }
              ${isPastDate(date) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {date.getDate()}
          </button>
        ))}
      </div>
    </>
  )

  const renderMonthsView = () => (
    <>
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateYear('prev')}
          className="p-2 hover:bg-glass"
        >
          <ChevronLeft size={16} />
        </Button>
        
        <button
          onClick={() => setViewMode('years')}
          className="text-text-primary hover:text-neon-cyan font-medium"
        >
          {currentDate.getFullYear()}
        </button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateYear('next')}
          className="p-2 hover:bg-glass"
        >
          <ChevronRight size={16} />
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {months.map((month, index) => (
          <button
            key={month}
            onClick={() => {
              const newDate = new Date(currentDate)
              newDate.setMonth(index)
              setCurrentDate(newDate)
              setViewMode('days')
            }}
            className="p-3 rounded-lg text-text-primary hover:bg-glass hover:text-neon-cyan transition-all duration-200"
          >
            {month}
          </button>
        ))}
      </div>
    </>
  )

  const renderYearsView = () => (
    <>
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateYear('prev')}
          className="p-2 hover:bg-glass"
        >
          <ChevronLeft size={16} />
        </Button>
        
        <span className="text-text-primary font-medium">
          {years[0]} - {years[years.length - 1]}
        </span>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateYear('next')}
          className="p-2 hover:bg-glass"
        >
          <ChevronRight size={16} />
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
        {years.map(year => (
          <button
            key={year}
            onClick={() => {
              const newDate = new Date(currentDate)
              newDate.setFullYear(year)
              setCurrentDate(newDate)
              setViewMode('months')
            }}
            className="p-3 rounded-lg text-text-primary hover:bg-glass hover:text-neon-cyan transition-all duration-200"
          >
            {year}
          </button>
        ))}
      </div>
    </>
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-dark-void/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-sm"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <GlassPanel variant="strong" className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-text-primary">
                    Выберите дату
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="p-2 hover:bg-glass"
                  >
                    ✕
                  </Button>
                </div>

                <div className="min-h-[320px]">
                  {viewMode === 'days' && renderDaysView()}
                  {viewMode === 'months' && renderMonthsView()}
                  {viewMode === 'years' && renderYearsView()}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-glass">
                  <span className="text-sm text-text-muted">
                    {value ? `Выбрано: ${new Date(value).toLocaleDateString('ru-RU')}` : 'Дата не выбрана'}
                  </span>
                  <Button
                    variant="ghost"
                    onClick={() => setViewMode('days')}
                    className="text-neon-cyan hover:text-neon-cyan/80"
                  >
                    Сегодня
                  </Button>
                </div>
              </div>
            </GlassPanel>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 