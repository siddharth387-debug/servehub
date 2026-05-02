import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { API } from "../context/AuthContext";
import toast from 'react-hot-toast';

const SERVICE_TYPES = [
  { id: 'gardening', icon: '🌱', label: 'Gardening', color: '#D1FAE5', text: '#065F46' },
  { id: 'food-delivery', icon: '🍱', label: 'Food Delivery', color: '#FEF3C7', text: '#92400E' },
  { id: 'medical-assistance', icon: '🏥', label: 'Medical Help', color: '#DBEAFE', text: '#1E40AF' },
  { id: 'companionship', icon: '🤝', label: 'Companionship', color: '#EDE9FE', text: '#6D28D9' },
  { id: 'household-help', icon: '🏠', label: 'Household Help', color: '#FFF7ED', text: '#C2410C' },
  { id: 'transportation', icon: '🚗', label: 'Transportation', color: '#F0FDF4', text: '#166534' },
  { id: 'grocery', icon: '🛒', label: 'Grocery Help', color: '#FDF4FF', text: '#9333EA' },
  { id: 'medication-reminder', icon: '💊', label: 'Medication', color: '#FFF1F2', text: '#9F1239' },
  { id: 'other', icon: '✨', label: 'Other', color: '#F9FAFB', text: '#374151' },
];

const urgencyColor = { low: 'badge-green', medium: 'badge-blue', high: 'badge-orange', emergency: 'badge-red' };
const statusColor = { pending: 'badge-orange', accepted: 'badge-blue', 'in-progress': 'badge-purple', completed: 'badge-green', cancelled: 'badge-gray' };

const ElderCarePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [filterType, setFilterType] = useState('');
  const [form, setForm] = useState({ beneficiaryName: '', beneficiaryAge: '', serviceType: '', description: '', 'address.street': '', 'address.city': '', 'address.pincode': '', contactPhone: '', urgency: 'medium', frequency: 'one-time', preferredDate: '', budget: '' });
  const [submitting, setSubmitting] = useState(false);
  const [accepting, setAccepting] = useState(null);

  const fetchRequests = async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    try {
      const params = filterType ? `?serviceType=${filterType}` : '';
      const res = await API.get(`/elder-care${params}`);
      setRequests(res.data.requests);
    } catch (e) {
      toast.error('Failed to load requests');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchRequests(); }, [user, filterType]);

  const handleFormChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    setSubmitting(true);
    try {
      const data = {
        ...form,
        serviceType: form.serviceType || selectedType,
        address: { street: form['address.street'], city: form['address.city'], pincode: form['address.pincode'] },
        beneficiaryAge: Number(form.beneficiaryAge),
        budget: form.budget ? Number(form.budget) : undefined
      };
      await API.post('/elder-care', data);
      toast.success('Care request submitted! Our volunteers will reach out soon. 💚');
      setShowForm(false);
      fetchRequests();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to submit request');
    } finally { setSubmitting(false); }
  };

  const handleAccept = async (id) => {
    try {
      await API.put(`/elder-care/${id}/accept`);
      toast.success('Request accepted! Please reach out to the family. 🤝');
      setAccepting(null); fetchRequests();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to accept');
    }
  };

  const handleComplete = async (id) => {
    try {
      await API.put(`/elder-care/${id}/complete`);
      toast.success('Marked as completed! Thank you for your service. ⭐');
      fetchRequests();
    } catch (e) {
      toast.error('Failed to update');
    }
  };

  return (
    <div className="elder-page">
      <div className="page-header elder-header">
        <div className="container">
          <h1>Elder Care Services</h1>
          <p>Compassionate support for our most valued community members. Request help or volunteer your time.</p>
          <div className="header-actions-row">
            {user ? (
              <button className="btn btn-accent btn-lg" onClick={() => setShowForm(true)}>
                ❤️ Request Care for an Elder
              </button>
            ) : (
              <button className="btn btn-accent btn-lg" onClick={() => navigate('/register')}>
                Join to Request Care
              </button>
            )}
            {(!user || user?.role === 'user') && (
              <button className="btn btn-outline-white btn-lg" onClick={() => navigate('/register?role=volunteer')}>
                🤝 Become a Volunteer
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SERVICE TYPE ICONS */}
      <div className="service-types-bar">
        <div className="container">
          <div className="st-scroll">
            <button className={`st-pill ${filterType === '' ? 'active' : ''}`} onClick={() => setFilterType('')}>
              All Services
            </button>
            {SERVICE_TYPES.map(s => (
              <button key={s.id}
                className={`st-pill ${filterType === s.id ? 'active' : ''}`}
                style={filterType === s.id ? { background: s.color, color: s.text, borderColor: s.text } : {}}
                onClick={() => setFilterType(s.id)}>
                <span>{s.icon}</span> {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* REQUEST FORM MODAL */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-box modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Request Elder Care ❤️</h2>
              <button onClick={() => setShowForm(false)} className="modal-close">✕</button>
            </div>

            <p className="form-intro">Tell us about the elder who needs help. Our volunteers will be in touch within 24 hours.</p>

            <form onSubmit={handleSubmit}>
              <div className="form-section">
                <h4 className="fs-title">Select Service Type</h4>
                <div className="service-type-grid">
                  {SERVICE_TYPES.map(s => (
                    <button type="button" key={s.id}
                      className={`st-card ${(form.serviceType || selectedType) === s.id ? 'selected' : ''}`}
                      style={(form.serviceType || selectedType) === s.id ? { background: s.color, borderColor: s.text } : {}}
                      onClick={() => setForm({ ...form, serviceType: s.id })}>
                      <span className="stc-icon">{s.icon}</span>
                      <span className="stc-label">{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Elder's Name *</label>
                  <input className="form-input" name="beneficiaryName" required value={form.beneficiaryName} onChange={handleFormChange} placeholder="Name of the person needing help" />
                </div>
                <div className="form-group">
                  <label className="form-label">Age *</label>
                  <input className="form-input" type="number" name="beneficiaryAge" required value={form.beneficiaryAge} onChange={handleFormChange} placeholder="Age (e.g. 75)" min={60} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description of Need *</label>
                <textarea className="form-textarea" name="description" required value={form.description} onChange={handleFormChange} placeholder="Please describe what help is needed, any special considerations, medical conditions, etc." />
              </div>

              <div className="form-row-3">
                <div className="form-group">
                  <label className="form-label">Street / Area *</label>
                  <input className="form-input" name="address.street" required value={form['address.street']} onChange={handleFormChange} placeholder="Street address" />
                </div>
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input className="form-input" name="address.city" required value={form['address.city']} onChange={handleFormChange} placeholder="City" />
                </div>
                <div className="form-group">
                  <label className="form-label">Pincode</label>
                  <input className="form-input" name="address.pincode" value={form['address.pincode']} onChange={handleFormChange} placeholder="Pincode" />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Contact Phone *</label>
                  <input className="form-input" name="contactPhone" required value={form.contactPhone} onChange={handleFormChange} placeholder="Phone number" />
                </div>
                <div className="form-group">
                  <label className="form-label">Preferred Date</label>
                  <input className="form-input" type="date" name="preferredDate" value={form.preferredDate} onChange={handleFormChange} />
                </div>
              </div>

              <div className="form-row-3">
                <div className="form-group">
                  <label className="form-label">Urgency</label>
                  <select className="form-select" name="urgency" value={form.urgency} onChange={handleFormChange}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Frequency</label>
                  <select className="form-select" name="frequency" value={form.frequency} onChange={handleFormChange}>
                    <option value="one-time">One-time</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Budget (₹, optional)</label>
                  <input className="form-input" type="number" name="budget" value={form.budget} onChange={handleFormChange} placeholder="0 for volunteer help" />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-accent" disabled={submitting || !form.serviceType}>
                  {submitting ? 'Submitting...' : '❤️ Submit Care Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM ACCEPT MODAL */}
      {accepting && (
        <div className="modal-overlay" onClick={() => setAccepting(null)}>
          <div className="modal-box modal-sm" onClick={e => e.stopPropagation()}>
            <h2>Accept This Request?</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: 12, marginBottom: 24 }}>By accepting, you commit to reaching out to this family and helping the elder. Are you ready?</p>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setAccepting(null)}>Not Yet</button>
              <button className="btn btn-accent" onClick={() => handleAccept(accepting)}>🤝 Yes, I'll Help!</button>
            </div>
          </div>
        </div>
      )}

      {/* REQUESTS */}
      <div className="container" style={{ paddingTop: 48, paddingBottom: 80 }}>
        {!user ? (
          <div className="guest-banner">
            <div className="gb-content">
              <span>🔒</span>
              <div>
                <h3>Sign in to view care requests</h3>
                <p>Join ServeHub to browse elder care needs in your community or submit a care request for your loved ones.</p>
              </div>
            </div>
            <button className="btn btn-primary" onClick={() => navigate('/login')}>Sign In</button>
          </div>
        ) : loading ? (
          <div className="spinner"></div>
        ) : requests.length === 0 ? (
          <div className="empty-state">
            <div className="icon">❤️</div>
            <h3>No requests found</h3>
            <p>{user.role === 'volunteer' ? 'No open requests in your area yet. Check back soon!' : 'You have no care requests yet.'}</p>
          </div>
        ) : (
          <div className="requests-grid">
            {requests.map(req => {
              const stype = SERVICE_TYPES.find(s => s.id === req.serviceType);
              return (
                <div key={req._id} className="request-card" style={{ '--rc-bg': stype?.color || '#F9FAFB' }}>
                  <div className="rc-top">
                    <div className="rc-icon-wrap" style={{ background: stype?.color }}>
                      <span>{stype?.icon || '❤️'}</span>
                    </div>
                    <div className="rc-badges">
                      <span className={`badge ${urgencyColor[req.urgency]}`}>{req.urgency}</span>
                      <span className={`badge ${statusColor[req.status]}`}>{req.status}</span>
                    </div>
                  </div>

                  <h3 className="rc-title">{stype?.label || req.serviceType}</h3>
                  <p className="rc-beneficiary">For: <strong>{req.beneficiaryName}</strong>, Age {req.beneficiaryAge}</p>
                  <p className="rc-desc">{req.description.length > 120 ? req.description.slice(0, 120) + '...' : req.description}</p>

                  <div className="rc-meta">
                    <span>📍 {req.address?.city}</span>
                    <span>🔄 {req.frequency}</span>
                    {req.preferredDate && <span>📅 {new Date(req.preferredDate).toLocaleDateString()}</span>}
                  </div>

                  {req.assignedVolunteer && (
                    <div className="rc-volunteer">
                      <span>🙋 {req.assignedVolunteer.name}</span>
                      <span>{req.assignedVolunteer.phone}</span>
                    </div>
                  )}

                  <div className="rc-actions">
                    {user.role === 'volunteer' && req.status === 'pending' && (
                      <button className="btn btn-accent btn-sm" onClick={() => setAccepting(req._id)}>
                        🤝 Accept
                      </button>
                    )}
                    {(req.status === 'accepted' || req.status === 'in-progress') &&
                      (req.assignedVolunteer?._id === user.id || req.requestedBy?._id === user.id || user.role === 'admin') && (
                      <button className="btn btn-primary btn-sm" onClick={() => handleComplete(req._id)}>
                        ✅ Mark Complete
                      </button>
                    )}
                    {req.budget > 0 && (
                      <span className="budget-tag">₹{req.budget}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        .elder-page { padding-top: 80px; }
        .elder-header { background: linear-gradient(135deg, #1B4332, #40916C, #F4A261) !important; }
        .header-actions-row { display: flex; gap: 16px; margin-top: 28px; flex-wrap: wrap; }
        .service-types-bar { background: white; border-bottom: 1px solid var(--border); padding: 16px 0; position: sticky; top: 80px; z-index: 100; }
        .st-scroll { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none; }
        .st-scroll::-webkit-scrollbar { display: none; }
        .st-pill { display: flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 100px; border: 1.5px solid var(--border); background: white; font-size: 0.8rem; font-weight: 500; cursor: pointer; white-space: nowrap; transition: all 0.2s; }
        .st-pill:hover { border-color: var(--primary); }
        .st-pill.active { background: var(--primary); color: white; border-color: var(--primary); }
        .guest-banner { background: var(--warm-card); border: 2px dashed var(--border); border-radius: var(--radius-lg); padding: 40px; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
        .gb-content { display: flex; align-items: flex-start; gap: 20px; }
        .gb-content span { font-size: 2.5rem; }
        .gb-content h3 { margin-bottom: 6px; }
        .gb-content p { color: var(--text-muted); font-size: 0.9rem; }
        .requests-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .request-card { background: var(--rc-bg, white); border-radius: var(--radius-lg); padding: 24px; border: 1px solid var(--border); transition: var(--transition); }
        .request-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
        .rc-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .rc-icon-wrap { width: 52px; height: 52px; border-radius: 14px; background: white; display: flex; align-items: center; justify-content: center; font-size: 1.6rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .rc-badges { display: flex; gap: 6px; flex-wrap: wrap; }
        .rc-title { font-size: 1.15rem; margin-bottom: 4px; }
        .rc-beneficiary { font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 10px; }
        .rc-desc { font-size: 0.875rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 14px; }
        .rc-meta { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 14px; }
        .rc-meta span { font-size: 0.78rem; color: var(--text-secondary); }
        .rc-volunteer { background: rgba(45,106,79,0.08); border-radius: 8px; padding: 8px 12px; display: flex; gap: 12px; margin-bottom: 14px; font-size: 0.8rem; color: var(--primary-dark); font-weight: 500; }
        .rc-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .budget-tag { font-size: 0.875rem; font-weight: 600; color: var(--primary); background: rgba(45,106,79,0.1); padding: 4px 12px; border-radius: 100px; }
        /* Form specific */
        .form-intro { color: var(--text-muted); margin-bottom: 24px; font-size: 0.9rem; }
        .form-section { margin-bottom: 24px; }
        .fs-title { font-size: 0.9rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.04em; }
        .service-type-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }
        .st-card { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 12px 8px; border-radius: 12px; border: 2px solid var(--border); background: white; cursor: pointer; transition: all 0.2s; }
        .st-card:hover { border-color: var(--primary-light); }
        .st-card.selected { border-color: var(--primary); }
        .stc-icon { font-size: 1.5rem; }
        .stc-label { font-size: 0.7rem; font-weight: 600; text-align: center; color: var(--text-secondary); }
        .form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 20px; backdrop-filter: blur(4px); }
        .modal-box { background: white; border-radius: var(--radius-xl); padding: 40px; width: 100%; max-width: 700px; max-height: 90vh; overflow-y: auto; }
        .modal-lg { max-width: 760px; }
        .modal-sm { max-width: 440px; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .modal-header h2 { font-size: 1.5rem; }
        .modal-close { background: var(--surface); border: none; width: 36px; height: 36px; border-radius: 50%; font-size: 1rem; cursor: pointer; }
        .modal-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 28px; }
        @media (max-width: 1024px) { .requests-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 768px) {
          .requests-grid { grid-template-columns: 1fr; }
          .service-type-grid { grid-template-columns: repeat(3, 1fr); }
          .header-actions-row { flex-direction: column; }
          .form-row-2, .form-row-3 { grid-template-columns: 1fr; }
          .guest-banner { flex-direction: column; }
        }
      `}</style>
    </div>
  );
};

export default ElderCarePage;
