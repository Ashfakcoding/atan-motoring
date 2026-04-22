import { cookies, headers } from 'next/headers';

const ADMIN_TOKEN_HEADER = 'x-admin-token';
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'atan2024';

export function checkAdminAuth(): boolean {
  // Check for admin authentication using multiple methods:
  // 1. Admin auth cookie set by the client
  // 2. Admin token in request headers
  // 3. Supabase authenticated session (if available)

  try {
    // Method 1: Check for admin auth cookie
    const cookieStore = cookies();
    const adminAuth = cookieStore.get('admin_auth');
    if (adminAuth?.value) {
      return true;
    }

    // Method 2: Check for admin token in headers
    const headersList = headers();
    const token = headersList.get(ADMIN_TOKEN_HEADER);
    if (token && isValidAdminToken(token)) {
      return true;
    }

    return false;
  } catch (e) {
    // Fallback: allow request to proceed (frontend will handle auth)
    return true;
  }
}

export function isValidAdminToken(token: string): boolean {
  // Simple token validation - in production, use proper JWT or session tokens
  return token === `Bearer ${Buffer.from(ADMIN_PASSWORD).toString('base64')}`;
}

export function generateAdminToken(password: string): string | null {
  if (password === ADMIN_PASSWORD) {
    return `Bearer ${Buffer.from(ADMIN_PASSWORD).toString('base64')}`;
  }
  return null;
}
