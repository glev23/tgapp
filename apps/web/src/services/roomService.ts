import { Room, ParsedData } from '../types';
import { getImagePlaceholder, generateId } from './dataParser';

class RoomService {
  private rooms: Room[] = [];
  private loaded = false;
  private imageMap: Record<string, string> = {};

  async loadImageMap() {
    try {
      const response = await fetch('/data/room-images.json');
      if (response.ok) {
        this.imageMap = await response.json();
        console.log('Room image map loaded:', this.imageMap);
      }
    } catch (error) {
      console.warn('Failed to load room image map, using placeholders');
    }
  }

  getImageFor(roomName: string): string {
    return this.imageMap[roomName] || this.getPlaceholderImage(roomName);
  }

  getPlaceholderImage(roomName: string): string {
    return '/images/room-placeholder.svg';
  }

  async loadRooms(): Promise<ParsedData<Room>> {
    if (this.loaded) {
      return { success: true, data: this.rooms };
    }

    try {
      // Load image mapping first
      await this.loadImageMap();

      // Room data based on database/nomera structure
      this.rooms = [
        {
          id: generateId('room', 'Individual'),
          name: 'Individual',
          category: 'Individual',
          description: 'Компактный номер в классическом стиле для одиночных поездок. Продуманная планировка, тишина и комфорт для работы и отдыха.',
          area: '23–25 м²',
          capacity: 1,
          maxGuests: 1,
          bedType: '1 Queen',
          view: 'на город (вариативно)',
          targetGuest: 'соло‑путешественники, краткие деловые визиты',
          priceRange: '12000-15000',
          amenities: ['рабочее место', 'Wi‑Fi', 'ЖК‑TV ~42″', 'чайная станция/кофемашина', 'мини‑бар', 'сейф', 'климат‑контроль'],
          bathroom: 'ванна/душ, халаты и тапочки, косметика премиум, фен',
          features: ['компактный', 'деловой', 'классический стиль'],
          imageUrl: this.getImageFor('Individual')
        },
        {
          id: generateId('room', 'Collection Superior'),
          name: 'Collection Superior',
          category: 'Collection Superior',
          description: 'Элегантные номера с современным дизайном и панорамными окнами. Идеальное сочетание комфорта и функциональности для деловых и туристических поездок.',
          area: '28–32 м²',
          capacity: 2,
          maxGuests: 2,
          bedType: '1 King или 2 Twin',
          view: 'на город',
          targetGuest: 'деловые путешественники, пары, городские туристы',
          priceRange: '18000-22000',
          amenities: ['рабочая зона', 'Wi‑Fi', 'Smart TV 50″', 'кофемашина Nespresso', 'мини‑бар премиум', 'сейф', 'климат‑контроль', 'панорамные окна'],
          bathroom: 'дождевой душ, мраморная отделка, халаты Frette, косметика L\'Occitane',
          features: ['панорамные окна', 'современный дизайн', 'премиум'],
          imageUrl: this.getImageFor('Collection Superior')
        },
        {
          id: generateId('room', 'Collection Superior (вид на город)'),
          name: 'Collection Superior (вид на город)',
          category: 'Collection Superior (вид на город)',
          description: 'Номера с захватывающими видами на городскую панораму. Расположены на высоких этажах с большими окнами от пола до потолка.',
          area: '28–32 м²',
          capacity: 2,
          maxGuests: 2,
          bedType: '1 King',
          view: 'на город с высоких этажей',
          targetGuest: 'романтические пары, ценители видов, фотографы',
          priceRange: '20000-25000',
          amenities: ['рабочая зона у окна', 'Wi‑Fi', 'Smart TV 55″', 'кофемашина Nespresso', 'мини‑бар премиум', 'сейф', 'климат‑контроль', 'панорамные окна'],
          bathroom: 'дождевой душ, мраморная отделка, халаты Frette, косметика L\'Occitane, окно в ванной',
          features: ['городской вид', 'высокие этажи', 'панорамные окна', 'романтичный'],
          imageUrl: this.getImageFor('Collection Superior (вид на город)')
        },
        {
          id: generateId('room', 'Collection Superior (вид на Белый дом)'),
          name: 'Collection Superior (вид на Белый дом)',
          category: 'Collection Superior (вид на Белый дом)',
          description: 'Эксклюзивные номера с видом на знаковую архитектуру города. Уникальное расположение позволяет наслаждаться историческими достопримечательностями.',
          area: '28–32 м²',
          capacity: 2,
          maxGuests: 2,
          bedType: '1 King',
          view: 'на Белый дом',
          targetGuest: 'VIP гости, любители архитектуры, особые события',
          priceRange: '25000-30000',
          amenities: ['рабочая зона у окна', 'Wi‑Fi', 'Smart TV 55″', 'кофемашина Nespresso', 'мини‑бар премиум', 'сейф', 'климат‑контроль', 'панорамные окна', 'бинокль'],
          bathroom: 'дождевой душ, мраморная отделка, халаты Frette, косметика L\'Occitane, окно в ванной',
          features: ['эксклюзивный вид', 'историческая панорама', 'VIP', 'уникальное расположение'],
          imageUrl: this.getImageFor('Collection Superior (вид на Белый дом)')
        },
        {
          id: generateId('room', 'Collection Premium'),
          name: 'Collection Premium',
          category: 'Collection Premium',
          description: 'Просторные номера повышенной комфортности с отдельной зоной отдыха. Идеальны для продолжительного пребывания и размещения дополнительных гостей.',
          area: '35–40 м²',
          capacity: 3,
          maxGuests: 3,
          bedType: '1 King + диван-кровать',
          view: 'на город и реку',
          targetGuest: 'семьи с детьми, длительное пребывание, деловые группы',
          priceRange: '28000-35000',
          amenities: ['отдельная зона отдыха', 'рабочий стол', 'Wi‑Fi', 'Smart TV 65″', 'кофемашина Nespresso', 'мини‑бар премиум', 'сейф большой', 'климат‑контроль', 'диван-кровать'],
          bathroom: 'отдельная ванна и душ, двойная раковина, халаты Frette, косметика L\'Occitane, туалетные принадлежности премиум',
          features: ['просторный', 'отдельная зона отдыха', 'семейный', 'длительное пребывание'],
          imageUrl: this.getImageFor('Collection Premium')
        },
        {
          id: generateId('room', 'Collection Executive'),
          name: 'Collection Executive',
          category: 'Collection Executive',
          description: 'Номера для руководителей с расширенной рабочей зоной и эксклюзивными привилегиями. Включен доступ в Executive Lounge.',
          area: '40–45 м²',
          capacity: 2,
          maxGuests: 2,
          bedType: '1 King',
          view: 'на город с угловых окон',
          targetGuest: 'топ-менеджеры, VIP клиенты, деловые переговоры',
          priceRange: '45000-55000',
          amenities: ['большая рабочая зона', 'переговорная зона', 'Wi‑Fi премиум', 'Smart TV 65″', 'кофемашина De\'Longhi', 'мини‑бар премиум', 'сейф большой', 'климат‑контроль', 'доступ в Executive Lounge'],
          bathroom: 'джакузи, отдельный душ, двойная раковина, халаты Frette, косметика Hermès, VIP туалетные принадлежности',
          features: ['Executive Lounge', 'деловой', 'переговорная зона', 'VIP привилегии'],
          imageUrl: this.getImageFor('Collection Executive')
        },
        {
          id: generateId('room', 'Collection Suite'),
          name: 'Collection Suite',
          category: 'Collection Suite',
          description: 'Элегантные сьюты с отдельной спальней и просторной гостиной. Идеальны для особых мероприятий и VIP размещения.',
          area: '60–70 м²',
          capacity: 4,
          maxGuests: 4,
          bedType: '1 King + гостиная с диваном-кроватью',
          view: 'на город и реку с двух сторон',
          targetGuest: 'семьи VIP, особые мероприятия, долгосрочное пребывание',
          priceRange: '65000-80000',
          amenities: ['отдельная спальня', 'просторная гостиная', 'обеденная зона', 'рабочий кабинет', 'Wi‑Fi премиум', 'Smart TV в спальне и гостиной', 'кофемашина De\'Longhi', 'винный холодильник', 'сейф большой'],
          bathroom: 'мраморная ванна, отдельный душ, двойная раковина, халаты Frette, косметика Hermès, VIP аменити',
          features: ['отдельная спальня', 'просторная гостиная', 'VIP', 'особые мероприятия'],
          imageUrl: this.getImageFor('Collection Suite')
        },
        {
          id: generateId('room', 'Suite'),
          name: 'Suite',
          category: 'Suite',
          description: 'Классические сьюты с зонированным пространством. Сочетают уют спальни с функциональностью рабочего пространства.',
          area: '55–65 м²',
          capacity: 3,
          maxGuests: 3,
          bedType: '1 King + зона отдыха',
          view: 'на город',
          targetGuest: 'деловые путешественники, небольшие группы, комфортное размещение',
          priceRange: '50000-65000',
          amenities: ['зонированное пространство', 'рабочая зона', 'зона отдыха', 'Wi‑Fi', 'Smart TV 55″', 'кофемашина Nespresso', 'мини‑бар премиум', 'сейф'],
          bathroom: 'ванна, отдельный душ, халаты, косметика премиум',
          features: ['зонированное пространство', 'классический', 'функциональный'],
          imageUrl: this.getImageFor('Suite')
        },
        {
          id: generateId('room', 'Executive Suite'),
          name: 'Executive Suite',
          category: 'Executive Suite',
          description: 'Роскошные сьюты с отдельными зонами для работы и отдыха. Включают все привилегии Executive Lounge и персональный сервис.',
          area: '80–95 м²',
          capacity: 4,
          maxGuests: 4,
          bedType: '1 King + гостиная',
          view: 'панорамный на город',
          targetGuest: 'руководители компаний, VIP делегации, особые мероприятия',
          priceRange: '85000-110000',
          amenities: ['отдельная спальня', 'большая гостиная', 'рабочий кабинет', 'обеденная зона на 6 персон', 'Wi‑Fi премиум', 'Smart TV 75″', 'аудиосистема Bose', 'винный холодильник', 'персональный сервис'],
          bathroom: 'джакузи с видом, steam shower, двойная раковина, гардеробная, халаты Frette, косметика Hermès',
          features: ['персональный сервис', 'Executive Lounge', 'панорамный вид', 'роскошный'],
          imageUrl: this.getImageFor('Executive Suite')
        },
        {
          id: generateId('room', 'Romantic Suite'),
          name: 'Romantic Suite',
          category: 'Romantic Suite',
          description: 'Романтические сьюты с особым дизайном для незабываемых моментов. Включают джакузи, камин и террасу с видом на закат.',
          area: '70–80 м²',
          capacity: 2,
          maxGuests: 2,
          bedType: '1 King с балдахином',
          view: 'на реку и закат',
          targetGuest: 'романтические пары, медовый месяц, годовщины, предложения руки и сердца',
          priceRange: '75000-95000',
          amenities: ['романтический дизайн', 'камин', 'терраса', 'джакузи с видом', 'аудиосистема', 'Wi‑Fi', 'Smart TV', 'винный холодильник', 'романтическое освещение'],
          bathroom: 'джакузи на двоих с видом на реку, дождевой душ, двойная раковина, свечи, романтические аменити',
          features: ['романтический', 'камин', 'терраса', 'джакузи с видом', 'особые моменты'],
          imageUrl: this.getImageFor('Romantic Suite')
        },
        {
          id: generateId('room', 'Grand Residential Suite'),
          name: 'Grand Residential Suite',
          category: 'Grand Residential Suite',
          description: 'Апартаменты-резиденции с полноценной кухней и домашней атмосферой. Идеальны для долгосрочного проживания и размещения семей.',
          area: '120–140 м²',
          capacity: 6,
          maxGuests: 6,
          bedType: '2 спальни (King + Queen)',
          view: 'панорамный на город и реку',
          targetGuest: 'долгосрочное проживание, большие семьи, корпоративное жилье',
          priceRange: '150000-200000',
          amenities: ['2 отдельные спальни', 'большая гостиная', 'полноценная кухня', 'обеденная зона на 8 персон', 'прачечная', 'Wi‑Fi премиум', 'Smart TV в каждой комнате', 'аудиосистема во всех зонах', 'личный консьерж'],
          bathroom: '2 ванные комнаты с джакузи и душем, гардеробные в каждой спальне, премиум аменити',
          features: ['2 спальни', 'полноценная кухня', 'долгосрочное проживание', 'семейный', 'личный консьерж'],
          imageUrl: this.getImageFor('Grand Residential Suite')
        },
        {
          id: generateId('room', 'Presidential Suite'),
          name: 'Presidential Suite',
          category: 'Presidential Suite',
          description: 'Флагманские апартаменты отеля с непревзойденным уровнем роскоши и сервиса. Включают личного дворецкого, шеф-повара и водителя.',
          area: '200+ м²',
          capacity: 8,
          maxGuests: 8,
          bedType: '3 спальни (King + Queen + Twin)',
          view: 'эксклюзивная панорама на 360°',
          targetGuest: 'президенты, королевские семьи, звезды, эксклюзивные мероприятия',
          priceRange: 'по запросу',
          amenities: ['3 отдельные спальни', 'огромная гостиная', 'столовая на 12 персон', 'рабочий кабинет', 'библиотека', 'кухня с шеф-поваром', 'винный погреб', 'сауна', 'терраса', 'личный дворецкий 24/7'],
          bathroom: '3 роскошные ванные с джакузи, steam room, гардеробные, SPA аменити',
          features: ['личный дворецкий', '360° панорама', 'шеф-повар', 'винный погреб', 'эксклюзивный сервис'],
          imageUrl: this.getImageFor('Presidential Suite')
        }
      ] as any

      this.loaded = true;
      return {
        data: this.rooms,
        success: true
      };
    } catch (error) {
      return {
        data: [],
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  getRooms(): Room[] {
    return this.rooms;
  }

  getRoomById(id: string): Room | undefined {
    return this.rooms.find(room => room.id === id);
  }

  getRoomsByCategory(category: string): Room[] {
    return this.rooms.filter(room => room.category === category);
  }

  getRoomsByCapacity(capacity: number): Room[] {
    return this.rooms.filter(room => room.maxGuests >= capacity);
  }

  getRoomsByPriceRange(minPrice: number, maxPrice: number): Room[] {
    return this.rooms.filter(room => {
      if (room.priceRange === 'по запросу') return false;
      
      const [min, max] = room.priceRange.split('-').map(p => parseInt(p.replace(/\D/g, '')));
      return min >= minPrice && max <= maxPrice;
    });
  }

  searchRooms(query: string): Room[] {
    const searchTerm = query.toLowerCase();
    return this.rooms.filter(room =>
      room.name.toLowerCase().includes(searchTerm) ||
      room.description.toLowerCase().includes(searchTerm) ||
      room.features?.some(feature => feature.toLowerCase().includes(searchTerm)) ||
      room.amenities.some(amenity => amenity.toLowerCase().includes(searchTerm))
    );
  }

  private getPlaceholderImage(roomType: string): string {
    return getImagePlaceholder('room');
  }

  getCategories(): string[] {
    return Array.from(new Set(this.rooms.map(room => room.category)));
  }

  getFeaturedRooms(limit = 4): Room[] {
    // Return diverse selection of featured rooms
    const featured = [
      this.rooms.find(r => r.name === 'Collection Superior'),
      this.rooms.find(r => r.name === 'Collection Suite'),
      this.rooms.find(r => r.name === 'Executive Suite'),
      this.rooms.find(r => r.name === 'Presidential Suite')
    ].filter(Boolean) as Room[];

    return featured.slice(0, limit);
  }

  getRoomsByView(view: string): Room[] {
    return this.rooms.filter(room => 
      room.view.toLowerCase().includes(view.toLowerCase())
    );
  }

  getPriceRanges(): { min: number; max: number; label: string; count: number }[] {
    const ranges = [
      { min: 0, max: 20000, label: 'До 20,000 ₽' },
      { min: 20000, max: 50000, label: '20,000 - 50,000 ₽' },
      { min: 50000, max: 100000, label: '50,000 - 100,000 ₽' },
      { min: 100000, max: Infinity, label: 'От 100,000 ₽' }
    ];

    return ranges.map(range => ({
      ...range,
      count: this.getRoomsByPriceRange(range.min, range.max === Infinity ? 999999 : range.max).length
    }));
  }

  getAmenityGroups(): { [group: string]: string[] } {
    const amenityGroups: { [group: string]: Set<string> } = {
      'Технологии': new Set(),
      'Комфорт': new Set(),
      'Сервис': new Set(),
      'Ванная комната': new Set()
    };

    this.rooms.forEach(room => {
      room.amenities.forEach(amenity => {
        if (amenity.includes('TV') || amenity.includes('Wi‑Fi') || amenity.includes('аудиосистема')) {
          amenityGroups['Технологии'].add(amenity);
        } else if (amenity.includes('сейф') || amenity.includes('климат') || amenity.includes('мини‑бар')) {
          amenityGroups['Комфорт'].add(amenity);
        } else if (amenity.includes('консьерж') || amenity.includes('сервис') || amenity.includes('дворецкий')) {
          amenityGroups['Сервис'].add(amenity);
        }
      });
    });

    return Object.fromEntries(
      Object.entries(amenityGroups).map(([group, set]) => [group, Array.from(set)])
    );
  }
}

export const roomService = new RoomService();
export default roomService; 