'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { DEFAULTS, type Bike, type PricingRow, type Review, type Service } from '@/lib/defaults';
import { hasSupabase, supabase } from '@/lib/supabase';

type PageKey = 'home' | 'bikes' | 'servicing' | 'reviews' | 'contact';
type AdminTab = 'bikes' | 'services' | 'pricing';
type Filters = { condition: 'all' | 'new' | 'used'; class: 'all' | '2b' | '2a' | '2'; brand: string };
type ContactPayload = { first_name: string; last_name: string; phone: string; enquiry_type: string; message: string };
type BikeEnquiryPayload = { name: string; phone: string; bike_name: string; message: string };

type BikeForm = {
  id: number | '';
  make: string;
  model: string;
  cond: 'new' | 'used';
  cls: '2b' | '2a' | '2';
  price: string;
  engine: string;
  power: string;
  spec3: string;
  status: string;
};

type ServiceForm = {
  id: number | '';
  icon: string;
  name: string;
  desc: string;
  price: string;
};

type PricingForm = {
  id: number | '';
  type: 'item' | 'cat';
  catName: string;
  name: string;
  details: string;
  amount: string;
  popular: 'yes' | 'no';
};

const LOCAL_USER = 'admin';
const LOCAL_PASS = 'atan2024';
const ENQUIRY_OPTIONS = ['General Servicing', 'Engine Overhaul', 'Buying a New Bike', 'Buying a Used Bike', 'Trade-In', 'Other'];

const emptyBikeForm: BikeForm = {
  id: '',
  make: '',
  model: '',
  cond: 'new',
  cls: '2b',
  price: '',
  engine: '',
  power: '',
  spec3: '',
  status: ''
};

const emptyServiceForm: ServiceForm = { id: '', icon: '', name: '', desc: '', price: '' };
const emptyPricingForm: PricingForm = { id: '', type: 'item', catName: '', name: '', details: '', amount: '', popular: 'no' };

function BikeSvg({ condition }: { condition: 'new' | 'used' }) {
  const accent = condition === 'new' ? '#e84b1a' : '#fbbf24';
  return (
    <svg width="180" height="110" viewBox="0 0 200 120" fill="none" aria-hidden="true">
      <ellipse cx="46" cy="90" rx="26" ry="26" stroke={accent} strokeWidth="4" />
      <ellipse cx="154" cy="90" rx="26" ry="26" stroke={accent} strokeWidth="4" />
      <path d="M65 90h24l18-28h18l12 28h-17" stroke="#f5f0eb" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M80 58l18 3M117 62l-5-14h14" stroke={accent} strokeWidth="4" strokeLinecap="round" />
      <path d="M52 90l12-24h23M137 90l-7-18" stroke="#888" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="46" cy="90" r="6" fill={accent} />
      <circle cx="154" cy="90" r="6" fill={accent} />
    </svg>
  );
}

