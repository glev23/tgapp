import { Restaurant, MenuItem, Room, SpaService, MenuCategory, ParsedData, DietaryInfo } from '../types';

/**
 * Data Parser Service
 * Handles parsing of data from database directories and text files
 */

// Helper to fetch JSON from public folder
async function fetchPublicJSON<T>(path: string): Promise<T> {
  const res = await fetch(path, { cache: 'no-cache' })
  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`)
  return res.json()
}

// Restaurant data parsing
export const parseRestaurantData = async (): Promise<ParsedData<Restaurant>> => {
  try {
    // Parse from rest.txt structure
    const restaurants: Restaurant[] = [
      {
        id: 'lobby-bar',
        name: 'Лобби-бар',
        description: 'Круглосуточный лобби-бар с русской и международной кухней. Идеальное место для встреч, переговоров и отдыха в любое время суток.',
        cuisine: 'русская, международная',
        hours: 'круглосуточно',
        averageCheck: 'от 1500 ₽',
        features: ['круглосуточно', 'лобби', 'международная кухня'],
        location: 'Лобби отеля',
        contact: '+7 (495) 123-45-67'
      },
      {
        id: 'veranda',
        name: 'Ресторан «Веранда»',
        description: 'Элегантный ресторан с панорамным видом. Русская и международная кухня в атмосфере уюта и комфорта.',
        cuisine: 'русская, международная',
        hours: 'Завтрак для гостей подаётся с 6:30 до 11:00',
        averageCheck: 'от 2500 ₽',
        features: ['завтрак для гостей', 'панорамный вид', 'элегантная атмосфера'],
        location: 'Веранда отеля',
        contact: '+7 (495) 123-45-68'
      },
      {
        id: 'club-restaurant',
        name: 'Клубный ресторан',
        description: 'Премиум ресторан с русской и международной кухней, специализирующийся на гастрономических сетах.',
        cuisine: 'русская, международная, гастрономические сеты',
        hours: 'c 06:30 до 00:00, завтрак с 06:30 до 11:00, ланч с 13:00 до 16:00, ужин с 18:00 до 21:00',
        averageCheck: 'от 5000 ₽',
        features: ['гастрономические сеты', 'завтрак', 'ланч', 'ужин', 'премиум'],
        location: 'Клубная зона отеля',
        contact: '+7 (495) 123-45-69'
      },
      {
        id: 'black-thai',
        name: 'Black Thai',
        description: 'Аутентичный тайский ресторан с яркими пряными вкусами, свежими травами и балансом остроты. Современный интерьер с экзотическими акцентами создаёт атмосферу вечера в Бангкоке.',
        cuisine: 'тайская',
        hours: '12:00 до 00:00 (кухня открыта до 23:30)',
        averageCheck: '3500 ₽',
        features: ['тайская кухня', 'пряные блюда', 'вегетарианские позиции', 'выбор уровня остроты'],
        location: 'Внутри отеля Radisson Collection',
        contact: '+7 (495) 123-45-70'
      },
      {
        id: 'zea',
        name: 'ZEA',
        description: 'Современный ресторан средиземноморской кухни с элегантным интерьером и изысканными блюдами.',
        cuisine: 'средиземноморская',
        hours: '12:00-00:00',
        averageCheck: '5000 ₽',
        features: ['средиземноморская кухня', 'изысканные блюда', 'элегантный интерьер'],
        location: 'Основная зона отеля',
        contact: '+7 (495) 123-45-71'
      },
      {
        id: 'buono',
        name: 'BUONO',
        description: 'Аутентичный итальянский ресторан с традиционными рецептами и современным подходом к подаче.',
        cuisine: 'итальянская',
        hours: 'с 12.00 до 00.00',
        averageCheck: '5000 ₽',
        features: ['итальянская кухня', 'традиционные рецепты', 'современная подача'],
        location: 'Итальянская зона отеля',
        contact: '+7 (495) 123-45-72'
      },
      {
        id: 'koktebel-bar',
        name: 'Коктебель Бар',
        description: 'Авторская кухня в формате тапас-бара. Уникальные сочетания вкусов и креативные блюда.',
        cuisine: 'авторская кухня, тапас-бар',
        hours: 'с 18:00 до 06:00',
        averageCheck: '4000 ₽',
        features: ['авторская кухня', 'тапас-бар', 'ночной', 'креативные блюда'],
        location: 'Барная зона отеля',
        contact: '+7 (495) 123-45-73'
      },
      {
        id: 'karaoke-trubadur',
        name: 'Караоке Трубадур',
        description: 'Итальянская кухня в сочетании с караоке. Отличное место для веселых вечеров с друзьями.',
        cuisine: 'итальянская',
        hours: 'с 20.00 до 06.00',
        averageCheck: '5000 ₽',
        features: ['караоке', 'итальянская кухня', 'ночной', 'развлекательная программа'],
        location: 'Развлекательная зона отеля',
        contact: '+7 (495) 123-45-74'
      },
      {
        id: 'romantic',
        name: 'Romantic',
        description: 'Романтический ресторан с депозитной системой. Идеальное место для особых случаев и свиданий.',
        cuisine: 'европейская',
        hours: 'с 12:00 до 00:00',
        averageCheck: 'депозит',
        features: ['депозитная система', 'романтическая атмосфера', 'особые случаи'],
        location: 'Романтическая зона отеля',
        contact: '+7 (495) 123-45-75'
      },
      {
        id: 'soluxe-club',
        name: 'Soluxe Club',
        description: 'Китайская кухня от шеф-повара Ян Пэй Вэнь. Аутентичные блюда с современным подходом.',
        cuisine: 'китайская',
        hours: 'с 11:00 до 00:00',
        averageCheck: '4000 ₽',
        features: ['китайская кухня', 'авторская кухня', 'шеф-повар'],
        location: 'Китайская зона отеля',
        contact: '+7 (495) 123-45-76'
      },
      {
        id: 'richy-richy',
        name: 'Richy Richy',
        description: 'Авторская кухня с уникальными сочетаниями вкусов и инновационными техниками приготовления.',
        cuisine: 'авторская',
        hours: '11:00–00:00',
        averageCheck: 'от 6000 ₽',
        features: ['авторская кухня', 'инновационные техники', 'уникальные вкусы'],
        location: 'Авторская зона отеля',
        contact: '+7 (495) 123-45-77'
      },
      {
        id: 'il-forno',
        name: 'il FORNO',
        description: 'Традиционная итальянская кухня с акцентом на свежие ингредиенты и классические рецепты.',
        cuisine: 'итальянская',
        hours: 'с 11:00 до 23:00',
        averageCheck: '4000 ₽',
        features: ['итальянская кухня', 'традиционные рецепты', 'свежие ингредиенты'],
        location: 'Итальянская зона отеля',
        contact: '+7 (495) 123-45-78'
      },
      {
        id: 'erwin',
        name: 'ERWIN. РекаМореОкеан',
        description: 'Средиземноморская кухня с морскими акцентами. Свежие морепродукты и блюда из рыбы.',
        cuisine: 'средиземноморская',
        hours: 'ежедневно 12:00 - 01:00',
        averageCheck: '5000 ₽',
        features: ['средиземноморская кухня', 'морепродукты', 'рыбные блюда'],
        location: 'Морская зона отеля',
        contact: '+7 (495) 123-45-79'
      },
      {
        id: 'maroon',
        name: 'Maroon',
        description: 'Ближневосточная кухня с богатыми специями и традиционными рецептами.',
        cuisine: 'ближневосточная',
        hours: 'вс – чт с 10:00 до 01:00; пт – сб с 10:00 до 02:00',
        averageCheck: '5000 ₽',
        features: ['ближневосточная кухня', 'богатые специи', 'традиционные рецепты'],
        location: 'Ближневосточная зона отеля',
        contact: '+7 (495) 123-45-80'
      },
      {
        id: 'matreshka',
        name: 'Матрёшка',
        description: 'Русская кухня в традиционном стиле. Блюда, приготовленные по старинным рецептам.',
        cuisine: 'русская',
        hours: 'с 09:00 до 23:00',
        averageCheck: '3500 ₽',
        features: ['русская кухня', 'традиционные рецепты', 'старинные блюда'],
        location: 'Русская зона отеля',
        contact: '+7 (495) 123-45-81'
      },
      {
        id: 'chef-steak-bar',
        name: 'Chef Steak&Bar',
        description: 'Восточная и европейская кухня с акцентом на стейки и мясные блюда.',
        cuisine: 'восточная и европейская',
        hours: 'пн-пт с 11:00 до 02:00; сб с 10:00 до 02:00; вс с 10:00 до 01:00',
        averageCheck: '4000 - 5000 ₽',
        features: ['восточная кухня', 'европейская кухня', 'стейки', 'мясные блюда'],
        location: 'Стейк-зона отеля',
        contact: '+7 (495) 123-45-82'
      },
      {
        id: 'grammys',
        name: 'Grammy\'s',
        description: 'Европейская кухня в ночном формате. Идеальное место для поздних ужинов.',
        cuisine: 'европейская',
        hours: '20:00-06:00',
        averageCheck: 'от 4500 ₽',
        features: ['европейская кухня', 'ночной', 'поздние ужины'],
        location: 'Ночная зона отеля',
        contact: '+7 (495) 123-45-83'
      },
      {
        id: 'tbilisi',
        name: 'Тбилиси',
        description: 'Грузинская и европейская кухня с традиционными блюдами и гостеприимной атмосферой.',
        cuisine: 'грузинская, европейская',
        hours: '12:00 - 05:00',
        averageCheck: '3000 ₽',
        features: ['грузинская кухня', 'европейская кухня', 'традиционные блюда', 'гостеприимство'],
        location: 'Грузинская зона отеля',
        contact: '+7 (495) 123-45-84'
      }
    ]

    return {
      data: restaurants,
      success: true
    };
  } catch (error) {
    return {
      data: [],
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Menu data parsing - now loads from public/data/menu-full.json
export const parseMenuData = async (): Promise<ParsedData<MenuItem>> => {
  try {
    console.log('Fetching menu data from /data/menu-full.json...')
    const data = await fetchPublicJSON<any>('/data/menu-full.json')
    console.log('Raw menu data:', data)

    const items: MenuItem[] = []
    const categoryMap = new Map<string, any[]>()

    if (data && Array.isArray(data.categories)) {
      console.log('Processing', data.categories.length, 'categories')
      
      // First pass: group items by category name to handle duplicates
      data.categories.forEach((category: any, catIndex: number) => {
        const categoryName: string = (category.name || '').toString()
        const categoryItems: any[] = Array.isArray(category.items) ? category.items : []
        console.log(`Category ${catIndex}: "${categoryName}" with ${categoryItems.length} items`)

        if (categoryMap.has(categoryName)) {
          // Merge with existing category
          const existing = categoryMap.get(categoryName)!
          existing.push(...categoryItems)
          console.log(`Merged "${categoryName}" - now has ${existing.length} items`)
        } else {
          // New category
          categoryMap.set(categoryName, [...categoryItems])
        }
      })

      // Second pass: process all items from merged categories
      categoryMap.forEach((categoryItems, categoryName) => {
        console.log(`Processing merged category "${categoryName}" with ${categoryItems.length} items`)
        
        categoryItems.forEach((raw, idx) => {
          const name = (raw.name || '').toString().trim()
          const price = Number(raw.price) || 0
          if (!name || !price) return

          // Parse dietary information from the item data or generate based on name/category
          const dietaryInfo: DietaryInfo = {
            vegetarian: raw.vegetarian || 
                       name.toLowerCase().includes('овощ') || 
                       name.toLowerCase().includes('каша') ||
                       name.toLowerCase().includes('салат') ||
                       name.toLowerCase().includes('суп') && !name.toLowerCase().includes('мяс') ||
                       categoryName.toLowerCase().includes('десерт'),
            lactoseFree: raw.lactoseFree || 
                         name.toLowerCase().includes('без молока') ||
                         name.toLowerCase().includes('веган'),
            glutenFree: raw.glutenFree || 
                        name.toLowerCase().includes('без глютена') ||
                        name.toLowerCase().includes('рис') ||
                        name.toLowerCase().includes('гречка'),
            spicy: raw.spicy || 
                   name.toLowerCase().includes('острый') || 
                   name.toLowerCase().includes('чили') ||
                   name.toLowerCase().includes('карри') ||
                   name.toLowerCase().includes('перец'),
            halal: raw.halal || 
                   name.toLowerCase().includes('халяль') ||
                   name.toLowerCase().includes('курица') ||
                   name.toLowerCase().includes('индейка')
          }

          const item: MenuItem = {
            id: `${categoryName}-${name}-${price}-${idx}`
              .toLowerCase()
              .replace(/\s+/g, '-')
              .replace(/[^a-z0-9а-яё\-]/gi, ''),
            name,
            description: raw.description || undefined,
            portion: raw.portion || undefined,
            price,
            category: categoryName,
            dietary: dietaryInfo,
            dietaryInfo: dietaryInfo, // Backward compatibility
          }
          items.push(item)
        })
      })
    }

    console.log('Parsed', items.length, 'menu items')
    console.log('Sample items:', items.slice(0, 3))

    return { data: items, success: true }
  } catch (error) {
    console.error('Error parsing menu data:', error)
    return {
      data: [],
      success: false,
      error: error instanceof Error ? error.message : 'Failed to parse menu'
    }
  }
}

// Menu categories parsing
export const parseMenuCategories = (): MenuCategory[] => {
  return [
    { id: 'breakfast', name: 'ЗАВТРАК А ЛЯ КАРТ', order: 1 },
    { id: 'cold-appetizers', name: 'ХОЛОДНЫЕ ЗАКУСКИ', order: 2 },
    { id: 'desserts', name: 'ДЕСЕРТЫ И СВЕЖАЯ ВЫПЕЧКА', order: 3 },
    { id: 'hot-dishes', name: 'ГОРЯЧИЕ БЛЮДА', order: 4 },
    { id: 'caviar', name: 'ИКРА', order: 5 },
    { id: 'sandwiches-pizza', name: 'СЭНДВИЧИ И ПИЦЦА', order: 6 },
    { id: 'pizza', name: 'ПИЦЦА', order: 7 },
    { id: 'salads', name: 'САЛАТЫ', order: 8 },
    { id: 'soups', name: 'СУПЫ', order: 9 },
    { id: 'hot-appetizers', name: 'ГОРЯЧИЕ ЗАКУСКИ', order: 10 },
    { id: 'pasta', name: 'ПАСТА', order: 11 },
    { id: 'main-dishes', name: 'ОСНОВНЫЕ БЛЮДА', order: 12 },
    { id: 'side-dishes', name: 'ГАРНИРЫ', order: 13 },
    { id: 'asian-dishes', name: 'АЗИАТСКИЕ БЛЮДА', order: 14 },
    { id: 'kids-menu', name: 'ДЕТСКОЕ МЕНЮ', order: 15 },
    { id: 'desserts-simple', name: 'ДЕСЕРТЫ', order: 16 },
    { id: 'ice-cream', name: 'МОРОЖЕНОЕ И СОРБЕТ', order: 17 },
    { id: 'aperitif', name: 'АПЕРИТИВ', order: 18 },
    { id: 'champagne', name: 'ШАМПАНСКОЕ', order: 19 },
    { id: 'sparkling-wine', name: 'ИГРИСТОЕ ВИНО', order: 20 },
    { id: 'white-wine', name: 'БЕЛОЕ ВИНО', order: 21 },
    { id: 'rose-wine', name: 'РОЗОВОЕ ВИНО', order: 22 },
    { id: 'red-wine', name: 'КРАСНОЕ ВИНО', order: 23 },
    { id: 'port', name: 'ПОРТВЕЙН', order: 24 },
    { id: 'vodka', name: 'ВОДКА', order: 25 },
    { id: 'rum', name: 'РОМ', order: 26 },
    { id: 'tequila', name: 'ТЕКИЛА', order: 27 },
    { id: 'gin', name: 'ДЖИН', order: 28 },
    { id: 'whiskey', name: 'ВИСКИ', order: 29 },
    { id: 'cognac', name: 'КОНЬЯК', order: 30 },
    { id: 'brandy', name: 'БРЕНДИ', order: 31 },
    { id: 'liqueurs', name: 'ЛИКЕРЫ', order: 32 },
    { id: 'beer', name: 'ПИВО', order: 33 },
    { id: 'coffee-cocoa', name: 'КОФЕ И КАКАО', order: 34 },
    { id: 'mineral-water', name: 'МИНЕРАЛЬНАЯ ВОДА', order: 35 },
    { id: 'non-alcoholic', name: 'БЕЗАЛКОГОЛЬНЫЕ НАПИТКИ', order: 36 }
  ];
};

// Room data parsing
export const parseRoomData = async (): Promise<ParsedData<Room>> => {
  try {
    const rooms: Room[] = [
      {
        id: 'individual',
        name: 'Individual',
        description: 'Индивидуальный номер с современными удобствами',
        features: ['Wi-Fi', 'Кондиционер', 'Мини-бар'],
        maxGuests: 2
      },
      {
        id: 'collection-superior',
        name: 'Collection Superior',
        description: 'Номер повышенной комфортности',
        features: ['Wi-Fi', 'Кондиционер', 'Мини-бар', 'Сейф'],
        maxGuests: 2
      },
      {
        id: 'collection-superior-city',
        name: 'Collection Superior (вид на город)',
        description: 'Номер повышенной комфортности с видом на город',
        features: ['Wi-Fi', 'Кондиционер', 'Мини-бар', 'Сейф', 'Вид на город'],
        maxGuests: 2,
        view: 'город'
      }
    ] as any

    return {
      data: rooms,
      success: true
    };
  } catch (error) {
    return {
      data: [],
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// SPA services data parsing
export const parseSpaData = async (): Promise<ParsedData<SpaService>> => {
  try {
    const services: SpaService[] = [
      {
        id: 'thai-massage',
        name: 'Тайский массаж',
        description: 'Традиционный тайский массаж для восстановления энергии',
        duration: '60-90 минут'
      },
      {
        id: 'sports-massage',
        name: 'Спортивный массаж',
        description: 'Массаж для восстановления после физических нагрузок',
        duration: '45-60 минут'
      },
      {
        id: 'cosmetology',
        name: 'Косметологические процедуры',
        description: 'Широкий спектр косметологических услуг',
        duration: '30-120 минут'
      }
    ] as any

    return {
      data: services,
      success: true
    };
  } catch (error) {
    return {
      data: [],
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Image placeholder system
export const getImagePlaceholder = (type: 'restaurant' | 'room' | 'service' | 'menu') => {
  const placeholders = {
    restaurant: {
      fallbackIcon: '🍽️',
      gradientClass: 'bg-gradient-purple-cyan'
    },
    room: {
      fallbackIcon: '🛏️',
      gradientClass: 'bg-gradient-cyan-magenta'
    },
    service: {
      fallbackIcon: '💆‍♀️',
      gradientClass: 'bg-gradient-gold'
    },
    menu: {
      fallbackIcon: '🍴',
      gradientClass: 'bg-gradient-neon'
    }
  };

  return placeholders[type];
};

// Utility function to generate unique IDs
export const generateId = (prefix: string, name: string): string => {
  return `${prefix}-${name.toLowerCase().replace(/[^a-z0-9а-яё\s]/gi, '').replace(/\s+/g, '-')}`;
}; 