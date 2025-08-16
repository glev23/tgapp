# ��������� ENTERING CREATIVE PHASE: ДИЗАЙН-СИСТЕМА И UI КОМПОНЕНТЫ

## Компонент: Дизайн-система для Telegram Mini App отеля

### Описание компонента
Создание современной, мобильной дизайн-системы для Telegram Mini App отеля Radisson Collection с фокусом на "дорогой" вид, микровзаимодействия и адаптацию под тему Telegram.

### Требования и ограничения
**Технические:**
- Mobile-first (360-414px ширина)
- Telegram WebView совместимость
- Интеграция с --tg-theme-* переменными
- 60fps производительность
- Tailwind CSS utility-first подход
- Radix UI headless компоненты

**Визуальные:**
- Современный, "дорогой" вид
- Без узнаваемых UI-китов
- Микровзаимодействия и spring-анимации
- Стеклянные эффекты и градиенты
- Поддержка светлой/темной темы

**UX требования:**
- Крупные тапы (44px+)
- Простая навигация
- Быстрая загрузка
- Placeholder для изображений

## АНАЛИЗ ДИЗАЙН-ВАРИАНТОВ

### Вариант 1: Премиум Минимализм
**Концепция:** Роскошь через простоту
- Цветовая схема: монохром + золотые акценты
- Типографика: тонкие шрифты, много воздуха
- Карточки: тонкие рамки, тени-подложки
- Анимации: fade + slide, 400ms ease-out
- Градиенты: subtle от белого к кремовому

**Плюсы:**
- Элегантный, "дорогой" вид
- Быстрая загрузка (минимум эффектов)
- Хорошо читается на любых экранах
- Легко адаптируется под Telegram темы

**Минусы:**
- Может показаться скучным
- Слабая дифференциация от конкурентов
- Ограниченные возможности брендинга

### Вариант 2: Стеклянный Неоморфизм
**Концепция:** Современность через материальность
- Цветовая схема: gradients + blur эффекты
- Карточки: стеклянные, backdrop-filter
- Тени: многослойные, с цветными оттенками
- Анимации: spring physics, morphing
- Микровзаимодействия: haptic feedback

**Плюсы:**
- Очень современный вид
- Сильные микровзаимодействия
- Запоминающийся дизайн
- Хорошо смотрится в темной теме

**Минусы:**
- Высокая нагрузка на GPU
- Может тормозить на слабых устройствах
- Сложность в поддержке

### Вариант 3: Гибридный Подход (РЕКОМЕНДУЕМЫЙ)
**Концепция:** Баланс элегантности и современности
- Основа: минималистичная с точечными акцентами
- Карточки: subtle градиенты + легкие тени
- Анимации: spring для ключевых элементов
- Цвета: Telegram theme + брендовые акценты
- Эффекты: стекло только для модалей и главных CTA

**Плюсы:**
- Оптимальный баланс красоты и производительности
- Легко масштабируется
- Хорошо работает на всех устройствах
- Простота в разработке и поддержке

**Минусы:**
- Требует тщательной проработки деталей
- Необходимость тестирования на разных устройствах

## ВЫБРАННЫЙ ПОДХОД: Гибридный

### Обоснование выбора:
1. **Производительность:** 60fps на мобильных устройствах
2. **Адаптивность:** Работает в Telegram WebView
3. **Масштабируемость:** Легко добавлять новые компоненты
4. **Брендинг:** Создает премиум-ощущение без перегрузки
5. **Техническая реализуемость:** Совместимо с Tailwind + Radix


## ДИЗАЙН-СИСТЕМА: ДЕТАЛЬНЫЕ СПЕЦИФИКАЦИИ

