/**
 * Business Configuration - Update these values to match your business details
 */

export const BUSINESS_CONFIG = {
  name: 'Atan Motoring Supply',
  phone: '+65 6743 1351',
  whatsappNumber: '6567431351', // without + or spaces for WhatsApp links
  email: 'info@atanmotoring.com.sg',
  address: 'Blk 3006 Ubi Road 1 #01-368/370, Kampong Ubi Industrial Estate, Singapore 408700',
  uen: '198903552W',
  yearEstablished: 1989,
  location: 'Ubi, Singapore',
  carousellProfile: 'https://www.carousell.sg/u/atanmotoring', // Update this with actual profile URL
  instagram: 'https://www.instagram.com/atanmotoring', // Update this
  googleReviews: 'https://g.co/kgs/...' // Update this
};

export const ENQUIRY_TYPES = [
  'General Servicing',
  'Engine Overhaul',
  'Buying a New Bike',
  'Buying a Used Bike',
  'Trade-In',
  'Other'
];

export const PAYMENT_PREFERENCES = ['Cash', 'Installment', 'Not Sure'];

export const BIKE_CLASSES = [
  { value: '2b', label: 'Class 2B', description: 'Up to 70cc, max 4kW (5.5hp)' },
  { value: '2a', label: 'Class 2A', description: 'Up to 125cc, max 11kW (15hp)' },
  { value: '2', label: 'Class 2', description: 'Above 125cc' }
];
