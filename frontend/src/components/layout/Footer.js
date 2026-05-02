import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="logo-row">
            <div className="logo-icon">🌿</div>
            <span className="logo-text">ServeHub</span>
          </div>
          <p className="tagline">Bridging opportunities, nurturing care — building a better community together.</p>
          <div className="social-links">
            {['twitter', 'linkedin', 'instagram'].map(s => (
              <a key={s} href="#" className="social-btn" aria-label={s}>
                {s === 'twitter' && '𝕏'}
                {s === 'linkedin' && 'in'}
                {s === 'instagram' && '📸'}
              </a>
            ))}
          </div>
        </div>

        <div className="footer-col">
          <h4>Our Services</h4>
          <ul>
            <li><Link to="/careers">Career Opportunities</Link></li>
            <li><Link to="/elder-care">Elder Care</Link></li>
            <li><Link to="/services">All Services</Link></li>
            <li><Link to="/register?role=volunteer">Become a Volunteer</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Platform</h4>
          <ul>
            <li><Link to="/register">Create Account</Link></li>
            <li><Link to="/login">Sign In</Link></li>
            <li><Link to="/dashboard">My Dashboard</Link></li>
            <li><a href="#">Contact Support</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>About</h4>
          <ul>
            <li><Link to="/mission">Our Mission</Link></li>
<li><Link to="/impact">Community Impact</Link></li>
<li><Link to="/privacy">Privacy Policy</Link></li>
<li><Link to="/terms">Terms of Service</Link></li>

          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} ServeHub. Built with ❤️ for humanity.</p>
        <p className="footer-note">Serving communities, one person at a time.</p>
      </div>
    </div>

    <style>{`
      .footer {
        background: var(--primary-dark);
        color: rgba(255,255,255,0.85);
        padding: 80px 0 40px;
        margin-top: 80px;
      }
      .footer-grid {
        display: grid;
        grid-template-columns: 1.5fr 1fr 1fr 1fr;
        gap: 48px;
        margin-bottom: 60px;
      }
      .footer-brand .logo-row {
        display: flex; align-items: center; gap: 10px; margin-bottom: 16px;
      }
      .footer-brand .logo-icon {
        width: 40px; height: 40px;
        background: rgba(255,255,255,0.15);
        border-radius: 12px;
        display: flex; align-items: center; justify-content: center;
        font-size: 20px;
      }
      .footer-brand .logo-text {
        font-family: 'Playfair Display', serif;
        font-size: 1.3rem; font-weight: 700; color: white;
      }
      .tagline {
        font-size: 0.9rem; line-height: 1.7;
        color: rgba(255,255,255,0.6);
        margin-bottom: 24px;
      }
      .social-links { display: flex; gap: 8px; }
      .social-btn {
        width: 36px; height: 36px;
        background: rgba(255,255,255,0.1);
        border-radius: 8px;
        display: flex; align-items: center; justify-content: center;
        font-size: 0.85rem; font-weight: 700; color: white;
        transition: all 0.2s;
      }
      .social-btn:hover { background: rgba(255,255,255,0.2); }
      .footer-col h4 {
        color: white;
        font-family: 'Playfair Display', serif;
        font-size: 1rem; margin-bottom: 20px;
      }
      .footer-col ul { list-style: none; }
      .footer-col li { margin-bottom: 10px; }
      .footer-col a {
        color: rgba(255,255,255,0.6);
        font-size: 0.9rem; transition: color 0.2s;
        text-decoration: none;
      }
      .footer-col a:hover { color: var(--accent); }
      .footer-bottom {
        border-top: 1px solid rgba(255,255,255,0.1);
        padding-top: 32px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .footer-bottom p { font-size: 0.875rem; color: rgba(255,255,255,0.5); }
      .footer-note { font-style: italic; }
      @media (max-width: 768px) {
        .footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
        .footer-bottom { flex-direction: column; gap: 8px; text-align: center; }
      }
      @media (max-width: 480px) {
        .footer-grid { grid-template-columns: 1fr; }
      }
    `}</style>
  </footer>
);

export default Footer;