### Цветовая палитра
**Базовые токены (интеграция с Telegram):**
```css
:root {
  /* Telegram theme integration */
  --bg: var(--tg-theme-bg-color, #ffffff);
  --surface: var(--tg-theme-secondary-bg-color, #f8f9fa); 
  --text: var(--tg-theme-text-color, #000000);
  --text-hint: var(--tg-theme-hint-color, #999999);
  --accent: var(--tg-theme-button-color, #2ea6ff);
  --accent-text: var(--tg-theme-button-text-color, #ffffff);
  
  /* Brand extensions */
  --brand-gold: #d4af37;
  --brand-gold-subtle: #f5e6a3;
  --surface-elevated: rgba(255, 255, 255, 0.8);
  --shadow-soft: 0 2px 8px rgba(0, 0, 0, 0.04);
  --shadow-medium: 0 4px 16px rgba(0, 0, 0, 0.08);
  --shadow-strong: 0 8px 24px rgba(0, 0, 0, 0.12);
  
  /* Interactive states */
  --hover-overlay: rgba(0, 0, 0, 0.04);
  --active-overlay: rgba(0, 0, 0, 0.08);
  --focus-ring: var(--accent);
}
```

### Типографика
**Иерархия размеров (mobile-first):**
- Display: 28px / 1.2 / 600 (hero заголовки)
- H1: 24px / 1.3 / 600 (заголовки страниц) 
- H2: 20px / 1.4 / 600 (заголовки секций)
- H3: 18px / 1.4 / 500 (заголовки карточек)
- Body: 16px / 1.5 / 400 (основной текст)
- Caption: 14px / 1.4 / 400 (описания)
- Label: 12px / 1.3 / 500 (лейблы, бейджи)

**Шрифт:** system font stack для оптимальной производительности

### Spacing система
**8px базовая единица:**
- xs: 4px (внутренние отступы бейджей)
- sm: 8px (минимальные отступы)
- md: 16px (стандартные отступы)
- lg: 24px (секции)
- xl: 32px (между блоками)
- 2xl: 48px (отступы страниц)

### Border Radius
- sm: 6px (бейджи, мелкие элементы)
- md: 12px (кнопки, инпуты)
- lg: 16px (карточки)
- xl: 20px (модали, крупные карточки)
- full: 9999px (круглые элементы)

### Компонентная система

#### 1. Карточки (Card System)
**BaseCard** - основа для всех карточек:
- Background: var(--surface-elevated)
- Border radius: lg (16px)
- Padding: md (16px)
- Shadow: soft
- Hover: transform scale(1.02) + shadow-medium
- Transition: all 200ms ease-out

**Варианты:**
- RoomCard: изображение placeholder + заголовок + цена + удобства
- MenuItemCard: название + описание + калории + цена + диетические бейджи
- RestaurantCard: название + кухня + часы + средний чек
- ConferenceCard: название + площадь + вместимость + цена

#### 2. Навигация
**TabBar** (нижняя навигация):
- Height: 64px + safe-area-inset-bottom
- Background: var(--surface-elevated) + backdrop-blur
- Icons: 24px (активные с --accent, неактивные с --text-hint)
- Labels: 12px под иконками
- Active indicator: золотая полоска сверху

**BackButton** (Telegram integration):
- Автоматическое управление через роутер
- Анимация: slide-in from left

#### 3. Кнопки
**Primary Button:**
- Background: gradient(var(--accent), оттенок светлее)
- Color: var(--accent-text)
- Height: 48px (удобно для тапов)
- Border radius: md
- Hover: transform translateY(-1px) + shadow увеличивается
- Active: transform scale(0.98)

**Secondary Button:**
- Background: transparent
- Border: 1px solid var(--accent)
- Color: var(--accent)

#### 4. Фильтры и поиск
**SearchBar:**
- Height: 44px
- Background: var(--surface)
- Border radius: xl
- Icon: лупа слева (16px)
- Placeholder: "Поиск блюд, номеров..."
- Focus: border становится --accent

**FilterChips:**
- Height: 36px
- Background: var(--surface) → var(--accent) при активации
- Border radius: full
- Padding: 8px 16px
- Text: 14px

#### 5. Состояния загрузки
**Skeleton:**
- Background: linear-gradient shimmer эффект
- Border radius: соответствует заменяемому контенту
- Анимация: shimmer 1.5s infinite

