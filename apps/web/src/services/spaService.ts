import { SpaService as SpaServiceType, ParsedData } from '../types';
import { getImagePlaceholder, generateId } from './dataParser';

class SpaService {
  private services: SpaServiceType[] = [];
  private loaded = false;
  private imageMap: Record<string, string> = {};

  async loadImageMap() {
    try {
      const response = await fetch('/data/spa-images.json');
      if (response.ok) {
        this.imageMap = await response.json();
        console.log('SPA image map loaded:', this.imageMap);
      }
    } catch (error) {
      console.warn('Failed to load SPA image map, using placeholders');
    }
  }

  getImageFor(serviceName: string): string {
    return this.imageMap[serviceName] || this.getPlaceholderImage(serviceName);
  }

  getPlaceholderImage(serviceName: string): string {
    return '/images/spa-placeholder.svg';
  }

  async loadServices(): Promise<ParsedData<SpaServiceType>> {
    if (this.loaded) {
      return { success: true, data: this.services };
    }

    try {
      // Load image mapping first
      await this.loadImageMap();

      // SPA services data based on database/spa&welness structure
      this.services = [
        {
          id: generateId('spa', 'Тайский массаж'),
          name: 'Тайский массаж',
          category: 'Массажные процедуры',
          duration: '60 / 90 минут',
          description: 'Глубокая работа с мышцами и фасциями в сочетании с мягкими растяжениями и йогическими приёмами. Улучшает подвижность, снимает мышечные зажимы и снижает уровень стресса.',
          suitableFor: 'При сидячей работе, ощущении усталости, после тренировок',
          contraindications: 'Острые воспаления, лихорадка, беременность — по согласованию с врачом и мастером',
          beforeProcedure: 'Не принимать плотную пищу за 1–2 часа; прибыть за 10 минут до начала для опроса и выбора интенсивности',
          priceRange: '6000-8500',
          images: [this.getImageFor('Тайский массаж')],
          features: ['глубокая работа', 'растяжения', 'антистресс', 'традиционная техника']
        },
        {
          id: generateId('spa', 'Спортивный массаж'),
          name: 'Спортивный массаж',
          category: 'Массажные процедуры',
          duration: '60 / 90 минут',
          description: 'Специализированный массаж для спортсменов и активных людей. Направлен на восстановление мышц, улучшение кровообращения и профилактику травм.',
          suitableFor: 'Спортсмены, люди с активным образом жизни, после интенсивных тренировок',
          contraindications: 'Острые травмы, воспалительные процессы в мышцах, повышенная температура',
          beforeProcedure: 'Сообщить о недавних травмах или болевых ощущениях; прибыть за 10 минут для консультации',
          priceRange: '5500-7500',
          images: [this.getImageFor('Спортивный массаж')],
          features: ['восстановление мышц', 'профилактика травм', 'спортивная медицина', 'глубокое воздействие']
        },
        {
          id: generateId('spa', 'Медицинский массаж'),
          name: 'Медицинский массаж',
          category: 'Массажные процедуры',
          duration: '45 / 60 минут',
          description: 'Лечебный массаж по назначению врача. Применяется для реабилитации, коррекции осанки и лечения заболеваний опорно-двигательного аппарата.',
          suitableFor: 'По назначению врача, при проблемах с позвоночником, реабилитация после травм',
          contraindications: 'Онкологические заболевания, острые инфекции, кожные заболевания в месте воздействия',
          beforeProcedure: 'Предоставить справку от врача или результаты обследований; прийти за 15 минут для консультации',
          priceRange: '7000-9000',
          images: [this.getImageFor('Медицинский массаж')],
          features: ['лечебный эффект', 'врачебное назначение', 'реабилитация', 'коррекция осанки']
        },
        {
          id: generateId('spa', 'Лимфодренажный массаж'),
          name: 'Лимфодренажный массаж',
          category: 'Массажные процедуры',
          duration: '60 / 90 минут',
          description: 'Деликатный массаж для стимуляции лимфатической системы. Способствует выведению токсинов, уменьшению отеков и улучшению общего самочувствия.',
          suitableFor: 'При отеках, целлюлите, для детоксикации организма, в комплексных программах снижения веса',
          contraindications: 'Онкологические заболевания, тромбофлебит, острые инфекционные заболевания',
          beforeProcedure: 'Пить больше воды в день процедуры; избегать алкоголя за 24 часа до сеанса',
          priceRange: '6500-8000',
          images: [this.getImageFor('Лимфодренажный массаж')],
          features: ['детоксикация', 'против отеков', 'лимфодренаж', 'деликатное воздействие']
        },
        {
          id: generateId('spa', 'Массаж лица'),
          name: 'Массаж лица',
          category: 'Массажные процедуры',
          duration: '30 / 45 минут',
          description: 'Омолаживающий массаж лица для улучшения тонуса кожи, разглаживания морщин и улучшения цвета лица. Включает работу с акупунктурными точками.',
          suitableFor: 'Профилактика старения, улучшение тонуса кожи, снятие напряжения мимических мышц',
          contraindications: 'Острые воспалительные процессы на коже, герпес в активной фазе, недавние косметологические процедуры',
          beforeProcedure: 'Очистить лицо от декоративной косметики; сообщить о недавних косметологических процедурах',
          priceRange: '4000-6000',
          images: [this.getImageFor('Массаж лица')],
          features: ['омоложение', 'тонус кожи', 'акупунктура', 'антивозрастной эффект']
        },
        {
          id: generateId('spa', 'Гидромассаж'),
          name: 'Гидромассаж',
          category: 'Массажные процедуры',
          duration: '20 / 30 минут',
          description: 'Массаж водными струями в специальной ванне. Сочетает расслабляющий и тонизирующий эффект, улучшает кровообращение и снимает мышечное напряжение.',
          suitableFor: 'Снятие стресса, мышечного напряжения, улучшение кровообращения, после физических нагрузок',
          contraindications: 'Сердечно-сосудистые заболевания в острой фазе, кожные заболевания, беременность',
          beforeProcedure: 'Принять душ перед процедурой; сообщить о проблемах с сердцем или давлением',
          priceRange: '3500-5000',
          images: [this.getImageFor('Гидромассаж')],
          features: ['водные струи', 'расслабление', 'тонизирование', 'улучшение кровообращения']
        },
        {
          id: generateId('spa', 'Stone-терапия'),
          name: 'Stone-терапия (горячие камни)',
          category: 'Массажные процедуры',
          duration: '75 / 90 минут',
          description: 'Уникальная методика с использованием нагретых базальтовых камней. Глубокое прогревание тканей, расслабление мышц и гармонизация энергетических потоков.',
          suitableFor: 'Хронический стресс, мышечные зажимы, усталость, для глубокого расслабления',
          contraindications: 'Сердечно-сосудистые заболевания, варикозное расширение вен, беременность, онкология',
          beforeProcedure: 'Сообщить о чувствительности к теплу; не принимать алкоголь за 24 часа до процедуры',
          priceRange: '8000-11000',
          images: [this.getImageFor('Stone-терапия (горячие камни)')],
          features: ['горячие камни', 'глубокое прогревание', 'энергетическая гармонизация', 'премиум процедура']
        },
        {
          id: generateId('spa', 'Icoone массаж'),
          name: 'Icoone — аппаратный массаж',
          category: 'Аппаратные процедуры',
          duration: '30 / 45 минут',
          description: 'Инновационный итальянский аппарат с 75 программами массажа. Microvibration и Multifrequential технологии для коррекции фигуры и омоложения.',
          suitableFor: 'Коррекция фигуры, антицеллюлитная терапия, лифтинг, лимфодренаж, спортивное восстановление',
          contraindications: 'Беременность, онкологические заболевания, кардиостимулятор, острые воспалительные процессы',
          beforeProcedure: 'Консультация со специалистом для выбора программы; пить больше воды после процедуры',
          priceRange: '7500-10000',
          images: [this.getImageFor('Icoone — аппаратный массаж')],
          features: ['75 программ', 'итальянские технологии', 'коррекция фигуры', 'антицеллюлит']
        },
        {
          id: generateId('spa', 'Парение в русской бане'),
          name: 'Парение в русской бане',
          category: 'Банные процедуры',
          duration: '90 / 120 минут',
          description: 'Традиционное русское парение с веником в аутентичной бане. Глубокое очищение, детоксикация и укрепление иммунитета в атмосфере русских традиций.',
          suitableFor: 'Укрепление иммунитета, детоксикация, снятие стресса, любители русских традиций',
          contraindications: 'Сердечно-сосудистые заболевания, гипертония, беременность, острые инфекционные заболевания',
          beforeProcedure: 'Не принимать алкоголь; пить больше воды; не есть плотно за 2 часа до процедуры',
          priceRange: '4000-6000',
          images: [this.getImageFor('Парение в русской бане')],
          features: ['русские традиции', 'веник', 'детоксикация', 'укрепление иммунитета']
        },
        {
          id: generateId('spa', 'Детокс-программы'),
          name: 'Детокс-программы (баня и хамам)',
          category: 'Банные процедуры',
          duration: '120 / 150 минут',
          description: 'Комплексные программы очищения организма с использованием русской бани и турецкого хамама. Включают пилинг, обертывания и релаксацию.',
          suitableFor: 'Комплексное очищение организма, снижение веса, улучшение состояния кожи, антистресс',
          contraindications: 'Серьезные заболевания сердца, беременность, онкология, острые инфекции',
          beforeProcedure: 'Консультация со специалистом; соблюдение питьевого режима; легкое питание накануне',
          priceRange: '8000-12000',
          images: [this.getImageFor('Детокс-программы (баня и хамам)')],
          features: ['комплексная программа', 'баня + хамам', 'детоксикация', 'очищение организма']
        },
        {
          id: generateId('spa', 'Скрабирование'),
          name: 'Скрабирование',
          category: 'Уходовые процедуры',
          duration: '30 / 45 минут',
          description: 'Глубокое очищение кожи с использованием натуральных скрабов. Удаление омертвевших клеток, стимуляция обновления кожи и улучшение ее текстуры.',
          suitableFor: 'Подготовка к другим процедурам, улучшение текстуры кожи, очищение пор',
          contraindications: 'Повреждения кожи, воспалительные процессы, аллергия на компоненты скраба',
          beforeProcedure: 'Тест на аллергию при чувствительной коже; не использовать автозагар за 3 дня',
          priceRange: '3000-4500',
          images: [this.getImageFor('Скрабирование')],
          features: ['натуральные скрабы', 'глубокое очищение', 'обновление кожи', 'подготовительная процедура']
        },
        {
          id: generateId('spa', 'Обертывание'),
          name: 'Обертывание',
          category: 'Уходовые процедуры',
          duration: '60 / 90 минут',
          description: 'Лечебные и косметические обертывания с использованием грязей, водорослей, шоколада и других активных компонентов для коррекции фигуры и улучшения состояния кожи.',
          suitableFor: 'Коррекция фигуры, антицеллюлитная терапия, увлажнение кожи, релаксация',
          contraindications: 'Варикозное расширение вен, сердечно-сосудистые заболевания, беременность, аллергии',
          beforeProcedure: 'Тест на аллергию; не принимать горячий душ после процедуры в течение 4 часов',
          priceRange: '5000-8000',
          images: [this.getImageFor('Обертывание')],
          features: ['активные компоненты', 'коррекция фигуры', 'антицеллюлит', 'увлажнение кожи']
        },
        {
          id: generateId('spa', 'Парикмахерские услуги'),
          name: 'Парикмахерские услуги',
          category: 'Салонные услуги',
          duration: '60 / 120 минут',
          description: 'Полный спектр парикмахерских услуг от профессиональных стилистов. Стрижки, укладки, окрашивание и уходовые процедуры для волос премиум класса.',
          suitableFor: 'Создание нового образа, уход за волосами, подготовка к особым событиям',
          contraindications: 'Аллергия на компоненты красителей, повреждения кожи головы, недавние химические процедуры',
          beforeProcedure: 'Консультация со стилистом; тест на аллергию при окрашивании; чистые волосы',
          priceRange: '4000-15000',
          images: [this.getImageFor('Парикмахерские услуги')],
          features: ['профессиональные стилисты', 'стрижки и окрашивание', 'премиум уход', 'создание образа']
        },
        {
          id: generateId('spa', 'Королевское бритье'),
          name: 'Королевское бритье',
          category: 'Салонные услуги',
          duration: '45 / 60 минут',
          description: 'Традиционное мужское бритье опасной бритвой с горячими полотенцами, премиум косметикой и расслабляющим массажем лица. Истинно королевский уход.',
          suitableFor: 'Мужчины, ценящие традиции и качественный уход, подготовка к особым событиям',
          contraindications: 'Повреждения кожи лица, острые воспалительные процессы, аллергия на компоненты косметики',
          beforeProcedure: 'Консультация с мастером о типе кожи; не бриться самостоятельно за 2 дня до процедуры',
          priceRange: '5000-7000',
          images: [this.getImageFor('Королевское бритье')],
          features: ['опасная бритва', 'горячие полотенца', 'премиум косметика', 'традиционная техника']
        },
        {
          id: generateId('spa', 'Маникюр и педикюр'),
          name: 'Маникюр и педикюр (в 4 руки)',
          category: 'Салонные услуги',
          duration: '90 / 120 минут',
          description: 'Одновременный маникюр и педикюр от двух мастеров. Экономия времени без компромиссов в качестве. Включает уход, массаж и покрытие на выбор.',
          suitableFor: 'Экономия времени, подготовка к событиям, регулярный уход за руками и ногами',
          contraindications: 'Грибковые заболевания, повреждения кожи, воспалительные процессы в зоне обработки',
          beforeProcedure: 'Удалить старое покрытие заранее; не использовать кремы в день процедуры',
          priceRange: '6000-9000',
          images: [this.getImageFor('Маникюр и педикюр (в 4 руки)')],
          features: ['два мастера одновременно', 'экономия времени', 'комплексный уход', 'профессиональные покрытия']
        }
      ];

      this.loaded = true;
      return { success: true, data: this.services };
    } catch (error) {
      console.error('Error loading SPA services:', error);
      return { 
        success: false, 
        data: [], 
        error: 'Не удалось загрузить данные SPA услуг' 
      };
    }
  }

