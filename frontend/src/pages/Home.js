import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API } from '../context/AuthContext';



const SERVICES = [
  { icon: '💼', title: 'Career Openings', desc: 'Discover thousands of job opportunities across all sectors. Upload your profile and connect with top employers.', link: '/careers', color: '#E8F4F1', accent: '#2D6A4F' },
  { icon: '🌿', title: 'Elder Gardening', desc: 'Volunteer to help seniors maintain their gardens — bringing joy and green beauty to their everyday lives.', link: '/elder-care', color: '#FEF3E7', accent: '#E76F51' },
  { icon: '🍱', title: 'Food Delivery', desc: 'Ensure elders receive nutritious home-cooked meals through our compassionate volunteer delivery network.', link: '/elder-care', color: '#EFF6FF', accent: '#457B9D' },
  { icon: '🏥', title: 'Medical Assistance', desc: 'Help seniors navigate medical appointments, access medications, and receive the care they deserve.', link: '/elder-care', color: '#F0FDF4', accent: '#16A34A' },
  { icon: '🛒', title: 'Grocery Help', desc: 'Assist elderly neighbours with grocery runs, ensuring they always have what they need without the strain.', link: '/elder-care', color: '#FFF7ED', accent: '#D97706' },
  { icon: '🤝', title: 'Companionship', desc: 'Fighting loneliness one visit at a time. Volunteer to spend quality time with seniors who need a friend.', link: '/elder-care', color: '#FDF4FF', accent: '#9333EA' },
];

const STATS = [
  { value: '12,000+', label: 'Community Members', icon: '👥' },
  { value: '3,400+', label: 'Jobs Posted', icon: '💼' },
  { value: '8,200+', label: 'Elders Served', icon: '❤️' },
  { value: '94%', label: 'Satisfaction Rate', icon: '⭐' },
];

const TESTIMONIALS = [
  { name: 'Priya Sharma', role: 'Volunteer', text: 'ServeHub helped me find my purpose. Every week I help Mrs. Rao with groceries, and the smile on her face makes everything worthwhile.', avatar: '👩', location: 'Chennai' },
  { name: 'Rajesh Kumar', role: 'Job Seeker', text: 'I found my dream job in just 2 weeks using ServeHub. The platform is incredibly easy to use and the job listings are genuine.', avatar: '👨', location: 'Bangalore' },
  { name: 'Meena Patel', role: 'Elder Care User', text: 'My father lives alone. ServeHub volunteers come twice a week to help him with household tasks. We feel so much more at peace.', avatar: '👩', location: 'Mumbai' },
];

