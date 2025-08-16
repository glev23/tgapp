import { Restaurant, ParsedData } from '../types';
import { parseRestaurantData } from './dataParser';

/**
 * Restaurant Service
 * Handles restaurant data operations
 */

class RestaurantService {
  private restaurants: Restaurant[] = [];
  private loaded = false;
  private imageMap: Record<string, string> = {};

  private async loadImageMap() {
    try {
      const res = await fetch('/data/restaurant-images.json', { cache: 'no-cache' })
      if (!res.ok) return
      const json = await res.json()
      if (json && Array.isArray(json.items)) {
        json.items.forEach((it: any) => {
          this.imageMap[it.slug] = it.file
        })
      }
    } catch {}
  }

  async loadRestaurants(): Promise<ParsedData<Restaurant>> {
    if (this.loaded) {
      return { data: this.restaurants, success: true };
    }

    try {
      await this.loadImageMap()
      const result = await parseRestaurantData();
      
      if (result.success) {
        this.restaurants = result.data.map(restaurant => ({
          ...restaurant,
          imageUrl: restaurant.imageUrl || this.getImageFor(restaurant.name) || this.getPlaceholder()
        }));
        this.loaded = true;
      }

      return { 
        data: this.restaurants, 
        success: result.success, 
        error: result.error 
      };
    } catch (error) {
      return {
        data: [],
        success: false,
        error: error instanceof Error ? error.message : 'Failed to load restaurants'
      };
    }
  }

  private slugify(name: string) {
    return name
      .toString()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9а-яё\s\-_.]/gi, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

  private getImageFor(name: string): string | undefined {
    const slug = this.slugify(name)
    return this.imageMap[slug]
  }

  private getPlaceholder(): string {
    return '/images/restaurant-placeholder.svg';
  }

  getRestaurants(): Restaurant[] { return this.restaurants }
  getRestaurantById(id: string): Restaurant | undefined { return this.restaurants.find(r => r.id === id) }

  getRestaurantsByFeature(feature: string): Restaurant[] {
    return this.restaurants.filter(restaurant => 
      restaurant.features?.some(f => 
        f.toLowerCase().includes(feature.toLowerCase())
      )
    );
  }

  getRestaurantsByCuisine(cuisine: string): Restaurant[] {
    return this.restaurants.filter(restaurant => 
      restaurant.cuisine.toLowerCase().includes(cuisine.toLowerCase())
    );
  }

  getRestaurantsByPriceRange(minPrice: number, maxPrice: number): Restaurant[] {
    return this.restaurants.filter(restaurant => {
      if (!restaurant.averagePrice) return false;
      return restaurant.averagePrice >= minPrice && restaurant.averagePrice <= maxPrice;
    });
  }

  searchRestaurants(query: string): Restaurant[] {
    const searchTerm = query.toLowerCase();
    return this.restaurants.filter(restaurant =>
      restaurant.name.toLowerCase().includes(searchTerm) ||
      restaurant.description.toLowerCase().includes(searchTerm) ||
      restaurant.cuisine.toLowerCase().includes(searchTerm) ||
      restaurant.features?.some(feature => 
        feature.toLowerCase().includes(searchTerm)
      )
    );
  }

  // Get featured restaurants (e.g., for home page quick actions)
  getFeaturedRestaurants(limit = 4): Restaurant[] {
    // Return restaurants with high ratings or special features
    const featured = this.restaurants
      .filter(restaurant => 
        restaurant.features?.includes('авторская кухня') ||
        restaurant.averagePrice && restaurant.averagePrice >= 4000
      )
      .slice(0, limit);

    // If not enough featured restaurants, fill with others
    if (featured.length < limit) {
      const remaining = this.restaurants
        .filter(restaurant => !featured.includes(restaurant))
        .slice(0, limit - featured.length);
      featured.push(...remaining);
    }

    return featured;
  }

  // Get restaurants by time of day
  getRestaurantsByTime(hour: number): Restaurant[] {
    return this.restaurants.filter(restaurant => {
      const hours = restaurant.hours.toLowerCase();
      
      // Handle 24/7 restaurants
      if (hours.includes('круглосуточно')) {
        return true;
      }

      // Early morning (6-11)
      if (hour >= 6 && hour <= 11 && hours.includes('завтрак')) {
        return true;
      }

      // Lunch time (12-16)
      if (hour >= 12 && hour <= 16 && hours.includes('ланч')) {
        return true;
      }

      // Dinner time (18-23)
      if (hour >= 18 && hour <= 23) {
        return true;
      }

      // Night time (20-06)
      if ((hour >= 20 || hour <= 6) && restaurant.features?.includes('ночной')) {
        return true;
      }

      return true; // Default to showing all restaurants
    });
  }

  // Get cuisine types for filtering
  getCuisineTypes(): string[] {
    const cuisines = new Set<string>();
    
    this.restaurants.forEach(restaurant => {
      restaurant.cuisine.split(',').forEach(cuisine => {
        cuisines.add(cuisine.trim());
      });
    });

    return Array.from(cuisines).sort();
  }

  // Get price ranges
  getPriceRanges(): { min: number; max: number; label: string; count: number }[] {
    const ranges = [
      { min: 0, max: 2000, label: 'До 2000 ₽' },
      { min: 2000, max: 4000, label: '2000-4000 ₽' },
      { min: 4000, max: 6000, label: '4000-6000 ₽' },
      { min: 6000, max: Infinity, label: 'От 6000 ₽' }
    ];

    return ranges.map(range => ({
      ...range,
      count: this.getRestaurantsByPriceRange(range.min, range.max).length
    }));
  }

  // Check if restaurant is currently open (mock implementation)
  isRestaurantOpen(restaurantId: string): boolean {
    const restaurant = this.getRestaurantById(restaurantId);
    if (!restaurant) return false;

    const hours = restaurant.hours.toLowerCase();
    
    // If 24/7, always open
    if (hours.includes('круглосуточно')) {
      return true;
    }

    // For demo purposes, assume all restaurants are open during reasonable hours
    const currentHour = new Date().getHours();
    return currentHour >= 8 && currentHour <= 23;
  }
}

// Export singleton instance
export const restaurantService = new RestaurantService();
export default restaurantService; 