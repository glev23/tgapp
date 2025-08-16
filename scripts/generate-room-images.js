const fs = require('fs');
const path = require('path');

// Source directory (database)
const sourceDir = path.join(__dirname, '../database/nomera');
// Destination directory (public)
const destDir = path.join(__dirname, '../apps/web/public/images/rooms');
// Mapping file
const mappingFile = path.join(__dirname, '../apps/web/public/data/room-images.json');

// Ensure destination directory exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Room categories from the database
const roomCategories = [
  'Collection Executive',
  'Collection Premium',
  'Collection Suite',
  'Collection Superior',
  'Collection Superior (вид на Белый дом)',
  'Collection Superior (вид на город)',
  'Executive Suite',
  'Grand Residential Suite',
  'Individual',
  'Presidential Suite',
  'Romantic Suite',
  'Suite'
];

const imageMap = {};

// Function to copy image and update mapping
function copyImage(roomName, sourcePath, destPath) {
  try {
    // Create a safe filename
    const safeName = roomName.toLowerCase()
      .replace(/[^a-z0-9а-яё\s]/gi, '')
      .replace(/\s+/g, '-')
      .replace(/[()]/g, '');
    
    const finalDestPath = path.join(destDir, `${safeName}.jpg`);
    
    // Copy the image
    fs.copyFileSync(sourcePath, finalDestPath);
    
    // Update mapping
    imageMap[roomName] = `/images/rooms/${safeName}.jpg`;
    
    console.log(`✅ Copied: ${roomName} -> ${finalDestPath}`);
  } catch (error) {
    console.error(`❌ Error copying ${roomName}:`, error.message);
  }
}

// Process each room category directory
roomCategories.forEach(roomName => {
  const roomDir = path.join(sourceDir, roomName);
  
  if (fs.existsSync(roomDir)) {
    // Look for image files
    const files = fs.readdirSync(roomDir);
    const imageFile = files.find(file => 
      /\.(jpg|jpeg|png|webp)$/i.test(file)
    );
    
    if (imageFile) {
      const sourcePath = path.join(roomDir, imageFile);
      copyImage(roomName, sourcePath, destDir);
    } else {
      console.log(`⚠️  No image found for: ${roomName}`);
      // Use placeholder
      imageMap[roomName] = '/images/room-placeholder.svg';
    }
  } else {
    console.log(`⚠️  Directory not found: ${roomName}`);
    // Use placeholder
    imageMap[roomName] = '/images/room-placeholder.svg';
  }
});

// Write mapping file
fs.writeFileSync(mappingFile, JSON.stringify(imageMap, null, 2));
console.log(`\n📝 Image mapping saved to: ${mappingFile}`);

// Create placeholder SVG if it doesn't exist
const placeholderPath = path.join(__dirname, '../apps/web/public/images/room-placeholder.svg');
if (!fs.existsSync(placeholderPath)) {
  const placeholderSvg = `<svg width="400" height="300" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="300" fill="url(#gradient)"/>
    <defs>
      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#4facfe;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#00f2fe;stop-opacity:1" />
      </linearGradient>
    </defs>
    <text x="200" y="150" text-anchor="middle" fill="white" font-family="Arial" font-size="24" font-weight="bold">ROOM</text>
  </svg>`;
  
  fs.writeFileSync(placeholderPath, placeholderSvg);
  console.log(`📝 Placeholder SVG created: ${placeholderPath}`);
}

console.log('\n🎉 Room image generation complete!');
console.log(`📊 Total rooms processed: ${Object.keys(imageMap).length}`); 