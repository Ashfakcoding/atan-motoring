import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import type { Listing } from '@/lib/listingTypes';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const { data, error } = await supabaseServer
      .from('listings')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching listing:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { data, error } = await supabaseServer
      .from('listings')
      .insert({
        title: body.title,
        description: body.description || null,
        price: body.price || null,
        engine_cc: body.engine_cc || null,
        coe_expiry: body.coe_expiry || null,
        mileage: body.mileage || null,
        licence_class: body.licence_class || null,
        seller_type: body.seller_type || null,
        location: body.location || null,
        image_url: body.image_url || null,
        carousell_source_url: body.carousell_source_url || null,
        status: body.status || 'draft'
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating listing:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const body = await request.json();

    const { data, error } = await supabaseServer
      .from('listings')
      .update({
        title: body.title,
        description: body.description || null,
        price: body.price || null,
        engine_cc: body.engine_cc || null,
        coe_expiry: body.coe_expiry || null,
        mileage: body.mileage || null,
        licence_class: body.licence_class || null,
        seller_type: body.seller_type || null,
        location: body.location || null,
        image_url: body.image_url || null,
        carousell_source_url: body.carousell_source_url || null,
        status: body.status || 'draft',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating listing:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // Get listing to find image URL
    const { data: listing } = await supabaseServer
      .from('listings')
      .select('image_url')
      .eq('id', id)
      .single();

    // Delete from database
    const { error: deleteError } = await supabaseServer
      .from('listings')
      .delete()
      .eq('id', id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 400 });
    }

    // Delete image from storage if it exists
    if (listing?.image_url) {
      try {
        // Extract filename from URL
        const urlParts = listing.image_url.split('/');
        const filename = urlParts[urlParts.length - 1];
        await supabaseServer.storage.from('listing-images').remove([filename]);
      } catch (e) {
        console.error('Error deleting image:', e);
        // Don't fail the request if image deletion fails
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting listing:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