**Empty States:**
- Иконка (lucide-react) 48px
- Заголовок: "Ничего не найдено"
- Описание: подсказка что делать
- CTA кнопка при необходимости

### Анимации и переходы
**Принципы:**
- Spring physics для естественности
- Максимум 500ms для любых переходов
- Easing: ease-out для появления, ease-in для исчезновения
- Parallax эффекты запрещены (производительность)

**Ключевые анимации:**
- Page transitions: slide + fade 300ms
- Card hover: scale + shadow 200ms
- Button press: scale down 100ms
- Modal появление: slide up + fade 400ms
- Filter open: height expand 250ms

### Responsive breakpoints
**Mobile-first подход:**
- Base: 360px+ (минимальная ширина)
- sm: 375px+ (iPhone SE)
- md: 414px+ (стандартные экраны)
- lg: 768px+ (планшеты в портрете) - редко используется

### Accessibility
**Обязательные требования:**
- Contrast ratio: минимум 4.5:1 для текста
- Focus rings: 2px solid var(--focus-ring)
- Touch targets: минимум 44x44px
- Screen reader support через Radix UI
- Keyboard navigation для всех интерактивных элементов


## ПРОВЕРКА ПРОТИВ ТРЕБОВАНИЙ

### ✅ Техническая совместимость:
- Mobile-first (360-414px): ✅ Адаптивная система
- Telegram WebView: ✅ Интеграция через --tg-theme-*
- 60fps производительность: ✅ Оптимизированные анимации
- Tailwind CSS: ✅ Utility-first токены
- Radix UI: ✅ Headless компоненты с accessibility

### ✅ Визуальные требования:
- Современный "дорогой" вид: ✅ Subtle градиенты + золотые акценты
- Без узнаваемых UI-китов: ✅ Кастомная система
- Микровзаимодействия: ✅ Spring анимации
- Стеклянные эффекты: ✅ Точечно в модалях
- Светлая/темная тема: ✅ Автоматическая адаптация

### ✅ UX требования:
- Крупные тапы 44px+: ✅ Все интерактивные элементы
- Простая навигация: ✅ TabBar + BackButton интеграция
- Быстрая загрузка: ✅ Skeleton states
- Placeholder изображения: ✅ Shimmer эффекты

## РЕАЛИЗАЦИОННЫЕ GUIDELINES

### Tailwind конфигурация
Расширить базовую конфигурацию:
```js
// tailwind.config.js расширения
theme: {
  extend: {
    colors: {
      bg: 'var(--bg)',
      surface: 'var(--surface)', 
      accent: 'var(--accent)',
      'brand-gold': 'var(--brand-gold)'
    },
    spacing: {
      'safe-bottom': 'env(safe-area-inset-bottom)'
    },
    animation: {
      'shimmer': 'shimmer 1.5s infinite',
      'slide-up': 'slideUp 400ms ease-out'
    }
  }
}
```

### Компонентная иерархия
```
/components/ui/
  ├── Button/ (Primary, Secondary, variants)
  ├── Card/ (Base + специализированные)
  ├── Navigation/ (TabBar, BackButton integration)
  ├── Search/ (SearchBar, FilterChips)
  ├── Loading/ (Skeleton, Spinner, Empty)
  └── Layout/ (Container, Stack, Grid)

/components/domain/
  ├── RoomCard/ (специфичная для номеров)
  ├── MenuItemCard/ (для позиций меню)
  ├── RestaurantCard/ (для ресторанов)
  └── ConferenceCard/ (для залов)
```

### Анимационные сценарии
1. **Загрузка страницы:** Skeleton → Content fade-in 300ms
2. **Навигация между табами:** Current slide out + New slide in 300ms
3. **Открытие карточки:** Scale up 1.02 + shadow увеличение 200ms
4. **Фильтрация списка:** Items fade out → new items fade in 250ms
5. **Модальные окна:** Backdrop fade + content slide up 400ms
6. **Pull-to-refresh:** Стрелка поворот + список обновление

