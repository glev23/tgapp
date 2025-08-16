const fs = require('fs');

function parseHotelInfo(content, filename) {
  const lines = content.split('\n').map(line => line.trim());
  
  const hotel = {
    source: filename,
    name: "Radisson Collection Hotel, Moscow",
    description: {
      short: "",
      detailed: ""
    },
    rooms: [],
    amenities: [],
    spa: {
      schedule: {},
      rules: [],
      services: []
    },
    restaurants: [],
    checkin: {},
    children: {},
    parking: {},
    security: [],
    languages: [],
    contacts: {},
    conferences: [],
    transport: {},
    services: []
  };
  
  let currentSection = '';
  let currentText = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (!line) {
      if (currentText) {
        processSection(hotel, currentSection, currentText);
        currentText = '';
      }
      continue;
    }
    
    // Detect section headers
    if (line.includes('Описание отеля')) {
      currentSection = 'description';
      currentText = '';
    } else if (line.includes('Категории и описание номеров')) {
      currentSection = 'rooms';
      currentText = '';
    } else if (line.includes('SPA C Wellness') || line.includes('Radisson Collection Fitness & Spa')) {
      currentSection = 'spa';
      currentText = '';
    } else if (line.includes('Список ресторанов')) {
      currentSection = 'restaurants';
      currentText = '';
    } else if (line.includes('Правила заселения')) {
      currentSection = 'checkin';
      currentText = '';
    } else if (line.includes('Условия проживания с детьми')) {
      currentSection = 'children';
      currentText = '';
    } else if (line.includes('Наличие парковки')) {
      currentSection = 'parking';
      currentText = '';
    } else if (line.includes('Безопасность')) {
      currentSection = 'security';
      currentText = '';
    } else if (line.includes('Языки обслуживания')) {
      currentSection = 'languages';
      currentText = '';
    } else if (line.includes('Трансферы') || line.includes('аренда авто')) {
      currentSection = 'transport';
      currentText = '';
    } else {
      currentText += line + '\n';
    }
  }
  
  // Process final section
  if (currentText) {
    processSection(hotel, currentSection, currentText);
  }
  
  return hotel;
}

function processSection(hotel, section, text) {
  const lines = text.split('\n').filter(line => line.trim());
  
  switch (section) {
    case 'description':
      // Combine description lines
      hotel.description.detailed = lines.join(' ').trim();
      hotel.description.short = hotel.description.detailed.substring(0, 200) + '...';
      break;
      
    case 'rooms':
      lines.forEach(line => {
        if (line.startsWith('o ')) {
          const room = parseRoomInfo(line);
          if (room) hotel.rooms.push(room);
        }
      });
      break;
      
    case 'restaurants':
      lines.forEach(line => {
        if (line.includes('Кухня:') || line.includes('Средний')) {
          const restaurant = parseRestaurantInfo(line);
          if (restaurant) hotel.restaurants.push(restaurant);
        }
      });
      break;
      
    case 'spa':
      hotel.spa.description = lines.join(' ');
      break;
      
    case 'checkin':
      lines.forEach(line => {
        if (line.includes('Check-in')) {
          hotel.checkin.checkin = line.split(':')[1]?.trim() || 'с 15:00';
        }
        if (line.includes('Check-out')) {
          hotel.checkin.checkout = line.split(':')[1]?.trim() || '12:00';
        }
      });
      break;
      
    case 'languages':
      hotel.languages = ['Русский', 'Английский'];
      break;
  }
}

function parseRoomInfo(line) {
  // Extract room type and details
  const match = line.match(/o\s+(.+?),\s*(\d+-?\d*)\s*m²,?\s*(.+)/);
  if (!match) return null;
  
  const [, name, size, details] = match;
  
  return {
    id: name.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-'),
    name: name.trim(),
    size: size.trim(),
    details: details.trim(),
    occupancy: details.includes('одноместное') ? 1 : 2,
    beds: extractBeds(details)
  };
}

function parseRestaurantInfo(line) {
  // Basic restaurant parsing - can be enhanced
  if (line.includes('-')) {
    const parts = line.split('-');
    return {
      id: parts[0].trim().toLowerCase().replace(/\s+/g, '-'),
      name: parts[0].trim(),
      description: parts[1]?.trim() || ''
    };
  }
  return null;
}

function extractBeds(details) {
  const beds = [];
  if (details.includes('King')) beds.push('King');
  if (details.includes('Twin')) beds.push('Twin');  
  if (details.includes('Queen')) beds.push('Queen');
  return beds;
}

// Parse both info files
const infoContent = fs.readFileSync('../info.txt', 'utf8');
const hotelData = parseHotelInfo(infoContent, 'info.txt');

const infoTwoContent = fs.readFileSync('../info_two.txt', 'utf8');
const hotelMarketingData = parseHotelInfo(infoTwoContent, 'info_two.txt');

// Combine data
const combinedHotelData = {
  ...hotelData,
  marketing: hotelMarketingData
};

// Save to JSON
fs.writeFileSync('../apps/web/public/data/hotel.json', JSON.stringify(combinedHotelData, null, 2));

console.log('✅ Hotel info parsing complete!');
console.log(`��� Rooms: ${hotelData.rooms.length} categories`);
console.log(`���️ Restaurants: ${hotelData.restaurants.length} found`);
console.log(`��� Description: ${hotelData.description.detailed.length} chars`);
