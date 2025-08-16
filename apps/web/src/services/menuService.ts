import { MenuItem, MenuCategory, ParsedData, DietaryInfo } from '../types';
import { parseMenuData, parseMenuCategories, getImagePlaceholder } from './dataParser';

/**
 * Menu Service
 * Handles menu data operations and filtering
 */

class MenuService {
  private menuItems: MenuItem[] = [];
  private categories: MenuCategory[] = [];
  private loaded = false;

  async loadMenu(): Promise<ParsedData<MenuItem>> {
    if (this.loaded) {
      return { data: this.menuItems, success: true };
    }

    try {
      console.log('Loading menu data...')
      const result = await parseMenuData();
      console.log('Menu data loaded:', result)
      
      if (result.success) {
        this.menuItems = result.data.map(item => ({
          ...item,
          imageUrl: item.imageUrl || this.getPlaceholderImage(item.id)
        }));
        
        // Load categories after menu items are loaded
        this.categories = parseMenuCategories();
        console.log('Categories loaded:', this.categories)
        
        this.loaded = true;
      }

      return { 
        data: this.menuItems, 
        success: result.success, 
        error: result.error 
      };
    } catch (error) {
      console.error('Error in loadMenu:', error)
      return {
        data: [],
        success: false,
        error: error instanceof Error ? error.message : 'Failed to load menu'
      };
    }
  }

  getMenuItems(): MenuItem[] {
    return this.menuItems;
  }

  getMenuItemById(id: string): MenuItem | undefined {
    return this.menuItems.find(item => item.id === id);
  }

  getMenuItemsByCategory(categoryId: string): MenuItem[] {
    const category = this.categories.find(cat => cat.id === categoryId);
    if (!category) return [];
    
    return this.menuItems.filter(item => item.category === category.name);
  }

  getMenuItemsByCategoryName(categoryName: string): MenuItem[] {
    return this.menuItems.filter(item => item.category === categoryName);
  }

  getCategories(): MenuCategory[] {
    // Исключаем категорию "ЗАВТРАК А ЛЯ КАРТ" из фильтра
    return this.categories.filter(category => category.name !== 'ЗАВТРАК А ЛЯ КАРТ');
  }

  getCategoryById(id: string): MenuCategory | undefined {
    return this.categories.find(category => category.id === id);
  }

  searchMenuItems(query: string): MenuItem[] {
    const searchTerm = query.toLowerCase();
    return this.menuItems.filter(item =>
      item.name.toLowerCase().includes(searchTerm) ||
      item.description?.toLowerCase().includes(searchTerm) ||
      item.category.toLowerCase().includes(searchTerm)
    );
  }

  // Dietary filtering functions
  getVegetarianItems(): MenuItem[] {
    return this.menuItems.filter(item => item.dietaryInfo?.vegetarian);
  }

  getLactoseFreeItems(): MenuItem[] {
    return this.menuItems.filter(item => item.dietaryInfo?.lactoseFree);
  }

  getGlutenFreeItems(): MenuItem[] {
    return this.menuItems.filter(item => item.dietaryInfo?.glutenFree);
  }

  getSpicyItems(): MenuItem[] {
    return this.menuItems.filter(item => item.dietaryInfo?.spicy);
  }

  getHalalItems(): MenuItem[] {
    return this.menuItems.filter(item => item.dietaryInfo?.halal);
  }

  // Filter by multiple dietary requirements
  filterByDietaryRequirements(requirements: Partial<DietaryInfo>): MenuItem[] {
    return this.menuItems.filter(item => {
      if (!item.dietaryInfo) return false;

      return Object.entries(requirements).every(([key, value]) => {
        if (!value) return true; // Skip if requirement is false
        return item.dietaryInfo?.[key as keyof DietaryInfo] === true;
      });
    });
  }

  // Get items by price range
  getItemsByPriceRange(minPrice: number, maxPrice: number): MenuItem[] {
    return this.menuItems.filter(item => 
      item.price >= minPrice && item.price <= maxPrice
    );
  }

  // Get featured/popular items
  getFeaturedItems(limit = 6): MenuItem[] {
    // For demo, return items from different categories
    const featured: MenuItem[] = [];
    const categoriesUsed = new Set<string>();

    for (const item of this.menuItems) {
      if (featured.length >= limit) break;
      
      if (!categoriesUsed.has(item.category)) {
        featured.push(item);
        categoriesUsed.add(item.category);
      }
    }

    // Fill remaining spots with other items
    if (featured.length < limit) {
      const remaining = this.menuItems
        .filter(item => !featured.includes(item))
        .slice(0, limit - featured.length);
      featured.push(...remaining);
    }

    return featured;
  }

