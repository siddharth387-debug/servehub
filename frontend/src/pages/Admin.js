import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";

import toast from 'react-hot-toast';

const AdminPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [elderCare, setElderCare] = useState([]);
  const [loading, setLoading] = useState(false);
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (user.role !== 'admin') { navigate('/dashboard'); return; }
    loadStats();
  }, [user]);

  const loadStats = async () => {
    try {
      const res = await API.get('/admin/stats');
      setStats(res.data.stats);
    } catch (e) { toast.error('Failed to load stats'); }
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const q = roleFilter ? `?role=${roleFilter}` : '';
      const res = await API.get(`/admin/users${q}`);
      setUsers(res.data.users);
    } catch (e) { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  const loadElderCare = async () => {
    setLoading(true);
    try {
      const res = await API.get('/admin/elder-care');
      setElderCare(res.data.requests);
    } catch (e) { toast.error('Failed to load elder care'); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (tab === 'users') loadUsers(); }, [tab, roleFilter]);
  useEffect(() => { if (tab === 'elder-care') loadElderCare(); }, [tab]);

  const handleToggleUser = async (id, isActive) => {
    try {
      await API.put(`/admin/users/${id}`, { isActive: !isActive });
      toast.success(isActive ? 'User deactivated' : 'User activated');
      loadUsers();
    } catch (e) { toast.error('Failed to update user'); }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await API.delete(`/admin/users/${id}`);
      toast.success('User removed');
      loadUsers();
    } catch (e) { toast.error('Failed to delete'); }
  };

  const roleColors = { admin: '#7C3AED', volunteer: '#F4A261', provider: '#457B9D', user: '#2D6A4F' };
  const statusColor = { pending: '#FEF3C7', accepted: '#DBEAFE', completed: '#D1FAE5', cancelled: '#F3F4F6' };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="admin-page">
      <div className="admin-sidebar">
        <div className="admin-logo">
          <span>⚙️</span>
          <h2>Admin Panel</h2>
        </div>
        <nav>
          {[
            { id: 'stats', icon: '📊', label: 'Dashboard' },
            { id: 'users', icon: '👥', label: 'Manage Users' },
            { id: 'elder-care', icon: '❤️', label: 'Elder Care' },
            { id: 'careers', icon: '💼', label: 'Job Listings' },
          ].map(t => (
            <button key={t.id} className={`anav-item ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id)}>
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="admin-main">
        {/* STATS */}
        {tab === 'stats' && (
          <div className="animate-in">
            <h1>Platform Overview</h1>
            <p className="text-muted mb-24">Real-time ServeHub platform statistics</p>
            {stats && (
              <div className="admin-stats-grid">
                {[
                  { label: 'Total Users', value: stats.users, icon: '👥', color: '#2D6A4F', bg: '#D1FAE5' },
                  { label: 'Active Jobs', value: stats.careers, icon: '💼', color: '#457B9D', bg: '#DBEAFE' },
                  { label: 'Volunteers', value: stats.volunteers, icon: '🤝', color: '#D97706', bg: '#FEF3C7' },
                  { label: 'Care Requests', value: stats.elderCareRequests, icon: '❤️', color: '#E63946', bg: '#FEE2E2' },
                  { label: 'Services Completed', value: stats.completedServices, icon: '✅', color: '#16A34A', bg: '#DCFCE7' },
                ].map((s, i) => (
                  <div key={i} className="admin-stat">
                    <div className="as-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
                    <div className="as-value" style={{ color: s.color }}>{s.value?.toLocaleString()}</div>
                    <div className="as-label">{s.label}</div>
                  </div>
                ))}
              </div>
            )}
            <div className="admin-info-cards">
              <div className="aic">
                <h3>🚀 Quick Actions</h3>
                <div className="aic-actions">
                  <button className="btn btn-outline btn-sm" onClick={() => setTab('users')}>Manage Users</button>
                  <button className="btn btn-outline btn-sm" onClick={() => setTab('elder-care')}>View Care Requests</button>
                </div>
              </div>
              <div className="aic">
                <h3>📋 Platform Health</h3>
                <div className="health-items">
                  <div className="hi"><span className="hi-dot green"></span> API Connected</div>
                  <div className="hi"><span className="hi-dot green"></span> MongoDB Active</div>
                  <div className="hi"><span className="hi-dot green"></span> All Systems Normal</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* USERS */}
        {tab === 'users' && (
          <div className="animate-in">
            <div className="admin-section-header">
              <h1>User Management</h1>
              <div className="filter-row">
                {['', 'user', 'volunteer', 'provider', 'admin'].map(r => (
                  <button key={r} className={`pill ${roleFilter === r ? 'active' : ''}`}
                    onClick={() => setRoleFilter(r)}>
                    {r || 'All'}
                  </button>
                ))}
              </div>
            </div>
            {loading ? <div className="spinner"></div> : (
              <div className="users-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Role</th>
                      <th>Phone</th>
                      <th>Joined</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id}>
                        <td>
                          <div className="user-cell">
                            <div className="uc-avatar" style={{ background: roleColors[u.role] || '#2D6A4F' }}>
                              {u.name?.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="uc-name">{u.name}</p>
                              <p className="uc-email">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge" style={{ background: roleColors[u.role] + '22', color: roleColors[u.role] }}>
                            {u.role}
                          </span>
                        </td>
                        <td className="text-muted">{u.phone || '—'}</td>
                        <td className="text-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td>
                          <span className={`badge ${u.isActive ? 'badge-green' : 'badge-red'}`}>
                            {u.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button className="action-btn" onClick={() => handleToggleUser(u._id, u.isActive)}
                              title={u.isActive ? 'Deactivate' : 'Activate'}>
                              {u.isActive ? '🚫' : '✅'}
                            </button>
                            {u.role !== 'admin' && (
                              <button className="action-btn danger" onClick={() => handleDeleteUser(u._id)} title="Delete">
                                🗑️
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.length === 0 && (
                  <div className="empty-state">
                    <div className="icon">👥</div>
                    <h3>No users found</h3>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ELDER CARE */}
        {tab === 'elder-care' && (
          <div className="animate-in">
            <h1>Elder Care Requests</h1>
            <p className="text-muted mb-24">All care requests on the platform</p>
            {loading ? <div className="spinner"></div> : (
              <div className="ec-list">
                {elderCare.map(req => (
                  <div key={req._id} className="ec-row">
                    <div className="ec-info">
                      <h4>{req.serviceType?.replace('-', ' ').toUpperCase()}</h4>
                      <p><strong>{req.beneficiaryName}</strong>, {req.beneficiaryAge} yrs</p>
                      <p className="text-muted">📍 {req.address?.city} · Requested by: {req.requestedBy?.name}</p>
                    </div>
                    <div className="ec-meta">
                      <span className="badge" style={{ background: statusColor[req.status], color: '#1A1A1A' }}>{req.status}</span>
                      <span className="badge badge-orange">{req.urgency}</span>
                      <p className="text-muted" style={{ fontSize: '0.8rem' }}>{new Date(req.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
                {elderCare.length === 0 && (
                  <div className="empty-state"><div className="icon">❤️</div><h3>No elder care requests yet</h3></div>
                )}
              </div>
            )}
          </div>
        )}

        {tab === 'careers' && (
          <div className="animate-in">
            <h1>Job Listings</h1>
            <p className="text-muted">Manage all job listings on the platform.</p>
            <div className="empty-state mt-24">
              <div className="icon">💼</div>
              <h3>Career Management</h3>
              <p>Full career management coming soon. Use the Careers page for now.</p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .admin-page { display: grid; grid-template-columns: 260px 1fr; min-height: 100vh; padding-top: 80px; }
        .admin-sidebar { background: var(--primary-dark); padding: 32px 20px; position: sticky; top: 80px; height: calc(100vh - 80px); overflow-y: auto; }
        .admin-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 40px; }
        .admin-logo span { font-size: 1.5rem; }
        .admin-logo h2 { color: white; font-size: 1.1rem; }
        .anav-item { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 8px; font-size: 0.875rem; font-weight: 500; color: rgba(255,255,255,0.65); background: none; border: none; cursor: pointer; width: 100%; text-align: left; transition: all 0.2s; margin-bottom: 4px; }
        .anav-item:hover { background: rgba(255,255,255,0.1); color: white; }
        .anav-item.active { background: rgba(255,255,255,0.15); color: white; }
        .admin-main { padding: 40px 48px; background: var(--warm-bg); }
        .admin-main h1 { font-size: 2rem; margin-bottom: 8px; }
        .admin-stats-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 20px; margin-bottom: 40px; }
        .admin-stat { background: white; border-radius: var(--radius-md); padding: 24px 20px; text-align: center; border: 1px solid var(--border); }
        .as-icon { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin: 0 auto 12px; }
        .as-value { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 700; margin-bottom: 4px; }
        .as-label { font-size: 0.8rem; color: var(--text-muted); }
        .admin-info-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .aic { background: white; border-radius: var(--radius-md); padding: 24px; border: 1px solid var(--border); }
        .aic h3 { margin-bottom: 16px; font-size: 1rem; }
        .aic-actions { display: flex; gap: 10px; flex-wrap: wrap; }
        .health-items { display: flex; flex-direction: column; gap: 8px; }
        .hi { display: flex; align-items: center; gap: 8px; font-size: 0.875rem; color: var(--text-secondary); }
        .hi-dot { width: 8px; height: 8px; border-radius: 50%; }
        .hi-dot.green { background: #16A34A; box-shadow: 0 0 0 3px rgba(22,163,74,0.2); }
        .admin-section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; flex-wrap: wrap; gap: 16px; }
        .filter-row { display: flex; gap: 6px; flex-wrap: wrap; }
        .pill { padding: 6px 14px; border-radius: 100px; border: 1.5px solid var(--border); background: white; font-size: 0.8rem; cursor: pointer; transition: all 0.2s; text-transform: capitalize; }
        .pill.active { background: var(--primary); color: white; border-color: var(--primary); }
        .users-table-wrap { background: white; border-radius: var(--radius-lg); border: 1px solid var(--border); overflow: hidden; }
        .admin-table { width: 100%; border-collapse: collapse; }
        .admin-table th { text-align: left; padding: 14px 20px; font-size: 0.78rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em; background: var(--warm-bg); border-bottom: 1px solid var(--border); }
        .admin-table td { padding: 14px 20px; border-bottom: 1px solid var(--border); vertical-align: middle; }
        .admin-table tr:last-child td { border-bottom: none; }
        .admin-table tr:hover td { background: var(--warm-bg); }
        .user-cell { display: flex; align-items: center; gap: 10px; }
        .uc-avatar { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700; color: white; flex-shrink: 0; }
        .uc-name { font-weight: 600; font-size: 0.875rem; }
        .uc-email { font-size: 0.78rem; color: var(--text-muted); }
        .table-actions { display: flex; gap: 6px; }
        .action-btn { width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--border); background: white; cursor: pointer; font-size: 1rem; transition: all 0.15s; }
        .action-btn:hover { background: var(--warm-bg); }
        .action-btn.danger:hover { background: #FEE2E2; border-color: #FECACA; }
        .ec-list { display: flex; flex-direction: column; gap: 12px; }
        .ec-row { background: white; border-radius: var(--radius-md); padding: 20px 24px; display: flex; justify-content: space-between; align-items: center; gap: 24px; border: 1px solid var(--border); }
        .ec-info h4 { font-size: 0.875rem; font-weight: 700; margin-bottom: 4px; letter-spacing: 0.04em; color: var(--primary-dark); }
        .ec-info p { font-size: 0.875rem; margin-bottom: 2px; }
        .ec-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; }
        @media (max-width: 1200px) { .admin-stats-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px) {
          .admin-page { grid-template-columns: 1fr; }
          .admin-sidebar { height: auto; position: static; }
          .admin-main { padding: 24px 16px; }
          .admin-stats-grid { grid-template-columns: repeat(2, 1fr); }
          .admin-info-cards { grid-template-columns: 1fr; }
          .ec-row { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </div>
  );
};

export default AdminPage;