  getServices(): SpaServiceType[] {
    return this.services;
  }

  getServiceById(id: string): SpaServiceType | null {
    console.log('Looking for service with ID:', id)
    console.log('Available services:', this.services.map(s => ({ id: s.id, name: s.name })))
    const service = this.services.find(service => service.id === id)
    console.log('Found service:', service)
    return service || null;
  }

  getServicesByCategory(category: string): SpaServiceType[] {
    return this.services.filter(service => service.category === category);
  }

  getServicesByDuration(maxDuration: number): SpaServiceType[] {
    return this.services.filter(service => {
      const durations = service.duration.split(' / ').map(d => parseInt(d));
      return Math.min(...durations) <= maxDuration;
    });
  }

  getServicesByPriceRange(minPrice: number, maxPrice: number): SpaServiceType[] {
    return this.services.filter(service => {
      const [min, max] = service.priceRange.split('-').map(p => parseInt(p.replace(/\D/g, '')));
      return min >= minPrice && max <= maxPrice;
    });
  }

  searchServices(query: string): SpaServiceType[] {
    const searchTerm = query.toLowerCase();
    return this.services.filter(service =>
      service.name.toLowerCase().includes(searchTerm) ||
      service.description.toLowerCase().includes(searchTerm) ||
      service.features?.some(feature => feature.toLowerCase().includes(searchTerm)) ||
      service.category.toLowerCase().includes(searchTerm)
    );
  }

