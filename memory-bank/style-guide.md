# STYLE GUIDE — NEON LIQUID GLASS THEME

> **Design System для Telegram Mini App отеля с темой "Neon Liquid Glass"**  
> Мобильная ориентация (360-430px) | React + Tailwind CSS

## 🎨 DESIGN PHILOSOPHY

**Концепция:** "Neon Liquid Glass" — премиальный дизайн, сочетающий:
- **Тёмные глубокие фоны** создающие ощущение роскоши
- **Стеклянные поверхности** с размытием и прозрачностью  
- **Мягкие неоновые акценты** для выделения интерактивных элементов
- **Плавные анимации** для создания "жидкого" ощущения

**Принципы:**
- Элегантность превыше агрессивности
- Читаемость поверх эффектности 
- 60fps анимации для плавности
- Мобильный приоритет

## 🌈 COLOR PALETTE

### Base Colors (Backgrounds)
```
--dark-void: #0B0F1A      // Самый тёмный фон
--dark-navy: #1A1F2E      // Средний фон  
--dark-indigo: #2A1E3D    // Акцентный тёмный фон
```

### Neon Accents (Interactive Elements)
```
--neon-purple: #7C3AED    // Основной accent
--neon-cyan: #22D3EE      // Вторичный accent  
--neon-blue: #00E5FF      // Информационный
--neon-magenta: #FF00E5   // Специальный accent
--neon-pink: #FF0080      // Дополнительный
```

### Premium Accents
```
--gold: #D4AF37          // Премиум элементы
--gold-light: #F0D975    // Hover состояния
--gold-dark: #B8941F     // Active состояния
```

### Glass/Surface Colors
```
--glass: rgba(255, 255, 255, 0.1)        // Базовое стекло
--glass-strong: rgba(255, 255, 255, 0.2) // Активное стекло
--surface-light: rgba(255, 255, 255, 0.05) // Тонкие поверхности
```

### Text Colors
```
--text-primary: #E6F0FF   // Основной текст
--text-secondary: #B8C5D1 // Вторичный текст
--text-muted: #6B7889     // Приглушённый текст
```

## 📝 TYPOGRAPHY

### Font Stack
- **Primary:** `font-sans` → Manrope (Google Fonts)
- **Display:** `font-display` → Exo 2 (Google Fonts) 
- **Mono:** `font-mono` → SF Mono, ui-monospace

### Font Hierarchy
```
/* Display Headers */
.text-display: 3rem (48px), line-height: 1.1, font-weight: 800
.text-hero: 2.5rem (40px), line-height: 1.2, font-weight: 700

/* Standard Headers */  
.text-4xl: 36px, font-weight: 700
.text-3xl: 30px, font-weight: 600
.text-2xl: 24px, font-weight: 600
.text-xl: 20px, font-weight: 500

/* Body Text */
.text-base: 16px, font-weight: 400
.text-sm: 14px, font-weight: 400  
.text-xs: 12px, font-weight: 400
```

## 🎭 GRADIENTS & EFFECTS

### Hero/Background Gradients (Soft)
```css
/* Мягкие градиенты для больших поверхностей */
.bg-gradient-hero-soft: linear-gradient(135deg, rgba(99, 102, 241, 0.4) 0%, rgba(139, 92, 246, 0.3) 30%, rgba(59, 130, 246, 0.2) 60%, rgba(99, 102, 241, 0.4) 100%)

.bg-gradient-hero-elegant: radial-gradient(ellipse at center, rgba(139, 92, 246, 0.15) 0%, rgba(59, 130, 246, 0.1) 50%, transparent 80%)
```

### Accent Gradients (Medium)  
```css
/* Для кнопок и карточек */
.bg-gradient-purple-cyan: linear-gradient(135deg, rgba(124, 58, 237, 0.5) 0%, rgba(34, 211, 238, 0.4) 100%)

.bg-gradient-cyan-magenta: linear-gradient(135deg, rgba(0, 229, 255, 0.4) 0%, rgba(255, 0, 229, 0.4) 100%)

.bg-gradient-gold: linear-gradient(135deg, #D4AF37 0%, #F0D975 100%)
```

### Intense Gradients (Accent Only)
```css
/* Только для малых accent элементов */
.bg-gradient-hero: conic-gradient(from 0deg at 50% 50%, #7C3AED 0deg, #00E5FF 120deg, #FF00E5 240deg, #7C3AED 360deg)

.bg-gradient-glass: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)
```

## 🏗️ COMPONENT STYLES

### Buttons
```css
/* Primary Button */
.btn-primary {
  @apply bg-gradient-purple-cyan text-white font-medium px-6 py-3 rounded-xl;
  @apply shadow-neon backdrop-blur-sm;
  @apply transition-all duration-300;
  @apply hover:shadow-neon-strong hover:scale-[1.02];
}

/* Secondary Button */  
.btn-secondary {
  @apply bg-glass border border-glass-strong text-text-primary;
  @apply backdrop-blur-md rounded-xl px-6 py-3;
  @apply hover:bg-glass-strong hover:border-neon-cyan/50;
}

/* Ghost Button */
.btn-ghost {
  @apply text-neon-cyan border border-neon-cyan/30 rounded-xl px-6 py-3;
  @apply hover:bg-neon-cyan/10 hover:border-neon-cyan;
}
```

