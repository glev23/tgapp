const fs = require('fs');
const path = require('path');

// Dietary mapping based on food names and categories
const dietaryMapping = {
  // Vegetarian foods
  vegetarian: [
    'йогурт', 'фрукт', 'овощ', 'салат', 'каша', 'хлопья', 'мюсли', 'гранола',
    'клубника', 'малина', 'яблоко', 'банан', 'апельсин', 'лимон', 'гречка',
    'рис', 'картофель', 'морковь', 'огурцы', 'помидоры', 'зелень', 'орехи',
    'семена', 'мед', 'варенье', 'джем', 'мороженое', 'шоколад', 'конфеты'
  ],
  
  // Lactose free
  lactoseFree: [
    'без молока', 'веган', 'овощной', 'фруктовый', 'на воде', 'миндальное молоко',
    'соевое молоко', 'кокосовое молоко', 'овсяное молоко'
  ],
  
  // Gluten free
  glutenFree: [
    'без глютена', 'рис', 'гречка', 'киноа', 'кукуруза', 'картофель',
    'овощи', 'фрукты', 'орехи', 'семена', 'яйца', 'рыба', 'мясо'
  ],
  
  // Spicy foods
  spicy: [
    'острый', 'чили', 'карри', 'перец', 'имбирь', 'чеснок', 'горчица',
    'хрен', 'васаби', 'табаско', 'кайенский', 'жгучий'
  ],
  
  // Halal foods
  halal: [
    'халяль', 'курица', 'индейка', 'баранина', 'говядина', 'телятина',
    'рыба', 'морепродукты', 'яйца', 'молоко', 'сыр', 'йогурт'
  ]
};

// Category mapping for better organization
const categoryMapping = {
  'ЗАВТРАК А ЛЯ КАРТ': 'breakfast',
  'КАШИ, ХЛОПЬЯ И ЙОГУРТЫ': 'breakfast',
  'ХОЛОДНЫЕ ЗАКУСКИ': 'cold-appetizers',
  'ГОРЯЧИЕ ЗАКУСКИ': 'hot-appetizers',
  'СУПЫ': 'soups',
  'ОСНОВНЫЕ БЛЮДА': 'main-dishes',
  'ДЕСЕРТЫ И СВЕЖАЯ ВЫПЕЧКА': 'desserts',
  'НАПИТКИ': 'beverages',
  'АЛКОГОЛЬНЫЕ НАПИТКИ': 'beverages'
};

function checkDietaryRequirements(name, category) {
  const nameLower = name.toLowerCase();
  const categoryLower = category.toLowerCase();
  
  const dietary = {};
  
  // Check each dietary requirement
  Object.entries(dietaryMapping).forEach(([requirement, keywords]) => {
    dietary[requirement] = keywords.some(keyword => 
      nameLower.includes(keyword.toLowerCase())
    );
  });
  
  // Special rules based on category
  if (categoryLower.includes('десерт') || categoryLower.includes('фрукт')) {
    dietary.vegetarian = true;
  }
  
  if (categoryLower.includes('овощ') || categoryLower.includes('салат')) {
    dietary.vegetarian = true;
    dietary.lactoseFree = true;
  }
  
  if (categoryLower.includes('каша') || categoryLower.includes('хлопья')) {
    dietary.vegetarian = true;
  }
  
  return dietary;
}

function enhanceMenuData() {
  try {
    // Read existing menu data
    const menuPath = path.join(__dirname, '../apps/web/public/data/menu-full.json');
    const menuData = JSON.parse(fs.readFileSync(menuPath, 'utf8'));
    
    console.log('Enhancing menu data with dietary information...');
    
    // Process each category
    menuData.categories.forEach(category => {
      if (category.items && Array.isArray(category.items)) {
        category.items.forEach(item => {
          // Add dietary information
          item.dietary = checkDietaryRequirements(item.name, category.name);
          
          // Add dietaryInfo for backward compatibility
          item.dietaryInfo = item.dietary;
          
          // Add category mapping
          item.categoryId = categoryMapping[category.name] || 'other';
        });
      }
    });
    
    // Write enhanced data back
    const outputPath = path.join(__dirname, '../apps/web/public/data/menu-enhanced.json');
    fs.writeFileSync(outputPath, JSON.stringify(menuData, null, 2));
    
    console.log(`Enhanced menu saved to: ${outputPath}`);
    console.log('Menu items enhanced with dietary information and category mapping');
    
    // Also update the original file
    fs.writeFileSync(menuPath, JSON.stringify(menuData, null, 2));
    console.log('Original menu-full.json updated');
    
  } catch (error) {
    console.error('Error enhancing menu data:', error);
  }
}

// Run the enhancement
enhanceMenuData(); 