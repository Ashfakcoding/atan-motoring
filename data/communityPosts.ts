/**
 * Community Posts - Bulletin board content for the Community section
 * Edit this file to add/update community posts
 */

export type PostCategory = 'group-rides' | 'maintenance-tips' | 'workshop-news' | 'new-stock' | 'promotions';

export interface CommunityPost {
  id: number;
  title: string;
  category: PostCategory;
  excerpt: string;
  content: string;
  author: string;
  publishedDate: string; // ISO date YYYY-MM-DD
  coverEmoji?: string; // Emoji for visual representation
  pinned: boolean;
  featured: boolean;
}

// Sample posts - replace with actual content
export const COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 1,
    title: 'Weekend Group Ride to East Coast Lagoon – June 15th',
    category: 'group-rides',
    coverEmoji: '🏍️',
    excerpt: 'Join us for a scenic ride down to East Coast this Sunday. Light snacks and beverages provided!',
    content: `We're organizing a casual group ride this coming Sunday (June 15th) starting at 9:00 AM from our workshop.

**Route:** Workshop → Geylang → East Coast Lagoon Park (approximate ride time: 1 hour)

**What to bring:**
- Full safety gear required
- ID and driving licence
- Sunscreen and water bottle
- Snacks (we'll have some too!)

**Meeting point:** Atan Motoring workshop, Blk 3006 Ubi Road 1
**Departure:** 9:00 AM sharp
**Expected return:** 12:30 PM

This is a beginner-friendly ride. All experience levels welcome. We'll do a quick safety briefing and bike inspection before departing.

**Sign up:** WhatsApp us at +65 6743 1351 with your name, bike model, and phone number. Limited to 20 riders.

See you there, riders!`,
    author: 'Atan Motoring Team',
    publishedDate: '2025-06-12',
    pinned: true,
    featured: true
  },
  {
    id: 2,
    title: 'Basic Chain Maintenance – Keep Your Bike Running Smooth',
    category: 'maintenance-tips',
    coverEmoji: '🔗',
    excerpt: 'Learn how to properly inspect, lubricate, and maintain your motorcycle chain. A well-maintained chain lasts longer and keeps you safer.',
    content: `Your motorcycle chain is one of the most critical components for performance and safety. Here's how to keep it in top shape:

**Step 1: Inspection**
- Check chain tension every 500-1000 km
- Look for rust, kinks, or bent links
- Compare tension at multiple points around the chain (it should be consistent)

**Proper Tension:**
- Most bikes need 25-35mm of free play at the midpoint (check your manual)
- Too tight: increases engine wear and limits suspension
- Too loose: risks chain slippage or derailment

**Step 2: Cleaning**
- Use a soft brush and degreaser to remove dirt and old lubricant
- Don't use high-pressure water – it forces dirt into the chain
- Let it dry completely

**Step 3: Lubrication**
- Apply chain-specific lubricant (not WD-40)
- Rotate the wheel slowly and apply lube to the inside of each link
- Wipe excess lube to prevent dirt accumulation
- Re-lubricate every 200-300 km or after rain

**When to Replace:**
- If you notice 3+ damaged links in a row
- If the chain won't stay adjusted properly
- As routine maintenance every 15,000-20,000 km

**Pro Tip:** Always maintain your chain right after a ride when it's warm – lubricant penetrates better.

Questions? Drop by the workshop and we'll give your chain a free inspection!`,
    author: 'Ahmad Razali, Master Technician',
    publishedDate: '2025-06-08',
    pinned: true,
    featured: false
  },
  {
    id: 3,
    title: 'New Honda CB190X In Stock – Limited Unit Available',
    category: 'new-stock',
    coverEmoji: '🆕',
    excerpt: 'Dark metallic edition just arrived. Excellent condition, 2024 model year. Class 2A approved.',
    content: `We're excited to announce a fresh arrival at our showroom!

**Honda CB190X 2024 – Dark Metallic**

**Specifications:**
- Engine: 190cc, 4-stroke
- Power: 17.7 hp @ 8,500 rpm
- Condition: Like new
- Mileage: 150 km (showroom test runs only)
- Licence Class: 2A
- Year: 2024

**Highlights:**
- Fuel-efficient performance bike
- Comfortable ergonomics for daily commuting
- Parts availability excellent in Singapore
- Warranty: 12 months (Atan parts warranty included)

**Price:** S$5,200 (negotiable for serious buyers)

**Test ride available this weekend!** Book your slot on WhatsApp now.

Enquire: +65 6743 1351 or drop by the workshop.`,
    author: 'Atan Motoring Team',
    publishedDate: '2025-06-10',
    pinned: false,
    featured: true
  }
];

export function getPostsByCategory(category: PostCategory): CommunityPost[] {
  return COMMUNITY_POSTS.filter((p) => p.category === category);
}

export function getPinnedPosts(): CommunityPost[] {
  return COMMUNITY_POSTS.filter((p) => p.pinned).sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
}

export function getFeaturedPosts(): CommunityPost[] {
  return COMMUNITY_POSTS.filter((p) => p.featured);
}

export function getAllPosts(): CommunityPost[] {
  return [...COMMUNITY_POSTS].sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
}

export function getPostById(id: number): CommunityPost | undefined {
  return COMMUNITY_POSTS.find((p) => p.id === id);
}