### Placeholder стратегия
- **Изображения:** Градиент + иконка отеля/блюда
- **Аватары:** Инициалы на цветном фоне
- **Карты залов:** Схематичные планы через SVG
- **Меню фото:** Иконки категорий (lucide-react)

��������� EXITING CREATIVE PHASE

## ИТОГОВЫЕ РЕШЕНИЯ

### Выбранный подход: Гибридная дизайн-система
- **Основа:** Минималистичная с премиум акцентами
- **Эффекты:** Точечные стеклянные элементы
- **Анимации:** Spring physics для ключевых взаимодействий
- **Цвета:** Telegram theme + золотые акценты бренда
- **Производительность:** 60fps на мобильных устройствах

### Готовые спецификации:
✅ Цветовая система с Telegram интеграцией
✅ Типографическая иерархия
✅ Компонентная система (карточки, навигация, кнопки)
✅ Анимационные принципы
✅ Accessibility требования
✅ Responsive guidelines

### Следующий шаг:
Дизайн-система готова для имплементации.
Переход в **IMPLEMENT** режим для создания базовых компонентов.


��������� ENTERING CREATIVE PHASE: UI/FX (PLAN2)

Component Description
- Глобальная визуальная система для PLAN2: неоновые/иридесцентные градиенты, стеклянные поверхности (glassmorphism), частицы, мягкий glow; акцент на мобильных 360–430px и Telegram WebView.

Requirements & Constraints
- Яркий «вау» эффект, динамичные переливы, glow/bloom
- Производительность 60fps → прогрессивные деградации (highPerf/mid/low)
- Совместимость с TWA темой (не ломает читаемость)

Options
1) CSS/Canvas‑градиенты + Particles (ts‑particles) + Framer micro‑FX
2) Three.js/react‑three‑fiber Hero (bloom/postprocessing) + CSS/Framer остальное
3) Lottie hero (рендер градиентных волн) + CSS/Framer + lightweight particles

Pros/Cons
- (1) + лёгкий бандл, + хорошая производительность; − меньше «глубины»
- (2) + максимальный «вау», + глубина/параллакс; − тяжелее, нужна деградация
- (3) + предсказуемость, + кроссплатформенность; − сложнее кастомизировать на лету

Recommended Approach
- Гибрид: Hero — Three.js (highPerf) / Lottie (mid) / CSS (low). Фоновый слой — CSS/Canvas градиенты + частицы с density по девайсу. UI — glow/glass на Tailwind/SCSS + Framer.

Implementation Guidelines
- Палитра: neon‑purple #7C3AED, neon‑blue #00E5FF, neon‑magenta #FF00E5, gold #D4AF37; фон #0B0F1A
- Эффекты: conic/linear градиенты с анимацией; glass panel (backdrop‑filter), glow halo; liquid underline в TabBar (layoutId)
- Деградации: feature flags highPerf/mid/low; prefers‑reduced‑motion — отключать тяжелые эффекты

Verification
- В hero видно динамический перелив/глубину (по классу устройства)
- Списки/карточки имеют неоновые glow и стекло‑поверхности
- Прокрутка и интеракции 60fps на mid‑девайсах

��������� EXITING CREATIVE PHASE

��������� ENTERING CREATIVE PHASE: DETAILED UI/FX DESIGN (PLAN2)

## КОМПОНЕНТНЫЕ СИСТЕМЫ - ДЕТАЛЬНАЯ ПРОРАБОТКА

### HERO SECTION ВАРИАНТЫ

**Вариант A: Three.js Shader Hero (High-Performance)**
- Vertex/fragment шейдеры: волновые искажения + bloom
- Интерактивные частицы следуют за курсором/тапом
- Цветовая схема: neon-purple → neon-cyan → neon-magenta (rotating conic)
- Performance: GPU-based, 60fps на устройствах с WebGL2

**Вариант B: Lottie Animation Hero (Mid-Performance)**
- Предрендеренная анимация: жидкие градиентные волны
- Overlay частицы через Canvas API (density по FPS)
- Интерполяция цветов через playback speed
- Performance: CPU-based, стабильно на большинстве устройств

