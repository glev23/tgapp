import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Briefcase, Utensils, Menu, User } from 'lucide-react'
import clsx from 'clsx'

const tabs = [
  { to: '/', icon: Home, label: 'Главная' },
  { to: '/services', icon: Briefcase, label: 'Услуги' },
  { to: '/restaurants', icon: Utensils, label: 'Рестораны' },
  { to: '/menu', icon: Menu, label: 'Меню' },
  { to: '/profile', icon: User, label: 'Профиль' }
]

export function TabBar() {
  const location = useLocation()
  
  return (
    <motion.nav 
      className="fixed bottom-0 left-0 right-0 pb-safe-bottom z-50"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Glass Background */}
      <div className="relative">
        <div className="absolute inset-0 bg-dark-void/90 backdrop-blur-md border-t border-glass" />
        
        {/* Gradient Border */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-70" />
        
        {/* Tab Content */}
        <div className="relative flex items-center justify-around px-1 py-3">
          {tabs.map((tab, index) => (
            <TabBarItem 
              key={tab.to} 
              {...tab} 
              index={index}
              isActive={location.pathname === tab.to}
            />
          ))}
        </div>
      </div>
    </motion.nav>
  )
}

interface TabBarItemProps {
  to: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  label: string
  index: number
  isActive: boolean
}

function TabBarItem({ to, icon: Icon, label, index, isActive }: TabBarItemProps) {
  return (
    <NavLink
      to={to}
       className="relative flex flex-col items-center justify-center px-2 py-1 min-w-[68px] rounded-xl transition-all duration-300"
    >
      <motion.div
        className="flex flex-col items-center space-y-1 relative"
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {/* Liquid Background for Active State */}
        {isActive && (
          <motion.div
          className="absolute inset-0 -m-2 bg-gradient-to-r from-neon-cyan/20 via-neon-purple/20 to-neon-magenta/20 rounded-2xl"
            layoutId="activeBubble"
            style={{
              background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.2) 0%, rgba(124, 58, 237, 0.2) 50%, rgba(255, 0, 229, 0.2) 100%)',
              filter: 'blur(8px)',

            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
          />
        )}
        
        {/* Solid Background for Active State */}
        {isActive && (
          <motion.div
            className="absolute -inset-1.5 bg-glass-strong/50 border border-neon-cyan/40 rounded-xl shadow-neon"
            layoutId="activeBackground"
            initial={false}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
          />
        )}
        
        {/* Icon */}
        <motion.div
          className="relative z-10"
          animate={{ 
            scale: isActive ? 1.1 : 1,
            y: isActive ? -2 : 0
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Icon 
            size={20} 
            className={clsx(
              "transition-all duration-300",
              isActive 
                ? 'text-neon-cyan drop-shadow-lg' 
                : 'text-text-muted hover:text-text-secondary'
            )}
          />
        </motion.div>
        
        {/* Label */}
        <motion.span
          className={clsx(
            "text-xs leading-none relative z-10 transition-all duration-300",
            isActive 
              ? 'text-text-primary font-medium' 
              : 'text-text-muted'
          )}
          animate={{ 
            opacity: isActive ? 1 : 0.7,
            scale: isActive ? 1 : 0.9
          }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.span>
        
        {/* Subtle Glow Effect */}
        {isActive && (
          <motion.div
            className="absolute inset-0 -m-2 rounded-xl opacity-20"
            style={{
              background: 'radial-gradient(circle, rgba(34, 211, 238, 0.4) 0%, transparent 60%)',
              filter: 'blur(8px)',
            }}
            animate={{
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </motion.div>
    </NavLink>
  )
}