### Cards
```css
/* Glass Card */
.card-glass {
  @apply bg-glass backdrop-blur-md border border-glass-strong;
  @apply rounded-2xl p-6 shadow-glass;
  @apply hover:bg-glass-strong transition-all duration-300;
}

/* Elevated Card */
.card-elevated {
  @apply bg-dark-navy/80 backdrop-blur-lg border border-neon-cyan/20;
  @apply rounded-2xl p-6 shadow-glass-strong;
  @apply hover:border-neon-cyan/40 hover:shadow-neon/20;
}
```

### Inputs
```css
/* Text Input */
.input-glass {
  @apply bg-glass backdrop-blur-sm border border-glass-strong;
  @apply rounded-xl px-4 py-3 text-text-primary placeholder-text-muted;
  @apply focus:border-neon-cyan focus:shadow-neon/30 focus:outline-none;
}

/* Search Input */
.input-search {
  @apply bg-dark-navy/50 backdrop-blur-md border border-neon-cyan/20;
  @apply rounded-2xl px-6 py-4 text-text-primary;
  @apply focus:border-neon-cyan focus:bg-dark-navy/70;
}
```

## ✨ ANIMATIONS

### Core Animations
```css
/* Gradient Animation */
.animate-gradient-shift {
  background-size: 200% 200%;
  animation: gradientShift 8s ease-in-out infinite;
}

/* Neon Pulse */
.animate-neon-pulse {
  animation: neonPulse 2s ease-in-out infinite;
}

/* Float Effect */
.animate-float {
  animation: float 6s ease-in-out infinite;
}

/* Glow Effect */
.animate-glow {
  animation: glow 2s ease-in-out infinite alternate;
}
```

### Micro-interactions
```css
/* Hover Scale */
.hover-scale {
  @apply transform transition-transform duration-200;
  @apply hover:scale-[1.02] active:scale-[0.98];
}

/* Press Effect */
.press-effect {
  @apply transform transition-all duration-150;
  @apply active:scale-95 active:brightness-90;
}
```

## 📐 SPACING & LAYOUT

### Spacing Scale (Tailwind Default + Custom)
```
px-1: 4px    px-2: 8px     px-3: 12px    px-4: 16px
px-5: 20px   px-6: 24px    px-8: 32px    px-10: 40px
px-12: 48px  px-16: 64px   px-20: 80px   px-24: 96px
```

### Mobile Layout Constraints
```css
/* Container Widths */
.container-mobile {
  max-width: 430px;
  min-width: 360px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Safe Areas */
.safe-top { padding-top: env(safe-area-inset-top); }
.safe-bottom { padding-bottom: env(safe-area-inset-bottom); }
```

## 🔧 SHADOWS & EFFECTS

### Shadow System
```css
/* Neon Shadows */
.shadow-neon: 0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor
.shadow-neon-strong: 0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor

/* Glass Shadows */
.shadow-glass: 0 8px 32px 0 rgba(31, 38, 135, 0.37)
.shadow-glass-strong: 0 8px 32px 0 rgba(31, 38, 135, 0.7)
```

### Backdrop Blur
```css
.backdrop-blur-xs: backdrop-filter: blur(2px)
.backdrop-blur-sm: backdrop-filter: blur(4px)  
.backdrop-blur-md: backdrop-filter: blur(12px)
.backdrop-blur-lg: backdrop-filter: blur(16px)
```

## 📱 MOBILE-SPECIFIC GUIDELINES

### Touch Targets
- **Минимум:** 44px × 44px для всех интерактивных элементов
- **Рекомендуемо:** 48px × 48px для основных действий
- **Отступы:** Минимум 8px между соседними touch target'ами

### Performance Guidelines
- **Анимации:** Используйте `transform` и `opacity` для 60fps
- **Градиенты:** Ограничивайте сложные градиенты на больших поверхностях
- **Blur Effects:** Используйте умеренно, особенно на слабых устройствах

### Accessibility
```css
/* Focus States */
.focus-visible:focus-visible {
  @apply outline-2 outline-neon-cyan outline-offset-2;
}

/* High Contrast Mode Support */
@media (prefers-contrast: high) {
  .text-muted { @apply text-text-secondary; }
  .bg-glass { @apply bg-dark-navy/50; }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  * { @apply !animate-none; }
}
```

## 🎯 USAGE GUIDELINES

### DO ✅
- Используйте стеклянные эффекты для модальных окон и overlay
- Применяйте мягкие неоновые акценты для interactive элементов
- Анимируйте переходы с помощью `transform` и `opacity`
- Поддерживайте 60fps анимации
- Тестируйте на мобильных устройствах различной производительности

### DON'T ❌
- Не используйте интенсивные градиенты на больших поверхностях
- Не злоупотребляйте эффектами blur на слабых устройствах  
- Не используйте анимации `width`, `height`, `margin`, `padding`
- Не создавайте touch target'ы меньше 44px
- Не забывайте про состояния loading и error

## 🔄 TELEGRAM INTEGRATION

### Theme Variables
```css
/* Интеграция с Telegram темами */
.tg-button {
  background-color: var(--tg-theme-button-color);
  color: var(--tg-theme-button-text-color);
}

.tg-text {
  color: var(--tg-theme-text-color);
}

.tg-hint {
  color: var(--tg-theme-hint-color);
}
```

### WebApp Specific
- Учитывайте safe areas в iOS
- Поддерживайте Back Button интеграцию
- Обеспечивайте совместимость с системными темами Telegram

---

**Версия:** 1.0 | **Обновлено:** PLAN3 Creative Phase | **Статус:** Активный 