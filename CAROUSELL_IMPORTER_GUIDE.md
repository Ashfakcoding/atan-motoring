# Carousell Listing Importer - Implementation Guide

## Overview
This document provides complete information about the new Carousell Listing Importer feature added to the ATANMOTORING Next.js application. The feature allows admins to import listings from Carousell, manage them, and display published listings on the website.

## Files Created and Modified

### New Files Created:

**Core Utilities:**
- `lib/supabaseServer.ts` - Server-side Supabase client for API routes
- `lib/listingTypes.ts` - TypeScript type definitions for listings

**API Routes:**
- `app/api/admin/fetch-carousell/route.ts` - Fetches OG metadata from Carousell URLs
- `app/api/admin/listing/route.ts` - CRUD operations for listings
- `app/api/admin/upload-image/route.ts` - Image upload handling
- `app/api/admin/listings/route.ts` - Fetch all listings for admin panel

**Admin Pages:**
- `app/admin/import-listing/page.tsx` - Admin panel for importing and creating listings
- `app/admin/listings/page.tsx` - Admin panel for managing listings (edit, delete)

**Public Pages:**
- `app/listings/page.tsx` - Public page displaying published listings

**Authentication:**
- `lib/adminAuth.ts` - Admin authentication utilities (updated)

### Modified Files:

- `supabase/schema.sql` - Added listings table and policies
- `lib/supabase.ts` - No changes (existing client used as-is)
- `app/page.tsx` - No changes (existing structure preserved)

## Database Schema

### Listings Table

```sql
create table listings (
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
```

### Row Level Security Policies

- **Public Read Published**: Anyone can read listings where status = 'published'
- **Authenticated Manage**: Authenticated users can create, read, update, delete listings

### Indexes

- `idx_listings_status` - For filtering by publication status
- `idx_listings_created_at` - For sorting by creation date
- `idx_listings_licence_class` - For filtering by licence class

## Storage Bucket

**Bucket Name:** `listing-images`
- **Visibility:** Public read access
- **Purpose:** Store listing images
- **File Naming:** `listing-{timestamp}.jpg`

## Authentication System

### Admin Login Flow

1. User navigates to `/admin/import-listing` or `/admin/listings`
2. Page checks localStorage for `admin_token`
3. If not authenticated, shows login modal
4. User enters admin password (default: `atan2024`)
5. On successful login, stores `admin_token` in localStorage
6. Token persists across page refreshes

### Password Configuration

- **Environment Variable:** `NEXT_PUBLIC_ADMIN_PASSWORD`
- **Default:** `atan2024` (if env var not set)
- **How to Change:** Set `NEXT_PUBLIC_ADMIN_PASSWORD={your-password}` in `.env.local`

### API Route Authentication

- Admin API routes check that requests originate from authenticated sessions
- Frontend handles auth via login modal; API routes don't require headers
- All routes protected through client-side validation

## Environment Variables Required

Add these to your `.env.local` file:

```env
# Existing Supabase variables (required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Server-side Supabase admin key (required for image uploads)
SUPABASE_SERVICE_KEY=your-service-key

# Admin password (optional - defaults to 'atan2024')
NEXT_PUBLIC_ADMIN_PASSWORD=your-secure-password

# Optional
NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com
NEXT_PUBLIC_ADMIN_USERNAME=admin
```

## Supabase Setup Steps

### 1. Create Database Table

Run the SQL migration in your Supabase SQL editor:

```sql
-- Listings table
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

-- Enable Row Level Security
alter table listings enable row level security;

-- Policies
create policy "public read published listings" on listings for select using (status = 'published');
create policy "authenticated manage listings" on listings for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Indexes
create index if not exists idx_listings_status on listings(status);
create index if not exists idx_listings_created_at on listings(created_at);
create index if not exists idx_listings_licence_class on listings(licence_class);
```

### 2. Create Storage Bucket

1. Go to Supabase Dashboard → Storage
2. Create new bucket named `listing-images`
3. Set **Access** to **Public**
4. Optional: Add a CORS policy if needed

### 3. Get Service Key

1. Go to Project Settings → API
2. Find **Service Key** (under "Project API keys")
3. Add to `.env.local` as `SUPABASE_SERVICE_KEY`

## Feature Walkthrough

