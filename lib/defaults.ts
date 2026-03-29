export type Bike = {
  id: number;
  make: string;
  model: string;
  cond: 'new' | 'used';
  cls: '2b' | '2a' | '2';
  price: string;
  engine: string;
  power: string;
  spec3: string;
  status: string;
};

export type Service = {
  id: number;
  icon: string;
  name: string;
  desc: string;
  price: string;
};

export type PricingRow =
  | { id: number; type: 'cat'; catName: string }
  | { id: number; type: 'item'; name: string; details: string; amount: string; popular: boolean };

export type Review = {
  id: number;
  author: string;
  avatar: string;
  source: string;
  text: string;
  rating: number;
};

export const DEFAULTS = {
  bikes: [
    { id: 1, make: 'Honda', model: 'RS150R 2024', cond: 'new', cls: '2b', price: '9,800', engine: '150cc', power: '17.1 hp', spec3: '2024', status: 'In Stock' },
    { id: 2, make: 'Yamaha', model: 'Y15ZR 2024', cond: 'new', cls: '2b', price: '10,488', engine: '155cc', power: '16.2 hp', spec3: '2024', status: 'In Stock' },
    { id: 3, make: 'Kawasaki', model: 'Z125 Pro 2024', cond: 'new', cls: '2b', price: '8,200', engine: '125cc', power: '9.7 hp', spec3: '2024', status: 'In Stock' },
    { id: 4, make: 'Honda', model: 'CB500F 2024', cond: 'new', cls: '2a', price: '18,900', engine: '471cc', power: '47 hp', spec3: '2024', status: 'In Stock' },
    { id: 5, make: 'Yamaha', model: 'MT-03 2024', cond: 'new', cls: '2a', price: '16,500', engine: '321cc', power: '42 hp', spec3: '2024', status: 'In Stock' },
    { id: 6, make: 'Kawasaki', model: 'Z650 2024', cond: 'new', cls: '2', price: '28,800', engine: '649cc', power: '68 hp', spec3: '2024', status: 'In Stock' },
    { id: 7, make: 'Yamaha', model: 'XMAX 300 2023', cond: 'new', cls: '2a', price: '22,500', engine: '292cc', power: '28 hp', spec3: '2023', status: 'In Stock' },
    { id: 8, make: 'Honda', model: 'CBR150R 2021', cond: 'used', cls: '2b', price: '6,500', engine: '150cc', power: '18 hp', spec3: '22k km', status: 'Good Condition' },
    { id: 9, make: 'Yamaha', model: 'FZ150i 2020', cond: 'used', cls: '2b', price: '4,800', engine: '150cc', power: '14.5 hp', spec3: '35k km', status: 'Good Condition' },
    { id: 10, make: 'Kawasaki', model: 'Ninja 250SL 2019', cond: 'used', cls: '2a', price: '9,200', engine: '249cc', power: '30 hp', spec3: '28k km', status: 'Excellent Condition' },
    { id: 11, make: 'Suzuki', model: 'Raider R150 2022', cond: 'used', cls: '2b', price: '5,900', engine: '147cc', power: '16.2 hp', spec3: '14k km', status: 'Very Good' },
    { id: 12, make: 'Honda', model: 'CB400X 2020', cond: 'used', cls: '2', price: '15,800', engine: '399cc', power: '45 hp', spec3: '18k km', status: 'Good Condition' }
  ] as Bike[],
  services: [
    { id: 1, icon: '🔧', name: 'General Servicing', desc: 'Complete inspection and tune-up including oil change, filter replacement, chain lubrication, and brake check.', price: '40' },
    { id: 2, icon: '⚙️', name: 'Engine Overhaul', desc: 'Full engine teardown, inspection, piston and gasket replacement, and precision reassembly.', price: '350' },
    { id: 3, icon: '🛞', name: 'Tyre & Wheel', desc: 'Tyre replacement, wheel balancing, spoke truing, and rim straightening for all bike types.', price: '25' },
    { id: 4, icon: '⚡', name: 'Electrical Works', desc: 'Battery replacement, wiring diagnostics, starter motor repair, and lighting upgrades.', price: '50' },
    { id: 5, icon: '🛑', name: 'Brake System', desc: 'Pad and disc replacement, brake fluid flush, hydraulic line checks and inspection.', price: '45' },
    { id: 6, icon: '💨', name: 'Carburetor & Fuel', desc: 'Carb cleaning, jetting, fuel injection service, and fuel pump replacement.', price: '70' }
  ] as Service[],
  pricing: [
    { id: 1, type: 'cat', catName: 'Regular Maintenance' },
    { id: 2, type: 'item', name: 'Basic Service', details: 'Oil change + filter + general check', amount: '40 – 60', popular: false },
    { id: 3, type: 'item', name: 'Major Service', details: 'Full service with valve clearance', amount: '120 – 200', popular: false },
    { id: 4, type: 'item', name: 'Chain & Sprocket Set', details: 'Parts + fitment', amount: '80 – 150', popular: false },
    { id: 5, type: 'item', name: 'Air Filter Replacement', details: 'OEM or aftermarket', amount: '20 – 45', popular: false },
    { id: 6, type: 'cat', catName: 'Engine & Transmission' },
    { id: 7, type: 'item', name: 'Top Overhaul', details: 'Piston, rings, gaskets', amount: '200 – 350', popular: false },
    { id: 8, type: 'item', name: 'Full Engine Overhaul', details: 'Complete strip and rebuild', amount: '350 – 700', popular: true },
    { id: 9, type: 'item', name: 'Clutch Replacement', details: 'Plates, springs, basket inspect', amount: '120 – 250', popular: false },
    { id: 10, type: 'cat', catName: 'Brakes & Suspension' },
    { id: 11, type: 'item', name: 'Brake Pad Set (Front + Rear)', details: 'OEM spec pads', amount: '60 – 120', popular: false },
    { id: 12, type: 'item', name: 'Disc Brake Replacement', details: 'Per disc, includes fitment', amount: '90 – 180', popular: false },
    { id: 13, type: 'item', name: 'Brake Fluid Flush', details: 'DOT 4 full system bleed', amount: '35 – 55', popular: false },
    { id: 14, type: 'item', name: 'Fork Oil Change', details: 'Both legs, seals if needed', amount: '60 – 120', popular: false },
    { id: 15, type: 'cat', catName: 'Electrical' },
    { id: 16, type: 'item', name: 'Battery Replacement', details: 'Supply + fitment', amount: '60 – 140', popular: false },
    { id: 17, type: 'item', name: 'Electrical Diagnosis', details: 'Full system scan + report', amount: '40 – 60', popular: false },
    { id: 18, type: 'item', name: 'Starter Motor Overhaul', details: 'Brushes, bearing, armature', amount: '90 – 160', popular: false },
    { id: 19, type: 'cat', catName: 'Tyres & Wheels' },
    { id: 20, type: 'item', name: 'Front Tyre Fitting', details: 'Balancing included', amount: '15 – 25', popular: false },
    { id: 21, type: 'item', name: 'Rear Tyre Fitting', details: 'Balancing included', amount: '20 – 35', popular: false },
    { id: 22, type: 'item', name: 'Wheel Truing', details: 'Spoke adjustment per wheel', amount: '30 – 60', popular: false }
  ] as PricingRow[],
  reviews: [
    { id: 1, author: 'Qah R.', avatar: 'Q', source: 'First-time buyer · Google Review', rating: 5, text: "So glad I came across Atan Motoring's page and made the choice to purchase my first bike from them! Most importantly, they are not pushy and are transparent about everything. A big shoutout to Mr Kenneth for assisting me throughout the entire process!" },
    { id: 2, author: 'Khairin S.', avatar: 'K', source: 'XMAX 300 owner · Carousell Review', rating: 5, text: 'I bought my XMAX 300 from Atan Motoring. Fantastic experience! Friendly staff, clear financing, and they even helped with road tax and season parking. They really go the extra mile. Highly recommend!' },
    { id: 3, author: 'Aziz M.', avatar: 'A', source: 'Verified buyer · Google Review', rating: 5, text: 'Was attended to by Irfan. Had a really pleasant experience — friendly, helpful, and guided me throughout the purchase to ensure a smooth transaction. Rest assured you will be in good hands at Atan Motoring!' },
    { id: 4, author: 'Siti N.', avatar: 'S', source: 'SYM owner · Google Review', rating: 5, text: "Extremely friendly service and the after-sales service was excellent. Bought my SYM bike from them and I'm absolutely loving it. The staff was very prompt with my enquiries. Very happy with my experience!" },
    { id: 5, author: 'Guatseah', avatar: 'G', source: 'Verified buyer · Carousell Review', rating: 5, text: 'Highly recommend getting your bike here. Kenneth is knowledgeable on bikes and is a really easygoing person. Completed the deal in just 1 viewing! Very friendly and top-notch service all around. Strongly recommended.' },
    { id: 6, author: 'Raymond T.', avatar: 'R', source: 'Long-time customer · Google Review', rating: 5, text: 'Mr. Steven and his sons Kenneth and Kendrick are true professionals. Smooth process for buying and servicing. Detailed advice on bikes and recommendations. Over 30 years of experience really shows.' }
  ] as Review[]
};