  // Get breakfast items specifically (since it was mentioned as problematic)
  getBreakfastItems(): MenuItem[] {
    return this.getMenuItemsByCategoryName('Завтрак а-ля карт');
  }

  // Get recommended items based on time of day
  getRecommendedByTime(hour: number): MenuItem[] {
    if (hour >= 6 && hour <= 11) {
      // Morning - breakfast items
      return this.getBreakfastItems();
    } else if (hour >= 12 && hour <= 16) {
      // Lunch - soups and main dishes
      return [
        ...this.getMenuItemsByCategoryName('Супы'),
        ...this.getMenuItemsByCategoryName('Основные блюда')
      ].slice(0, 8);
    } else if (hour >= 17 && hour <= 23) {
      // Dinner - appetizers and main dishes
      return [
        ...this.getMenuItemsByCategoryName('Холодные закуски'),
        ...this.getMenuItemsByCategoryName('Горячие закуски'),
        ...this.getMenuItemsByCategoryName('Основные блюда')
      ].slice(0, 8);
    } else {
      // Late night/early morning - lighter options
      return [
        ...this.getMenuItemsByCategoryName('Холодные закуски'),
        ...this.getMenuItemsByCategoryName('Десерты'),
        ...this.getMenuItemsByCategoryName('Напитки')
      ].slice(0, 6);
    }
  }

  // Get price statistics
  getPriceStats(): { min: number; max: number; average: number } {
    if (this.menuItems.length === 0) {
      return { min: 0, max: 0, average: 0 };
    }

    const prices = this.menuItems.map(item => item.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const average = prices.reduce((sum, price) => sum + price, 0) / prices.length;

    return { min, max, average: Math.round(average) };
  }

  // Get items count by category
  getCategoryItemCounts(): { [categoryName: string]: number } {
    const counts: { [categoryName: string]: number } = {};
    
    this.categories.forEach(category => {
      counts[category.name] = this.getMenuItemsByCategoryName(category.name).length;
    });

    return counts;
  }

  // Advanced search with filters
  advancedSearch(params: {
    query?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    dietaryRequirements?: Partial<DietaryInfo>;
  }): MenuItem[] {
    let results = this.menuItems;

    // Text search
    if (params.query) {
      results = results.filter(item =>
        item.name.toLowerCase().includes(params.query!.toLowerCase()) ||
        item.description?.toLowerCase().includes(params.query!.toLowerCase())
      );
    }

    // Category filter
    if (params.category) {
      results = results.filter(item => item.category === params.category);
    }

    // Price range filter
    if (params.minPrice !== undefined) {
      results = results.filter(item => item.price >= params.minPrice!);
    }
    if (params.maxPrice !== undefined) {
      results = results.filter(item => item.price <= params.maxPrice!);
    }

    // Dietary requirements filter
    if (params.dietaryRequirements) {
      results = results.filter(item => {
        if (!item.dietaryInfo) return false;

        return Object.entries(params.dietaryRequirements!).every(([key, value]) => {
          if (!value) return true;
          return item.dietaryInfo?.[key as keyof DietaryInfo] === true;
        });
      });
    }

    return results;
  }

  private getPlaceholderImage(itemId: string): string {
    return `/images/menu/${itemId}/thumbnail.jpg`;
  }

  // Check if category has long name (for mobile navigation fix)
  isCategoryNameLong(categoryName: string): boolean {
    return categoryName.length > 12;
  }

  // Get shortened category name for mobile
  getShortenedCategoryName(categoryName: string, maxLength = 12): string {
    if (categoryName.length <= maxLength) return categoryName;
    
    // Smart truncation for Russian text
    const words = categoryName.split(' ');
    if (words.length === 1) {
      return categoryName.substring(0, maxLength - 1) + '…';
    }
    
    // Try to keep first word + abbreviation
    const firstWord = words[0];
    if (firstWord.length <= maxLength - 2) {
      return firstWord + '…';
    }
    
    return categoryName.substring(0, maxLength - 1) + '…';
  }
}

// Export singleton instance
export const menuService = new MenuService();
export default menuService; 