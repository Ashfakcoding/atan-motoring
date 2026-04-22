create table if not exists bikes (
  id bigint primary key,
  make text not null,
  model text not null,
  cond text not null check (cond in ('new','used')),
  cls text not null check (cls in ('2b','2a','2')),
  price text not null,
  engine text not null,
  power text not null,
  spec3 text not null,
  status text not null,
  carousell_url text
);

create table if not exists services (
  id bigint primary key,
  icon text not null,
  name text not null,
  desc text not null,
  price text not null
);

create table if not exists pricing (
  id bigint primary key,
  type text not null check (type in ('cat','item')),
  catName text,
  name text,
  details text,
  amount text,
  popular boolean default false
);

create table if not exists reviews (
  id bigint primary key,
  author text not null,
  avatar text not null,
  source text not null,
  text text not null,
  rating integer not null default 5
);

create table if not exists service_rates (
  id bigint generated always as identity primary key,
  bike_model_id integer not null,
  bike_brand text not null,
  bike_model text not null,
  service_category text not null,
  service_label text not null,
  description text,
  price_from decimal(10,2) not null,
  price_to decimal(10,2),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists community_posts (
  id bigint generated always as identity primary key,
  title text not null,
  category text not null check (category in ('group-rides','maintenance-tips','workshop-news','new-stock','promotions')),
  excerpt text,
  content text not null,
  author text not null default 'Atan Admin',
  cover_emoji text default '📝',
  pinned boolean default false,
  featured boolean default false,
  published_date timestamptz not null default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists bike_inventory (
  id bigint generated always as identity primary key,
  make text not null,
  model text not null,
  condition text not null check (condition in ('new','used')),
  licence_class text not null check (licence_class in ('2b','2a','2')),
  price decimal(10,2) not null,
  engine_cc integer,
  power_hp text,
  year_or_mileage text,
  carousell_url text,
  featured boolean default false,
  in_stock boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists enquiries (
  id bigint generated always as identity primary key,
  type text not null,
  first_name text,
  last_name text,
  name text,
  phone text,
  enquiry_type text,
  bike_name text,
  message text,
  date_of_birth date,
  licence_issue_date date,
  licence_class text check (licence_class in ('2b','2a','2')),
  payment_preference text,
  created_at timestamptz not null default now()
);

alter table bikes enable row level security;
alter table services enable row level security;
alter table pricing enable row level security;
alter table reviews enable row level security;
alter table enquiries enable row level security;
alter table service_rates enable row level security;
alter table community_posts enable row level security;
alter table bike_inventory enable row level security;

create policy "public read bikes" on bikes for select using (true);
create policy "public read services" on services for select using (true);
create policy "public read pricing" on pricing for select using (true);
create policy "public read reviews" on reviews for select using (true);
create policy "public insert enquiries" on enquiries for insert with check (true);
create policy "public read service_rates" on service_rates for select using (true);
create policy "public read community_posts" on community_posts for select using (true);
create policy "public read bike_inventory" on bike_inventory for select using (true);

create policy "authenticated manage bikes" on bikes for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated manage services" on services for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated manage pricing" on pricing for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated manage reviews" on reviews for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated manage service_rates" on service_rates for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated manage community_posts" on community_posts for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated manage bike_inventory" on bike_inventory for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Indexes for performance
create index if not exists idx_service_rates_bike_model on service_rates(bike_model_id);
create index if not exists idx_service_rates_category on service_rates(service_category);
create index if not exists idx_community_posts_category on community_posts(category);
create index if not exists idx_community_posts_pinned on community_posts(pinned);
create index if not exists idx_bike_inventory_licence_class on bike_inventory(licence_class);
create index if not exists idx_bike_inventory_condition on bike_inventory(condition);
create index if not exists idx_enquiries_type on enquiries(type);
create index if not exists idx_enquiries_created_at on enquiries(created_at);

insert into bikes (id, make, model, cond, cls, price, engine, power, spec3, status) values
(1,'Honda','RS150R 2024','new','2b','9,800','150cc','17.1 hp','2024','In Stock'),
(2,'Yamaha','Y15ZR 2024','new','2b','10,488','155cc','16.2 hp','2024','In Stock'),
(3,'Kawasaki','Z125 Pro 2024','new','2b','8,200','125cc','9.7 hp','2024','In Stock'),
(4,'Honda','CB500F 2024','new','2a','18,900','471cc','47 hp','2024','In Stock'),
(5,'Yamaha','MT-03 2024','new','2a','16,500','321cc','42 hp','2024','In Stock'),
(6,'Kawasaki','Z650 2024','new','2','28,800','649cc','68 hp','2024','In Stock'),
(7,'Yamaha','XMAX 300 2023','new','2a','22,500','292cc','28 hp','2023','In Stock'),
(8,'Honda','CBR150R 2021','used','2b','6,500','150cc','18 hp','22k km','Good Condition'),
(9,'Yamaha','FZ150i 2020','used','2b','4,800','150cc','14.5 hp','35k km','Good Condition'),
(10,'Kawasaki','Ninja 250SL 2019','used','2a','9,200','249cc','30 hp','28k km','Excellent Condition'),
(11,'Suzuki','Raider R150 2022','used','2b','5,900','147cc','16.2 hp','14k km','Very Good'),
(12,'Honda','CB400X 2020','used','2','15,800','399cc','45 hp','18k km','Good Condition')
on conflict (id) do nothing;

insert into services (id, icon, name, desc, price) values
(1,'🔧','General Servicing','Complete inspection and tune-up including oil change, filter replacement, chain lubrication, and brake check.','40'),
(2,'⚙️','Engine Overhaul','Full engine teardown, inspection, piston and gasket replacement, and precision reassembly.','350'),
(3,'🛞','Tyre & Wheel','Tyre replacement, wheel balancing, spoke truing, and rim straightening for all bike types.','25'),
(4,'⚡','Electrical Works','Battery replacement, wiring diagnostics, starter motor repair, and lighting upgrades.','50'),
(5,'🛑','Brake System','Pad and disc replacement, brake fluid flush, hydraulic line checks and inspection.','45'),
(6,'💨','Carburetor & Fuel','Carb cleaning, jetting, fuel injection service, and fuel pump replacement.','70')
on conflict (id) do nothing;

insert into pricing (id, type, catName, name, details, amount, popular) values
(1,'cat','Regular Maintenance',null,null,null,false),
(2,'item',null,'Basic Service','Oil change + filter + general check','40 – 60',false),
(3,'item',null,'Major Service','Full service with valve clearance','120 – 200',false),
(4,'item',null,'Chain & Sprocket Set','Parts + fitment','80 – 150',false),
(5,'item',null,'Air Filter Replacement','OEM or aftermarket','20 – 45',false),
(6,'cat','Engine & Transmission',null,null,null,false),
(7,'item',null,'Top Overhaul','Piston, rings, gaskets','200 – 350',false),
(8,'item',null,'Full Engine Overhaul','Complete strip and rebuild','350 – 700',true),
(9,'item',null,'Clutch Replacement','Plates, springs, basket inspect','120 – 250',false),
(10,'cat','Brakes & Suspension',null,null,null,false),
(11,'item',null,'Brake Pad Set (Front + Rear)','OEM spec pads','60 – 120',false),
(12,'item',null,'Disc Brake Replacement','Per disc, includes fitment','90 – 180',false),
(13,'item',null,'Brake Fluid Flush','DOT 4 full system bleed','35 – 55',false),
(14,'item',null,'Fork Oil Change','Both legs, seals if needed','60 – 120',false),
(15,'cat','Electrical',null,null,null,false),
(16,'item',null,'Battery Replacement','Supply + fitment','60 – 140',false),
(17,'item',null,'Electrical Diagnosis','Full system scan + report','40 – 60',false),
(18,'item',null,'Starter Motor Overhaul','Brushes, bearing, armature','90 – 160',false),
(19,'cat','Tyres & Wheels',null,null,null,false),
(20,'item',null,'Front Tyre Fitting','Balancing included','15 – 25',false),
(21,'item',null,'Rear Tyre Fitting','Balancing included','20 – 35',false),
(22,'item',null,'Wheel Truing','Spoke adjustment per wheel','30 – 60',false)
on conflict (id) do nothing;

insert into reviews (id, author, avatar, source, text, rating) values
(1,'Qah R.','Q','First-time buyer · Google Review','So glad I came across Atan Motoring''s page and made the choice to purchase my first bike from them! Most importantly, they are not pushy and are transparent about everything. A big shoutout to Mr Kenneth for assisting me throughout the entire process!',5),
(2,'Khairin S.','K','XMAX 300 owner · Carousell Review','I bought my XMAX 300 from Atan Motoring. Fantastic experience! Friendly staff, clear financing, and they even helped with road tax and season parking. They really go the extra mile. Highly recommend!',5),
(3,'Aziz M.','A','Verified buyer · Google Review','Was attended to by Irfan. Had a really pleasant experience — friendly, helpful, and guided me throughout the purchase to ensure a smooth transaction. Rest assured you will be in good hands at Atan Motoring!',5),
(4,'Siti N.','S','SYM owner · Google Review','Extremely friendly service and the after-sales service was excellent. Bought my SYM bike from them and I''m absolutely loving it. The staff was very prompt with my enquiries. Very happy with my experience!',5),
(5,'Guatseah','G','Verified buyer · Carousell Review','Highly recommend getting your bike here. Kenneth is knowledgeable on bikes and is a really easygoing person. Completed the deal in just 1 viewing! Very friendly and top-notch service all around. Strongly recommended.',5),
(6,'Raymond T.','R','Long-time customer · Google Review','Mr. Steven and his sons Kenneth and Kendrick are true professionals. Smooth process for buying and servicing. Detailed advice on bikes and recommendations. Over 30 years of experience really shows.',5)
on conflict (id) do nothing;

-- Sample Service Rates for different bike models
insert into service_rates (bike_model_id, bike_brand, bike_model, service_category, service_label, description, price_from, price_to, notes) values
(1, 'Honda', 'RS150R', 'general', 'General Servicing', 'Oil change + filter + inspection', 45.00, 60.00, 'Every 1000km'),
(1, 'Honda', 'RS150R', 'overhaul', 'Major Servicing', 'Full service with valve clearance', 120.00, 150.00, 'Every 5000km'),
(1, 'Honda', 'RS150R', 'brake-suspension', 'Brake Pad Replacement', 'Front and rear pad set', 65.00, 100.00, 'As needed'),
(1, 'Honda', 'RS150R', 'cvt', 'CVT Belt Service', 'Belt + pulley inspection', 80.00, 120.00, 'Every 10000km'),
(1, 'Honda', 'RS150R', 'diagnostic', 'Electrical Diagnosis', 'Full system scan', 50.00, 80.00, 'For engine warning light'),
(4, 'Honda', 'CB500F', 'general', 'General Servicing', 'Oil change + filter + inspection', 55.00, 75.00, 'Every 1000km'),
(4, 'Honda', 'CB500F', 'overhaul', 'Major Servicing', 'Full service with valve clearance', 150.00, 200.00, 'Every 6000km'),
(6, 'Kawasaki', 'Z650', 'general', 'General Servicing', 'Oil change + filter + inspection', 60.00, 85.00, 'Every 1000km'),
(6, 'Kawasaki', 'Z650', 'overhaul', 'Major Servicing', 'Full service with valve clearance', 180.00, 250.00, 'Every 6000km')
on conflict do nothing;

-- Sample Community Posts
insert into community_posts (title, category, excerpt, content, author, cover_emoji, pinned, featured, published_date) values
('Weekend Group Ride to East Coast Lagoon – June 15th', 'group-rides', 'Join us for a scenic ride along the coast!', 'Meet at Atan Motoring at 8 AM. We''ll be riding to East Coast Lagoon with a stop for breakfast. Perfect for all skill levels. Bring your helmet and a full tank!', 'Atan Admin', '🏍️', true, true, now() - interval '2 days'),
('Chain Maintenance Tips for Wet Season', 'maintenance-tips', 'Keep your bike chain in perfect condition', 'The wet season is here! Time to give your chain extra care. Use a quality chain cleaner and lube regularly. Check chain tension every 500km. A well-maintained chain ensures smooth riding and extends your bike life.', 'Atan Admin', '⛓️', true, false, now() - interval '5 days'),
('New Stock Arrival: Yamaha XMAX 300 2024', 'new-stock', 'Fresh arrivals in our showroom!', 'We just received 3 units of the 2024 Yamaha XMAX 300. Premium automatic scooter with ABS and traction control. Financing available. Come visit us at the workshop to test ride!', 'Atan Admin', '✨', false, true, now() - interval '1 day'),
('May Promo: Free Helmet with Every Service', 'promotions', 'Special offer this month only!', 'Avail of a free quality helmet (worth S$80) when you book a Major Service this month. Valid until May 31st. Limited slots available, so book your appointment now!', 'Atan Admin', '🎁', false, false, now() - interval '7 days')
on conflict do nothing;

-- Sample Bike Inventory with Carousell URLs
insert into bike_inventory (make, model, condition, licence_class, price, engine_cc, power_hp, year_or_mileage, carousell_url, featured, in_stock) values
('Honda', 'RS150R 2024', 'new', '2b', 9800, 150, '17.1hp', '2024', 'https://www.carousell.sg/p/honda-rs150r-2024-atan-motoring/', true, true),
('Yamaha', 'Aerox 155 2024', 'new', '2a', 12500, 155, '16.2hp', '2024', 'https://www.carousell.sg/p/yamaha-aerox-155-2024-atan-motoring/', true, true),
('Kawasaki', 'Z650 2024', 'new', '2', 28800, 649, '68hp', '2024', 'https://www.carousell.sg/p/kawasaki-z650-2024-atan-motoring/', true, true),
('Honda', 'CBR150R 2021', 'used', '2b', 6500, 150, '18hp', '22k km', 'https://www.carousell.sg/p/honda-cbr150r-2021-good-condition-atan-motoring/', false, true),
('Yamaha', 'FZ150i 2020', 'used', '2b', 4800, 150, '14.5hp', '35k km', 'https://www.carousell.sg/p/yamaha-fz150i-2020-atan-motoring/', false, true)
on conflict do nothing;

-- Listings table for Carousell importer
create table if not exists listings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  title text not null,
  description text,
  price numeric,
  engine_cc integer,
  coe_expiry date,
  mileage integer,
  licence_class text check (licence_class in ('2B', '2A', 'Class 2')),
  seller_type text check (seller_type in ('Dealer', 'Owner')),
  location text,
  image_url text,
  carousell_source_url text,
  status text default 'draft' check (status in ('draft', 'published')),
  updated_at timestamptz default now()
);

alter table listings enable row level security;

create policy "public read published listings" on listings for select using (status = 'published');
create policy "authenticated manage listings" on listings for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create index if not exists idx_listings_status on listings(status);
create index if not exists idx_listings_created_at on listings(created_at);
create index if not exists idx_listings_licence_class on listings(licence_class);
