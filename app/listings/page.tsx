import { supabase } from '@/lib/supabase';
import type { Listing } from '@/lib/listingTypes';

function formatPrice(price: number | null): string {
  if (!price) return '—';
  return `$${price.toLocaleString()}`;
}

function formatDate(dateString: string | null): string {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-SG', {
    year: 'numeric',
    month: 'short'
  });
}

async function getPublishedListings(): Promise<Listing[]> {
  if (!supabase) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching listings:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching listings:', error);
    return [];
  }
}

export default async function ListingsPage() {
  const listings = await getPublishedListings();

  return (
    <div style={{ padding: '0' }}>
      <style jsx>{`
        .listings-page {
          padding-top: 106px;
          color: var(--white);
        }

        .listings-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 60px 48px;
        }

        .page-header {
          margin-bottom: 60px;
        }

        .page-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 56px;
          line-height: 1.1;
          letter-spacing: 1px;
          margin-bottom: 16px;
        }

        .page-subtitle {
          color: var(--muted);
          font-size: 18px;
          line-height: 1.6;
          max-width: 600px;
        }

        .listings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
          margin-bottom: 60px;
        }

        .listing-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 6px;
          overflow: hidden;
          transition: all 0.3s;
        }

        .listing-card:hover {
          border-color: var(--accent);
          box-shadow: 0 8px 32px rgba(232, 75, 26, 0.15);
          transform: translateY(-2px);
        }

        .listing-image {
          width: 100%;
          height: 220px;
          object-fit: cover;
          background: var(--surface-2);
        }

        .listing-image-placeholder {
          width: 100%;
          height: 220px;
          background: var(--surface-2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--muted);
          font-size: 13px;
        }

        .listing-content {
          padding: 20px;
        }

        .listing-title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 12px;
          color: var(--white);
          line-height: 1.4;
        }

        .listing-price {
          font-size: 20px;
          font-weight: 600;
          color: var(--accent);
          margin-bottom: 16px;
        }

        .listing-specs {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 16px;
        }

        .spec-badge {
          background: rgba(232, 75, 26, 0.1);
          color: var(--accent);
          padding: 4px 10px;
          border-radius: 3px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .spec-badge.grey {
          background: rgba(100, 100, 100, 0.2);
          color: var(--muted);
        }

        .listing-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          font-size: 12px;
          color: var(--muted);
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border);
        }

        .detail-row {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .detail-label {
          font-weight: 600;
          color: var(--white);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-size: 10px;
        }

        .detail-value {
          color: var(--muted);
          font-size: 13px;
        }

        .listing-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
        }

        .seller-badge {
          background: rgba(100, 100, 100, 0.2);
          color: var(--muted);
          padding: 4px 10px;
          border-radius: 3px;
          font-size: 11px;
          font-weight: 600;
        }

        .listing-location {
          font-size: 12px;
          color: var(--muted);
        }

        .empty-state {
          text-align: center;
          padding: 80px 40px;
        }

        .empty-state-title {
          font-size: 24px;
          font-weight: 600;
          color: var(--white);
          margin-bottom: 16px;
        }

        .empty-state-text {
          color: var(--muted);
          font-size: 16px;
          margin-bottom: 32px;
        }

        @media (max-width: 768px) {
          .listings-container {
            padding: 40px 24px;
          }

          .page-title {
            font-size: 36px;
          }

          .listings-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="listings-page">
        <div className="listings-container">
          <div className="page-header">
            <h1 className="page-title">Our Listings</h1>
            <p className="page-subtitle">Browse available bikes from our inventory. Each listing has been carefully selected and verified by our team.</p>
          </div>

          {listings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-title">No listings available</div>
              <div className="empty-state-text">Check back soon for new listings!</div>
            </div>
          ) : (
            <div className="listings-grid">
              {listings.map((listing) => (
                <div key={listing.id} className="listing-card">
                  {listing.image_url ? (
                    <img
                      src={listing.image_url}
                      alt={listing.title}
                      className="listing-image"
                    />
                  ) : (
                    <div className="listing-image-placeholder">No image</div>
                  )}

                  <div className="listing-content">
                    <div className="listing-title">{listing.title}</div>

                    <div className="listing-price">{formatPrice(listing.price)}</div>

                    {(listing.engine_cc || listing.licence_class || listing.mileage !== null) && (
                      <div className="listing-specs">
                        {listing.engine_cc && (
                          <div className="spec-badge">{listing.engine_cc}cc</div>
                        )}
                        {listing.licence_class && (
                          <div className="spec-badge">{listing.licence_class}</div>
                        )}
                        {listing.mileage !== null && (
                          <div className="spec-badge grey">{listing.mileage.toLocaleString()} km</div>
                        )}
                      </div>
                    )}

                    {(listing.coe_expiry || listing.location) && (
                      <div className="listing-details">
                        {listing.coe_expiry && (
                          <div className="detail-row">
                            <div className="detail-label">COE Till</div>
                            <div className="detail-value">{formatDate(listing.coe_expiry)}</div>
                          </div>
                        )}
                        {listing.location && (
                          <div className="detail-row">
                            <div className="detail-label">Location</div>
                            <div className="detail-value">{listing.location}</div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="listing-footer">
                      {listing.seller_type && (
                        <div className="seller-badge">{listing.seller_type}</div>
                      )}
                      {listing.location && (
                        <div className="listing-location">{listing.location}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
