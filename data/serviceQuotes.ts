/**
 * Service Quote Data - Bike models and service estimates for Singapore riders
 * Edit this file to update bike models, service types, and pricing estimates
 */

export type BikeClass = '2b' | '2a' | '2';
export type ServiceCategory = 'general' | 'overhaul' | 'brake-suspension' | 'cvt' | 'diagnostic';

export interface BikeModel {
  id: number;
  brand: string;
  model: string;
  slug: string;
  bikeClass: BikeClass;
  engineCc: number;
  popular: boolean;
}

export interface ServiceEstimate {
  id: number;
  bikeModelId: number;
  category: ServiceCategory;
  categoryLabel: string;
  packageDescription: string;
  priceFrom: number;
  priceTo: number | null;
  notes?: string;
}

// Common Singapore bike models (15+ entries)
export const BIKE_MODELS: BikeModel[] = [
  // 2B Class - 70cc and under
  { id: 1, brand: 'Yamaha', model: 'Sniper 150', slug: 'yamaha-sniper-150', bikeClass: '2b', engineCc: 150, popular: true },
  { id: 2, brand: 'Honda', model: 'Super Cub', slug: 'honda-super-cub', bikeClass: '2b', engineCc: 125, popular: true },
  { id: 3, brand: 'Honda', model: 'PCX160', slug: 'honda-pcx-160', bikeClass: '2b', engineCc: 160, popular: true },
  
  // 2A Class - 125cc
  { id: 4, brand: 'Yamaha', model: 'Aerox 155', slug: 'yamaha-aerox-155', bikeClass: '2a', engineCc: 155, popular: true },
  { id: 5, brand: 'Yamaha', model: 'XMAX 300', slug: 'yamaha-xmax-300', bikeClass: '2a', engineCc: 300, popular: false },
  { id: 6, brand: 'Yamaha', model: 'NMAX', slug: 'yamaha-nmax', bikeClass: '2a', engineCc: 155, popular: true },
  { id: 7, brand: 'Yamaha', model: 'MT-15', slug: 'yamaha-mt-15', bikeClass: '2a', engineCc: 155, popular: false },
  { id: 8, brand: 'Yamaha', model: 'R15', slug: 'yamaha-r15', bikeClass: '2a', engineCc: 150, popular: false },
  { id: 9, brand: 'Honda', model: 'ADV 160', slug: 'honda-adv-160', bikeClass: '2a', engineCc: 160, popular: true },
  { id: 10, brand: 'Honda', model: 'CBR150R', slug: 'honda-cbr150r', bikeClass: '2a', engineCc: 150, popular: false },
  { id: 11, brand: 'Honda', model: 'CB190X', slug: 'honda-cb190x', bikeClass: '2a', engineCc: 190, popular: false },
  
  // 2 Class - Above 125cc
  { id: 12, brand: 'Honda', model: 'Forza 350', slug: 'honda-forza-350', bikeClass: '2', engineCc: 350, popular: false },
  { id: 13, brand: 'Suzuki', model: 'GSX-R150', slug: 'suzuki-gsx-r150', bikeClass: '2', engineCc: 150, popular: false },
  { id: 14, brand: 'Kawasaki', model: 'Ninja 250', slug: 'kawasaki-ninja-250', bikeClass: '2', engineCc: 250, popular: false },
  { id: 15, brand: 'Kawasaki', model: 'Z250', slug: 'kawasaki-z250', bikeClass: '2', engineCc: 250, popular: false },
  { id: 16, brand: 'Ducati', model: 'Monster 500', slug: 'ducati-monster-500', bikeClass: '2', engineCc: 500, popular: false },
];

