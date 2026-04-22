export type Listing = {
  id: string;
  created_at: string;
  title: string;
  description: string | null;
  price: number | null;
  engine_cc: number | null;
  coe_expiry: string | null;
  mileage: number | null;
  licence_class: '2B' | '2A' | 'Class 2' | null;
  seller_type: 'Dealer' | 'Owner' | null;
  location: string | null;
  image_url: string | null;
  carousell_source_url: string | null;
  status: 'draft' | 'published';
  updated_at: string;
};

export type ListingForm = Omit<Listing, 'id' | 'created_at' | 'updated_at'>;

export type CarousellFetchResponse = {
  title: string;
  description: string;
  image_url: string;
  carousell_source_url: string;
};
