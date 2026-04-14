/**
 * Bike Inventory - Data-driven inventory with Carousell integration
 * UPDATE CAROUSELL URLs: Replace placeholder URLs with actual Carousell listing URLs
 * The business owner can easily update these URLs without touching code
 */

export interface InventoryBike {
  id: number;
  title: string;
  brand: string;
  model: string;
  bikeClass: '2b' | '2a' | '2';
  condition: 'new' | 'used';
  year: number;
  mileage: string; // e.g., "22,500 km"
  engineCc: number;
  powerHp?: string; // e.g., "17 hp"
  price: string; // e.g., "5,200"
  carousellUrl: string; // Direct Carousell listing URL - UPDATE THESE!
  status: string; // e.g., "In Stock", "Sold"
  featured: boolean;
}

/**
 * IMPORTANT FOR BUSINESS OWNER:
 * 
 * To update these listings, find the Carousell URL for each bike and paste it here.
 * 
 * Example: If you have a bike listed on Carousell at:
 * https://www.carousell.sg/p/yamaha-aerox-2024-copy-copy-1234567890/
 * 
 * Copy that full URL and replace the carousellUrl value below.
 * 
 * Price and description on this site should match your Carousell listings for consistency.
 */

export const INVENTORY: InventoryBike[] = [
  {
    id: 1,
    title: 'Yamaha Aerox 155 – Black Racing Edition',
    brand: 'Yamaha',
    model: 'Aerox 155',
    bikeClass: '2a',
    condition: 'new',
    year: 2024,
    mileage: 'New',
    engineCc: 155,
    powerHp: '15 hp',
    price: '3,800',
    carousellUrl: 'https://www.carousell.sg/p/yamaha-aerox-155-black-racing-1/', // UPDATE THIS URL
    featured: true,
    status: 'In Stock'
  },
  {
    id: 2,
    title: 'Honda PCX 160 – 2024 Silver',
    brand: 'Honda',
    model: 'PCX 160',
    bikeClass: '2b',
    condition: 'new',
    year: 2024,
    mileage: 'New',
    engineCc: 160,
    powerHp: '13.1 hp',
    price: '3,900',
    carousellUrl: 'https://www.carousell.sg/p/honda-pcx-160-silver-2024/', // UPDATE THIS URL
    featured: true,
    status: 'In Stock'
  },
  {
    id: 3,
    title: 'Yamaha NMAX – Red Sport',
    brand: 'Yamaha',
    model: 'NMAX',
    bikeClass: '2a',
    condition: 'new',
    year: 2024,
    mileage: 'New',
    engineCc: 155,
    powerHp: '14.7 hp',
    price: '4,100',
    carousellUrl: 'https://www.carousell.sg/p/yamaha-nmax-red-sport-2024/', // UPDATE THIS URL
    featured: false,
    status: 'In Stock'
  },
  {
    id: 4,
    title: 'Honda ADV 160 – Adventure Grey',
    brand: 'Honda',
    model: 'ADV 160',
    bikeClass: '2a',
    condition: 'new',
    year: 2024,
    mileage: 'New',
    engineCc: 160,
    powerHp: '14.7 hp',
    price: '4,200',
    carousellUrl: 'https://www.carousell.sg/p/honda-adv-160-adventure-grey/', // UPDATE THIS URL
    featured: false,
    status: 'In Stock'
  },
  {
    id: 5,
    title: 'Kawasaki Ninja 250 – Green Metallic (Used)',
    brand: 'Kawasaki',
    model: 'Ninja 250',
    bikeClass: '2',
    condition: 'used',
    year: 2023,
    mileage: '8,400 km',
    engineCc: 250,
    powerHp: '26 hp',
    price: '4,900',
    carousellUrl: 'https://www.carousell.sg/p/kawasaki-ninja-250-2023-used/', // UPDATE THIS URL
    featured: true,
    status: 'In Stock'
  },
  {
    id: 6,
    title: 'Yamaha MT-15 – Matte Black',
    brand: 'Yamaha',
    model: 'MT-15',
    bikeClass: '2a',
    condition: 'new',
    year: 2024,
    mileage: 'New',
    engineCc: 155,
    powerHp: '17 hp',
    price: '3,600',
    carousellUrl: 'https://www.carousell.sg/p/yamaha-mt-15-matte-black-2024/', // UPDATE THIS URL
    featured: false,
    status: 'In Stock'
  },
  {
    id: 7,
    title: 'Honda CB190X – Diamond Black (Used)',
    brand: 'Honda',
    model: 'CB190X',
    bikeClass: '2a',
    condition: 'used',
    year: 2023,
    mileage: '5,200 km',
    engineCc: 190,
    powerHp: '17.7 hp',
    price: '5,200',
    carousellUrl: 'https://www.carousell.sg/p/honda-cb190x-diamond-black-used/', // UPDATE THIS URL
    featured: false,
    status: 'In Stock'
  },
  {
    id: 8,
    title: 'Honda Super Cub – Classic Red',
    brand: 'Honda',
    model: 'Super Cub 125',
    bikeClass: '2b',
    condition: 'new',
    year: 2024,
    mileage: 'New',
    engineCc: 125,
    powerHp: '9.7 hp',
    price: '2,800',
    carousellUrl: 'https://www.carousell.sg/p/honda-super-cub-125-red-2024/', // UPDATE THIS URL
    featured: false,
    status: 'In Stock'
  },
  {
    id: 9,
    title: 'Yamaha R15 – Race Blue (Used)',
    brand: 'Yamaha',
    model: 'R15',
    bikeClass: '2a',
    condition: 'used',
    year: 2022,
    mileage: '12,800 km',
    engineCc: 150,
    powerHp: '16.6 hp',
    price: '3,200',
    carousellUrl: 'https://www.carousell.sg/p/yamaha-r15-race-blue-used/', // UPDATE THIS URL
    featured: false,
    status: 'In Stock'
  },
  {
    id: 10,
    title: 'Yamaha XMAX 300 – Dark Grey',
    brand: 'Yamaha',
    model: 'XMAX 300',
    bikeClass: '2',
    condition: 'new',
    year: 2024,
    mileage: 'New',
    engineCc: 300,
    powerHp: '25.5 hp',
    price: '7,200',
    carousellUrl: 'https://www.carousell.sg/p/yamaha-xmax-300-dark-grey/', // UPDATE THIS URL
    featured: true,
    status: 'In Stock'
  }
];

