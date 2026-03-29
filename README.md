# Atan Motoring Project

This is a full Next.js + Supabase + Vercel project rebuilt from the original HTML site.

## Stack
- Next.js App Router
- Supabase database + auth
- Vercel deployment

## Features
- Pixel-matched single-page dealership UI
- Bikes listing with filters
- Services cards and pricing table
- Reviews section
- Contact modal
- Bike enquiry modal
- Admin login modal
- Admin sidebar with CRUD for bikes, services, and pricing
- WhatsApp floating button
- Works with Supabase, but also falls back to built-in demo data if env vars are not set

## Setup
1. Install dependencies
   npm install

2. Create `.env.local` from `.env.example`

3. Create a Supabase project and paste your values:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_ADMIN_EMAIL`
   - `NEXT_PUBLIC_ADMIN_USERNAME`

4. Run the SQL in `supabase/schema.sql`

5. Create an auth user in Supabase Auth using the email in `NEXT_PUBLIC_ADMIN_EMAIL`

6. Start locally
   npm run dev

## Admin login
- Username: whatever you set in `NEXT_PUBLIC_ADMIN_USERNAME` (default `admin`)
- Password: the password for the Supabase auth user

If Supabase is not configured, a local demo login is available:
- Username: `admin`
- Password: `atan2024`

## Deploy to Vercel
1. Push this folder to GitHub
2. Import the repo into Vercel
3. Add the same environment variables in Vercel
4. Deploy

## Notes
- CRUD writes are done client-side and synced to Supabase
- The UI intentionally preserves the original look, animation behavior, modal layout, and page-tab structure from the source HTML