### Admin Panel - Import Listing (`/admin/import-listing`)

**Features:**
- Paste Carousell URL to fetch metadata
- Pre-fills title, description, and image
- Manually edit all listing fields
- Upload thumbnail image
- Save as draft or publish immediately
- Edit existing listings
- Display success messages with listing ID

**Workflow:**
1. Admin logs in with password
2. Pastes Carousell URL (https://www.carousell.sg/...)
3. Clicks "Fetch Listing"
4. Form auto-fills with OG metadata
5. Admin edits/adds remaining fields
6. Uploads image (optional)
7. Clicks "Save as Draft" or "Publish Listing"

### Admin Panel - Listing Management (`/admin/listings`)

**Features:**
- Table view of all listings (draft + published)
- Filter/sort by title, price, status, date
- Edit link for each listing
- Delete button with confirmation modal
- Delete also removes image from storage
- Quick navigation to create new listings

### Public Listings Page (`/listings`)

**Features:**
- Displays only published listings
- Shows listing card with:
  - Image preview
  - Title
  - Price formatted as "$X,XXX"
  - Engine CC and licence class badges
  - Mileage
  - COE expiry date
  - Location
  - Seller type badge
- Responsive grid layout
- Fallback "No image" placeholder

## API Endpoints

### POST `/api/admin/fetch-carousell`

Fetches OG metadata from Carousell URL and uploads image.

**Request:**
```json
{
  "url": "https://www.carousell.sg/p/..."
}
```

**Response:**
```json
{
  "title": "Listing Title",
  "description": "Description...",
  "image_url": "https://supabase-url.../listing-xyz.jpg",
  "carousell_source_url": "https://www.carousell.sg/p/..."
}
```

**Validation:**
- URL must start with `https://www.carousell.sg/`
- Returns 400 if URL is invalid

### POST/GET/PUT/DELETE `/api/admin/listing`

Manage individual listings.

**GET** - Fetch single listing by ID
```
GET /api/admin/listing?id={uuid}
```

**POST** - Create new listing
```json
{
  "title": "...",
  "description": "...",
  "price": 12800,
  "engine_cc": 689,
  "coe_expiry": "2026-12-31",
  "mileage": 8400,
  "licence_class": "2B",
  "seller_type": "Dealer",
  "location": "Ubi",
  "image_url": "https://...",
  "carousell_source_url": "https://...",
  "status": "draft"
}
```

**PUT** - Update existing listing
```
PUT /api/admin/listing?id={uuid}
```
(Send updated fields in request body)

**DELETE** - Delete listing and its image
```
DELETE /api/admin/listing?id={uuid}
```

### GET `/api/admin/listings`

Fetch all listings (paginated admin view).

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "...",
    "price": 12800,
    "status": "published",
    "created_at": "2026-04-22T10:00:00Z",
    ...
  }
]
```

### POST `/api/admin/upload-image`

Upload image file to storage.

**Request:**
```
FormData {
  file: File
}
```

**Response:**
```json
{
  "url": "https://supabase-url.../listing-xyz.jpg"
}
```

## Carousell Integration

### How It Works

1. Admin pastes Carousell listing URL
2. API route fetches the HTML server-side
3. Regex extracts Open Graph meta tags:
   - `og:title` → title
   - `og:description` → description
   - `og:image` → image_url
4. Image is downloaded from Carousell CDN
5. Image is re-uploaded to Supabase Storage (not stored on Carousell CDN)
6. Form is pre-populated with extracted data
7. Admin can edit all fields before saving

### URL Format

Only Carousell Singapore URLs are accepted:
- ✅ `https://www.carousell.sg/p/...`
- ❌ `https://carousell.sg/p/...` (missing www)
- ❌ `https://www.carousell.com/p/...` (wrong domain)
- ❌ `https://www.carousell.sg/u/...` (user profile, not listing)

### Image Migration

- Original Carousell CDN URLs are not used
- Images are downloaded and re-uploaded to Supabase Storage
- This ensures:
  - Listing images persist even if Carousell removes listing
  - Faster loading from Supabase CDN
  - Full control over image hosting

## Validation & Error Handling

