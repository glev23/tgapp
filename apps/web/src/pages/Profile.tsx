import React from 'react'
import { motion } from 'framer-motion'
import { useTelegram } from '../app/providers/TelegramProvider'
import { Card, CardContent } from '../components/ui'
import { User, Settings, Bell } from 'lucide-react'

export function Profile() {
  const { user, isReady } = useTelegram()

  if (!isReady) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-shimmer">Загрузка...</div>
      </div>
    )
  }

  return (
    <motion.div
      className="space-y-6 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="space-y-2">
        <h1 className="text-h1 font-bold text-text">Профиль</h1>
        <p className="text-body text-hint">Ваши настройки и предпочтения</p>
      </div>

      {/* User Info */}
      {user && (
        <Card variant="elevated">
          <CardContent className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-brand-gold bg-opacity-10 rounded-full flex items-center justify-center">
              <User size={24} className="text-brand-gold" />
            </div>
            <div className="flex-1">
              <h3 className="text-h3 font-medium text-text">
                {user.first_name} {user.last_name}
              </h3>
              <p className="text-caption text-hint">@{user.username}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Settings */}
      <div className="space-y-3">
        <Card variant="elevated" clickable>
          <CardContent className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-surface rounded-lg flex items-center justify-center">
              <Settings size={20} className="text-accent" />
            </div>
            <div className="flex-1">
              <h3 className="text-h3 font-medium text-text">Настройки</h3>
              <p className="text-caption text-hint">Персонализация приложения</p>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated" clickable>
          <CardContent className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-surface rounded-lg flex items-center justify-center">
              <Bell size={20} className="text-accent" />
            </div>
            <div className="flex-1">
              <h3 className="text-h3 font-medium text-text">Уведомления</h3>
              <p className="text-caption text-hint">Управление уведомлениями</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
