import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { API } from "../context/AuthContext";
import toast from 'react-hot-toast';

const TABS = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'profile', label: 'My Profile', icon: '👤' },
  { id: 'applications', label: 'Applications', icon: '💼' },
  { id: 'care-requests', label: 'Care Requests', icon: '❤️' },
];

const Dashboard = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [profileForm, setProfileForm] = useState({ name: '', phone: '', bio: '', skills: '' });
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({ applications: 0, careRequests: 0, completedCare: 0 });

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    setProfileForm({
      name: user.name || '',
      phone: user.phone || '',
      bio: user.bio || '',
      skills: user.skills?.join(', ') || ''
    });

    API.get('/services/overview').then(res => {
      setStats({
        applications: 0,
        careRequests: res.data.overview.totalCareRequests,
        completedCare: res.data.overview.completedCare
      });
    }).catch(() => {});
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    await updateProfile({
      ...profileForm,
      skills: profileForm.skills.split(',').map(s => s.trim()).filter(Boolean)
    });
    setSaving(false);
  };

  if (!user) return null;

  const roleColors = { admin: '#7C3AED', volunteer: '#F4A261', provider: '#457B9D', user: '#2D6A4F' };
  const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <div className="dashboard">
      <div className="dashboard-sidebar">
        <div className="sidebar-profile">
          <div className="sb-avatar" style={{ background: roleColors[user.role] || '#2D6A4F' }}>
            {getInitials(user.name)}
          </div>
          <div>
            <h3 className="sb-name">{user.name}</h3>
            <span className="sb-role" style={{ background: roleColors[user.role] + '22', color: roleColors[user.role] }}>
              {user.role}
            </span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {TABS.map(t => (
            <button key={t.id} className={`snav-item ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id)}>
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
          <div className="snav-divider" />
          <Link to="/careers" className="snav-item">
            <span>🔍</span> Browse Jobs
          </Link>
          <Link to="/elder-care" className="snav-item">
            <span>❤️</span> Elder Care
          </Link>
          <button className="snav-item danger" onClick={() => { logout(); navigate('/'); }}>
            <span>🚪</span> Sign Out
          </button>
        </nav>
      </div>

      <div className="dashboard-main">
        <div className="dash-header">
          <div>
            <h1>
              {tab === 'overview' && `Good day, ${user.name?.split(' ')[0]}! 🌿`}
              {tab === 'profile' && 'My Profile'}
              {tab === 'applications' && 'My Job Applications'}
              {tab === 'care-requests' && 'My Care Requests'}
            </h1>
            <p className="dash-sub">
              {tab === 'overview' && "Here's a summary of your ServeHub activity."}
              {tab === 'profile' && "Manage your personal information and skills."}
              {tab === 'applications' && "Track all your job applications."}
              {tab === 'care-requests' && "Manage elder care requests."}
            </p>
          </div>
        </div>

        {/* OVERVIEW TAB */}
        {tab === 'overview' && (
          <div className="overview-content animate-in">
            <div className="stat-cards">
              <div className="dash-stat-card">
                <div className="dsc-icon" style={{ background: '#E8F4F1' }}>💼</div>
                <div>
                  <h3>Job Applications</h3>
                  <p className="dsc-value">Track your career journey</p>
                </div>
                <button className="btn btn-outline btn-sm" onClick={() => setTab('applications')}>View</button>
              </div>
              <div className="dash-stat-card">
                <div className="dsc-icon" style={{ background: '#FEF3E7' }}>❤️</div>
                <div>
                  <h3>Care Activity</h3>
                  <p className="dsc-value">{stats.completedCare} completed platform-wide</p>
                </div>
                <button className="btn btn-outline btn-sm" onClick={() => setTab('care-requests')}>View</button>
              </div>
              <div className="dash-stat-card">
                <div className="dsc-icon" style={{ background: '#EFF6FF' }}>👤</div>
                <div>
                  <h3>Profile</h3>
                  <p className="dsc-value">{user.bio ? 'Bio added' : 'Complete your profile'}</p>
                </div>
                <button className="btn btn-outline btn-sm" onClick={() => setTab('profile')}>Edit</button>
              </div>
            </div>

            {/* Quick Actions */}
            <h2 className="section-head">Quick Actions</h2>
            <div className="quick-actions-grid">
              {[
                { icon: '🔍', title: 'Find Jobs', desc: 'Browse latest opportunities', link: '/careers', color: '#E8F4F1' },
                { icon: '❤️', title: 'Request Care', desc: 'Get help for an elder', link: '/elder-care', color: '#FEF3E7' },
                ...(user.role === 'volunteer' ? [{ icon: '🤝', title: 'Help an Elder', desc: 'Accept care requests', link: '/elder-care', color: '#D1FAE5' }] : []),
                ...(user.role === 'provider' || user.role === 'admin' ? [{ icon: '➕', title: 'Post a Job', desc: 'Find new talent', link: '/careers', color: '#F0FDF4' }] : []),
                { icon: '👤', title: 'Edit Profile', desc: 'Update your information', link: null, color: '#EFF6FF', onClick: () => setTab('profile') },
              ].map((a, i) => (
                a.link ? (
                  <Link key={i} to={a.link} className="qa-card" style={{ background: a.color }}>
                    <span className="qa-icon">{a.icon}</span>
                    <h4>{a.title}</h4>
                    <p>{a.desc}</p>
                  </Link>
                ) : (
                  <button key={i} className="qa-card" style={{ background: a.color }} onClick={a.onClick}>
                    <span className="qa-icon">{a.icon}</span>
                    <h4>{a.title}</h4>
                    <p>{a.desc}</p>
                  </button>
                )
              ))}
            </div>

            {/* Role specific message */}
            <div className="role-banner" style={{ background: roleColors[user.role] + '12', borderColor: roleColors[user.role] + '40' }}>
              <span style={{ fontSize: '1.5rem' }}>
                {user.role === 'volunteer' ? '🤝' : user.role === 'provider' ? '🏢' : user.role === 'admin' ? '⚙️' : '🌱'}
              </span>
              <div>
                <h3 style={{ color: roleColors[user.role] }}>
                  {user.role === 'volunteer' && 'You are a Volunteer — Thank you for serving!'}
                  {user.role === 'provider' && 'Employer Account — Post jobs and find talent'}
                  {user.role === 'admin' && 'Admin Access — Manage the ServeHub platform'}
                  {user.role === 'user' && 'Community Member — Explore jobs and request care'}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  {user.role === 'volunteer' && 'Browse open elder care requests and make someone\'s day better.'}
                  {user.role === 'provider' && 'Reach thousands of qualified job seekers on ServeHub.'}
                  {user.role === 'admin' && 'You have full access to the admin panel.'}
                  {user.role === 'user' && 'Find your next opportunity or request care for your loved ones.'}
                </p>
              </div>
              {user.role === 'admin' && (
                <Link to="/admin" className="btn btn-sm" style={{ background: roleColors.admin, color: 'white', borderColor: roleColors.admin }}>Admin Panel</Link>
              )}
            </div>
          </div>
        )}

        {/* PROFILE TAB */}
        {tab === 'profile' && (
          <div className="profile-content animate-in">
            <div className="profile-card">
              <div className="profile-avatar-section">
                <div className="profile-avatar-big" style={{ background: roleColors[user.role] || '#2D6A4F' }}>
                  {getInitials(user.name)}
                </div>
                <div>
                  <h2>{user.name}</h2>
                  <p className="text-muted">{user.email}</p>
                  <span className="badge" style={{ background: roleColors[user.role] + '22', color: roleColors[user.role], marginTop: 8, display: 'inline-block', padding: '4px 14px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 700 }}>
                    {user.role}
                  </span>
                </div>
              </div>
              <div className="divider" />
              <form onSubmit={handleSaveProfile}>
                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input className="form-input" value={profileForm.name} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input className="form-input" value={profileForm.phone} onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} placeholder="Phone number" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Bio</label>
                  <textarea className="form-textarea" value={profileForm.bio} onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })} placeholder="Tell us about yourself..." style={{ minHeight: 100 }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Skills (comma-separated)</label>
                  <input className="form-input" value={profileForm.skills} onChange={e => setProfileForm({ ...profileForm, skills: e.target.value })} placeholder="React, Node.js, Communication..." />
                </div>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : '✅ Save Changes'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* APPLICATIONS TAB */}
        {tab === 'applications' && (
          <div className="animate-in">
            <div className="empty-state">
              <div className="icon">💼</div>
              <h3>Your Applications</h3>
              <p>Job applications you submit will appear here.</p>
              <Link to="/careers" className="btn btn-primary mt-16">Browse Jobs →</Link>
            </div>
          </div>
        )}

        {/* CARE REQUESTS TAB */}
        {tab === 'care-requests' && (
          <div className="animate-in">
            <div className="empty-state">
              <div className="icon">❤️</div>
              <h3>Care Requests</h3>
              <p>Elder care requests you've submitted or accepted will appear here.</p>
              <Link to="/elder-care" className="btn btn-accent mt-16">Go to Elder Care →</Link>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .dashboard {
          display: grid; grid-template-columns: 280px 1fr;
          min-height: 100vh; padding-top: 80px;
        }
        .dashboard-sidebar {
          background: white; border-right: 1px solid var(--border);
          padding: 32px 20px; position: sticky; top: 80px;
          height: calc(100vh - 80px); overflow-y: auto;
        }
        .sidebar-profile { display: flex; align-items: center; gap: 12px; margin-bottom: 32px; padding: 16px; background: var(--warm-bg); border-radius: var(--radius-md); }
        .sb-avatar { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1rem; font-weight: 700; color: white; flex-shrink: 0; }
        .sb-name { font-size: 0.95rem; font-weight: 600; margin-bottom: 4px; }
        .sb-role { font-size: 0.75rem; font-weight: 700; padding: 3px 10px; border-radius: 100px; text-transform: capitalize; }
        .sidebar-nav { display: flex; flex-direction: column; gap: 4px; }
        .snav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 14px; border-radius: var(--radius-sm);
          font-size: 0.875rem; font-weight: 500; color: var(--text-secondary);
          background: none; border: none; cursor: pointer; text-decoration: none;
          transition: all 0.2s; text-align: left;
        }
        .snav-item:hover { background: var(--warm-bg); color: var(--primary); }
        .snav-item.active { background: rgba(45,106,79,0.1); color: var(--primary); font-weight: 600; }
        .snav-item.danger:hover { background: #FEE2E2; color: var(--danger); }
        .snav-divider { height: 1px; background: var(--border); margin: 12px 0; }
        .dashboard-main { padding: 40px 48px; background: var(--warm-bg); min-height: calc(100vh - 80px); }
        .dash-header { margin-bottom: 36px; }
        .dash-header h1 { font-size: 2rem; margin-bottom: 6px; }
        .dash-sub { color: var(--text-muted); }
        .stat-cards { display: flex; flex-direction: column; gap: 16px; margin-bottom: 40px; }
        .dash-stat-card { background: white; border-radius: var(--radius-md); padding: 20px 24px; border: 1px solid var(--border); display: flex; align-items: center; gap: 16px; }
        .dsc-icon { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink: 0; }
        .dash-stat-card h3 { font-size: 1rem; margin-bottom: 3px; }
        .dsc-value { font-size: 0.825rem; color: var(--text-muted); }
        .dash-stat-card .btn { margin-left: auto; flex-shrink: 0; }
        .section-head { font-size: 1.3rem; margin-bottom: 20px; }
        .quick-actions-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 36px; }
        .qa-card { border-radius: var(--radius-md); padding: 24px 20px; cursor: pointer; border: 1px solid transparent; transition: var(--transition); text-align: left; text-decoration: none; display: block; }
        .qa-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }
        .qa-icon { font-size: 1.8rem; margin-bottom: 10px; display: block; }
        .qa-card h4 { font-size: 0.95rem; margin-bottom: 4px; color: var(--primary-dark); }
        .qa-card p { font-size: 0.8rem; color: var(--text-muted); }
        .role-banner { border-radius: var(--radius-md); padding: 24px; border: 1px solid; display: flex; align-items: center; gap: 16px; }
        .role-banner > span { flex-shrink: 0; }
        .role-banner h3 { font-size: 1rem; margin-bottom: 4px; }
        .role-banner .btn { flex-shrink: 0; margin-left: auto; }
        .profile-card { background: white; border-radius: var(--radius-lg); padding: 40px; border: 1px solid var(--border); }
        .profile-avatar-section { display: flex; align-items: center; gap: 20px; margin-bottom: 28px; }
        .profile-avatar-big { width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; font-weight: 700; color: white; flex-shrink: 0; }
        .profile-avatar-section h2 { font-size: 1.5rem; margin-bottom: 4px; }
        .form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 1024px) {
          .quick-actions-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .dashboard { grid-template-columns: 1fr; }
          .dashboard-sidebar { height: auto; position: static; border-right: none; border-bottom: 1px solid var(--border); }
          .sidebar-nav { flex-direction: row; flex-wrap: wrap; }
          .dashboard-main { padding: 24px 16px; }
          .quick-actions-grid { grid-template-columns: repeat(2, 1fr); }
          .form-row-2 { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