  private getPlaceholderImage(serviceName: string): string {
    return '/images/spa-placeholder.svg';
  }

  getCategories(): string[] {
    return Array.from(new Set(this.services.map(service => service.category)));
  }

  getFeaturedServices(limit = 4): SpaServiceType[] {
    // Return diverse selection of featured services
    const featured = [
      this.services.find(s => s.name === 'Тайский массаж'),
      this.services.find(s => s.name === 'Stone-терапия (горячие камни)'),
      this.services.find(s => s.name === 'Icoone — аппаратный массаж'),
      this.services.find(s => s.name === 'Детокс-программы (баня и хамам)')
    ].filter(Boolean) as SpaServiceType[];

    return featured.slice(0, limit);
  }

  getServicesByFeature(feature: string): SpaServiceType[] {
    return this.services.filter(service => 
      service.features?.some(f => f.toLowerCase().includes(feature.toLowerCase()))
    );
  }

  getDurationRanges(): { min: number; max: number; label: string; count: number }[] {
    const ranges = [
      { min: 0, max: 45, label: 'До 45 минут' },
      { min: 45, max: 90, label: '45 - 90 минут' },
      { min: 90, max: 150, label: '90 - 150 минут' },
      { min: 150, max: 999, label: 'Более 150 минут' }
    ];

    return ranges.map(range => ({
      ...range,
      count: this.getServicesByDuration(range.max).length
    }));
  }

  getMassageServices(): SpaServiceType[] {
    return this.getServicesByCategory('Массажные процедуры');
  }

  getBathServices(): SpaServiceType[] {
    return this.getServicesByCategory('Банные процедуры');
  }

  getSalonServices(): SpaServiceType[] {
    return this.getServicesByCategory('Салонные услуги');
  }

  getCareServices(): SpaServiceType[] {
    return this.getServicesByCategory('Уходовые процедуры');
  }

  getApparatusServices(): SpaServiceType[] {
    return this.getServicesByCategory('Аппаратные процедуры');
  }
}

export const spaService = new SpaService();
export default spaService; 