export default function Page() {
  const [activePage, setActivePage] = useState<PageKey>('home');
  const [adminTab, setAdminTab] = useState<AdminTab>('bikes');
  const [filters, setFilters] = useState<Filters>({ condition: 'all', class: 'all', brand: 'all' });
  const [bikes, setBikes] = useState<Bike[]>(DEFAULTS.bikes);
  const [services, setServices] = useState<Service[]>(DEFAULTS.services);
  const [pricing, setPricing] = useState<PricingRow[]>(DEFAULTS.pricing);
  const [reviews, setReviews] = useState<Review[]>(DEFAULTS.reviews);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginPending, setLoginPending] = useState(false);
  const [contactPending, setContactPending] = useState(false);
  const [enquiryPending, setEnquiryPending] = useState(false);
  const [contactForm, setContactForm] = useState<ContactPayload>({ first_name: '', last_name: '', phone: '', enquiry_type: ENQUIRY_OPTIONS[0], message: '' });
  const [enquiryForm, setEnquiryForm] = useState<BikeEnquiryPayload>({ name: '', phone: '', bike_name: '', message: '' });
  const [bikeForm, setBikeForm] = useState<BikeForm>(emptyBikeForm);
  const [serviceForm, setServiceForm] = useState<ServiceForm>(emptyServiceForm);
  const [pricingForm, setPricingForm] = useState<PricingForm>(emptyPricingForm);

  useEffect(() => {
    const init = async () => {
      if (!hasSupabase || !supabase) {
        setIsLoaded(true);
        return;
      }

      const [bikesRes, servicesRes, pricingRes, reviewsRes, sessionRes] = await Promise.all([
        supabase.from('bikes').select('*').order('id', { ascending: true }),
        supabase.from('services').select('*').order('id', { ascending: true }),
        supabase.from('pricing').select('*').order('id', { ascending: true }),
        supabase.from('reviews').select('*').order('id', { ascending: true }),
        supabase.auth.getSession()
      ]);

      if (bikesRes.data?.length) setBikes(bikesRes.data as Bike[]);
      if (servicesRes.data?.length) setServices(servicesRes.data as Service[]);
      if (pricingRes.data?.length) setPricing(pricingRes.data as PricingRow[]);
      if (reviewsRes.data?.length) setReviews(reviewsRes.data as Review[]);
      setIsLoggedIn(Boolean(sessionRes.data.session));
      setIsLoaded(true);
    };

    void init();
  }, []);

  useEffect(() => {
    const open = isLoginOpen || isContactOpen || isEnquiryOpen || isAdminOpen;
    document.body.classList.toggle('modal-open', open);
    return () => document.body.classList.remove('modal-open');
  }, [isLoginOpen, isContactOpen, isEnquiryOpen, isAdminOpen]);

  const brands = useMemo(() => ['all', ...Array.from(new Set(bikes.map((b) => b.make))).sort()], [bikes]);

  const filteredBikes = useMemo(
    () =>
      bikes.filter((b) => {
        if (filters.condition !== 'all' && b.cond !== filters.condition) return false;
        if (filters.class !== 'all' && b.cls !== filters.class) return false;
        if (filters.brand !== 'all' && b.make !== filters.brand) return false;
        return true;
      }),
    [bikes, filters]
  );

  const nextBikeId = useMemo(() => Math.max(0, ...bikes.map((b) => Number(b.id))) + 1, [bikes]);
  const nextServiceId = useMemo(() => Math.max(0, ...services.map((s) => Number(s.id))) + 1, [services]);
  const nextPricingId = useMemo(() => Math.max(0, ...pricing.map((p) => Number(p.id))) + 1, [pricing]);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const goTo = (page: PageKey) => { setActivePage(page); scrollTop(); };

  async function syncTable<T extends { id: number }>(table: 'bikes' | 'services' | 'pricing', rows: T[]) {
    if (!hasSupabase || !supabase) return;
    await supabase.from(table).delete().gte('id', 0);
    if (rows.length) await supabase.from(table).insert(rows);
  }

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    setLoginPending(true);
    setLoginError('');

    if (hasSupabase && supabase) {
      const mappedEmail =
        loginUser === (process.env.NEXT_PUBLIC_ADMIN_USERNAME || LOCAL_USER)
          ? process.env.NEXT_PUBLIC_ADMIN_EMAIL || loginUser
          : loginUser;

      const { error } = await supabase.auth.signInWithPassword({ email: mappedEmail, password: loginPass });
      if (error) {
        setLoginError('Incorrect username or password.');
        setLoginPass('');
        setLoginPending(false);
        return;
      }

      setIsLoggedIn(true);
      setIsLoginOpen(false);
      setIsAdminOpen(true);
      setLoginPending(false);
      return;
    }

    if (loginUser === LOCAL_USER && loginPass === LOCAL_PASS) {
      setIsLoggedIn(true);
      setIsLoginOpen(false);
      setIsAdminOpen(true);
    } else {
      setLoginError('Incorrect username or password.');
      setLoginPass('');
    }
    setLoginPending(false);
  }

  async function logout() {
    if (hasSupabase && supabase) await supabase.auth.signOut();
    setIsLoggedIn(false);
    setIsAdminOpen(false);
  }

  async function handleContactSubmit(event: FormEvent) {
  event.preventDefault();
  setContactPending(true);

  if (hasSupabase && supabase) {
    const { data, error } = await supabase.from('enquiries').insert({
      type: 'contact',
      first_name: contactForm.first_name,
      last_name: contactForm.last_name,
      phone: contactForm.phone,
      enquiry_type: contactForm.enquiry_type,
      message: contactForm.message
    });

    console.log('DATA:', data);
    console.log('ERROR:', error);

    if (error) {
      alert("❌ Failed to send enquiry");
      setContactPending(false);
      return;
    }
  }

  setContactPending(false);
  setIsContactOpen(false);
  setContactForm({
    first_name: '',
    last_name: '',
    phone: '',
    enquiry_type: ENQUIRY_OPTIONS[0],
    message: ''
  });

  window.alert("✅ Message sent! Our team will be in touch within 24 hours.");
}

  async function handleBikeEnquiry(event: FormEvent) {
    event.preventDefault();
    setEnquiryPending(true);
    if (hasSupabase && supabase) {
      await supabase.from('enquiries').insert({
        type: 'bike',
        name: enquiryForm.name,
        phone: enquiryForm.phone,
        bike_name: enquiryForm.bike_name,
        message: enquiryForm.message
      });
    }
    setEnquiryPending(false);
    setIsEnquiryOpen(false);
    setEnquiryForm({ name: '', phone: '', bike_name: '', message: '' });
    window.alert("Enquiry sent! We'll contact you via WhatsApp shortly.");
  }

  function openEnquiry(bike: Bike) {
    setEnquiryForm({ name: '', phone: '', bike_name: `${bike.make} ${bike.model} (S$${bike.price})`, message: '' });
    setIsEnquiryOpen(true);
  }

  async function saveBike() {
    if (!bikeForm.make || !bikeForm.model || !bikeForm.price) {
      window.alert('Fill in Make, Model and Price.');
      return;
    }

    const record: Bike = {
      id: bikeForm.id === '' ? nextBikeId : Number(bikeForm.id),
      make: bikeForm.make,
      model: bikeForm.model,
      cond: bikeForm.cond,
      cls: bikeForm.cls,
      price: bikeForm.price,
      engine: bikeForm.engine,
      power: bikeForm.power,
      spec3: bikeForm.spec3,
      status: bikeForm.status || 'In Stock'
    };

    const next = bikeForm.id === '' ? [...bikes, record] : bikes.map((b) => (b.id === record.id ? record : b));
    setBikes(next);
    await syncTable('bikes', next);
    setBikeForm(emptyBikeForm);
  }

  function editBike(bike: Bike) { setBikeForm({ ...bike }); }
  async function delBike(id: number) {
    if (!window.confirm('Remove this listing?')) return;
    const next = bikes.filter((b) => b.id !== id);
    setBikes(next);
    await syncTable('bikes', next);
  }

  async function saveService() {
    if (!serviceForm.name || !serviceForm.price) {
      window.alert('Fill in Service Name and Price.');
      return;
    }
    const record: Service = {
      id: serviceForm.id === '' ? nextServiceId : Number(serviceForm.id),
      icon: serviceForm.icon || '🔧',
      name: serviceForm.name,
      desc: serviceForm.desc,
      price: serviceForm.price
    };
    const next = serviceForm.id === '' ? [...services, record] : services.map((s) => (s.id === record.id ? record : s));
    setServices(next);
    await syncTable('services', next);
    setServiceForm(emptyServiceForm);
  }

  function editService(service: Service) { setServiceForm({ ...service }); }
  async function delService(id: number) {
    if (!window.confirm('Remove this service?')) return;
    const next = services.filter((s) => s.id !== id);
    setServices(next);
    await syncTable('services', next);
  }

  async function savePricing() {
    let record: PricingRow;
    if (pricingForm.type === 'cat') {
      if (!pricingForm.catName) {
        window.alert('Enter a category name.');
        return;
      }
      record = { id: pricingForm.id === '' ? nextPricingId : Number(pricingForm.id), type: 'cat', catName: pricingForm.catName };
    } else {
      if (!pricingForm.name || !pricingForm.amount) {
        window.alert('Fill in Service Name and Price.');
        return;
      }
      record = {
        id: pricingForm.id === '' ? nextPricingId : Number(pricingForm.id),
        type: 'item',
        name: pricingForm.name,
        details: pricingForm.details,
        amount: pricingForm.amount,
        popular: pricingForm.popular === 'yes'
      };
    }

    const next = pricingForm.id === '' ? [...pricing, record] : pricing.map((p) => (p.id === record.id ? record : p));
    setPricing(next);
    await syncTable('pricing', next);
    setPricingForm(emptyPricingForm);
  }

  function editPricing(row: PricingRow) {
    if (row.type === 'cat') {
      setPricingForm({ id: row.id, type: 'cat', catName: row.catName, name: '', details: '', amount: '', popular: 'no' });
    } else {
      setPricingForm({ id: row.id, type: 'item', catName: '', name: row.name, details: row.details, amount: row.amount, popular: row.popular ? 'yes' : 'no' });
    }
  }

  async function delPricing(id: number) {
    if (!window.confirm('Remove this row?')) return;
    const next = pricing.filter((p) => p.id !== id);
    setPricing(next);
    await syncTable('pricing', next);
  }

  if (!isLoaded) return null;

  return (
    <>
      <nav>
        <div className="nav-top">
          <span className="nav-logo" onClick={() => goTo('home')}>ATAN<span>.</span>MOTORING</span>
          <div className="nav-right">
            <button className="owner-btn" onClick={() => (isLoggedIn ? setIsAdminOpen(true) : setIsLoginOpen(true))}>
              <svg viewBox="0 0 24 24"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" /></svg>
              {isLoggedIn ? 'Owner Dashboard' : 'Admin Login'}
            </button>
            <button className="nav-cta" onClick={() => setIsContactOpen(true)}>Get in Touch</button>
          </div>
        </div>
        <div className="page-tabs">
          <button className={`page-tab ${activePage === 'home' ? 'active' : ''}`} onClick={() => goTo('home')}>Home</button>
          <button className={`page-tab ${activePage === 'bikes' ? 'active' : ''}`} onClick={() => goTo('bikes')}>Buy a Bike</button>
          <button className={`page-tab ${activePage === 'servicing' ? 'active' : ''}`} onClick={() => goTo('servicing')}>Servicing</button>
          <button className={`page-tab ${activePage === 'reviews' ? 'active' : ''}`} onClick={() => goTo('reviews')}>Reviews</button>
          <button className={`page-tab ${activePage === 'contact' ? 'active' : ''}`} onClick={() => goTo('contact')}>Contact</button>
        </div>
      </nav>

      <div className={`page ${activePage === 'home' ? 'active' : ''}`} id="page-home">
        <div className="hero">
          <div className="hero-bg" />
          <div className="hero-grid" />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p className="hero-eyebrow">Established 1989 · Ubi, Singapore</p>
            <h1 className="hero-title">BUILT FOR<em>THE ROAD.</em></h1>
            <p className="hero-sub">Expert motorbike repair, servicing, and sales. New and used motorcycles from the brands you trust — all under one roof in Kampong Ubi.</p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={() => goTo('bikes')}>Browse Bikes</button>
              <button className="btn-ghost" onClick={() => goTo('servicing')}>Our Services</button>
            </div>
            <div className="hero-stats">
              <div><div className="stat-val">35<span>+</span></div><div className="stat-label">Years Experience</div></div>
              <div><div className="stat-val">4.9<span>★</span></div><div className="stat-label">Google Rating</div></div>
              <div><div className="stat-val">111<span>+</span></div><div className="stat-label">Verified Reviews</div></div>
              <div><div className="stat-val">12<span>mo</span></div><div className="stat-label">Parts Warranty</div></div>
            </div>
          </div>
        </div>
        <Footer includeUen />
      </div>

      <div className={`page ${activePage === 'bikes' ? 'active' : ''}`} id="page-bikes">
        <div className="pg-section">
          <p className="section-eyebrow">Showroom</p>
          <h2 className="section-title">BIKES FOR SALE</h2>
          <p className="section-sub">Browse our full range of new and pre-loved motorcycles. Filter by condition, licence class, or brand.</p>
          <div className="bikes-toolbar">
            <FilterGroup label="Condition">
              {(['all', 'new', 'used'] as const).map((item) => (
                <button key={item} className={`pill ${filters.condition === item ? 'active' : ''}`} onClick={() => setFilters((p) => ({ ...p, condition: item }))}>{item === 'all' ? 'All' : item[0].toUpperCase() + item.slice(1)}</button>
              ))}
            </FilterGroup>
            <div className="filter-sep" />
            <FilterGroup label="Licence Class">
              {(['all', '2b', '2a', '2'] as const).map((item) => (
                <button key={item} className={`pill ${filters.class === item ? 'active' : ''}`} onClick={() => setFilters((p) => ({ ...p, class: item }))}>{item === 'all' ? 'All Classes' : `Class ${item.toUpperCase()}`}</button>
              ))}
            </FilterGroup>
            <div className="filter-sep" />
            <FilterGroup label="Brand">
              {brands.map((brand) => (
                <button key={brand} className={`pill ${filters.brand === brand ? 'active' : ''}`} onClick={() => setFilters((p) => ({ ...p, brand }))}>{brand === 'all' ? 'All Brands' : brand}</button>
              ))}
            </FilterGroup>
          </div>
          <div className="bikes-results">Showing <span>{filteredBikes.length}</span> bikes</div>
          <div className="bikes-grid">
            {!filteredBikes.length ? <div className="no-bikes">No bikes match your filters. Try adjusting them above.</div> : filteredBikes.map((b) => (
              <div className="bike-card" key={b.id}>
                <div className="bike-img">
                  <BikeSvg condition={b.cond} />
                  <div className="bike-tags">
                    <span className={`bike-tag ${b.cond}`}>{b.cond}</span>
                    <span className="bike-tag cls">Class {b.cls.toUpperCase()}</span>
                  </div>
                </div>
                <div className="bike-body">
                  <div className="bike-make">{b.make}</div>
                  <div className="bike-model">{b.model}</div>
                  <div className="bike-specs">
                    <div className="bike-spec"><strong>{b.engine}</strong>Engine</div>
                    <div className="bike-spec"><strong>{b.power}</strong>Power</div>
                    <div className="bike-spec"><strong>{b.spec3}</strong>{b.cond === 'new' ? 'Year' : 'Mileage'}</div>
                  </div>
                  <div className="bike-price">S${b.price}</div>
                </div>
                <div className="bike-footer">
                  <span style={{ fontSize: 12, color: 'var(--muted)' }}>{b.status}</span>
                  <button className="enquire-btn" onClick={() => openEnquiry(b)}>Enquire</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>

      <div className={`page ${activePage === 'servicing' ? 'active' : ''}`} id="page-servicing">
        <div className="pg-section">
          <p className="section-eyebrow">What We Do</p>
          <h2 className="section-title">OUR SERVICES</h2>
          <p className="section-sub">From a quick oil change to a full engine rebuild, our certified mechanics handle it all.</p>
          <div className="services-grid">
            {services.map((s) => (
              <div className="service-card" key={s.id}>
                <div className="service-icon">{s.icon}</div>
                <div className="service-name">{s.name}</div>
                <p className="service-desc">{s.desc}</p>
                <div className="service-price"><span className="from">From</span><span className="amount">S${s.price}</span></div>
              </div>
            ))}
          </div>
          <div className="pricing-wrap">
            <p className="section-eyebrow">Transparent Rates</p>
            <h2 className="section-title">SERVICE PRICING</h2>
            <p className="section-sub">All prices in SGD and include labour. Parts quoted separately at market rate.</p>
            <div style={{ overflowX: 'auto', marginTop: 32 }}>
              <table className="pricing-table">
                <thead><tr><th>Service</th><th>Details</th><th>Price (S$)</th></tr></thead>
                <tbody>
                  {pricing.map((row) => row.type === 'cat' ? (
                    <tr className="cat-row" key={row.id}><td colSpan={3}>{row.catName}</td></tr>
                  ) : (
                    <tr key={row.id}>
                      <td>{row.name}{row.popular ? <span className="price-badge">Popular</span> : null}</td>
                      <td>{row.details}</td>
                      <td>{row.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="note">Prices are estimates and may vary. A no-obligation quote is provided before any work begins. GST not included.</p>
          </div>
        </div>
        <Footer />
      </div>

      <div className={`page ${activePage === 'reviews' ? 'active' : ''}`} id="page-reviews">
        <div className="pg-section">
          <p className="section-eyebrow">What Riders Say</p>
          <h2 className="section-title">CUSTOMER REVIEWS</h2>
          <p className="section-sub">Real feedback from Singapore riders who've trusted us with their bikes.</p>
          <div className="rating-summary">
            <div className="rating-big">4.9</div>
            <div className="rating-detail">
              <div className="stars-lg">★★★★★</div>
              <div className="rating-count">Based on 111+ verified reviews</div>
              <div className="google-badge" style={{ marginTop: 6 }}>
                <svg width="14" height="14" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Google Reviews
              </div>
            </div>
          </div>
          <div className="reviews-grid">
            {reviews.map((r) => (
              <div className="review-card" key={r.id}>
                <div className="review-quote">“</div>
                <div className="review-stars">{'★'.repeat(r.rating)}</div>
                <p className="review-text">{r.text}</p>
                <div className="review-author"><div className="review-avatar">{r.avatar}</div><div><div className="review-name">{r.author}</div><div className="review-source">{r.source}</div></div></div>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>

      <div className={`page ${activePage === 'contact' ? 'active' : ''}`} id="page-contact">
        <div className="pg-section">
          <p className="section-eyebrow">Find Us</p>
          <h2 className="section-title">VISIT THE WORKSHOP</h2>
          <p className="section-sub">Drop by our workshop in Kampong Ubi, or send us a message and we'll get back to you promptly.</p>
          <button className="btn-primary" onClick={() => setIsContactOpen(true)} style={{ marginTop: 28 }}>Send Us a Message</button>
          <div className="contact-info-grid">
            <div className="info-item"><div className="info-icon">📍</div><div><div className="info-label">Location</div><div className="info-val">Blk 3006 Ubi Road 1 #01-368/370<br />Kampong Ubi Industrial Estate<br />Singapore 408700</div></div></div>
            <div className="info-item"><div className="info-icon">📞</div><div><div className="info-label">Phone / WhatsApp</div><div className="info-val">+65 6743 1351</div></div></div>
            <div className="info-item"><div className="info-icon">🕐</div><div><div className="info-label">Working Hours</div><div className="info-val">Mon – Fri: 9:30 AM – 6:30 PM<br />Saturday: 9:30 AM – 5:30 PM<br />Sunday: Closed</div></div></div>
            <div className="info-item"><div className="info-icon">✉</div><div><div className="info-label">Email</div><div className="info-val">info@atanmotoring.com.sg</div></div></div>
          </div>
        </div>
        <Footer includeUen />
      </div>

      <a href="https://wa.me/6567431351" target="_blank" className="wa-btn" title="Chat with us on WhatsApp" rel="noreferrer">
        <div className="wa-pulse" />
        <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
      </a>

      <Modal open={isLoginOpen} onClose={() => setIsLoginOpen(false)} id="login-modal">
        <div className="modal login-modal">
          <button className="modal-close" onClick={() => setIsLoginOpen(false)}>✕</button>
          <div className="login-logo">ATAN<span>.</span>MOTORING</div>
          <div className="modal-title">Admin Login</div>
          <p className="modal-sub">Enter your credentials to access the dashboard.</p>
          <p className="login-err" id="login-err" style={{ display: loginError ? 'block' : 'none' }}>{loginError}</p>
          <form className="modal-form" onSubmit={handleLogin}>
            <div className="form-group"><label>Username</label><input type="text" value={loginUser} onChange={(e) => setLoginUser(e.target.value)} placeholder="admin" autoComplete="username" /></div>
            <div className="form-group"><label>Password</label><input type="password" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} placeholder="••••••••" autoComplete="current-password" /></div>
            <button type="submit" className="form-submit" disabled={loginPending}>{loginPending ? 'Signing In...' : 'Sign In'}</button>
          </form>
        </div>
      </Modal>

      <Modal open={isContactOpen} onClose={() => setIsContactOpen(false)} id="contact-modal">
        <div className="modal" style={{ maxWidth: 520 }}>
          <button className="modal-close" onClick={() => setIsContactOpen(false)}>✕</button>
          <div className="modal-title">Get in Touch</div>
          <p className="modal-sub">Send us a message and we'll reply via WhatsApp within 24 hours.</p>
          <form className="modal-form" onSubmit={handleContactSubmit}>
            <div className="form-row">
              <div className="form-group"><label>First Name</label><input type="text" required placeholder="Ahmad" value={contactForm.first_name} onChange={(e) => setContactForm((p) => ({ ...p, first_name: e.target.value }))} /></div>
              <div className="form-group"><label>Last Name</label><input type="text" required placeholder="Razali" value={contactForm.last_name} onChange={(e) => setContactForm((p) => ({ ...p, last_name: e.target.value }))} /></div>
            </div>
            <div className="form-group"><label>Phone / WhatsApp</label><input type="tel" placeholder="+65 9000 0000" value={contactForm.phone} onChange={(e) => setContactForm((p) => ({ ...p, phone: e.target.value }))} /></div>
            <div className="form-group"><label>Enquiry Type</label><select value={contactForm.enquiry_type} onChange={(e) => setContactForm((p) => ({ ...p, enquiry_type: e.target.value }))}>{ENQUIRY_OPTIONS.map((opt) => <option key={opt}>{opt}</option>)}</select></div>
            <div className="form-group"><label>Message</label><textarea placeholder="Tell us about your bike or what you're looking for…" value={contactForm.message} onChange={(e) => setContactForm((p) => ({ ...p, message: e.target.value }))} /></div>
            <button type="submit" className="form-submit" disabled={contactPending}>{contactPending ? 'Sending...' : 'Send Message'}</button>
          </form>
        </div>
      </Modal>

      <Modal open={isEnquiryOpen} onClose={() => setIsEnquiryOpen(false)} id="enquiry-modal">
        <div className="modal">
          <button className="modal-close" onClick={() => setIsEnquiryOpen(false)}>✕</button>
          <div className="modal-title">Bike Enquiry</div>
          <p className="modal-sub">{enquiryForm.bike_name || "Fill in your details and we'll get back to you on WhatsApp."}</p>
          <form className="modal-form" onSubmit={handleBikeEnquiry}>
            <div className="form-group"><label>Your Name</label><input type="text" placeholder="Full name" required value={enquiryForm.name} onChange={(e) => setEnquiryForm((p) => ({ ...p, name: e.target.value }))} /></div>
            <div className="form-group"><label>Phone / WhatsApp</label><input type="tel" placeholder="+65 9000 0000" required value={enquiryForm.phone} onChange={(e) => setEnquiryForm((p) => ({ ...p, phone: e.target.value }))} /></div>
            <div className="form-group"><label>Interested Bike</label><input type="text" readOnly style={{ color: 'var(--muted)' }} value={enquiryForm.bike_name} /></div>
            <div className="form-group"><label>Message (optional)</label><textarea placeholder="Any questions about this bike?" value={enquiryForm.message} onChange={(e) => setEnquiryForm((p) => ({ ...p, message: e.target.value }))} /></div>
            <button type="submit" className="form-submit" disabled={enquiryPending}>{enquiryPending ? 'Sending...' : 'Send Enquiry'}</button>
          </form>
        </div>
      </Modal>

      <div className={`admin-panel ${isAdminOpen ? 'open' : ''}`} id="admin-panel">
        <div className="admin-header">
          <div><h2>Owner Dashboard</h2><div className="admin-header-sub">Atan Motoring Supply Pte Ltd</div></div>
          <div className="admin-hright">
            <button className="admin-logout" onClick={logout}>Log out</button>
            <button className="admin-close" onClick={() => setIsAdminOpen(false)}>✕</button>
          </div>
        </div>
        <div className="admin-tabs">
          <button className={`admin-tab ${adminTab === 'bikes' ? 'active' : ''}`} onClick={() => setAdminTab('bikes')}>Bikes</button>
          <button className={`admin-tab ${adminTab === 'services' ? 'active' : ''}`} onClick={() => setAdminTab('services')}>Services</button>
          <button className={`admin-tab ${adminTab === 'pricing' ? 'active' : ''}`} onClick={() => setAdminTab('pricing')}>Pricing</button>
        </div>
        <div className="admin-content">
          <div className={`admin-section ${adminTab === 'bikes' ? 'active' : ''}`}>
            <p className="admin-note">Add, edit or remove bike listings. Changes appear immediately.</p>
            <div>
              {bikes.map((b) => <AdminListItem key={b.id} title={<>{b.make} {b.model}<span className="abadge">{b.cond}</span><span className="abadge cls">Class {b.cls.toUpperCase()}</span></>} subtitle={`S$${b.price} · ${b.status}`} onEdit={() => editBike(b)} onDelete={() => delBike(b.id)} />)}
            </div>
            <hr className="admin-divider" />
            <p className="admin-sub-title">{bikeForm.id === '' ? 'Add New Listing' : 'Edit Listing'}</p>
            <div className="admin-form-row"><AdminInput label="Make / Brand" value={bikeForm.make} onChange={(v) => setBikeForm((p) => ({ ...p, make: v }))} placeholder="e.g. Honda" /><AdminInput label="Model" value={bikeForm.model} onChange={(v) => setBikeForm((p) => ({ ...p, model: v }))} placeholder="e.g. CB150R 2024" /></div>
            <div className="admin-form-row3">
              <AdminSelect label="Condition" value={bikeForm.cond} onChange={(v) => setBikeForm((p) => ({ ...p, cond: v as BikeForm['cond'] }))} options={[['new', 'New'], ['used', 'Used']]} />
              <AdminSelect label="Licence Class" value={bikeForm.cls} onChange={(v) => setBikeForm((p) => ({ ...p, cls: v as BikeForm['cls'] }))} options={[['2b', 'Class 2B'], ['2a', 'Class 2A'], ['2', 'Class 2']]} />
              <AdminInput label="Price (S$)" value={bikeForm.price} onChange={(v) => setBikeForm((p) => ({ ...p, price: v }))} placeholder="e.g. 9,800" />
            </div>
            <div className="admin-form-row"><AdminInput label="Engine" value={bikeForm.engine} onChange={(v) => setBikeForm((p) => ({ ...p, engine: v }))} placeholder="e.g. 150cc" /><AdminInput label="Power" value={bikeForm.power} onChange={(v) => setBikeForm((p) => ({ ...p, power: v }))} placeholder="e.g. 17 hp" /></div>
            <div className="admin-form-row"><AdminInput label="Year / Mileage" value={bikeForm.spec3} onChange={(v) => setBikeForm((p) => ({ ...p, spec3: v }))} placeholder="e.g. 2024 or 22k km" /><AdminInput label="Status" value={bikeForm.status} onChange={(v) => setBikeForm((p) => ({ ...p, status: v }))} placeholder="e.g. In Stock" /></div>
            <div className="btn-row"><button className="admin-save" onClick={saveBike}>{bikeForm.id === '' ? 'Add Listing' : 'Save Changes'}</button>{bikeForm.id !== '' ? <button className="admin-save btn-cancel show" onClick={() => setBikeForm(emptyBikeForm)}>Cancel</button> : null}</div>
          </div>

          <div className={`admin-section ${adminTab === 'services' ? 'active' : ''}`}>
            <p className="admin-note">Manage service cards shown on the servicing page.</p>
            <div>
              {services.map((s) => <AdminListItem key={s.id} title={<>{s.icon} {s.name}</>} subtitle={`From S$${s.price}`} onEdit={() => editService(s)} onDelete={() => delService(s.id)} />)}
            </div>
            <hr className="admin-divider" />
            <p className="admin-sub-title">{serviceForm.id === '' ? 'Add New Service' : 'Edit Service'}</p>
            <AdminInput label="Icon / Emoji" value={serviceForm.icon} onChange={(v) => setServiceForm((p) => ({ ...p, icon: v }))} placeholder="e.g. 🔧" />
            <AdminInput label="Service Name" value={serviceForm.name} onChange={(v) => setServiceForm((p) => ({ ...p, name: v }))} placeholder="e.g. General Servicing" />
            <AdminTextarea label="Description" value={serviceForm.desc} onChange={(v) => setServiceForm((p) => ({ ...p, desc: v }))} placeholder="Describe the service..." />
            <AdminInput label="From Price (S$)" value={serviceForm.price} onChange={(v) => setServiceForm((p) => ({ ...p, price: v }))} placeholder="e.g. 40" />
            <div className="btn-row"><button className="admin-save" onClick={saveService}>{serviceForm.id === '' ? 'Add Service' : 'Save Changes'}</button>{serviceForm.id !== '' ? <button className="admin-save btn-cancel show" onClick={() => setServiceForm(emptyServiceForm)}>Cancel</button> : null}</div>
          </div>

          <div className={`admin-section ${adminTab === 'pricing' ? 'active' : ''}`}>
            <p className="admin-note">Reorder is manual for now. Rows are shown by id order.</p>
            <div>
              {pricing.map((p) => <AdminListItem key={p.id} title={p.type === 'cat' ? <>📁 {p.catName}</> : <>{p.name}</>} subtitle={p.type === 'cat' ? 'Category header' : `S$${p.amount}${p.popular ? ' · Popular' : ''}`} onEdit={() => editPricing(p)} onDelete={() => delPricing(p.id)} />)}
            </div>
            <hr className="admin-divider" />
            <p className="admin-sub-title">{pricingForm.id === '' ? 'Add Pricing Row' : 'Edit Row'}</p>
            <AdminSelect label="Row Type" value={pricingForm.type} onChange={(v) => setPricingForm((p) => ({ ...p, type: v as PricingForm['type'] }))} options={[['item', 'Item'], ['cat', 'Category']]} />
            {pricingForm.type === 'cat' ? (
              <AdminInput label="Category Name" value={pricingForm.catName} onChange={(v) => setPricingForm((p) => ({ ...p, catName: v }))} placeholder="e.g. Electrical" />
            ) : (
              <>
                <AdminInput label="Service Name" value={pricingForm.name} onChange={(v) => setPricingForm((p) => ({ ...p, name: v }))} placeholder="e.g. Basic Service" />
                <AdminInput label="Details" value={pricingForm.details} onChange={(v) => setPricingForm((p) => ({ ...p, details: v }))} placeholder="e.g. Oil change + filter + general check" />
                <AdminInput label="Price (S$)" value={pricingForm.amount} onChange={(v) => setPricingForm((p) => ({ ...p, amount: v }))} placeholder="e.g. 40 – 60" />
                <AdminSelect label="Popular Badge" value={pricingForm.popular} onChange={(v) => setPricingForm((p) => ({ ...p, popular: v as 'yes' | 'no' }))} options={[['no', 'No'], ['yes', 'Yes']]} />
              </>
            )}
            <div className="btn-row"><button className="admin-save" onClick={savePricing}>{pricingForm.id === '' ? 'Add Row' : 'Save Changes'}</button>{pricingForm.id !== '' ? <button className="admin-save btn-cancel show" onClick={() => setPricingForm(emptyPricingForm)}>Cancel</button> : null}</div>
          </div>
        </div>
      </div>
    </>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="filter-group"><div className="filter-label">{label}</div><div className="filter-pills">{children}</div></div>;
}

function Modal({ open, onClose, id, children }: { open: boolean; onClose: () => void; id: string; children: React.ReactNode }) {
  return <div className={`modal-overlay ${open ? 'open' : ''}`} id={id} onClick={(e) => e.target === e.currentTarget && onClose()}>{children}</div>;
}

function Footer({ includeUen = false }: { includeUen?: boolean }) {
  return <footer><div className="footer-logo">ATAN<span>.</span>MOTORING</div><div className="footer-copy">© 2024 Atan Motoring Supply Pte Ltd{includeUen ? ' (UEN: 198903552W)' : ''}. All rights reserved.</div></footer>;
}

function AdminListItem({ title, subtitle, onEdit, onDelete }: { title: React.ReactNode; subtitle: string; onEdit: () => void; onDelete: () => void }) {
  return <div className="admin-list-item"><div className="alin"><div className="alin-name">{title}</div><div className="alin-sub">{subtitle}</div></div><div className="ala"><button className="edit-btn" onClick={onEdit}>Edit</button><button className="del-btn" onClick={onDelete}>Del</button></div></div>;
}

function AdminInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <div className="admin-form-group"><label>{label}</label><input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} /></div>;
}

function AdminTextarea({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <div className="admin-form-group"><label>{label}</label><textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} /></div>;
}

function AdminSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return <div className="admin-form-group"><label>{label}</label><select value={value} onChange={(e) => onChange(e.target.value)}>{options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></div>;
}
