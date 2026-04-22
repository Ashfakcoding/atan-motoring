'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import type { CarousellFetchResponse, Listing } from '@/lib/listingTypes';

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

export default function ImportListingPage() {
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  // Carousell URL input
  const [carousellUrl, setCarousellUrl] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState('');

  // Form state
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    engine_cc: '',
    coe_expiry: '',
    mileage: '',
    licence_class: '' as '' | '2B' | '2A' | 'Class 2',
    seller_type: '' as '' | 'Dealer' | 'Owner',
    location: '',
    image_url: '',
    carousell_source_url: ''
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  // Load existing listing if editing
  useEffect(() => {
    if (editId) {
      loadListing(editId);
    }
  }, [editId]);

  const loadListing = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/listing?id=${id}`);
      if (!response.ok) throw new Error('Failed to load listing');
      const listing: Listing = await response.json();

      setForm({
        title: listing.title,
        description: listing.description || '',
        price: listing.price ? listing.price.toString() : '',
        engine_cc: listing.engine_cc ? listing.engine_cc.toString() : '',
        coe_expiry: listing.coe_expiry || '',
        mileage: listing.mileage ? listing.mileage.toString() : '',
        licence_class: listing.licence_class || '',
        seller_type: listing.seller_type || '',
        location: listing.location || '',
        image_url: listing.image_url || '',
        carousell_source_url: listing.carousell_source_url || ''
      });

      if (listing.image_url) {
        setImagePreview(listing.image_url);
      }
    } catch (error) {
      console.error('Error loading listing:', error);
      setSaveError('Failed to load listing');
    }
  };

  const handleFetchCarousell = async () => {
    if (!carousellUrl.trim()) {
      setFetchError('Please enter a Carousell URL');
      return;
    }

    if (!carousellUrl.startsWith('https://www.carousell.sg/')) {
      setFetchError('Only Carousell Singapore URLs are accepted.');
      return;
    }

    setIsFetching(true);
    setFetchError('');

    try {
      const response = await fetch('/api/admin/fetch-carousell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: carousellUrl })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch listing');
      }

      const data: CarousellFetchResponse = await response.json();

      setForm((prev) => ({
        ...prev,
        title: data.title,
        description: data.description,
        image_url: data.image_url,
        carousell_source_url: data.carousell_source_url
      }));

      if (data.image_url) {
        setImagePreview(data.image_url);
      }
    } catch (error) {
      setFetchError(error instanceof Error ? error.message : 'Failed to fetch listing');
    } finally {
      setIsFetching(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);

    // Show preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadImageToSupabase = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/admin/upload-image', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.url;
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!form.title.trim()) {
      errors.title = 'Title is required';
    }

    if (!form.price || parseFloat(form.price) <= 0) {
      errors.price = 'Price is required and must be greater than 0';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveListing = async (status: 'draft' | 'published') => {
    if (!validateForm()) return;

    setIsSaving(true);
    setSaveError('');
    setSuccessMessage('');

    try {
      let finalImageUrl = form.image_url;

      // Upload new image if provided
      if (imageFile) {
        finalImageUrl = await uploadImageToSupabase(imageFile);
      }

      const method = editId ? 'PUT' : 'POST';
      const url = editId ? `/api/admin/listing?id=${editId}` : '/api/admin/listing';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          image_url: finalImageUrl,
          price: form.price ? parseFloat(form.price) : null,
          engine_cc: form.engine_cc ? parseInt(form.engine_cc) : null,
          mileage: form.mileage ? parseInt(form.mileage) : null,
          status
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save listing');
      }

      const savedListing: Listing = await response.json();

      setSaveSuccess(`Listing saved successfully. ID: ${savedListing.id}`);

      // Reset form for new listing
      if (!editId) {
        setCarousellUrl('');
        setForm({
          title: '',
          description: '',
          price: '',
          engine_cc: '',
          coe_expiry: '',
          mileage: '',
          licence_class: '',
          seller_type: '',
          location: '',
          image_url: '',
          carousell_source_url: ''
        });
        setImageFile(null);
        setImagePreview(null);
      }
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Failed to save listing');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFormChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear validation error for this field when user starts editing
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <AdminAuthWrapper>
      <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
        <style jsx>{`
          .admin-page {
            color: var(--white);
          }

          .section {
            margin-bottom: 40px;
            padding: 24px;
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 6px;
          }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 8px;
          color: var(--white);
        }

        .section-subtitle {
          font-size: 14px;
          color: var(--muted);
          margin-bottom: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 8px;
          color: var(--white);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-group input,
        .form-group textarea,
        .form-group select {
          width: 100%;
          padding: 12px;
          background: var(--black);
          border: 1px solid var(--border);
          border-radius: 4px;
          color: var(--white);
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          transition: border-color 0.2s;
        }

        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
          outline: none;
          border-color: var(--accent);
        }

        .form-group textarea {
          min-height: 100px;
          resize: vertical;
        }

        .form-error {
          color: #ff6b6b;
          font-size: 12px;
          margin-top: 4px;
        }

        .input-group {
          display: flex;
          gap: 12px;
        }

        .input-group > div {
          flex: 1;
        }

        .button-group {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }

        .btn {
          padding: 12px 24px;
          border: none;
          border-radius: 4px;
          font-weight: 600;
          font-size: 13px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }

        .btn-primary {
          background: var(--accent);
          color: #fff;
        }

        .btn-primary:hover {
          background: var(--accent-dim);
        }

        .btn-secondary {
          background: var(--surface-2);
          color: var(--white);
          border: 1px solid var(--border);
        }

        .btn-secondary:hover {
          background: var(--surface);
          border-color: var(--accent);
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .loading-text {
          color: var(--muted);
          font-size: 13px;
        }

        .error-message {
          color: #ff6b6b;
          font-size: 13px;
          padding: 12px;
          background: rgba(255, 107, 107, 0.1);
          border: 1px solid rgba(255, 107, 107, 0.3);
          border-radius: 4px;
          margin-bottom: 12px;
        }

        .success-message {
          color: #34d399;
          font-size: 13px;
          padding: 12px;
          background: rgba(52, 211, 153, 0.1);
          border: 1px solid rgba(52, 211, 153, 0.3);
          border-radius: 4px;
          margin-bottom: 12px;
        }

        .image-preview {
          width: 100%;
          max-width: 300px;
          height: 300px;
          object-fit: cover;
          border-radius: 4px;
          border: 1px solid var(--border);
        }

        .image-placeholder {
          width: 100%;
          max-width: 300px;
          height: 300px;
          background: var(--surface-2);
          border: 1px dashed var(--border);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--muted);
          font-size: 13px;
        }

        .image-upload-label {
          display: inline-block;
          padding: 12px 24px;
          background: var(--surface-2);
          border: 1px solid var(--border);
          border-radius: 4px;
          color: var(--white);
          font-weight: 600;
          font-size: 13px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 12px;
        }

        .image-upload-label:hover {
          border-color: var(--accent);
          color: var(--accent);
        }

        .image-upload-label input {
          display: none;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }

          .button-group {
            flex-direction: column;
          }

          .btn {
            width: 100%;
          }
        }
      `}</style>

      <div className="admin-page">
        <h1 style={{ marginBottom: '8px' }}>Import from Carousell</h1>
        <p style={{ color: 'var(--muted)', marginBottom: '40px' }}>
          Paste a URL from your own Carousell store to pre-fill the listing form.
        </p>

        {/* SECTION A: Carousell URL Input */}
        <div className="section">
          <div className="form-group">
            <label>Carousell URL</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                type="text"
                placeholder="https://www.carousell.sg/your-listing..."
                value={carousellUrl}
                onChange={(e) => setCarousellUrl(e.target.value)}
                style={{ flex: 1 }}
              />
              <button
                className="btn btn-primary"
                onClick={handleFetchCarousell}
                disabled={isFetching}
              >
                {isFetching ? 'Fetching...' : 'Fetch Listing'}
              </button>
            </div>
            {fetchError && <div className="error-message">{fetchError}</div>}
          </div>
        </div>

        {/* SECTION B: Listing Form */}
        <div className="section">
          <div className="section-title">Listing Details</div>

          {saveError && <div className="error-message">{saveError}</div>}
          {saveSuccess && <div className="success-message">{saveSuccess}</div>}

          {/* Title and Description */}
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleFormChange('title', e.target.value)}
              placeholder="e.g. Honda CB500F 2024"
            />
            {validationErrors.title && <div className="form-error">{validationErrors.title}</div>}
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => handleFormChange('description', e.target.value)}
              placeholder="Enter listing description..."
            />
          </div>

          {/* Price and Engine */}
          <div className="form-row">
            <div className="form-group">
              <label>Price (SGD) *</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => handleFormChange('price', e.target.value)}
                placeholder="e.g. 12800"
              />
              {validationErrors.price && <div className="form-error">{validationErrors.price}</div>}
            </div>
            <div className="form-group">
              <label>Engine CC</label>
              <input
                type="number"
                value={form.engine_cc}
                onChange={(e) => handleFormChange('engine_cc', e.target.value)}
                placeholder="e.g. 689"
              />
            </div>
          </div>

          {/* COE and Mileage */}
          <div className="form-row">
            <div className="form-group">
              <label>COE Expiry Date</label>
              <input
                type="date"
                value={form.coe_expiry}
                onChange={(e) => handleFormChange('coe_expiry', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Mileage (km)</label>
              <input
                type="number"
                value={form.mileage}
                onChange={(e) => handleFormChange('mileage', e.target.value)}
                placeholder="e.g. 8400"
              />
            </div>
          </div>

          {/* Licence Class and Seller Type */}
          <div className="form-row">
            <div className="form-group">
              <label>Licence Class</label>
              <select
                value={form.licence_class}
                onChange={(e) => handleFormChange('licence_class', e.target.value || '')}
              >
                <option value="">Select licence class...</option>
                <option value="2B">2B</option>
                <option value="2A">2A</option>
                <option value="Class 2">Class 2</option>
              </select>
            </div>
            <div className="form-group">
              <label>Seller Type</label>
              <select
                value={form.seller_type}
                onChange={(e) => handleFormChange('seller_type', e.target.value || '')}
              >
                <option value="">Select seller type...</option>
                <option value="Dealer">Dealer</option>
                <option value="Owner">Owner</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => handleFormChange('location', e.target.value)}
              placeholder="e.g. Ubi, Tampines, Jurong East"
            />
          </div>

          {/* Image */}
          <div className="form-group">
            <label>Image</label>
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="image-preview" />
            ) : (
              <div className="image-placeholder">No image</div>
            )}
            <label className="image-upload-label">
              Upload New Image
              <input type="file" accept="image/*" onChange={handleImageUpload} />
            </label>
          </div>

          {/* Carousell Source URL (readonly) */}
          <div className="form-group">
            <label>Source (reference only)</label>
            <input
              type="text"
              value={form.carousell_source_url}
              readOnly
              placeholder="Original Carousell URL"
              style={{ opacity: 0.6 }}
            />
          </div>

          {/* Action Buttons */}
          <div className="button-group">
            <button
              className="btn btn-secondary"
              onClick={() => handleSaveListing('draft')}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save as Draft'}
            </button>
            <button
              className="btn btn-primary"
              onClick={() => handleSaveListing('published')}
              disabled={isSaving}
            >
              {isSaving ? 'Publishing...' : 'Publish Listing'}
            </button>
          </div>
        </div>
      </div>
    </AdminAuthWrapper>
  );
}
