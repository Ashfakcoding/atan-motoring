import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import type { CarousellFetchResponse } from '@/lib/listingTypes';

const BROWSER_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

function extractOgTag(html: string, tagName: string): string {
  const regex = new RegExp(`<meta property="og:${tagName}"\\s+content="([^"]*)"`, 'i');
  const match = html.match(regex);
  return match ? match[1] : '';
}

async function downloadImage(imageUrl: string): Promise<Buffer | null> {
  try {
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': BROWSER_USER_AGENT
      },
      timeout: 10000
    });

    if (!response.ok) {
      console.error(`Failed to download image: ${response.statusText}`);
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error('Error downloading image:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    // For now, skip auth check - frontend handles it with login modal
    // In production, implement proper JWT or session-based auth

    const body = await request.json();
    const { url } = body;

    // Validate URL
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    if (!url.startsWith('https://www.carousell.sg/')) {
      return NextResponse.json(
        { error: 'Only Carousell Singapore URLs are accepted.' },
        { status: 400 }
      );
    }

    // Fetch the Carousell page
    const pageResponse = await fetch(url, {
      headers: {
        'User-Agent': BROWSER_USER_AGENT
      },
      timeout: 10000
    });

    if (!pageResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch Carousell listing' },
        { status: 400 }
      );
    }

    const html = await pageResponse.text();

    // Extract OG tags
    const title = extractOgTag(html, 'title');
    const description = extractOgTag(html, 'description');
    const imageUrl = extractOgTag(html, 'image');

    let uploadedImageUrl = '';

    // Download and upload image if available
    if (imageUrl) {
      try {
        const imageBuffer = await downloadImage(imageUrl);

        if (imageBuffer) {
          // Generate unique filename
          const filename = `listing-${Date.now()}.jpg`;

          // Upload to Supabase Storage
          const { data, error: uploadError } = await supabaseServer.storage
            .from('listing-images')
            .upload(filename, imageBuffer, {
              contentType: 'image/jpeg',
              upsert: false
            });

          if (uploadError) {
            console.error('Image upload error:', uploadError);
            // Continue without image - don't block the response
          } else if (data) {
            // Get public URL
            const { data: publicUrlData } = supabaseServer.storage
              .from('listing-images')
              .getPublicUrl(filename);

            uploadedImageUrl = publicUrlData.publicUrl;
          }
        }
      } catch (error) {
        console.error('Error processing image:', error);
        // Continue without image - don't block the response
      }
    }

    const response: CarousellFetchResponse = {
      title: title || '',
      description: description || '',
      image_url: uploadedImageUrl,
      carousell_source_url: url
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Carousell fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