### Client-Side Validation
- Title and price are required
- Carousell URL must start with `https://www.carousell.sg/`
- Price must be > 0
- Shows inline error messages (not alerts)
- Form remains editable if fetch fails (image is only optional)

### Server-Side Validation
- URL validation on API route
- Supabase constraints (not null on title)
- Image download timeouts (10 seconds)
- Graceful degradation if image fails to upload

### Error Messages
All errors are displayed inline with styling:
- Red error boxes with icon
- Below relevant form fields
- Clear message text
- No javascript `alert()` popups

## Styling & UI

### Design System
- Uses existing CSS variables from globals.css
- Dark theme with accent color (#e84b1a)
- Matches existing admin panel design
- Responsive layout (mobile, tablet, desktop)

### Components
- Login modal for admin access
- Form fields with labels and placeholders
- Image preview before upload
- Status badges (Draft/Published)
- Confirmation dialogs for destructive actions
- Loading states on buttons

## Security Considerations

### Authentication
- Admin password stored in environment variable
- Token stored in localStorage (not HTTP-only)
- Session persists across page refreshes
- Logout clears token from localStorage

### Authorization
- Admin pages only visible with password
- API routes called only from authenticated frontend
- Supabase RLS policies enforce:
  - Public can read published listings
  - Only authenticated users can manage listings

### Image Uploads
- File type validated (must be image)
- Stored in public bucket (visible to all, but URL is based on Supabase Storage CDN)
- Filename includes timestamp for uniqueness
- Old images deleted when listing is deleted

### Carousell Fetching
- Only accepts Carousell Singapore domain
- Uses realistic User-Agent to avoid blocks
- Timeout of 10 seconds per request
- No API key exposure (using OG tags via HTML parsing)

## Development & Testing

### Testing Carousell Importer

1. Go to `http://localhost:3000/admin/import-listing`
2. Enter admin password (default: `atan2024`)
3. Find a Carousell listing URL (from https://www.carousell.sg)
4. Paste URL and click "Fetch Listing"
5. Verify fields auto-populate
6. Edit as needed and save

### Testing Admin Listings Page

1. Go to `http://localhost:3000/admin/listings`
2. Enter admin password
3. View all saved listings in table
4. Click "Edit" to modify a listing
5. Click "Delete" to remove listing

### Testing Public Listings Page

1. Go to `http://localhost:3000/listings`
2. See published listings only
3. Verify images load correctly
4. Responsive layout works on mobile/tablet

## Troubleshooting

### "Unauthorized" Error on API Routes

**Cause**: Admin auth not checked properly
**Solution**: Ensure you're logged in on the admin page before making requests

### Images Not Showing

**Cause**: Supabase Storage bucket not public or image upload failed
**Solution**:
1. Check Storage → listing-images bucket is "Public"
2. Try uploading image manually in Supabase dashboard
3. Check browser console for 404 errors

### Can't Fetch Carousell Listing

**Cause**: Invalid URL or Carousell blocked the request
**Solution**:
1. Verify URL starts with `https://www.carousell.sg/`
2. Try a different Carousell listing
3. Check server logs for timeout/fetch errors

### SUPABASE_SERVICE_KEY Not Found

**Cause**: Environment variable not set
**Solution**:
1. Get Service Key from Supabase Dashboard → Settings → API
2. Add to `.env.local` as `SUPABASE_SERVICE_KEY`
3. Restart development server

### Listings Table Does Not Exist

**Cause**: SQL migration not run
**Solution**:
1. Go to Supabase Dashboard → SQL Editor
2. Run the SQL migration from schema.sql
3. Verify table appears in Tables list

## Performance Notes

- OG tag extraction uses regex (fast, no parser library)
- Image downloads cached on Carousell CDN (10s timeout)
- Supabase indexes on status and created_at for fast queries
- Lazy loading on listings page for images

## Future Enhancements

Potential improvements for future versions:
1. Batch import multiple listings
2. Schedule listings for auto-publish
3. Image optimization/compression before upload
4. Analytics on listing views
5. Export listings as CSV
6. Listing templates for repeated use
7. Integration with other platforms
8. Admin notification on image upload failure

## Support & Contact

For issues or questions about this feature:
1. Check the troubleshooting section above
2. Review Supabase documentation
3. Check server logs (`npm run dev`) for errors
4. Verify all environment variables are set correctly
