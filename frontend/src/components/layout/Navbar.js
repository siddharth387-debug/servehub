import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => { logout(); navigate('/'); setDropdownOpen(false); };

  const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  const roleColors = {
    admin: '#7C3AED',
    volunteer: '#F4A261',
    provider: '#457B9D',
    user: '#2D6A4F'
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="nav-inner">
          <Link to="/" className="nav-logo">
            <div className="logo-icon">🌿</div>
            <span className="logo-text">ServeHub</span>
          </Link>

          <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <li><Link to="/" className={isActive('/') ? 'active' : ''}>Home</Link></li>
            <li><Link to="/services" className={isActive('/services') ? 'active' : ''}>Services</Link></li>
            <li><Link to="/careers" className={isActive('/careers') ? 'active' : ''}>Careers</Link></li>
            <li><Link to="/elder-care" className={isActive('/elder-care') ? 'active' : ''}>Elder Care</Link></li>
            {user?.role === 'admin' && (
              <li><Link to="/admin" className={isActive('/admin') ? 'active' : ''}>Admin</Link></li>
            )}
          </ul>

          <div className="nav-actions">
            {user ? (
              <div className="user-menu">
                <button className="user-avatar-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <div className="avatar" style={{ background: roleColors[user.role] || '#2D6A4F' }}>
                    {getInitials(user.name)}
                  </div>
                  <span className="user-name-short">{user.name?.split(' ')[0]}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                {dropdownOpen && (
                  <div className="user-dropdown">
                    <div className="dropdown-header">
                      <div className="avatar" style={{ background: roleColors[user.role] }}>{getInitials(user.name)}</div>
                      <div>
                        <p className="dname">{user.name}</p>
                        <p className="demail">{user.email}</p>
                        <span className="badge" style={{ background: roleColors[user.role] + '22', color: roleColors[user.role], fontSize: '0.7rem', padding: '2px 8px', borderRadius: '100px', fontWeight: 700 }}>
                          {user.role}
                        </span>
                      </div>
                    </div>
                    <div className="dropdown-divider" />
                    <Link to="/dashboard" onClick={() => setDropdownOpen(false)} className="dropdown-item">
                      <span>📊</span> Dashboard
                    </Link>
                    <Link to="/dashboard/profile" onClick={() => setDropdownOpen(false)} className="dropdown-item">
                      <span>👤</span> My Profile
                    </Link>
                    <div className="dropdown-divider" />
                    <button className="dropdown-item danger" onClick={handleLogout}>
                      <span>🚪</span> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-btns">
                <Link to="/login" className="btn btn-outline btn-sm">Sign In</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Join Now</Link>
              </div>
            )}
            <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .navbar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          padding: 16px 0;
          background: transparent;
          transition: all 0.3s ease;
        }
        .navbar.scrolled {
          background: rgba(254,250,244,0.97);
          backdrop-filter: blur(12px);
          box-shadow: 0 2px 20px rgba(45,106,79,0.10);
          padding: 12px 0;
        }
        .nav-inner {
          display: flex; align-items: center; gap: 32px;
        }
        .nav-logo {
          display: flex; align-items: center; gap: 10px; flex-shrink: 0;
          text-decoration: none;
        }
        .logo-icon {
          width: 40px; height: 40px;
          background: linear-gradient(135deg, #2D6A4F, #40916C);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px;
          box-shadow: 0 4px 12px rgba(45,106,79,0.3);
        }
        .logo-text {
          font-family: 'Playfair Display', serif;
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--primary-dark);
        }
        .nav-links {
          display: flex; align-items: center; gap: 4px;
          list-style: none; flex: 1; justify-content: center;
        }
        .nav-links a {
          padding: 8px 16px;
          border-radius: 100px;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-secondary);
          transition: all 0.2s;
          text-decoration: none;
        }
        .nav-links a:hover, .nav-links a.active {
          background: rgba(45,106,79,0.08);
          color: var(--primary);
        }
        .nav-actions { display: flex; align-items: center; gap: 12px; margin-left: auto; }
        .auth-btns { display: flex; gap: 8px; }
        .user-menu { position: relative; }
        .user-avatar-btn {
          display: flex; align-items: center; gap: 8px;
          background: white; border: 2px solid var(--border);
          border-radius: 100px; padding: 6px 12px 6px 6px;
          cursor: pointer; transition: all 0.2s;
        }
        .user-avatar-btn:hover { border-color: var(--primary); box-shadow: var(--shadow-sm); }
        .user-avatar-btn svg { color: var(--text-muted); }
        .avatar {
          width: 32px; height: 32px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.75rem; font-weight: 700; color: white;
        }
        .user-name-short { font-size: 0.875rem; font-weight: 600; color: var(--text-primary); }
        .user-dropdown {
          position: absolute; top: calc(100% + 8px); right: 0;
          background: white; border-radius: 16px;
          border: 1px solid var(--border);
          box-shadow: 0 8px 40px rgba(0,0,0,0.12);
          min-width: 240px; overflow: hidden; z-index: 100;
          animation: fadeInUp 0.15s ease;
        }
        .dropdown-header {
          padding: 16px; display: flex; gap: 12px; align-items: center;
          background: var(--warm-bg);
        }
        .dropdown-header .avatar { width: 40px; height: 40px; font-size: 0.9rem; }
        .dname { font-weight: 600; font-size: 0.9rem; margin-bottom: 2px; }
        .demail { font-size: 0.75rem; color: var(--text-muted); margin-bottom: 4px; }
        .dropdown-divider { height: 1px; background: var(--border); margin: 4px 0; }
        .dropdown-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 16px; width: 100%;
          font-size: 0.875rem; font-weight: 500; color: var(--text-secondary);
          background: none; border: none; cursor: pointer; text-decoration: none;
          transition: all 0.15s;
        }
        .dropdown-item:hover { background: var(--warm-bg); color: var(--primary); }
        .dropdown-item.danger:hover { background: #FEE2E2; color: var(--danger); }
        .hamburger {
          display: none; flex-direction: column; gap: 5px;
          background: none; border: none; padding: 8px; cursor: pointer;
        }
        .hamburger span {
          display: block; width: 22px; height: 2px;
          background: var(--text-primary); border-radius: 2px; transition: all 0.3s;
        }
        @media (max-width: 768px) {
          .nav-links {
            display: none; position: fixed; top: 70px; left: 0; right: 0;
            background: white; flex-direction: column; padding: 20px;
            box-shadow: var(--shadow-lg); border-bottom: 1px solid var(--border);
          }
          .nav-links.open { display: flex; }
          .hamburger { display: flex; }
          .user-name-short { display: none; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
