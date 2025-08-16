const fs = require('fs');
const path = require('path');

function parseMenu(content, filename) {
  const lines = content.split('\n').map(line => line.trim()).filter(line => line);
  const menu = {
    source: filename,
    categories: []
  };
  
  let currentCategory = null;
  let currentSubcategory = null;
  
  for (let line of lines) {
    // Skip empty lines
    if (!line) continue;
    
    // Category headers (all caps, no price)
    if (line === line.toUpperCase() && !line.match(/\d+$/)) {
      currentCategory = {
        id: line.toLowerCase().replace(/\s+/g, '-'),
        name: line,
        items: [],
        subcategories: []
      };
      menu.categories.push(currentCategory);
      currentSubcategory = null;
      continue;
    }
    
    // Price pattern: ends with digits
    const priceMatch = line.match(/^(.+?)\s+(\d+)$/);
    if (priceMatch && currentCategory) {
      const [, itemText, price] = priceMatch;
      
      // Extract portion info
      const portionMatch = itemText.match(/^(.*?)\s*\(([^)]+)\)\s*(.*)$/);
      let name, portion, description;
      
      if (portionMatch) {
        name = portionMatch[1].trim();
        portion = portionMatch[2].trim();
        description = portionMatch[3].trim() || null;
      } else {
        name = itemText.trim();
        portion = null;
        description = null;
      }
      
      const item = {
        id: name.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-'),
        name: name,
        portion: portion,
        description: description,
        price: parseInt(price),
        tags: []
      };
      
      // Add dietary tags based on name/description
      if (name.includes('без глютена') || description?.includes('без глютена')) {
        item.tags.push('gluten-free');
      }
      if (name.includes('вегетарианск') || description?.includes('вегетарианск')) {
        item.tags.push('vegetarian');
      }
      
      currentCategory.items.push(item);
    }
    // Subcategory or description lines
    else if (currentCategory && !line.match(/\d+$/)) {
      // This is likely a description or subcategory
      if (line.includes(':')) {
        currentSubcategory = {
          name: line,
          items: []
        };
        currentCategory.subcategories.push(currentSubcategory);
      }
    }
  }
  
  return menu;
}

// Parse menu.txt
const menuContent = fs.readFileSync('../menu.txt', 'utf8');
const menuData = parseMenu(menuContent, 'menu.txt');

// Parse menu_two.txt  
const menuTwoContent = fs.readFileSync('../menu_two.txt', 'utf8');
const menuTwoData = parseMenu(menuTwoContent, 'menu_two.txt');

// Save to JSON files
fs.writeFileSync('../apps/web/public/data/menu.json', JSON.stringify(menuData, null, 2));
fs.writeFileSync('../apps/web/public/data/menu-full.json', JSON.stringify(menuTwoData, null, 2));

console.log('✅ Menu parsing complete!');
console.log(`��� menu.txt: ${menuData.categories.length} categories`);
console.log(`��� menu_two.txt: ${menuTwoData.categories.length} categories`);

// Print summary
menuData.categories.forEach(cat => {
  console.log(`  - ${cat.name}: ${cat.items.length} items`);
});
