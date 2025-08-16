// Core data types for PLAN3 implementation

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisine: string;
  averagePrice?: number;
  averageCheck?: string;
  hours: string;
  imageUrl?: string;
  features?: string[];
  location?: string;
  contact?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  imageUrl?: string;
  // Extended fields used by UI
  portion?: string;
  dietary?: DietaryInfo;
  // Backward-compat field for compatibility
  dietaryInfo?: DietaryInfo;
}

export interface DietaryInfo {
  vegetarian?: boolean;
  lactoseFree?: boolean;
  glutenFree?: boolean;
  spicy?: boolean;
  halal?: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  order: number;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  category: string;
  area: string;
  capacity: number;
  maxGuests: number;
  bedType: string;
  view: string;
  targetGuest: string;
  priceRange: string;
  amenities: string[];
  bathroom: string;
  features: string[];
  imageUrl?: string;
  images?: string[];
}

export interface SpaService {
  id: string;
  name: string;
  description: string;
  category: string;
  duration?: string;
  about?: string;
  suitableFor?: string;
  contraindications?: string;
  recommendations?: string;
  beforeProcedure?: string;
  priceRange?: string;
  features?: string[];
  images?: string[];
  imageUrl?: string;
}

// Cart related types
export interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  imageUrl?: string;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

// Booking form types
export interface TableReservation {
  restaurantId: string;
  date: string;
  time: string;
  guests: number;
  customerInfo: CustomerInfo;
  preferences?: string;
  occasion?: string;
}

export interface RoomBooking {
  roomId: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children?: number;
  customerInfo: CustomerInfo;
  additionalServices?: string[];
}

export interface ServiceRequest {
  serviceId: string;
  date: string;
  time?: string;
  customerInfo: CustomerInfo;
  preferences?: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email?: string;
  comments?: string;
}

// UI state types
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface FormStep {
  id: string;
  title: string;
  isComplete: boolean;
  isActive: boolean;
}

// Data parsing types
export interface ParsedData<T> {
  data: T[];
  success: boolean;
  error?: string;
}

// Image handling
export interface ImagePlaceholder {
  type: 'restaurant' | 'room' | 'service' | 'menu';
  fallbackIcon: string;
  gradientClass: string;
} 