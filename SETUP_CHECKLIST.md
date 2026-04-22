# Carousell Listing Importer - Quick Setup Checklist

## Pre-Implementation Checklist

- [ ] Have Supabase project credentials ready (project URL, anon key, service key)
- [ ] Have admin password decided (or use default: `atan2024`)
- [ ] Backup existing database if applicable

## Step 1: Database Setup (Supabase)

### 1a. Create Listings Table

Go to **Supabase Dashboard → SQL Editor** and run:

```sql
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
```

- [ ] Table created successfully
- [ ] Policies enabled
- [ ] Indexes created

### 1b. Create Storage Bucket

1. Go to **Supabase Dashboard → Storage → Buckets**
2. Click **Create a new bucket**
3. Name: `listing-images`
4. Choose **Public** access
5. Click **Create bucket**

- [ ] Bucket created with public access

## Step 2: Environment Variables

### 2a. Get Service Key

1. Go to **Supabase Dashboard → Settings → API**
2. Copy **Service Key** (labeled "service_role secret")
3. Keep this safe - it has admin access to your database

### 2b. Update `.env.local`

Add these variables to `.env.local`:

```env
# Supabase credentials (you probably already have these)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# NEW: Required for image uploads
SUPABASE_SERVICE_KEY=your-service-key-from-step-2a

# OPTIONAL: Customize admin password (defaults to 'atan2024')
NEXT_PUBLIC_ADMIN_PASSWORD=your-secure-password

# OPTIONAL: If using Supabase auth (not local credentials)
NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com
NEXT_PUBLIC_ADMIN_USERNAME=admin
```

- [ ] `.env.local` updated with `SUPABASE_SERVICE_KEY`
- [ ] Admin password set (or using default)
- [ ] Variables match Supabase project exactly

## Step 3: Code Review

The following files have been created/modified:

**Created (New Files):**
- [ ] `lib/supabaseServer.ts` - Server Supabase client
- [ ] `lib/listingTypes.ts` - TypeScript types for listings
- [ ] `lib/adminAuth.ts` - Admin auth helper
- [ ] `app/api/admin/fetch-carousell/route.ts` - Carousell fetcher
- [ ] `app/api/admin/listing/route.ts` - Listing CRUD API
- [ ] `app/api/admin/upload-image/route.ts` - Image upload API
- [ ] `app/api/admin/listings/route.ts` - List all listings API
- [ ] `app/admin/import-listing/page.tsx` - Admin import page
- [ ] `app/admin/listings/page.tsx` - Admin management page
- [ ] `app/listings/page.tsx` - Public listings display

**Modified:**
- [ ] `supabase/schema.sql` - Added listings table (check in git diff)

## Step 4: Test the Feature Locally

### 4a. Start Development Server

```bash
npm run dev
```

- [ ] Server starts without errors
- [ ] No TypeScript compilation errors

### 4b. Test Admin Import Page

1. Navigate to `http://localhost:3000/admin/import-listing`
2. Enter password (default: `atan2024`)
3. Paste a real Carousell URL (e.g., `https://www.carousell.sg/p/gaming-laptop-good-condition-1234567890/`)
4. Click **Fetch Listing**
5. Verify fields populate

- [ ] Login modal appears
- [ ] Login works with correct password
- [ ] Can fetch Carousell listing
- [ ] Fields auto-populate
- [ ] Can edit fields
- [ ] Can save as draft/publish

### 4c. Test Admin Listings Page

1. Navigate to `http://localhost:3000/admin/listings`
2. Enter password
3. Should see table with previous listings

- [ ] Can view all listings
- [ ] Can click Edit
- [ ] Can delete listing (with confirmation)

### 4d. Test Public Listings Page

1. Navigate to `http://localhost:3000/listings`
2. Should see published listings only

- [ ] Published listings appear
- [ ] No draft listings shown
- [ ] Images display correctly
- [ ] Card shows all metadata

## Step 5: Deployment Prep

### 5a. Environment Variables (Production)

Add to your hosting platform (Vercel, etc.):

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=
NEXT_PUBLIC_ADMIN_PASSWORD=
```

- [ ] Environment variables set in production
- [ ] Double-check `SUPABASE_SERVICE_KEY` is correct

### 5b. Security Checklist

- [ ] Admin password is strong (not `atan2024` in production)
- [ ] `SUPABASE_SERVICE_KEY` is kept secret (never commit to git)
- [ ] Supabase RLS policies are enabled
- [ ] Storage bucket is set to Public
- [ ] `NEXT_PUBLIC_ADMIN_PASSWORD` is treated as public (shown in client code)

### 5c. Build Test

```bash
npm run build
```

- [ ] Build completes without errors
- [ ] No warnings about missing keys

## Step 6: Post-Deployment

### 6a. Test in Production

1. Visit production URL `/admin/import-listing`
2. Login and test importing a listing
3. Check that listing appears on `/listings`

- [ ] Import works
- [ ] Images upload to Supabase
- [ ] Published listings appear on public page

### 6b. Monitor Logs

- [ ] Check server logs for any errors
- [ ] Monitor Supabase dashboard for failed queries
- [ ] Check for image upload failures

### 6c. Documentation

- [ ] Share `CAROUSELL_IMPORTER_GUIDE.md` with team
- [ ] Document custom admin password
- [ ] Add feature to site documentation
- [ ] Train admins on how to use feature

## Rollback Plan

If something goes wrong:

1. **Database**: All data is in Supabase and can be accessed directly
2. **Files**: Code can be reverted via git
3. **Environment Variables**: Remove from hosting platform
4. **Storage**: Bucket can be deleted from Supabase if needed

## Common Issues & Solutions

### Issue: "SUPABASE_SERVICE_KEY is not defined"

**Solution**: Add to `.env.local` and restart server

### Issue: "Listings table does not exist"

**Solution**: Run SQL migration in Supabase SQL Editor

### Issue: "Storage bucket not found"

**Solution**: Create `listing-images` bucket with Public access in Supabase Storage

### Issue: "Can't login to admin panel"

**Solution**: 
- Default password is `atan2024`
- If changed, verify `NEXT_PUBLIC_ADMIN_PASSWORD` env var

### Issue: "Images not uploading"

**Solution**:
- Check `listing-images` bucket exists and is Public
- Check `SUPABASE_SERVICE_KEY` is correct
- Check browser console for errors
- Try uploading directly in Supabase Storage dashboard

## Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Implementation Guide**: See `CAROUSELL_IMPORTER_GUIDE.md`

## Timeline

| Step | Time | Status |
|------|------|--------|
| DB Setup | 5-10 min | [ ] Complete |
| Env Variables | 2-3 min | [ ] Complete |
| Code Review | 5-10 min | [ ] Complete |
| Local Testing | 10-15 min | [ ] Complete |
| Deployment | 5-10 min | [ ] Complete |
| Post-Deploy Test | 5 min | [ ] Complete |
| **Total** | ~45 min | [ ] Complete |

---

**Last Updated**: April 22, 2026  
**Version**: 1.0.0  
**Status**: Ready for Implementation