export function getInventoryByCondition(condition: 'new' | 'used' | 'all'): InventoryBike[] {
  if (condition === 'all') return INVENTORY.filter(b => b.status !== 'Sold');
  return INVENTORY.filter((b) => b.condition === condition && b.status !== 'Sold');
}

export function getInventoryByClass(bikeClass: '2b' | '2a' | '2' | 'all'): InventoryBike[] {
  if (bikeClass === 'all') return INVENTORY.filter(b => b.status !== 'Sold');
  return INVENTORY.filter((b) => b.bikeClass === bikeClass && b.status !== 'Sold');
}

export function getInventoryByBrand(brand: string): InventoryBike[] {
  if (brand === 'all') return INVENTORY.filter(b => b.status !== 'Sold');
  return INVENTORY.filter((b) => b.brand === brand && b.status !== 'Sold');
}

export function getFeaturedBikes(): InventoryBike[] {
  return INVENTORY.filter((b) => b.featured && b.status !== 'Sold');
}

export function getAllBrands(): string[] {
  const brands = new Set(INVENTORY.filter(b => b.status !== 'Sold').map((b) => b.brand));
  return Array.from(brands).sort();
}

export function getInventoryById(id: number): InventoryBike | undefined {
  return INVENTORY.find((b) => b.id === id);
}
