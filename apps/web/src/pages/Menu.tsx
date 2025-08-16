import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Star, Clock, Plus, Minus, ShoppingCart, X, Leaf, Shield, Flame, Heart, User, Phone, MapPin, CreditCard, Calendar } from 'lucide-react'
import { GradientBackground } from '../components/fx/GradientBackground'
import { ParticlesLayer } from '../components/fx/ParticlesLayer'
import { GlassPanel } from '../components/ui/GlassPanel'
import { Card, CardContent, Button } from '../components/ui'
import { MenuItem, MenuCategory, Cart, DietaryInfo } from '../types'
import menuService from '../services/menuService'
import cartService from '../services/cartService'

export function Menu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [cart, setCart] = useState<Cart>(cartService.getCart())
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDietaryFilters, setShowDietaryFilters] = useState(false)
  const [showCartModal, setShowCartModal] = useState(false)
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [dietaryFilters, setDietaryFilters] = useState<Partial<DietaryInfo>>({})
  const [orderFormData, setOrderFormData] = useState({
    name: '',
    phone: '',
    email: '',
    roomNumber: '',
    deliveryTime: '',
    paymentMethod: 'card',
    specialRequests: ''
  })

  useEffect(() => {
    const loadMenu = async () => {
      setIsLoading(true)
      try {
        const result = await menuService.loadMenu()
        console.log('Menu load result:', result)
        if (result.success) {
          setMenuItems(result.data)
          const cats = menuService.getCategories()
          console.log('Loaded categories:', cats)
          setCategories(cats)
          console.log('Total menu items loaded:', result.data.length)
          console.log('Sample menu items:', result.data.slice(0, 3))
        } else {
          setError(result.error || 'Ошибка загрузки меню')
        }
      } catch (err) {
        console.error('Error loading menu:', err)
        setError('Ошибка загрузки данных')
      } finally {
        setIsLoading(false)
      }
    }

    loadMenu()

    // Subscribe to cart updates
    const unsubscribe = cartService.subscribe((updatedCart) => {
      setCart(updatedCart)
    })

    return unsubscribe
  }, [])

  const getFilteredItems = () => {
    let items = menuItems

    // Debug logging
    console.log('Total menu items:', menuItems.length)
    console.log('Categories:', categories)
    console.log('Selected category:', selectedCategory)

    // Category filter
    if (selectedCategory !== 'all') {
      const category = categories.find(cat => cat.id === selectedCategory)
      console.log('Found category:', category)
      if (category) {
        items = items.filter(item => item.category === category.name)
        console.log('Items after category filter:', items.length)
        console.log('Sample items:', items.slice(0, 3))
      }
    }

    // Search filter
    if (searchTerm) {
      items = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Dietary filters
    if (Object.keys(dietaryFilters).length > 0) {
      items = items.filter(item => {
        if (!item.dietaryInfo) return false
        
        return Object.entries(dietaryFilters).every(([key, value]) => {
          if (!value) return true // Skip if requirement is false
          return item.dietaryInfo?.[key as keyof DietaryInfo] === true
        })
      })
    }

    console.log('Final filtered items:', items.length)
    return items
  }

  const getCategorizedItems = () => {
    const filtered = getFilteredItems()
    const grouped: { [categoryName: string]: MenuItem[] } = {}

    filtered.forEach(item => {
      const categoryName = item.category || 'Прочее'
      if (!grouped[categoryName]) {
        grouped[categoryName] = []
      }
      grouped[categoryName].push(item)
    })

    return Object.entries(grouped).map(([name, items]) => ({
      name,
      items
    }))
  }

  // Функция для получения количества товаров в категории (без учета фильтров)
  const getCategoryItemCount = (categoryName: string) => {
    return menuItems.filter(item => item.category === categoryName).length
  }

  // Функция для фильтрации категорий - теперь не нужна, так как категория удалена на уровне источника
  const getFilteredCategories = () => {
    return categories
  }

  const handleAddToCart = (item: MenuItem, quantity: number = 1) => {
    cartService.addItem(item, quantity)
  }

  const handleQuantityChange = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      cartService.removeItem(cartItemId)
    } else {
      cartService.updateItemQuantity(cartItemId, quantity)
    }
  }

  const getItemQuantityInCart = (itemId: string): number => {
    const cartItem = cart.items.find(item => item.menuItemId === itemId)
    return cartItem?.quantity || 0
  }

  const getDietaryIcon = (type: keyof DietaryInfo) => {
    switch (type) {
      case 'vegetarian': return <Leaf size={16} className="text-green-400" />
      case 'lactoseFree': return <Shield size={16} className="text-blue-400" />
      case 'glutenFree': return <Shield size={16} className="text-orange-400" />
      case 'spicy': return <Flame size={16} className="text-red-400" />
      case 'halal': return <Heart size={16} className="text-purple-400" />
    }
  }

  const getDietaryLabel = (type: keyof DietaryInfo) => {
    switch (type) {
      case 'vegetarian': return 'Вегетарианское'
      case 'lactoseFree': return 'Без лактозы'
      case 'glutenFree': return 'Без глютена'
      case 'spicy': return 'Острое'
      case 'halal': return 'Халяль'
    }
  }

  const toggleDietaryFilter = (type: keyof DietaryInfo) => {
    setDietaryFilters(prev => ({
      ...prev,
      [type]: !prev[type]
    }))
  }

  const clearDietaryFilters = () => {
    setDietaryFilters({})
  }

  const categorizedItems = getCategorizedItems()
  const activeDietaryFiltersCount = Object.values(dietaryFilters).filter(Boolean).length

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
            <p className="text-text-secondary">Загружаем меню...</p>
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
    <div className="min-h-screen relative overflow-hidden pb-24">
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
            Меню ресторанов
          </h1>
          <p className="text-text-secondary">
            {getFilteredItems().length} из {menuItems.length} блюд • Изысканная кухня от наших шеф-поваров
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <GlassPanel className="p-4">
            <div className="flex space-x-3">
              <div className="flex-1 relative">
                <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  placeholder="Поиск блюд..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-glass-strong border border-glass rounded-lg pl-10 pr-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                />
              </div>
              <Button 
                variant="secondary"
                className={`px-4 py-3 border border-glass hover:bg-glass text-text-primary relative ${
                  showDietaryFilters ? 'bg-glass-strong' : 'bg-glass-strong'
                }`}
                onClick={() => setShowDietaryFilters(!showDietaryFilters)}
              >
                <Filter size={20} />
                {activeDietaryFiltersCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-neon-cyan rounded-full text-xs text-dark-void flex items-center justify-center font-bold">
                    {activeDietaryFiltersCount}
                  </span>
                )}
              </Button>
            </div>
          </GlassPanel>

          {/* Dietary Filters */}
          <AnimatePresence>
            {showDietaryFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <GlassPanel className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-text-primary">Диетические предпочтения</h3>
                      {activeDietaryFiltersCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearDietaryFilters}
                          className="text-text-muted hover:text-text-primary"
                        >
                          Очистить
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {(['vegetarian', 'lactoseFree', 'glutenFree', 'spicy', 'halal'] as const).map((type) => (
                        <Button
                          key={type}
                          variant="ghost"
                          size="sm"
                          className={`flex items-center space-x-2 justify-start p-3 border transition-all ${
                            dietaryFilters[type]
                              ? 'bg-glass-strong border-neon-cyan text-text-primary'
                              : 'bg-glass border-glass text-text-secondary hover:text-text-primary'
                          }`}
                          onClick={() => toggleDietaryFilter(type)}
                        >
                          {getDietaryIcon(type)}
                          <span className="text-sm">{getDietaryLabel(type)}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </GlassPanel>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Category Filter - Horizontal Scroll */}
          <div className="flex space-x-2 overflow-x-auto pt-5 pb-5 px-5 scrollbar-hide">
            <motion.button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-neon-purple to-neon-cyan text-white shadow-neon'
                  : 'bg-glass border border-glass text-text-secondary hover:text-text-primary'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              Все ({menuItems.length})
            </motion.button>
            
            {getFilteredCategories().map((category) => {
              const itemCount = getCategoryItemCount(category.name);
              return (
                <motion.button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-neon-purple to-neon-cyan text-white shadow-neon'
                      : 'bg-glass border border-glass text-text-secondary hover:text-text-primary'
                  } ${
                    menuService.isCategoryNameLong(category.name) ? 'text-sm' : ''
                  }`}
                  whileTap={{ scale: 0.95 }}
                  title={category.name}
                >
                  <span>{menuService.getShortenedCategoryName(category.name, 15)}</span>
                  <span className="ml-1 text-xs opacity-75">({itemCount})</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Menu Categories */}
        <AnimatePresence>
          {categorizedItems.map((category, categoryIndex) => (
            <motion.div
              key={category.name}
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: categoryIndex * 0.1, duration: 0.5 }}
            >
              <h2 className="text-xl font-semibold text-text-primary flex items-center space-x-2">
                <span className="w-6 h-6 bg-gradient-gold rounded-full flex items-center justify-center">
                  <Star size={14} className="text-dark-void" />
                </span>
                <span>{category.name}</span>
                <span className="text-sm text-text-muted">({category.items.length})</span>
              </h2>

              <div className="grid gap-3">
                {category.items.map((item, itemIndex) => {
                  const quantityInCart = getItemQuantityInCart(item.id)
                  
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: itemIndex * 0.05, duration: 0.3 }}
                    >
                      <GlassPanel 
                        variant="card" 
                        glowColor="neon-cyan"
                        className="group"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="font-semibold text-text-primary text-lg leading-tight group-hover:text-neon-cyan transition-colors">
                                  {item.name}
                                </h3>
                                <div className="flex items-center space-x-1 ml-2">
                                  {/* Dietary Icons */}
                                  {item.dietaryInfo && (
                                    <>
                                      {item.dietaryInfo.vegetarian && (
                                        <Leaf size={14} className="text-green-400" title="Вегетарианское" />
                                      )}
                                      {item.dietaryInfo.glutenFree && (
                                        <Shield size={14} className="text-orange-400" title="Без глютена" />
                                      )}
                                      {item.dietaryInfo.lactoseFree && (
                                        <Shield size={14} className="text-blue-400" title="Без лактозы" />
                                      )}
                                      {item.dietaryInfo.spicy && (
                                        <Flame size={14} className="text-red-400" title="Острое" />
                                      )}
                                      {item.dietaryInfo.halal && (
                                        <Heart size={14} className="text-purple-400" title="Халяль" />
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                              
                              {item.description && (
                                <p className="text-text-secondary text-sm mb-2 line-clamp-2">
                                  {item.description}
                                </p>
                              )}
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2 text-sm text-text-muted">
                                  {item.portion && (
                                    <span>{item.portion}</span>
                                  )}
                                  <span className="text-gold font-semibold">
                                    {item.price} ₽
                                  </span>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  {quantityInCart > 0 && (
                                    <>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleQuantityChange(cart.items.find(item => item.menuItemId === item.id)?.id || '', quantityInCart - 1)}
                                        className="w-8 h-8 p-0 hover:bg-glass"
                                      >
                                        <Minus size={16} />
                                      </Button>
                                      <span className="w-8 text-center font-medium text-text-primary">
                                        {quantityInCart}
                                      </span>
                                    </>
                                  )}
                                  
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleAddToCart(item, 1)}
                                    className="w-8 h-8 p-0 hover:bg-glass hover:text-neon-cyan"
                                  >
                                    <Plus size={16} />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </GlassPanel>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {categorizedItems.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <GlassPanel className="p-8">
              <p className="text-text-muted">
                {searchTerm || activeDietaryFiltersCount > 0 ? 'Блюда не найдены по вашим критериям' : 'Меню недоступно'}
              </p>
              {(searchTerm || activeDietaryFiltersCount > 0) && (
                <Button
                  variant="ghost"
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm('')
                    clearDietaryFilters()
                    setSelectedCategory('all')
                  }}
                >
                  Сбросить фильтры
                </Button>
              )}
            </GlassPanel>
          </motion.div>
        )}
      </div>

      {/* Floating Cart Button */}
      <AnimatePresence>
        {cart.totalItems > 0 && (
          <motion.div
            className="fixed bottom-32 right-4 z-40"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Cart badge - вынесен за пределы кнопки */}
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-neon-magenta rounded-full text-xs text-white flex items-center justify-center font-bold shadow-lg z-50">
              {cart.totalItems}
            </span>
            
            <Button
              size="lg"
              className="w-16 h-16 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple text-white shadow-neon hover:shadow-neon-strong relative"
              onClick={() => setShowCartModal(true)}
            >
              <ShoppingCart size={24} />
              
              {/* Pulse animation */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple opacity-20 animate-ping" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Modal */}
      <AnimatePresence>
        {showCartModal && (
          <motion.div
            className="fixed inset-0 bg-dark-void/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4 pb-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCartModal(false)}
          >
            <motion.div
              className="w-full max-w-md max-h-[80vh] overflow-hidden"
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <GlassPanel variant="strong" className="relative">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-glass">
                  <h3 className="text-xl font-semibold text-text-primary">
                    Корзина ({cart.totalItems})
                  </h3>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowCartModal(false)}
                    className="text-text-muted hover:text-text-primary"
                  >
                    <X size={20} />
                  </Button>
                </div>

                {/* Cart Items */}
                <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                  {cart.items.map((cartItem) => (
                    <div key={cartItem.id} className="flex items-center space-x-3 p-3 bg-glass rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-text-primary text-sm">
                          {cartItem.name}
                        </h4>
                        <p className="text-text-muted text-xs">
                          {cartItem.price} ₽ × {cartItem.quantity}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-8 h-8 p-0 text-text-primary hover:text-neon-cyan"
                          onClick={() => handleQuantityChange(cartItem.id, cartItem.quantity - 1)}
                        >
                          <Minus size={14} />
                        </Button>
                        
                        <span className="w-8 text-center text-sm font-medium text-text-primary">
                          {cartItem.quantity}
                        </span>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-8 h-8 p-0 text-text-primary hover:text-neon-cyan"
                          onClick={() => handleQuantityChange(cartItem.id, cartItem.quantity + 1)}
                        >
                          <Plus size={14} />
                        </Button>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-bold text-gold text-sm">
                          {cartItem.price * cartItem.quantity} ₽
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-glass space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-text-primary">Итого:</span>
                    <span className="text-xl font-bold text-gold">{cart.totalPrice} ₽</span>
                  </div>
                  
                  <Button
                    fullWidth
                    size="lg"
                    className="bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-semibold shadow-neon"
                    onClick={() => {
                      setShowCartModal(false)
                      setShowOrderForm(true)
                    }}
                  >
                    Оформить заказ
                  </Button>
                </div>
              </GlassPanel>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order Form Modal */}
      <AnimatePresence>
        {showOrderForm && (
          <motion.div
            className="fixed inset-0 bg-dark-void/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <GlassPanel variant="strong" className="p-6">
                <div className="space-y-6">
                  {/* Header */}
                  <div className="text-center">
                    <CreditCard size={48} className="text-neon-cyan mx-auto mb-3" />
                    <h3 className="text-2xl font-semibold text-text-primary mb-2">
                      Оформление заказа
                    </h3>
                    <p className="text-text-secondary">
                      Заполните данные для доставки
                    </p>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-glass/30 rounded-xl p-4 border border-glass">
                    <h4 className="text-sm font-semibold text-text-primary mb-3">
                      Ваш заказ:
                    </h4>
                    <div className="space-y-2 text-sm">
                      {cart.items.map((item) => (
                        <div key={item.id} className="flex justify-between">
                          <span className="text-text-secondary">{item.name} × {item.quantity}</span>
                          <span className="text-text-primary font-medium">{item.price * item.quantity} ₽</span>
                        </div>
                      ))}
                      <div className="border-t border-glass pt-2 mt-2">
                        <div className="flex justify-between font-semibold">
                          <span className="text-text-primary">Итого:</span>
                          <span className="text-gold">{cart.totalPrice} ₽</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form */}
                  <form className="space-y-4" onSubmit={(e) => {
                    e.preventDefault()
                    // Здесь будет логика отправки заказа
                    console.log('Order data:', orderFormData)
                    alert('Заказ успешно оформлен!')
                    setShowOrderForm(false)
                    cartService.clearCart()
                  }}>
                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          <User size={16} className="inline mr-2" />
                          Имя и фамилия *
                        </label>
                        <input
                          type="text"
                          required
                          value={orderFormData.name}
                          onChange={(e) => setOrderFormData({...orderFormData, name: e.target.value})}
                          className="w-full px-3 py-2 bg-glass border border-glass-strong rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-transparent"
                          placeholder="Введите ваше имя"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          <Phone size={16} className="inline mr-2" />
                          Телефон *
                        </label>
                        <input
                          type="tel"
                          required
                          value={orderFormData.phone}
                          onChange={(e) => setOrderFormData({...orderFormData, phone: e.target.value})}
                          className="w-full px-3 py-2 bg-glass border border-glass-strong rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-transparent"
                          placeholder="+7 (999) 123-45-67"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={orderFormData.email}
                        onChange={(e) => setOrderFormData({...orderFormData, email: e.target.value})}
                        className="w-full px-3 py-2 bg-glass border border-glass-strong rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-transparent"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        <MapPin size={16} className="inline mr-2" />
                        Номер комнаты *
                      </label>
                      <input
                        type="text"
                        required
                        value={orderFormData.roomNumber}
                        onChange={(e) => setOrderFormData({...orderFormData, roomNumber: e.target.value})}
                        className="w-full px-3 py-2 bg-glass border border-glass-strong rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-transparent"
                        placeholder="Например: 205, 301, Presidential Suite"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        <Calendar size={16} className="inline mr-2" />
                        Желаемое время доставки
                      </label>
                      <input
                        type="text"
                        value={orderFormData.deliveryTime}
                        onChange={(e) => setOrderFormData({...orderFormData, deliveryTime: e.target.value})}
                        className="w-full px-3 py-2 bg-glass border border-glass-strong rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-transparent"
                        placeholder="Например: сегодня к 19:00"
                      />
                    </div>

                    {/* Payment Method */}
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        <CreditCard size={16} className="inline mr-2" />
                        Способ оплаты
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <label className="flex items-center space-x-2 p-3 bg-glass rounded-lg border border-glass-strong cursor-pointer hover:bg-glass-strong">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="card"
                            checked={orderFormData.paymentMethod === 'card'}
                            onChange={(e) => setOrderFormData({...orderFormData, paymentMethod: e.target.value})}
                            className="text-neon-cyan"
                          />
                          <span className="text-sm text-text-primary">Картой онлайн</span>
                        </label>
                        <label className="flex items-center space-x-2 p-3 bg-glass rounded-lg border border-glass-strong cursor-pointer hover:bg-glass-strong">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="cash"
                            checked={orderFormData.paymentMethod === 'cash'}
                            onChange={(e) => setOrderFormData({...orderFormData, paymentMethod: e.target.value})}
                            className="text-neon-cyan"
                          />
                          <span className="text-sm text-text-primary">Наличными</span>
                        </label>
                      </div>
                    </div>

                    {/* Special Requests */}
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Особые пожелания
                      </label>
                      <textarea
                        rows={3}
                        value={orderFormData.specialRequests}
                        onChange={(e) => setOrderFormData({...orderFormData, specialRequests: e.target.value})}
                        className="w-full px-3 py-2 bg-glass border border-glass-strong rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-transparent resize-none"
                        placeholder="Например: не звонить в дверь, оставить у консьержа, особые требования к блюдам"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <Button
                        type="submit"
                        fullWidth
                        size="lg"
                        className="bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-semibold shadow-neon hover:shadow-neon-strong hover:scale-[1.02] transition-all duration-300"
                      >
                        Подтвердить заказ
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setShowOrderForm(false)}
                        className="text-text-muted hover:text-text-primary"
                      >
                        Отмена
                      </Button>
                    </div>
                  </form>
                </div>
              </GlassPanel>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
 