// Service estimates by bike and category
// Edit these prices to reflect current 2024-2025 rates
export const SERVICE_ESTIMATES: ServiceEstimate[] = [
  // Yamaha Aerox 155 - Popular scooter
  { id: 1, bikeModelId: 4, category: 'general', categoryLabel: 'Basic Servicing', packageDescription: 'Oil change, filter replacement, general inspection', priceFrom: 35, priceTo: 50 },
  { id: 2, bikeModelId: 4, category: 'overhaul', categoryLabel: 'Major Servicing', packageDescription: 'Full fluid change, inspection, belt/chain maintenance', priceFrom: 80, priceTo: 120 },
  { id: 3, bikeModelId: 4, category: 'brake-suspension', categoryLabel: 'Brake & Suspension', packageDescription: 'Brake pad inspection/replacement, suspension adjustment', priceFrom: 60, priceTo: 150 },
  { id: 4, bikeModelId: 4, category: 'cvt', categoryLabel: 'CVT / Transmission', packageDescription: 'CVT belt inspection, transmission fluid check', priceFrom: 100, priceTo: 180 },
  { id: 5, bikeModelId: 4, category: 'diagnostic', categoryLabel: 'Engine Diagnostic', packageDescription: 'Full engine scan and computer diagnostic (parts extra)', priceFrom: 50, priceTo: 80 },

  // Honda PCX160 - Popular scooter
  { id: 6, bikeModelId: 3, category: 'general', categoryLabel: 'Basic Servicing', packageDescription: 'Oil change, filter replacement, general check', priceFrom: 35, priceTo: 50 },
  { id: 7, bikeModelId: 3, category: 'overhaul', categoryLabel: 'Major Servicing', packageDescription: 'Full fluid change and comprehensive inspection', priceFrom: 85, priceTo: 130 },
  { id: 8, bikeModelId: 3, category: 'brake-suspension', categoryLabel: 'Brake System', packageDescription: 'Brake inspection, pad replacement', priceFrom: 50, priceTo: 120 },

  // Honda ADV 160 - Popular adventure scooter
  { id: 9, bikeModelId: 9, category: 'general', categoryLabel: 'Basic Servicing', packageDescription: 'Oil change, filter, inspection', priceFrom: 40, priceTo: 60 },
  { id: 10, bikeModelId: 9, category: 'overhaul', categoryLabel: 'Major Servicing', packageDescription: 'Full maintenance', priceFrom: 100, priceTo: 150 },

  // Yamaha XMAX 300 - Larger scooter
  { id: 11, bikeModelId: 5, category: 'general', categoryLabel: 'Basic Servicing', packageDescription: 'Oil change, filter replacement', priceFrom: 50, priceTo: 70 },
  { id: 12, bikeModelId: 5, category: 'overhaul', categoryLabel: 'Major Servicing', packageDescription: 'Complete maintenance', priceFrom: 120, priceTo: 180 },

  // Honda CB190X - Popular street bike
  { id: 13, bikeModelId: 11, category: 'general', categoryLabel: 'Basic Servicing', packageDescription: 'Oil change, filter, chain maintenance', priceFrom: 40, priceTo: 60 },
  { id: 14, bikeModelId: 11, category: 'overhaul', categoryLabel: 'Engine Overhaul', packageDescription: 'Major service with fluid change', priceFrom: 100, priceTo: 160 },

  // Kawasaki Ninja 250 - Sport bike
  { id: 15, bikeModelId: 14, category: 'general', categoryLabel: 'Basic Servicing', packageDescription: 'Oil change, filter, chain check', priceFrom: 45, priceTo: 65 },
  { id: 16, bikeModelId: 14, category: 'overhaul', categoryLabel: 'Major Servicing', packageDescription: 'Full service with fluids and inspection', priceFrom: 120, priceTo: 180 },

  // Catch-all for unlisted bikes - generic estimates
  { id: 100, bikeModelId: 0, category: 'general', categoryLabel: 'Basic Servicing', packageDescription: 'Oil change, filter, general inspection', priceFrom: 35, priceTo: 60 },
  { id: 101, bikeModelId: 0, category: 'overhaul', categoryLabel: 'Major Servicing', packageDescription: 'Full maintenance service', priceFrom: 80, priceTo: 150 },
  { id: 102, bikeModelId: 0, category: 'brake-suspension', categoryLabel: 'Brake & Suspension', packageDescription: 'Brake and suspension inspection/service', priceFrom: 60, priceTo: 150 },
  { id: 103, bikeModelId: 0, category: 'cvt', categoryLabel: 'CVT / Chain Service', packageDescription: 'Transmission or chain maintenance', priceFrom: 80, priceTo: 160 },
  { id: 104, bikeModelId: 0, category: 'diagnostic', categoryLabel: 'Engine Diagnostic', packageDescription: 'Full diagnostic scan', priceFrom: 50, priceTo: 90 },
];

export function getBikeModelById(id: number): BikeModel | undefined {
  return BIKE_MODELS.find((b) => b.id === id);
}

export function getBikeModelsByClass(bikeClass: BikeClass): BikeModel[] {
  return BIKE_MODELS.filter((b) => b.bikeClass === bikeClass);
}

export function getEstimatesForBike(bikeModelId: number, category?: ServiceCategory): ServiceEstimate[] {
  return SERVICE_ESTIMATES.filter((e) => {
    if (bikeModelId !== 0 && e.bikeModelId !== 0 && e.bikeModelId !== bikeModelId) return false;
    if (category && e.category !== category) return false;
    return true;
  });
}

/**
 * Get the best estimate for a bike and category
 * First tries specific bike estimate, falls back to generic (bikeModelId: 0)
 */
export function getEstimate(bikeModelId: number, category: ServiceCategory): ServiceEstimate | null {
  // Try specific bike first
  const specific = SERVICE_ESTIMATES.find((e) => e.bikeModelId === bikeModelId && e.category === category);
  if (specific) return specific;

  // Fall back to generic
  return SERVICE_ESTIMATES.find((e) => e.bikeModelId === 0 && e.category === category) || null;
}
