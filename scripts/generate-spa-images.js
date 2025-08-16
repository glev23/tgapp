const fs = require('fs');
const path = require('path');

// Source directory (database)
const sourceDir = path.join(__dirname, '../database/spa&welness');
// Destination directory (public)
const destDir = path.join(__dirname, '../apps/web/public/images/spa');
// Mapping file
const mappingFile = path.join(__dirname, '../apps/web/public/data/spa-images.json');

// Ensure destination directory exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Read spa services from spaService.ts to get the mapping
const spaServices = [
  'Тайский массаж',
  'Спортивный массаж', 
  'Медицинский массаж',
  'Лимфодренажный массаж',
  'Массаж лица',
  'Гидромассаж',
  'Stone-терапия (горячие камни)',
  'Icoone — аппаратный массаж',
  'Парение в русской бане',
  'Детокс-программы (баня и хамам)',
  'Королевское бритье',
  'Лимфодренажный массаж',
  'Маникюр и педикюр (в 4 руки)',
  'Массаж лица',
  'Медицинский массаж',
  'Обертывание',
  'Парение в русской бане',
  'Парикмахерские услуги',
  'Скрабирование',
  'Спортивный массаж',
  'Тайский массаж'
];

const imageMap = {};

// Function to copy image and update mapping
function copyImage(serviceName, sourcePath, destPath) {
  try {
    // Create a safe filename
    const safeName = serviceName.toLowerCase()
      .replace(/[^a-z0-9а-яё\s]/gi, '')
      .replace(/\s+/g, '-');
    
    const finalDestPath = path.join(destDir, `${safeName}.jpg`);
    
    // Copy the image
    fs.copyFileSync(sourcePath, finalDestPath);
    
    // Update mapping
    imageMap[serviceName] = `/images/spa/${safeName}.jpg`;
    
    console.log(`✅ Copied: ${serviceName} -> ${finalDestPath}`);
  } catch (error) {
    console.error(`❌ Error copying ${serviceName}:`, error.message);
  }
}

// Process each spa service directory
spaServices.forEach(serviceName => {
  const serviceDir = path.join(sourceDir, serviceName);
  
  if (fs.existsSync(serviceDir)) {
    // Look for image files
    const files = fs.readdirSync(serviceDir);
    const imageFile = files.find(file => 
      /\.(jpg|jpeg|png|webp)$/i.test(file)
    );
    
    if (imageFile) {
      const sourcePath = path.join(serviceDir, imageFile);
      copyImage(serviceName, sourcePath, destDir);
    } else {
      console.log(`⚠️  No image found for: ${serviceName}`);
      // Use placeholder
      imageMap[serviceName] = '/images/spa-placeholder.svg';
    }
  } else {
    console.log(`⚠️  Directory not found: ${serviceName}`);
    // Use placeholder
    imageMap[serviceName] = '/images/spa-placeholder.svg';
  }
});

// Write mapping file
fs.writeFileSync(mappingFile, JSON.stringify(imageMap, null, 2));
console.log(`\n📝 Image mapping saved to: ${mappingFile}`);

// Create placeholder SVG if it doesn't exist
const placeholderPath = path.join(__dirname, '../apps/web/public/images/spa-placeholder.svg');
if (!fs.existsSync(placeholderPath)) {
  const placeholderSvg = `<svg width="400" height="300" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="300" fill="url(#gradient)"/>
    <defs>
      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
      </linearGradient>
    </defs>
    <text x="200" y="150" text-anchor="middle" fill="white" font-family="Arial" font-size="24" font-weight="bold">SPA</text>
  </svg>`;
  
  fs.writeFileSync(placeholderPath, placeholderSvg);
  console.log(`📝 Placeholder SVG created: ${placeholderPath}`);
}

console.log('\n🎉 SPA image generation complete!');
console.log(`📊 Total services processed: ${Object.keys(imageMap).length}`); 