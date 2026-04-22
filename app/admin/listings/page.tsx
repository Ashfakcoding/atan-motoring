'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Listing } from '@/lib/listingTypes';

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'atan2024';

function AdminAuthWrapper({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if already authenticated on mount
    const token = localStorage.getItem('admin_token');
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('admin_token', 'true');
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Incorrect password');
      setPassword('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return <div style={{ padding: '40px', color: 'var(--white)' }}>Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div style={{ padding: '40px', maxWidth: '400px', margin: '100px auto' }}>
        <style jsx>{`
          .login-form {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 6px;
            padding: 32px;
          }

          .login-title {
            font-size: 18px;
            font-weight: 600;
            color: var(--white);
            margin-bottom: 24px;
            text-align: center;
          }

          .form-group {
            margin-bottom: 16px;
          }

          .form-group label {
            display: block;
            font-size: 12px;
            font-weight: 600;
            margin-bottom: 8px;
            color: var(--white);
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .form-group input {
            width: 100%;
            padding: 12px;
            background: var(--black);
            border: 1px solid var(--border);
            border-radius: 4px;
            color: var(--white);
            font-family: 'DM Sans', sans-serif;
            font-size: 14px;
          }

          .form-group input:focus {
            outline: none;
            border-color: var(--accent);
          }

          .error {
            color: #ff6b6b;
            font-size: 12px;
            margin-bottom: 16px;
            padding: 12px;
            background: rgba(255, 107, 107, 0.1);
            border: 1px solid rgba(255, 107, 107, 0.3);
            border-radius: 4px;
          }

          .btn {
            width: 100%;
            padding: 12px;
            background: var(--accent);
            color: #fff;
            border: none;
            border-radius: 4px;
            font-weight: 600;
            font-size: 13px;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            cursor: pointer;
            font-family: 'DM Sans', sans-serif;
            transition: background 0.2s;
          }

          .btn:hover {
            background: var(--accent-dim);
          }
        `}</style>

        <form onSubmit={handleLogin} className="login-form">
          <div className="login-title">Admin Access Required</div>
          {loginError && <div className="error">{loginError}</div>}
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
            />
          </div>
          <button type="submit" className="btn">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <>
      <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 100 }}>
        <button
          onClick={handleLogout}
          style={{
            background: 'none',
            border: '1px solid var(--border)',
            color: 'var(--muted)',
            padding: '8px 16px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif",
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent)';
            e.currentTarget.style.color = 'var(--accent)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.color = 'var(--muted)';
          }}
        >
          Logout
        </button>
      </div>
      {children}
    </>
  );
}

