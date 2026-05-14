const { useState, useEffect } = React;
const { BrowserRouter, Switch, Route, Link, useParams, useHistory } = ReactRouterDOM;

// --- Login Component ---
function Login({ setToken, setUsername, setRoles }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '', email: '', roles: ['buyer'] });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const url = isLogin ? '/api/auth/login' : '/api/auth/register';

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || data.error || 'Authentication failed');
        setLoading(false);
        return;
      }

      if (isLogin) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        localStorage.setItem('roles', JSON.stringify(data.roles));
        setToken(data.token);
        setUsername(data.username);
        setRoles(data.roles);
        history.push('/');
      } else {
        setIsLogin(true);
        setError('Registration successful! Please login.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
    setLoading(false);
  };

  const selectedRole = formData.roles[0];

  const roleCardStyle = (role) => ({
    flex: 1,
    padding: '16px',
    borderRadius: '12px',
    border: selectedRole === role ? '2px solid var(--primary)' : '2px solid rgba(255,255,255,0.08)',
    background: selectedRole === role ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.03)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden'
  });

  return (
    <div style={{ 
      display: 'flex', 
      maxWidth: '900px', 
      margin: '60px auto', 
      borderRadius: '20px', 
      overflow: 'hidden',
      boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)',
      border: '1px solid rgba(255,255,255,0.08)'
    }}>
      {/* Left decorative panel */}
      <div style={{
        width: '340px',
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #c084fc 100%)',
        padding: '50px 40px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background decorative circles */}
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}></div>
        <div style={{ position: 'absolute', bottom: '-60px', left: '-30px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }}></div>
        <div style={{ position: 'absolute', top: '50%', left: '50%', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', transform: 'translate(-50%, -50%)' }}></div>
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'white', marginBottom: '16px', lineHeight: 1.2 }}>
            {isLogin ? 'Welcome\nBack!' : 'Join\nBidStream'}
          </div>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '30px' }}>
            {isLogin 
              ? 'Sign in to access live auctions, place bids, and manage your portfolio.' 
              : 'Create your account and start bidding on premium items in real-time.'}
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {['🔒 Secure', '⚡ Real-time', '💎 Premium'].map(tag => (
              <span key={tag} style={{
                padding: '6px 14px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '20px',
                fontSize: '0.8rem',
                color: 'white',
                fontWeight: '500',
                backdropFilter: 'blur(8px)'
              }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div style={{
        flex: 1,
        background: 'rgba(15, 23, 42, 0.95)',
        padding: '50px 40px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <div style={{ marginBottom: '8px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
            {isLogin ? 'Sign In' : 'Sign Up'}
          </span>
        </div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '6px' }}>
          {isLogin ? 'Login to your account' : 'Create your account'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '28px', fontSize: '0.9rem' }}>
          {isLogin ? 'Enter your credentials below' : 'Fill in your details to get started'}
        </p>
        
        {error && (
          <div style={{ 
            background: error.includes('successful') ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)', 
            color: error.includes('successful') ? 'var(--success)' : 'var(--danger)', 
            padding: '12px 16px', 
            borderRadius: '10px',
            marginBottom: '20px',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            border: error.includes('successful') ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)'
          }}>
            <span>{error.includes('successful') ? '✓' : '✕'}</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {!isLogin && (
            <>
              {/* Role selection cards */}
              <div>
                <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '500' }}>Choose your role</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={roleCardStyle('buyer')} onClick={() => setFormData({...formData, roles: ['buyer']})}>
                    <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>🏷️</div>
                    <div style={{ fontWeight: '600', fontSize: '0.95rem', marginBottom: '4px' }}>Bidder</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Bid on items</div>
                    {selectedRole === 'buyer' && <div style={{ position: 'absolute', top: '8px', right: '8px', width: '20px', height: '20px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: 'white' }}>✓</div>}
                  </div>
                  <div style={roleCardStyle('seller')} onClick={() => setFormData({...formData, roles: ['seller']})}>
                    <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>🔨</div>
                    <div style={{ fontWeight: '600', fontSize: '0.95rem', marginBottom: '4px' }}>Seller</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Sell items</div>
                    {selectedRole === 'seller' && <div style={{ position: 'absolute', top: '8px', right: '8px', width: '20px', height: '20px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: 'white' }}>✓</div>}
                  </div>
                </div>
              </div>

              {/* Email field */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '500' }}>Email</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', fontSize: '0.9rem', pointerEvents: 'none' }}>✉</span>
                  <input 
                    type="email" 
                    required 
                    placeholder="you@example.com"
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    style={{ paddingLeft: '38px' }}
                  />
                </div>
              </div>
            </>
          )}

          {/* Username field */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '500' }}>Username</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', fontSize: '0.9rem', pointerEvents: 'none' }}>👤</span>
              <input 
                type="text" 
                required 
                placeholder="Enter your username"
                value={formData.username} 
                onChange={e => setFormData({...formData, username: e.target.value})}
                style={{ paddingLeft: '38px' }}
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '500' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', fontSize: '0.9rem', pointerEvents: 'none' }}>🔒</span>
              <input 
                type="password" 
                required 
                placeholder="Enter your password"
                value={formData.password} 
                onChange={e => setFormData({...formData, password: e.target.value})}
                style={{ paddingLeft: '38px' }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn" 
            disabled={loading}
            style={{ 
              marginTop: '4px', 
              padding: '14px', 
              fontSize: '1rem',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              borderRadius: '10px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }}></span>
                Processing...
              </span>
            ) : (
              isLogin ? 'Sign In →' : 'Create Account →'
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span 
            style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: '600', transition: 'color 0.2s' }} 
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            onMouseOver={e => e.target.style.color = '#818cf8'}
            onMouseOut={e => e.target.style.color = 'var(--primary)'}
          >
            {isLogin ? 'Create one' : 'Sign in'}
          </span>
        </div>
      </div>
    </div>
  );
}

// --- Countdown to Start Component ---
function CountdownToStart({ startTime }) {
  const [countdown, setCountdown] = useState('');
  useEffect(() => {
    const calc = () => {
      const diff = new Date(startTime) - new Date();
      if (diff <= 0) { setCountdown('Starting now!'); return; }
      const d = Math.floor(diff / (1000*60*60*24));
      const h = Math.floor((diff / (1000*60*60)) % 24);
      const m = Math.floor((diff / (1000*60)) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setCountdown(d > 0 ? `${d}d ${h}h ${m}m ${s}s` : `${h}h ${m}m ${s}s`);
    };
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, [startTime]);

  return (
    <div style={{ padding: '12px', background: 'rgba(99,102,241,0.08)', borderRadius: '10px', textAlign: 'center', border: '1px solid rgba(99,102,241,0.15)' }}>
      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>Starts in</div>
      <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#818cf8', fontVariantNumeric: 'tabular-nums' }}>{countdown}</div>
      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '6px' }}>{new Date(startTime).toLocaleString()}</div>
    </div>
  );
}

// --- AuctionList Component ---
function AuctionList({ token, roles }) {
  const [auctions, setAuctions] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/auctions/active').then(r => r.json()),
      fetch('/api/auctions/upcoming').then(r => r.json())
    ]).then(([active, up]) => {
      setAuctions(active);
      setUpcoming(up);
      setLoading(false);
    }).catch(err => {
      console.error("Failed to load auctions", err);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading live auctions...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ margin: 0 }}>Live Premium Auctions</h1>
        {roles && roles.includes('ROLE_SELLER') && (
          <button onClick={() => setShowCreate(true)} className="btn" style={{ background: 'var(--primary)' }}>+ Create Auction</button>
        )}
      </div>

      {showCreate && <CreateAuctionModal token={token} onClose={() => setShowCreate(false)} onSuccess={() => window.location.reload()} />}

      {auctions.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '50px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
          <h2 style={{ marginBottom: '20px' }}>No Active Auctions</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>There are currently no active auctions. Check back later!</p>
        </div>
      )}

      <div className="auction-grid">
        {auctions.map(auction => (
          <div key={auction.id} className="glass-panel">
            <div className="card-image-wrapper">
              <img src={auction.imageUrl || 'https://images.unsplash.com/photo-1584727638096-042c45049ebe?auto=format&fit=crop&w=400&q=80'} alt={auction.title} />
            </div>
            <h3>{auction.title}</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>{auction.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Current Bid</span>
                <div className="price">${auction.currentHighestBid || auction.startingPrice}</div>
              </div>
            </div>
            <Link to={`/auction/${auction.id}`} style={{ width: '100%' }}>
              <button className="btn" style={{ width: '100%' }}>View & Bid</button>
            </Link>
          </div>
        ))}
      </div>

      {/* Upcoming Auctions Section */}
      {upcoming.length > 0 && (
        <div style={{ marginTop: '50px' }}>
          <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>📅</span> Upcoming Auctions
          </h2>
          <div className="auction-grid">
            {upcoming.map(auction => (
              <Link key={auction.id} to={`/auction/${auction.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="glass-panel" style={{ position: 'relative', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
                  onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(99,102,241,0.2)'; }}
                  onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
                >
                  <div style={{ position: 'absolute', top: '12px', right: '12px', padding: '4px 12px', background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '600', color: '#818cf8', zIndex: 2 }}>
                    SCHEDULED
                  </div>
                  <div className="card-image-wrapper">
                    <img src={auction.imageUrl || 'https://images.unsplash.com/photo-1584727638096-042c45049ebe?auto=format&fit=crop&w=400&q=80'} alt={auction.title} />
                  </div>
                  <h3>{auction.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>{auction.description}</p>
                  <div style={{ marginBottom: '16px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Starting Price</span>
                    <div className="price" style={{ fontSize: '1.4rem' }}>${auction.startingPrice}</div>
                  </div>
                  <CountdownToStart startTime={auction.startTime} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// --- Profile Modal Component ---
function ProfileModal({ token, username, roles, onClose, onLogout, onUsernameChange }) {
  const [activeTab, setActiveTab] = useState('account');
  const [newUsername, setNewUsername] = useState(username);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState({ text: '', type: '' });
  
  const [wins, setWins] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [historyItems, setHistoryItems] = useState([]);
  const [paymentItems, setPaymentItems] = useState([]);
  const isSeller = roles.includes('ROLE_SELLER');

  useEffect(() => {
    const authHeaders = { 'Authorization': `Bearer ${token}` };
    if (activeTab === 'wins' && !isSeller) {
      fetch('/api/user/wins', { headers: authHeaders })
        .then(res => { if (!res.ok) throw new Error('Failed'); return res.json(); })
        .then(data => { if (Array.isArray(data)) setWins(data); })
        .catch(() => setWins([]));
    }
    if (activeTab === 'dashboard' && isSeller) {
      fetch('/api/user/dashboard', { headers: authHeaders })
        .then(res => { if (!res.ok) throw new Error('Failed'); return res.json(); })
        .then(data => setDashboard(data))
        .catch(() => setDashboard({ totalListings: 0, activeListings: 0, soldItems: 0, unsoldItems: 0, pendingPayment: 0, totalRevenue: 0, listings: [] }));
    }
    if (activeTab === 'history') {
      if (isSeller) {
        fetch('/api/user/history/auctions', { headers: authHeaders })
          .then(res => { if (!res.ok) throw new Error('Failed'); return res.json(); })
          .then(data => { if (Array.isArray(data)) setHistoryItems(data); })
          .catch(() => setHistoryItems([]));
      } else {
        fetch('/api/user/history/bids', { headers: authHeaders })
          .then(res => { if (!res.ok) throw new Error('Failed'); return res.json(); })
          .then(data => { if (Array.isArray(data)) setHistoryItems(data); })
          .catch(() => setHistoryItems([]));
        fetch('/api/user/history/payments', { headers: authHeaders })
          .then(res => { if (!res.ok) throw new Error('Failed'); return res.json(); })
          .then(data => { if (Array.isArray(data)) setPaymentItems(data); })
          .catch(() => setPaymentItems([]));
      }
    }
  }, [activeTab, isSeller, token]);

  const updateUsername = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/user/username', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ newUsername })
      });
      const data = await res.json();
      if (res.ok) { setMsg({ text: data.message, type: 'success' }); onUsernameChange(newUsername); }
      else { setMsg({ text: data.message, type: 'error' }); }
    } catch (err) { setMsg({ text: 'Error updating username', type: 'error' }); }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (res.ok) { setMsg({ text: data.message, type: 'success' }); setCurrentPassword(''); setNewPassword(''); }
      else { setMsg({ text: data.message, type: 'error' }); }
    } catch (err) { setMsg({ text: 'Error updating password', type: 'error' }); }
  };

  const metricCard = (icon, label, value, color) => (
    <div style={{ flex: 1, padding: '18px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center', minWidth: '100px' }}>
      <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>{icon}</div>
      <div style={{ fontSize: '1.4rem', fontWeight: '700', color: color || 'var(--text-primary)' }}>{value}</div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{label}</div>
    </div>
  );

  const statusColor = (s) => {
    if (s === 'ACTIVE') return 'var(--success)';
    if (s === 'PAID') return '#22c55e';
    if (s === 'PENDING_PAYMENT') return '#fbbf24';
    if (s === 'CLOSED') return 'var(--text-secondary)';
    return 'var(--text-secondary)';
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div className="glass-panel modal-content" style={{ width: '650px', height: '85vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: 'var(--text)', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
        
        <div className="profile-header">
          <div className="profile-avatar">{username ? username.charAt(0).toUpperCase() : '?'}</div>
          <div>
            <h2 style={{ margin: 0 }}>Your Profile</h2>
            <div style={{ color: 'var(--text-secondary)' }}>{isSeller ? 'Auctioneer Account' : 'Bidder Account'}</div>
          </div>
        </div>
        
        <div className="tab-container" style={{ flexWrap: 'wrap' }}>
          <button className={`tab-btn ${activeTab === 'account' ? 'active' : ''}`} onClick={() => setActiveTab('account')}>⚙️ Account</button>
          {isSeller ? (
            <button className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>📊 Dashboard</button>
          ) : (
            <button className={`tab-btn ${activeTab === 'wins' ? 'active' : ''}`} onClick={() => setActiveTab('wins')}>🏆 My Wins</button>
          )}
          <button className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>📜 History</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '10px' }}>
          {msg.text && <div style={{ color: msg.type === 'error' ? 'var(--danger)' : 'var(--success)', marginBottom: '15px', padding: '10px', background: msg.type === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)', borderRadius: '8px' }}>{msg.text}</div>}
          
          {/* Account Tab */}
          {activeTab === 'account' && (
            <div>
              <form onSubmit={updateUsername} style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Change Username</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input type="text" required value={newUsername} onChange={e => setNewUsername(e.target.value)} style={{ flex: 1 }} />
                  <button type="submit" className="btn" style={{ background: 'var(--primary)' }}>Update</button>
                </div>
              </form>
              <form onSubmit={updatePassword} style={{ marginBottom: '40px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Change Password</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input type="password" required placeholder="Current Password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text)', borderRadius: '8px' }} />
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input type="password" required placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text)', borderRadius: '8px' }} />
                    <button type="submit" className="btn" style={{ background: 'var(--primary)' }}>Update</button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* My Wins Tab (Buyer) */}
          {activeTab === 'wins' && !isSeller && (
            <div>
              <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>🏆 Items You've Won</h3>
              {wins.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🎯</div>
                  <p style={{ color: 'var(--text-secondary)' }}>No wins yet. Start bidding on live auctions!</p>
                </div>
              ) : wins.map((item, i) => (
                <div key={i} className="history-item" style={{ gap: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {item.imageUrl && <img src={item.imageUrl} alt="" style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />}
                    <div>
                      <div className="history-title">{item.title}</div>
                      <div className="history-meta">Won for <strong style={{ color: 'var(--success)' }}>${item.winAmount}</strong></div>
                    </div>
                  </div>
                  <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600', background: item.status === 'PAID' ? 'rgba(34,197,94,0.15)' : 'rgba(251,191,36,0.15)', color: item.status === 'PAID' ? 'var(--success)' : '#fbbf24' }}>
                    {item.status === 'PAID' ? '✓ Paid' : '⏳ Payment Pending'}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Seller Dashboard Tab */}
          {activeTab === 'dashboard' && isSeller && (
            <div>
              {!dashboard ? <p>Loading dashboard...</p> : (
                <>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
                    {metricCard('📦', 'Total Listings', dashboard.totalListings, '#818cf8')}
                    {metricCard('🟢', 'Active', dashboard.activeListings, 'var(--success)')}
                    {metricCard('💰', 'Sold', dashboard.soldItems, '#22c55e')}
                    {metricCard('❌', 'Unsold', dashboard.unsoldItems, 'var(--danger)')}
                  </div>
                  <div style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(34,197,94,0.1), rgba(99,102,241,0.1))', borderRadius: '12px', border: '1px solid rgba(34,197,94,0.2)' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Total Revenue</div>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--success)' }}>${dashboard.totalRevenue.toFixed(2)}</div>
                    {dashboard.pendingPayment > 0 && <div style={{ fontSize: '0.8rem', color: '#fbbf24', marginTop: '6px' }}>⏳ {dashboard.pendingPayment} pending payment(s)</div>}
                  </div>
                </>
              )}
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div>
              {isSeller ? (
                <div>
                  <h3 style={{ marginBottom: '20px' }}>Your Auction Listings</h3>
                  {historyItems.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                      <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📦</div>
                      <p style={{ color: 'var(--text-secondary)' }}>No auctions created yet.</p>
                    </div>
                  ) : historyItems.map((item, i) => (
                    <div key={i} className="history-item" style={{ gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {item.imageUrl && <img src={item.imageUrl} alt="" style={{ width: '45px', height: '45px', borderRadius: '8px', objectFit: 'contain', background: 'rgba(0,0,0,0.3)' }} />}
                        <div>
                          <div className="history-title" style={{ fontSize: '0.95rem' }}>{item.title}</div>
                          <div className="history-meta">Start: ${item.startingPrice} · Highest: ${item.currentHighestBid}</div>
                        </div>
                      </div>
                      <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '600', background: `${statusColor(item.status)}22`, color: statusColor(item.status) }}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <h3 style={{ marginBottom: '15px' }}>Your Payment History</h3>
                  {paymentItems.length === 0 ? <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>No past payments.</p> : paymentItems.map((item, i) => (
                    <div key={`p-${i}`} className="history-item">
                      <div>
                        <div className="history-title">{item.title}</div>
                        <div className="history-meta">Won for ${item.currentHighestBid}</div>
                      </div>
                      <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>PAID ✓</span>
                    </div>
                  ))}
                  <h3 style={{ marginBottom: '15px', marginTop: '30px' }}>Your Bid History</h3>
                  {historyItems.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No bids placed yet.</p> : historyItems.map((item, i) => (
                    <div key={`b-${i}`} className="history-item">
                      <div>
                        <div className="history-title">Bid <strong>${item.bidAmount}</strong></div>
                        <div className="history-meta">on {item.auctionTitle}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
          <button onClick={onLogout} className="btn" style={{ background: 'var(--danger)', width: '100%' }}>Log Out Securely</button>
        </div>
      </div>
    </div>
  );
}

// --- Create Auction Modal Component ---
function CreateAuctionModal({ token, onClose, onSuccess }) {
  // Default: start = now, end = now + 30 min
  const toLocalStr = (d) => { const o = d.getTimezoneOffset() * 60000; return new Date(d.getTime() - o).toISOString().slice(0,16); };
  const [formData, setFormData] = useState({ title: '', description: '', startingPrice: '', startTime: toLocalStr(new Date()), endTime: toLocalStr(new Date(Date.now() + 30*60000)), image: null });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (new Date(formData.endTime) <= new Date(formData.startTime)) {
      alert('End time must be after start time'); return;
    }
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('startingPrice', formData.startingPrice);
    if (formData.image) data.append('image', formData.image);
    data.append('startTime', new Date(formData.startTime).toISOString());
    data.append('endTime', new Date(formData.endTime).toISOString());

    try {
      const res = await fetch('/api/auctions', { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: data });
      if (res.ok) onSuccess();
    } catch (err) { console.error(err); }
  };

  const isScheduled = new Date(formData.startTime) > new Date();

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div className="glass-panel modal-content" style={{ width: '500px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: 'var(--text)', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
        <h2 style={{ marginBottom: '20px' }}>Create New Auction</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Item Title</label>
            <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Description</label>
            <textarea required rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text)', borderRadius: '8px', fontFamily: 'inherit' }}></textarea>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Starting Price ($)</label>
            <input type="number" required min="1" value={formData.startingPrice} onChange={e => setFormData({...formData, startingPrice: e.target.value})} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>📅 Start Date & Time</label>
              <input type="datetime-local" required value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} style={{ colorScheme: 'dark' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>🏁 End Date & Time</label>
              <input type="datetime-local" required value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} style={{ colorScheme: 'dark' }} />
            </div>
          </div>
          {isScheduled && (
            <div style={{ padding: '10px 14px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '8px', fontSize: '0.85rem', color: '#818cf8' }}>
              ⏰ This auction will be <strong>scheduled</strong> and automatically go live at the selected start time.
            </div>
          )}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Item Photo (Optional)</label>
            <input type="file" accept="image/*" onChange={e => setFormData({...formData, image: e.target.files[0]})} style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text)', borderRadius: '8px' }} />
          </div>
          <button type="submit" className="btn" style={{ background: 'var(--primary)', marginTop: '10px' }}>{isScheduled ? '📅 Schedule Auction' : '🚀 Launch Auction Now'}</button>
        </form>
      </div>
    </div>
  );
}

// --- Checkout Modal Component ---
function CheckoutModal({ auctionId, token, amount, onClose, onSuccess }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    // Simulate contacting a payment gateway
    setTimeout(async () => {
      try {
        const res = await fetch(`/api/payment/pay/${auctionId}`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          onSuccess();
        } else {
          const errText = await res.text();
          setError(errText);
          setIsProcessing(false);
        }
      } catch (err) {
        setError("Payment failed due to network error.");
        setIsProcessing(false);
      }
    }, 1500); // 1.5 second mock delay
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div className="glass-panel" style={{ width: '400px', position: 'relative' }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '15px', right: '15px', background: 'transparent',
          border: 'none', color: 'var(--text)', fontSize: '1.2rem', cursor: 'pointer'
        }}>✕</button>
        
        <h2 style={{ marginBottom: '20px' }}>Complete Payment</h2>
        <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Amount Due</div>
          <div className="price" style={{ fontSize: '1.5rem' }}>${amount}</div>
        </div>

        {error && <div style={{ color: 'var(--danger)', marginBottom: '15px' }}>{error}</div>}

        {isProcessing ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div className="spinner" style={{ margin: '0 auto 20px auto', width: '40px', height: '40px', border: '4px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <p>Processing Payment securely...</p>
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <form onSubmit={handlePaymentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Cardholder Name</label>
              <input type="text" required placeholder="John Doe" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Card Number</label>
              <input type="text" required placeholder="0000 0000 0000 0000" maxLength="19" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Expiry</label>
                <input type="text" required placeholder="MM/YY" maxLength="5" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>CVC</label>
                <input type="text" required placeholder="123" maxLength="4" />
              </div>
            </div>
            <button type="submit" className="btn" style={{ background: 'var(--primary)', marginTop: '10px' }}>
              Confirm Payment
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// --- AuctionDetail Component ---
function AuctionDetail({ token, username, roles }) {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidAmount, setBidAmount] = useState('');
  const [timeLeft, setTimeLeft] = useState('');
  const [flashClass, setFlashClass] = useState('');
  const [error, setError] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    fetch(`/api/auctions/${id}`)
      .then(res => res.json())
      .then(data => {
        setAuction(data);
        setBidAmount((data.currentHighestBid || data.startingPrice) + 10);
      });

    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    fetch(`/api/bids/auction/${id}`, { headers, cache: 'no-store' })
      .then(res => {
        if (!res.ok) throw new Error("Error fetching bids");
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setBids(data.slice(0, 5));
        }
      })
      .catch(console.error);
  }, [id]);

  useEffect(() => {
    if (!auction) return;
    
    const calculateTimeLeft = () => {
      if (auction.status === 'UPCOMING') {
        const diff = new Date(auction.startTime) - new Date();
        if (diff > 0) {
          const d = Math.floor(diff / (1000*60*60*24));
          const h = Math.floor((diff / (1000*60*60)) % 24);
          const m = Math.floor((diff / 1000 / 60) % 60);
          const s = Math.floor((diff / 1000) % 60);
          setTimeLeft(d > 0 ? `Starts in ${d}d ${h}h ${m}m ${s}s` : `Starts in ${h}h ${m}m ${s}s`);
        } else {
          setTimeLeft("Starting soon...");
        }
      } else {
        const difference = new Date(auction.endTime) - new Date();
        if (difference > 0) {
          const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
          const m = Math.floor((difference / 1000 / 60) % 60);
          const s = Math.floor((difference / 1000) % 60);
          setTimeLeft(`${h}h ${m}m ${s}s`);
        } else {
          setTimeLeft("Auction Ended");
        }
      }
    };
    
    calculateTimeLeft();
    const timerId = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timerId);
  }, [auction]);

  useEffect(() => {
    if (!token) return;

    const socket = new SockJS('/ws');
    const stompClient = new window.StompJs.Client({
      webSocketFactory: () => socket,
      connectHeaders: { Authorization: `Bearer ${token}` },
      onConnect: () => {
        stompClient.subscribe(`/topic/auction/${id}`, (message) => {
          if (message.body) {
            const body = JSON.parse(message.body);
            if (body.status) {
              setAuction(prev => ({ ...prev, status: body.status }));
            }
            if (body.currentHighestBid) {
              setBids(prev => [{ amount: body.currentHighestBid, username: body.bidderUsername }, ...prev].slice(0, 5));
              setAuction(prev => ({ ...prev, currentHighestBid: body.currentHighestBid, endTime: body.newEndTime }));
  
              if (body.bidderUsername === username) {
                setFlashClass('flash-green');
              } else {
                setFlashClass('flash-red');
              }
              setTimeout(() => setFlashClass(''), 1000);
            }
          }
        });
      }
    });

    stompClient.activate();
    return () => stompClient.deactivate();
  }, [id, token, username]);

  const handleBid = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("Please login to place a bid.");
      return;
    }
    setError('');

    try {
      const res = await fetch('/api/bids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ auctionId: id, amount: parseFloat(bidAmount) })
      });

      if (!res.ok) {
        const errText = await res.text();
        setError(errText);
      }
    } catch (err) {
      setError("Failed to submit bid");
    }
  };

  const handleCheckoutSuccess = () => {
    setShowCheckout(false);
    setAuction(prev => ({ ...prev, status: 'PAID' }));
  };

  if (!auction) return <div>Loading...</div>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
      {showCheckout && (
        <CheckoutModal 
          auctionId={id} 
          token={token} 
          amount={auction.currentHighestBid || auction.startingPrice} 
          onClose={() => setShowCheckout(false)} 
          onSuccess={handleCheckoutSuccess} 
        />
      )}
      <div className={`glass-panel ${flashClass}`}>
        <div style={{ display: 'flex', gap: '20px' }}>
          <img 
            src={auction.imageUrl || 'https://images.unsplash.com/photo-1584727638096-042c45049ebe?auto=format&fit=crop&w=400&q=80'} 
            style={{ width: '300px', height: '300px', objectFit: 'contain', background: 'rgba(0,0,0,0.3)', borderRadius: '12px' }} 
            alt={auction.title} 
          />
          <div>
            <h1>{auction.title}</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '10px' }}>{auction.description}</p>
            <div style={{ marginTop: '20px' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Status: {
                  auction.status === 'UPCOMING' ? '📅 Scheduled' : 
                  (auction.status === 'PENDING_PAYMENT' && !(bids.length > 0 && bids[0].username === username) && auction.sellerUsername !== username) ? 'CLOSED' : 
                  auction.status
                }
              </div>
              <div className="timer" style={{ marginTop: '10px', color: auction.status === 'UPCOMING' ? '#818cf8' : undefined }}>{timeLeft}</div>
              
              {auction.status === 'UPCOMING' && (
                <div style={{ marginTop: '12px', padding: '12px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '10px', fontSize: '0.85rem', color: '#a5b4fc' }}>
                  ⏰ This auction hasn't started yet. Bidding opens at <strong>{new Date(auction.startTime).toLocaleString()}</strong>
                </div>
              )}
              
              {(auction.status === 'PENDING_PAYMENT' || auction.status === 'PAID' || timeLeft === "Auction Ended") && (
                <div style={{ marginTop: '10px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                  This auction has concluded.
                </div>
              )}
            </div>
            
            <div style={{ marginTop: '30px' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{auction.status === 'UPCOMING' ? 'Starting Price' : 'Current Highest Bid'}</div>
              <div className="price">${auction.status === 'UPCOMING' ? auction.startingPrice : (auction.currentHighestBid || auction.startingPrice)}</div>
            </div>

            {auction.status === 'UPCOMING' ? (
              <div style={{ marginTop: '30px', padding: '20px', background: 'rgba(99,102,241,0.06)', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>⏳</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Bidding will open when the auction starts</div>
              </div>
            ) : (auction.status === 'PENDING_PAYMENT' || (timeLeft === "Auction Ended" && auction.status !== 'PAID')) && bids.length > 0 && bids[0].username === username ? (
              <div style={{ marginTop: '30px' }}>
                <p style={{ color: 'var(--success)', marginBottom: '10px' }}>You won this auction!</p>
                <button onClick={() => setShowCheckout(true)} className="btn" style={{ background: 'var(--success)' }}>Pay Now</button>
              </div>
            ) : (!roles || roles.includes('ROLE_BUYER') || roles.length === 0) ? (
              <form onSubmit={handleBid} style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
                <input 
                  type="number" 
                  value={bidAmount} 
                  onChange={(e) => setBidAmount(e.target.value)} 
                  min={(auction.currentHighestBid || auction.startingPrice) + 1}
                  step="0.01"
                  required
                />
                <button type="submit" className="btn" disabled={auction.status !== 'ACTIVE'}>Place Bid</button>
              </form>
            ) : (
              <div style={{ marginTop: '30px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', color: 'var(--text-secondary)' }}>
                You are logged in as an Auctioneer. Only bidders can place bids.
              </div>
            )}
            {error && <div style={{ color: 'var(--danger)', marginTop: '10px' }}>{error}</div>}
          </div>
        </div>
      </div>

      <div className="glass-panel">
        <h2>Live Bid Feed</h2>
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {bids.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No bids yet. Be the first!</p> : null}
          {bids.map((bid, i) => (
            <div key={i} style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 'bold' }}>{bid.username}</span>
              <span className="price" style={{ fontSize: '1.2rem' }}>${bid.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Pending Payments Component ---
function PendingPayments({ token }) {
  const [pending, setPending] = useState([]);
  const [checkoutAuction, setCheckoutAuction] = useState(null);

  useEffect(() => {
    if (!token) return;
    fetch('/api/auctions/pending-payments', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error("Unauthorized or error fetching");
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setPending(data);
        }
      })
      .catch(console.error);
  }, [token]);

  if (pending.length === 0) return null;

  return (
    <div style={{ marginBottom: '40px' }}>
      {checkoutAuction && (
        <CheckoutModal 
          auctionId={checkoutAuction.id} 
          token={token} 
          amount={checkoutAuction.currentHighestBid} 
          onClose={() => setCheckoutAuction(null)} 
          onSuccess={() => {
            setCheckoutAuction(null);
            setPending(pending.filter(a => a.id !== checkoutAuction.id));
          }} 
        />
      )}
      <h2 style={{ color: 'var(--danger)', marginBottom: '20px' }}>Action Required: Pending Payments</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {pending.map(auction => (
          <div key={auction.id} className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <img src={auction.imageUrl} alt={auction.title} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
              <div>
                <h4 style={{ margin: 0 }}>{auction.title}</h4>
                <div className="price" style={{ fontSize: '1rem' }}>${auction.currentHighestBid}</div>
              </div>
            </div>
            <button 
              className="btn" 
              style={{ background: 'var(--success)' }}
              onClick={() => setCheckoutAuction(auction)}
            >
              Pay Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Main App Component ---
function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState(localStorage.getItem('username'));
  const [roles, setRoles] = useState(JSON.parse(localStorage.getItem('roles')) || []);
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('roles');
    setToken(null);
    setUsername('');
    setRoles([]);
    setShowProfile(false);
  };

  return (
    <div>
      <header className="app-header">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div className="logo">BidStream</div>
        </Link>
        <div>
          {token ? (
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <span style={{ marginRight: '15px' }}>Welcome, <strong>{username}</strong>!</span>
              <button onClick={() => setShowProfile(true)} className="btn" style={{ background: 'var(--text-secondary)' }}>Profile</button>
            </div>
          ) : (
            <Link to="/login">
              <button className="btn">Login / Register</button>
            </Link>
          )}
        </div>
      </header>

      <main className="container">
        {token && <Route exact path="/"><PendingPayments token={token} /></Route>}
        {showProfile && (
        <ProfileModal 
          token={token} 
          username={username} 
          roles={roles} 
          onClose={() => setShowProfile(false)} 
          onLogout={handleLogout} 
          onUsernameChange={(newUsername) => {
            setUsername(newUsername);
            localStorage.setItem('username', newUsername);
          }}
        />
      )}

      <Switch>
          <Route exact path="/">
            <AuctionList token={token} roles={roles} />
          </Route>
          <Route path="/auction/:id">
            <AuctionDetail token={token} username={username} roles={roles} />
          </Route>
          <Route path="/login">
            <Login setToken={setToken} setUsername={setUsername} setRoles={setRoles} />
          </Route>
        </Switch>
      </main>
    </div>
  );
}

// Mount the App
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