**Вариант C: CSS Conic Gradient Hero (Low-Performance)**
- Animated conic-gradient + CSS transforms
- Статичные SVG частицы с CSS animations
- Glassmorphism панель поверх градиента
- Performance: Minimal GPU usage, работает везде

### NAVIGATION DESIGN КОНЦЕПЦИИ

**TabBar "Liquid Bubble":**
- Активная вкладка: неоновое свечение + liquid background
- Переходы: layoutId motion для плавного bubble flow
- Иконки: phosphor-icons с glow эффектом при активности
- Background: glassmorphism с backdrop-blur(20px)

**Page Transitions:**
- Входящая страница: slide-up + masked gradient reveal
- Исходящая: scale-down + blur + fade
- Shared elements: layoutId для карточек отеля/номеров
- Duration: 400ms spring physics

### CARD SYSTEM ДИЗАЙН

**Glass Card Base:**
```
Background: rgba(255,255,255,0.1) + backdrop-blur(12px)
Border: 1px solid rgba(255,255,255,0.2) + gradient border
Shadow: 0 8px 32px rgba(31,38,135,0.37)
Hover: glow ring + y-transform(-4px) + scale(1.02)
```

**Room Card Specifics:**
- Hero image area: gradient overlay (dark-void → transparent)
- Price badge: neon-gold gradient + pulse animation
- Features: tags with glass background + neon borders
- Hover state: tilt effect (3D transform) + enhanced glow

**Menu Item Card:**
- Left: food category icon (animated on hover)
- Center: name + description + dietary tags
- Right: price in neon-gold + "add" button glow
- Special: vegetarian/halal badges with specific neon colors

### ANIMATION МИКРОСЦЕНАРИИ

**Button Press Sequence:**
1. Initial: glass surface + subtle glow
2. Hover: glow intensifies + scale(1.05)
3. Press: scale(0.95) + bright flash
4. Release: elastic return + success glow
5. Duration: 150ms each phase

**Card Loading Sequence:**
1. Skeleton: shimmer gradient across glass surface
2. Image load: blur(10px) → blur(0) over 300ms
3. Content: staggered fade-in (title → description → price)
4. Final: hover state becomes available

**Filter Chips Animation:**
- Inactive: glass surface + muted text
- Active: neon gradient background + white text + glow
- Toggle: morph animation between states (200ms)
- Multiple selection: wave effect across active chips

### ЦВЕТОВЫЕ КОМБИНАЦИИ И ГРАДИЕНТЫ

**Primary Gradient Presets:**
```css
hero-main: conic-gradient(#7C3AED 0deg, #00E5FF 120deg, #FF00E5 240deg, #7C3AED 360deg)
hero-alt: linear-gradient(135deg, #7C3AED 0%, #22D3EE 50%, #FF00E5 100%)
card-subtle: linear-gradient(135deg, rgba(124,58,237,0.1) 0%, rgba(0,229,255,0.1) 100%)
text-accent: linear-gradient(90deg, #00E5FF 0%, #FF00E5 100%)
gold-premium: linear-gradient(135deg, #D4AF37 0%, #F0D975 50%, #B8941F 100%)
```