function ListingsManagementContent() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/listings');

      if (!response.ok) {
        throw new Error('Failed to load listings');
      }

      const data: Listing[] = await response.json();
      setListings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load listings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = (id: string) => {
    setDeleteConfirm(id);
  };

  const handleCancelDelete = () => {
    setDeleteConfirm(null);
  };

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/admin/listing?id=${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete listing');
      }

      setListings((prev) => prev.filter((l) => l.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete listing');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-SG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number | null) => {
    if (!price) return '—';
    return `S$${price.toLocaleString()}`;
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <style jsx>{`
        .admin-page {
          color: var(--white);
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .header h1 {
          font-size: 32px;
          font-weight: 600;
          margin: 0;
        }

        .btn-new {
          background: var(--accent);
          color: #fff;
          padding: 12px 24px;
          border-radius: 4px;
          font-weight: 600;
          font-size: 13px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          text-decoration: none;
          display: inline-block;
          transition: background 0.2s;
        }

        .btn-new:hover {
          background: var(--accent-dim);
        }

        .error-message {
          color: #ff6b6b;
          font-size: 14px;
          padding: 16px;
          background: rgba(255, 107, 107, 0.1);
          border: 1px solid rgba(255, 107, 107, 0.3);
          border-radius: 4px;
          margin-bottom: 24px;
        }

        .loading-text {
          color: var(--muted);
          font-size: 14px;
        }

        .empty-state {
          padding: 60px 40px;
          text-align: center;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 6px;
        }

        .empty-state-title {
          font-size: 18px;
          font-weight: 600;
          color: var(--white);
          margin-bottom: 12px;
        }

        .empty-state-text {
          color: var(--muted);
          font-size: 14px;
          margin-bottom: 24px;
        }

        .table-wrapper {
          overflow-x: auto;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 6px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }

        thead {
          background: var(--surface-2);
          border-bottom: 1px solid var(--border);
        }

        th {
          padding: 16px;
          text-align: left;
          font-weight: 600;
          color: var(--white);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        tbody tr {
          border-bottom: 1px solid var(--border);
          transition: background 0.2s;
        }

        tbody tr:hover {
          background: var(--surface-2);
        }

        tbody tr:last-child {
          border-bottom: none;
        }

        td {
          padding: 16px;
          color: var(--white);
        }

        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 3px;
          font-weight: 600;
          font-size: 11px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .status-draft {
          background: rgba(100, 100, 100, 0.2);
          color: #aaa;
        }

        .status-published {
          background: rgba(52, 211, 153, 0.2);
          color: #34d399;
        }

        .action-links {
          display: flex;
          gap: 12px;
        }

        .link-edit {
          color: var(--accent);
          text-decoration: none;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.2s;
        }

        .link-edit:hover {
          color: var(--accent-dim);
        }

        .btn-delete {
          background: none;
          border: none;
          color: #ff6b6b;
          font-weight: 600;
          cursor: pointer;
          font-size: 13px;
          transition: color 0.2s;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 0;
          font-family: 'DM Sans', sans-serif;
        }

        .btn-delete:hover {
          color: #ff5252;
        }

        .delete-confirm-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .delete-confirm-dialog {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 32px;
          max-width: 400px;
          width: 90%;
        }

        .delete-confirm-title {
          font-size: 18px;
          font-weight: 600;
          color: var(--white);
          margin-bottom: 16px;
        }

        .delete-confirm-text {
          color: var(--muted);
          font-size: 14px;
          margin-bottom: 24px;
          line-height: 1.6;
        }

        .delete-confirm-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }

        .btn {
          padding: 10px 20px;
          border-radius: 4px;
          font-weight: 600;
          font-size: 12px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          cursor: pointer;
          border: none;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
        }

        .btn-cancel {
          background: var(--surface-2);
          color: var(--white);
          border: 1px solid var(--border);
        }

        .btn-cancel:hover {
          border-color: var(--accent);
        }

        .btn-confirm-delete {
          background: #ff6b6b;
          color: #fff;
        }

        .btn-confirm-delete:hover {
          background: #ff5252;
        }

        .btn-confirm-delete:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .table-wrapper {
            font-size: 12px;
          }

          th,
          td {
            padding: 12px 8px;
          }

          .header {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }
        }
      `}</style>

      <div className="admin-page">
        <div className="header">
          <h1>Listings</h1>
          <Link href="/admin/import-listing" className="btn-new">
            New Listing
          </Link>
        </div>

        {error && <div className="error-message">{error}</div>}

        {isLoading ? (
          <div className="loading-text">Loading listings...</div>
        ) : listings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-title">No listings yet</div>
            <div className="empty-state-text">Create your first listing by clicking the button above.</div>
            <Link href="/admin/import-listing" className="btn-new">
              Create Listing
            </Link>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((listing) => (
                  <tr key={listing.id}>
                    <td style={{ fontWeight: 500 }}>{listing.title}</td>
                    <td>{formatPrice(listing.price)}</td>
                    <td>
                      <div className={`status-badge status-${listing.status}`}>
                        {listing.status === 'published' ? 'Published' : 'Draft'}
                      </div>
                    </td>
                    <td>{formatDate(listing.created_at)}</td>
                    <td>
                      <div className="action-links">
                        <Link href={`/admin/import-listing?edit=${listing.id}`} className="link-edit">
                          Edit
                        </Link>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteConfirm(listing.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {deleteConfirm && (
          <div className="delete-confirm-overlay">
            <div className="delete-confirm-dialog">
              <div className="delete-confirm-title">Delete Listing?</div>
              <div className="delete-confirm-text">
                This action cannot be undone. The listing and its associated image will be permanently deleted.
              </div>
              <div className="delete-confirm-actions">
                <button className="btn btn-cancel" onClick={handleCancelDelete}>
                  Cancel
                </button>
                <button
                  className="btn btn-confirm-delete"
                  onClick={() => handleDelete(deleteConfirm)}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ListingsManagementPage() {
  return (
    <AdminAuthWrapper>
      <ListingsManagementContent />
    </AdminAuthWrapper>
  );
}
