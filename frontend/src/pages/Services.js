import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth, API } from '../context/AuthContext';


const MODULES = [
  {
    icon: '💼', title: 'Career Opportunities', color: '#E8F4F1', accent: '#2D6A4F',
    desc: 'Browse thousands of verified job listings across technology, healthcare, education, and more. Apply in seconds and track your applications.',
    features: ['Advanced job search & filters', 'One-click applications', 'Career progress tracking', 'Company profiles'],
    link: '/careers', linkText: 'Browse Jobs'
  },
  {
    icon: '❤️', title: 'Elder Care Network', color: '#FEF3E7', accent: '#E76F51',
    desc: 'Request compassionate help for senior citizens in your family or community. Our volunteers provide genuine, heartfelt assistance.',
    features: ['Gardening & yard work', 'Food delivery & meals', 'Medical support & appointments', 'Companionship & social visits'],
    link: '/elder-care', linkText: 'Get Help Now'
  },
  {
    icon: '🤝', title: 'Volunteer Program', color: '#EFF6FF', accent: '#457B9D',
    desc: 'Give back to your community by becoming a ServeHub volunteer. Help elders, build connections, and earn recognition for your service.',
    features: ['Flexible scheduling', 'Impact tracking dashboard', 'Volunteer badges & rewards', 'Community recognition'],
    link: '/register?role=volunteer', linkText: 'Become a Volunteer'
  },
  {
    icon: '🏢', title: 'For Employers', color: '#F0FDF4', accent: '#16A34A',
    desc: 'Post job listings, discover talented candidates, and build your workforce. Reach thousands of job seekers actively looking for opportunities.',
    features: ['Easy job posting', 'Applicant management', 'Candidate filtering', 'Company branding'],
    link: '/register?role=provider', linkText: 'Post a Job'
  },
];

const ServicesPage = () => (
  <div className="services-page">
    <div className="page-header">
      <div className="container">
        <h1>Our Services</h1>
        <p>Everything you need to grow, give back, and build a stronger community.</p>
      </div>
    </div>

    <div className="container" style={{ padding: '80px 24px' }}>
      <div className="services-detailed">
        {MODULES.map((m, i) => (
          <div key={i} className={`service-detail-row ${i % 2 === 1 ? 'reverse' : ''}`}>
            <div className="sd-visual" style={{ background: m.color }}>
              <div className="sd-icon">{m.icon}</div>
              <div className="sd-features">
                {m.features.map((f, j) => (
                  <div key={j} className="sd-feature">
                    <span style={{ color: m.accent }}>✓</span> {f}
                  </div>
                ))}
              </div>
            </div>
            <div className="sd-text">
              <h2 style={{ color: m.accent }}>{m.title}</h2>
              <p>{m.desc}</p>
              <Link to={m.link} className="btn btn-primary" style={{ background: m.accent, borderColor: m.accent }}>
                {m.linkText} →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Why choose us */}
      <div className="why-section">
        <div className="section-title">
          <span className="overline">Why ServeHub</span>
          <h2>A Platform Built for People</h2>
          <p>We believe that economic opportunity and community care go hand in hand.</p>
        </div>
        <div className="why-grid">
          {[
            { icon: '🔒', title: 'Trusted & Safe', desc: 'All volunteers and employers are verified. Your safety and dignity are our priority.' },
            { icon: '🚀', title: 'Fast & Simple', desc: 'Apply for jobs or request care in under 2 minutes. No complicated processes.' },
            { icon: '🌍', title: 'Community First', desc: 'Every feature is designed to strengthen communities, not just transactions.' },
            { icon: '💚', title: 'Free to Use', desc: 'Core features are completely free. We believe in equal access to opportunity.' },
          ].map((w, i) => (
            <div key={i} className="why-card">
              <div className="why-icon">{w.icon}</div>
              <h3>{w.title}</h3>
              <p>{w.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>

    <style>{`
      .services-page { padding-top: 80px; }
      .services-detailed { display: flex; flex-direction: column; gap: 80px; margin-bottom: 100px; }
      .service-detail-row { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
      .service-detail-row.reverse { direction: rtl; }
      .service-detail-row.reverse > * { direction: ltr; }
      .sd-visual { border-radius: var(--radius-xl); padding: 48px; display: flex; flex-direction: column; align-items: center; gap: 24px; }
      .sd-icon { font-size: 5rem; }
      .sd-features { display: flex; flex-direction: column; gap: 12px; width: 100%; }
      .sd-feature { display: flex; align-items: center; gap: 10px; font-size: 0.9rem; font-weight: 500; color: var(--text-secondary); }
      .sd-text h2 { font-size: 2.2rem; margin-bottom: 20px; }
      .sd-text p { color: var(--text-secondary); line-height: 1.8; margin-bottom: 32px; font-size: 1.05rem; }
      .why-section { padding: 80px 0 0; }
      .why-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
      .why-card { text-align: center; padding: 40px 24px; background: white; border-radius: var(--radius-lg); border: 1px solid var(--border); }
      .why-icon { font-size: 2.5rem; margin-bottom: 16px; }
      .why-card h3 { font-size: 1.1rem; margin-bottom: 10px; }
      .why-card p { color: var(--text-muted); font-size: 0.875rem; line-height: 1.6; }
      @media (max-width: 768px) {
        .service-detail-row, .service-detail-row.reverse { grid-template-columns: 1fr; direction: ltr; }
        .why-grid { grid-template-columns: 1fr 1fr; }
      }
    `}</style>
  </div>
);

export default ServicesPage;