**Semantic Color Mapping:**
- Success actions: neon-cyan (#22D3EE) + glow
- Warning/attention: neon-magenta (#FF00E5) + pulse
- Premium features: gold gradient + sparkle particles
- Disabled states: desaturated glass + reduced opacity

### TYPOGRAPHY ENHANCEMENT

**Font Stack Enhancement:**
```css
primary: 'SF Pro Display', 'Inter', system-ui, sans-serif
accent: 'SF Pro Text', 'Inter', system-ui, sans-serif
monospace: 'SF Mono', 'Fira Code', 'Courier New', monospace
```

**Text Effects:**
- Hero title: gradient text + subtle text-shadow
- Section headings: glass background + neon underline
- Menu prices: neon-gold color + weight 600
- Descriptions: improved line-height + letter-spacing
- CTAs: animated gradient text + glow on hover

### SPACING И RHYTHM

**Enhanced Spacing Scale:**
```
xs: 4px, sm: 8px, base: 16px, lg: 24px, xl: 32px, 2xl: 48px, 3xl: 64px
```

**Component Spacing Rules:**
- Cards: 16px inner padding, 8px gap between cards
- Hero: 48px top/bottom padding, 24px sides
- TabBar: 12px vertical, 8px horizontal per item
- Buttons: 12px vertical, 24px horizontal (touch-friendly)
- Glass panels: 24px padding, 16px border-radius

### PARTICLE SYSTEMS DESIGN

**Background Particles (Ambient):**
- Density: 30 particles (high-perf) / 15 (mid) / 5 (low)
- Movement: slow drift + subtle mouse parallax
- Colors: matching gradient palette with low opacity
- Size: 2-6px random, with blur(1px)

**Interactive Particles (Hero):**
- On tap/click: burst of 8-12 particles from point
- Trail: cursor movement creates particle wake
- Colors: bright neon matching current gradient
- Physics: gravity + fade out over 2 seconds

**Success Feedback Particles:**
- Button success: star-burst effect (6 particles)
- Form completion: confetti-style celebration
- Achievement unlock: golden sparkle trail

### PERFORMANCE OPTIMIZATION STRATEGY

**Device Detection Logic:**
```
High-Performance: GPU score > 1000, RAM > 4GB
Mid-Performance: GPU score 500-1000, RAM 2-4GB
Low-Performance: GPU score < 500, RAM < 2GB
```

**Feature Degradation Matrix:**
- High: All effects enabled, particle density 100%
- Mid: Reduced particles (50%), simpler shaders
- Low: CSS-only effects, minimal particles
- Critical: Static gradients, no particles

### ACCESSIBILITY CONSIDERATIONS

**Motion Sensitivity:**
- `prefers-reduced-motion`: disable auto-animations
- Alternative: subtle fade/scale instead of complex motion
- User setting: motion intensity slider (off/low/medium/high)

**Color Contrast:**
- Text on glass: ensure 4.5:1 contrast ratio
- Focus indicators: high contrast neon ring
- Color-blind friendly: patterns + colors for states
- Dark mode: adjust neon intensity for comfort

### VERIFICATION CHECKPOINTS

**Visual Quality:**
- [ ] Hero создает "вау" эффект при первом просмотре
- [ ] Градиенты плавно переливаются без stepping
- [ ] Glass эффекты выглядят реалистично
- [ ] Neon glow не засвечивает текст

**Performance:**
- [ ] 60fps на mid-устройствах при скролле
- [ ] Быстрый fallback на low-устройствах
- [ ] Particle system не блокирует UI
- [ ] Memory usage остается стабильным

**Usability:**
- [ ] Кнопки имеют четкий feedback
- [ ] Навигация интуитивна с анимациями
- [ ] Текст читается на всех фонах
- [ ] Touch targets минимум 44px

**Technical:**
- [ ] Анимации используют transform/opacity
- [ ] GPU layers правильно оптимизированы
- [ ] CSS containment применен где нужно
- [ ] Bundle size в пределах бюджета

��������� EXITING CREATIVE PHASE: DETAILED DESIGN

## ФИНАЛЬНЫЕ РЕШЕНИЯ

### Выбранная визуальная концепция:
**"Neon Liquid Glass"** - сочетание жидких неоновых градиентов с реалистичными стеклянными поверхностями и интерактивными частицами.

### Ключевые компоненты:
1. **Hero**: Adaptive FX (Three.js/Lottie/CSS) с интерактивными частицами
2. **Navigation**: Liquid bubble TabBar с layoutId transitions
3. **Cards**: Glass morphism + neon glow + tilt effects
4. **Buttons**: Multi-phase interaction feedback
5. **Typography**: Gradient text effects + enhanced spacing

### Implementation priorities:
1. Base FX layer (градиенты + particles)
2. Glass component system  
3. Navigation animations
4. Card hover effects
5. Micro-interactions polish

Готово для перехода в **IMPLEMENT** режим.