const HomePage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    API.get('/services/overview')
      .then(res => setStats(res.data.overview))
      .catch(() => {});
  }, []);

  return (
    <div className="home">
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-circle hc1"></div>
          <div className="hero-circle hc2"></div>
          <div className="hero-circle hc3"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge animate-in">🌱 Building stronger communities since 2024</div>
            <h1 className="hero-title animate-in delay-1">
              Where <em>Opportunity</em><br />Meets <em>Compassion</em>
            </h1>
            <p className="hero-subtitle animate-in delay-2">
              ServeHub connects job seekers with career opportunities while empowering communities to care for their elders with dignity and love.
            </p>
            <div className="hero-actions animate-in delay-3">
              <Link to="/careers" className="btn btn-accent btn-lg">
                <span>💼</span> Explore Careers
              </Link>
              <Link to="/elder-care" className="btn btn-outline-white btn-lg">
                <span>❤️</span> Help an Elder
              </Link>
            </div>
            <div className="hero-trust animate-in delay-4">
              <div className="trust-avatars">
                {['👩','👨','👴','👵','🧑'].map((e,i) => (
                  <div key={i} className="trust-avatar">{e}</div>
                ))}
              </div>
              <p>Joined by <strong>12,000+ community members</strong> across India</p>
            </div>
          </div>
          <div className="hero-visual animate-in delay-2">
            <div className="hero-card hc-main">
              <div className="hc-icon">🤝</div>
              <h3>Together We Serve</h3>
              <p>Every action creates a ripple of kindness</p>
            </div>
            <div className="hero-card hc-float hcf1">
              <span>💼</span>
              <div>
                <p className="hcf-title">New Job Posted</p>
                <p className="hcf-sub">Software Engineer · Remote</p>
              </div>
            </div>
            <div className="hero-card hc-float hcf2">
              <span>❤️</span>
              <div>
                <p className="hcf-title">Elder Helped Today</p>
                <p className="hcf-sub">Grocery run · Chennai</p>
              </div>
            </div>
            <div className="hero-card hc-float hcf3">
              <span>⭐</span>
              <div>
                <p className="hcf-title">5-Star Review</p>
                <p className="hcf-sub">"Life-changing platform!"</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {STATS.map((s, i) => (
              <div key={i} className="stat-card animate-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="stat-icon">{s.icon}</div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="services-section">
        <div className="container">
          <div className="section-title">
            <span className="overline">What We Offer</span>
            <h2>Services Built for People</h2>
            <p>From career growth to elder care, ServeHub is your community's platform for opportunity and compassion.</p>
          </div>
          <div className="services-grid">
            {SERVICES.map((s, i) => (
              <Link to={s.link} key={i} className="service-card" style={{ '--card-bg': s.color, '--card-accent': s.accent }}>
                <div className="sc-icon-wrap">
                  <span>{s.icon}</span>
                </div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <div className="sc-arrow">→</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-inner">
            <div className="mission-text">
              <span className="overline">Our Purpose</span>
              <h2>Why ServeHub Exists</h2>
              <p>India's elders built this nation. Our youth carry its future. ServeHub is the bridge that connects opportunity with gratitude — creating a cycle of giving where career growth funds community care.</p>
              <p>Every job filled. Every elder helped. Every volunteer hour given. These aren't just transactions — they are acts of profound human kindness.</p>
              {!user && (
                <div className="mission-actions">
                  <Link to="/register" className="btn btn-primary">Join the Movement 🌿</Link>
                  <Link to="/services" className="btn btn-outline">Learn More</Link>
                </div>
              )}
            </div>
            <div className="mission-visual">
              <div className="mv-block mvb1">
                <span>🌱</span>
                <h4>Grow Together</h4>
                <p>Career opportunities for everyone</p>
              </div>
              <div className="mv-block mvb2">
                <span>❤️</span>
                <h4>Care Together</h4>
                <p>Elder support network</p>
              </div>
              <div className="mv-block mvb3">
                <span>✨</span>
                <h4>Thrive Together</h4>
                <p>A stronger community</p>
              </div>
              <div className="mv-center">
                <span>🌍</span>
                <p>Community</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-title">
            <span className="overline">Simple & Easy</span>
            <h2>How ServeHub Works</h2>
          </div>
          <div className="steps-grid">
            {[
              { step: '01', icon: '📝', title: 'Create Your Profile', desc: 'Sign up as a job seeker, volunteer, or service provider in under 2 minutes.' },
              { step: '02', icon: '🔍', title: 'Browse & Discover', desc: 'Explore career openings or find elder care requests in your neighbourhood.' },
              { step: '03', icon: '🤝', title: 'Connect & Act', desc: 'Apply for jobs or accept elder care tasks and start making a difference today.' },
              { step: '04', icon: '🌟', title: 'Build Your Legacy', desc: 'Track your impact, earn recognition, and grow within the ServeHub community.' },
            ].map((s, i) => (
              <div key={i} className="step-card animate-in" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="step-number">{s.step}</div>
                <div className="step-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-title">
            <span className="overline">Community Stories</span>
            <h2>Voices of ServeHub</h2>
          </div>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testimonial-card animate-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="tc-quote">"</div>
                <p className="tc-text">{t.text}</p>
                <div className="tc-author">
                  <div className="tc-avatar">{t.avatar}</div>
                  <div>
                    <p className="tc-name">{t.name}</p>
                    <p className="tc-role">{t.role} · {t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="cta-section">
          <div className="container">
            <div className="cta-inner">
              <div className="cta-bg-circles">
                <div className="cta-circle cc1"></div>
                <div className="cta-circle cc2"></div>
              </div>
              <div className="cta-content">
                <h2>Ready to Make a Difference?</h2>
                <p>Join thousands of people already building careers and transforming lives through ServeHub.</p>
                <div className="cta-actions">
                  <Link to="/register" className="btn btn-accent btn-lg">Start Your Journey 🌿</Link>
                  <Link to="/login" className="btn btn-outline-white btn-lg">Sign In</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <style>{`
        .home { overflow-x: hidden; }

        /* HERO */
        .hero {
          min-height: 100vh;
          background: linear-gradient(135deg, #1B4332 0%, #2D6A4F 40%, #40916C 75%, #52B788 100%);
          display: flex; align-items: center;
          padding: 120px 0 80px;
          position: relative; overflow: hidden;
        }
        .hero-bg { position: absolute; inset: 0; }
        .hero-circle { position: absolute; border-radius: 50%; background: rgba(255,255,255,0.05); }
        .hc1 { width: 600px; height: 600px; top: -200px; right: -100px; }
        .hc2 { width: 400px; height: 400px; bottom: -100px; left: -100px; }
        .hc3 { width: 250px; height: 250px; top: 30%; left: 40%; background: rgba(244,162,97,0.08); }
        .hero .container { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; position: relative; z-index: 1; }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25);
          color: white; padding: 8px 20px; border-radius: 100px;
          font-size: 0.875rem; font-weight: 500;
          margin-bottom: 24px; backdrop-filter: blur(8px);
        }
        .hero-title {
          font-size: 3.8rem; color: white; margin-bottom: 20px;
          line-height: 1.1;
        }
        .hero-title em {
          font-style: normal;
          background: linear-gradient(135deg, #F4A261, #FDDCB5);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-subtitle { color: rgba(255,255,255,0.8); font-size: 1.15rem; line-height: 1.7; margin-bottom: 36px; max-width: 500px; }
        .hero-actions { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 40px; }
        .hero-trust { display: flex; align-items: center; gap: 16px; }
        .trust-avatars { display: flex; }
        .trust-avatar {
          width: 36px; height: 36px; border-radius: 50%; font-size: 18px;
          background: rgba(255,255,255,0.15); border: 2px solid rgba(255,255,255,0.4);
          display: flex; align-items: center; justify-content: center;
          margin-right: -8px;
        }
        .hero-trust p { color: rgba(255,255,255,0.8); font-size: 0.875rem; margin-left: 16px; }
        .hero-trust strong { color: white; }
        .hero-visual { position: relative; height: 420px; }
        .hero-card {
          background: rgba(255,255,255,0.12);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 20px;
          padding: 24px;
          color: white;
        }
        .hc-main {
          width: 280px; text-align: center;
          position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
        }
        .hc-icon { font-size: 2.5rem; margin-bottom: 12px; }
        .hc-main h3 { color: white; margin-bottom: 6px; }
        .hc-main p { color: rgba(255,255,255,0.7); font-size: 0.875rem; }
        .hc-float {
          display: flex; align-items: center; gap: 10px;
          padding: 12px 16px;
          position: absolute;
          font-size: 1.4rem;
          min-width: 200px;
          animation: float 4s ease-in-out infinite;
        }
        .hcf1 { top: 10%; right: 0; animation-delay: 0s; }
        .hcf2 { bottom: 15%; left: 0; animation-delay: 1.5s; }
        .hcf3 { top: 40%; right: -10%; animation-delay: 0.8s; }
        .hcf-title { font-size: 0.8rem; font-weight: 600; color: white; }
        .hcf-sub { font-size: 0.7rem; color: rgba(255,255,255,0.65); }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }

        /* STATS */
        .stats-section { padding: 80px 0; background: white; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
        .stat-card {
          text-align: center; padding: 36px 24px;
          background: var(--warm-bg);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border);
          transition: var(--transition);
        }
        .stat-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); }
        .stat-icon { font-size: 2rem; margin-bottom: 12px; }
        .stat-value { font-family: 'Playfair Display', serif; font-size: 2.4rem; font-weight: 700; color: var(--primary-dark); margin-bottom: 6px; }
        .stat-label { color: var(--text-muted); font-size: 0.9rem; }

        /* SERVICES */
        .services-section { padding: 100px 0; }
        .services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .service-card {
          background: var(--card-bg);
          border-radius: var(--radius-lg);
          padding: 32px;
          text-decoration: none;
          transition: var(--transition);
          border: 2px solid transparent;
          display: block;
          position: relative;
        }
        .service-card:hover {
          transform: translateY(-6px);
          border-color: var(--card-accent);
          box-shadow: 0 12px 40px rgba(0,0,0,0.1);
        }
        .sc-icon-wrap {
          width: 64px; height: 64px;
          background: white;
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          font-size: 2rem; margin-bottom: 20px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        .service-card h3 { font-size: 1.25rem; margin-bottom: 10px; color: var(--primary-dark); }
        .service-card p { color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6; }
        .sc-arrow {
          font-size: 1.2rem; margin-top: 16px;
          color: var(--card-accent); font-weight: bold;
          transition: transform 0.2s;
        }
        .service-card:hover .sc-arrow { transform: translateX(4px); }

        /* MISSION */
        .mission-section { padding: 100px 0; background: white; }
        .mission-inner {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 80px; align-items: center;
        }
        .mission-text .overline { color: var(--accent); }
        .mission-text h2 { font-size: 2.5rem; margin: 12px 0 24px; }
        .mission-text p { color: var(--text-secondary); line-height: 1.8; margin-bottom: 16px; }
        .mission-actions { display: flex; gap: 16px; margin-top: 32px; }
        .mission-visual { position: relative; height: 380px; }
        .mv-center {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
          width: 100px; height: 100px; border-radius: 50%;
          background: linear-gradient(135deg, var(--primary), var(--primary-light));
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          color: white; font-size: 2rem; box-shadow: 0 8px 32px rgba(45,106,79,0.35);
          z-index: 2;
        }
        .mv-center p { font-size: 0.7rem; font-weight: 600; margin-top: 4px; }
        .mv-block {
          position: absolute; background: var(--warm-card);
          border: 1px solid var(--border); border-radius: var(--radius-md);
          padding: 20px; text-align: center;
          box-shadow: var(--shadow-sm);
        }
        .mv-block span { font-size: 1.8rem; }
        .mv-block h4 { font-size: 0.95rem; margin: 8px 0 4px; }
        .mv-block p { font-size: 0.8rem; color: var(--text-muted); }
        .mvb1 { top: 0; left: 0; width: 160px; }
        .mvb2 { top: 0; right: 0; width: 160px; }
        .mvb3 { bottom: 0; left: 50%; transform: translateX(-50%); width: 160px; }

        /* HOW IT WORKS */
        .how-it-works { padding: 100px 0; }
        .steps-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
        .step-card { text-align: center; padding: 40px 24px; background: white; border-radius: var(--radius-lg); border: 1px solid var(--border); position: relative; }
        .step-number { font-family: 'Playfair Display', serif; font-size: 3rem; color: var(--border); font-weight: 700; position: absolute; top: 16px; right: 20px; line-height: 1; }
        .step-icon { font-size: 2.5rem; margin-bottom: 16px; }
        .step-card h3 { font-size: 1.1rem; margin-bottom: 8px; }
        .step-card p { color: var(--text-muted); font-size: 0.875rem; line-height: 1.6; }

        /* TESTIMONIALS */
        .testimonials-section { padding: 100px 0; background: var(--primary-dark); }
        .testimonials-section .section-title h2 { color: white; }
        .testimonials-section .section-title p { color: rgba(255,255,255,0.65); }
        .testimonials-section .overline { color: var(--accent); }
        .testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .testimonial-card {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: var(--radius-lg);
          padding: 36px;
          position: relative;
        }
        .tc-quote { font-size: 4rem; color: var(--accent); line-height: 0.5; margin-bottom: 20px; font-family: Georgia; font-weight: 700; }
        .tc-text { color: rgba(255,255,255,0.85); font-size: 0.95rem; line-height: 1.7; margin-bottom: 28px; }
        .tc-author { display: flex; align-items: center; gap: 12px; }
        .tc-avatar { font-size: 2rem; }
        .tc-name { font-weight: 600; color: white; font-size: 0.9rem; }
        .tc-role { color: rgba(255,255,255,0.55); font-size: 0.8rem; }

        /* CTA */
        .cta-section { padding: 100px 0; }
        .cta-inner {
          background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 60%, var(--accent-dark) 100%);
          border-radius: 32px;
          padding: 80px 60px;
          text-align: center;
          position: relative; overflow: hidden;
        }
        .cta-bg-circles { position: absolute; inset: 0; }
        .cta-circle { position: absolute; border-radius: 50%; background: rgba(255,255,255,0.05); }
        .cc1 { width: 400px; height: 400px; top: -100px; right: -100px; }
        .cc2 { width: 300px; height: 300px; bottom: -80px; left: -80px; }
        .cta-content { position: relative; z-index: 1; }
        .cta-content h2 { color: white; font-size: 2.8rem; margin-bottom: 16px; }
        .cta-content p { color: rgba(255,255,255,0.75); font-size: 1.1rem; margin-bottom: 36px; }
        .cta-actions { display: flex; gap: 16px; justify-content: center; }

        @media (max-width: 1024px) {
          .hero-title { font-size: 2.8rem; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .services-grid { grid-template-columns: repeat(2, 1fr); }
          .steps-grid { grid-template-columns: repeat(2, 1fr); }
          .testimonials-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) {
          .hero .container { grid-template-columns: 1fr; }
          .hero-visual { display: none; }
          .hero-title { font-size: 2.2rem; }
          .hero-actions { flex-direction: column; }
          .services-grid, .stats-grid, .steps-grid { grid-template-columns: 1fr; }
          .mission-inner { grid-template-columns: 1fr; }
          .mission-visual { display: none; }
          .cta-inner { padding: 48px 24px; }
          .cta-content h2 { font-size: 2rem; }
          .cta-actions { flex-direction: column; align-items: center; }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
