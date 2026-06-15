import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { payForCareRequest, isUnpaid, isPaidRequest, isFreeRequest } from '../utils/razorpay';

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

const EMPTY_FORM = {
  beneficiaryName: '', beneficiaryAge: '', serviceType: '', description: '',
  'address.street': '', 'address.city': '', 'address.pincode': '',
  contactPhone: '', urgency: 'medium', frequency: 'one-time', preferredDate: '', budget: '',
};

const PaymentBadge = ({ req }) => {
  if (isUnpaid(req)) return <span className="badge badge-red payment-badge">⏳ Awaiting Payment</span>;
  if (isPaidRequest(req)) return <span className="badge badge-green payment-badge">✓ Paid</span>;
  if (isFreeRequest(req)) return <span className="badge badge-blue payment-badge">🤝 Volunteer</span>;
  return null;
};

const ElderCarePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [helpType, setHelpType] = useState('volunteer');
  const [submitting, setSubmitting] = useState(false);
  const [payingId, setPayingId] = useState(null);
  const [accepting, setAccepting] = useState(null);

  const budgetAmount = Number(form.budget) || 0;
  const needsPayment = helpType === 'paid' && budgetAmount > 0;

  const fetchRequests = async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    try {
      const params = filterType ? `?serviceType=${filterType}` : '';
      const res = await API.get(`/elder-care${params}`);
      setRequests(res.data.requests);
    } catch {
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, [user, filterType]);

  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setHelpType('volunteer');
  };

  const handlePay = async (req) => {
    setPayingId(req._id);
    try {
      await payForCareRequest({ elderCareId: req._id, user });
      toast.success('Payment successful! Volunteers can now see your request. 💚');
      fetchRequests();
    } catch (err) {
      if (!err.cancelled) {
        toast.error(err.response?.data?.message || err.message || 'Payment failed');
      } else {
        toast('Payment cancelled — you can pay anytime from your request card.', { icon: '💳' });
      }
    } finally {
      setPayingId(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    if (!form.serviceType) {
      toast.error('Please select a service type');
      return;
    }

    setSubmitting(true);
    try {
      const data = {
        ...form,
        serviceType: form.serviceType,
        address: { street: form['address.street'], city: form['address.city'], pincode: form['address.pincode'] },
        beneficiaryAge: Number(form.beneficiaryAge),
        budget: helpType === 'paid' ? budgetAmount : 0,
      };

      const res = await API.post('/elder-care', data);
      const created = res.data.request;

      if (res.data.requiresPayment) {
        toast('Request saved! Complete payment to publish it for volunteers.', { icon: '💳', duration: 4000 });
        setShowForm(false);
        resetForm();
        await fetchRequests();

        setPayingId(created._id);
        try {
          await payForCareRequest({ elderCareId: created._id, user });
          toast.success('Payment successful! Volunteers can now see your request. 💚');
          fetchRequests();
        } catch (payErr) {
          if (!payErr.cancelled) {
            toast.error(payErr.response?.data?.message || payErr.message || 'Payment failed');
          } else {
            toast('You can complete payment from your request card below.', { icon: '👇', duration: 4000 });
          }
        } finally {
          setPayingId(null);
        }
      } else {
        toast.success('Care request submitted! Our volunteers will reach out soon. 💚');
        setShowForm(false);
        resetForm();
        fetchRequests();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      await API.put(`/elder-care/${id}/accept`);
      toast.success('Request accepted! Please reach out to the family. 🤝');
      setAccepting(null);
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to accept');
    }
  };

  const handleComplete = async (id) => {
    try {
      await API.put(`/elder-care/${id}/complete`);
      toast.success('Marked as completed! Thank you for your service. ⭐');
      fetchRequests();
    } catch {
      toast.error('Failed to update');
    }
  };

  const unpaidCount = requests.filter(r => isUnpaid(r) && r.requestedBy?._id === user?.id).length;
  const isOwner = (req) => req.requestedBy?._id === user?.id || req.requestedBy === user?.id;

  return (
    <div className="elder-page">
      <div className="page-header elder-header">
        <div className="container">
          <h1>Elder Care Services</h1>
          <p>Compassionate support for our most valued community members. Request help or volunteer your time.</p>
          <div className="header-actions-row">
            {user ? (
              <button className="btn btn-accent btn-lg" onClick={() => { resetForm(); setShowForm(true); }}>
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

      {user && unpaidCount > 0 && (
        <div className="payment-alert-bar">
          <div className="container payment-alert-inner">
            <span className="pa-icon">💳</span>
            <div>
              <strong>{unpaidCount} request{unpaidCount > 1 ? 's' : ''} awaiting payment</strong>
              <p>Complete payment to make your care requests visible to volunteers.</p>
            </div>
          </div>
        </div>
      )}

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

      {showForm && (
        <div className="modal-overlay" onClick={() => !submitting && setShowForm(false)}>
          <div className="modal-box modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Request Elder Care ❤️</h2>
              <button onClick={() => !submitting && setShowForm(false)} className="modal-close" disabled={submitting}>✕</button>
            </div>

            <p className="form-intro">Tell us about the elder who needs help. Free requests go live instantly; paid requests require a one-time payment before volunteers can see them.</p>

            <form onSubmit={handleSubmit}>
              <div className="form-section">
                <h4 className="fs-title">Select Service Type</h4>
                <div className="service-type-grid">
                  {SERVICE_TYPES.map(s => (
                    <button type="button" key={s.id}
                      className={`st-card ${form.serviceType === s.id ? 'selected' : ''}`}
                      style={form.serviceType === s.id ? { background: s.color, borderColor: s.text } : {}}
                      onClick={() => setForm({ ...form, serviceType: s.id })}>
                      <span className="stc-icon">{s.icon}</span>
                      <span className="stc-label">{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="help-type-toggle">
                <button type="button"
                  className={`htt-option ${helpType === 'volunteer' ? 'active' : ''}`}
                  onClick={() => { setHelpType('volunteer'); setForm({ ...form, budget: '' }); }}>
                  <span className="htt-icon">🤝</span>
                  <div>
                    <strong>Volunteer Help</strong>
                    <small>Free community support</small>
                  </div>
                </button>
                <button type="button"
                  className={`htt-option ${helpType === 'paid' ? 'active' : ''}`}
                  onClick={() => setHelpType('paid')}>
                  <span className="htt-icon">💳</span>
                  <div>
                    <strong>Paid Help</strong>
                    <small>Contribute for professional care</small>
                  </div>
                </button>
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
                {helpType === 'paid' && (
                  <div className="form-group">
                    <label className="form-label">Amount (₹) *</label>
                    <input className="form-input" type="number" name="budget" required min={1} value={form.budget} onChange={handleFormChange} placeholder="e.g. 500" />
                  </div>
                )}
              </div>

              {needsPayment && (
                <div className="payment-info-banner">
                  <span>🔒</span>
                  <div>
                    <strong>One-time payment of ₹{budgetAmount}</strong>
                    <p>You'll be redirected to Razorpay after submitting. Your request stays private until payment is complete.</p>
                  </div>
                </div>
              )}

              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)} disabled={submitting}>Cancel</button>
                <button type="submit" className="btn btn-accent" disabled={submitting || !form.serviceType}>
                  {submitting
                    ? (needsPayment ? 'Saving & opening payment...' : 'Submitting...')
                    : needsPayment
                      ? `💳 Submit & Pay ₹${budgetAmount}`
                      : '❤️ Submit Care Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

      <div className="container requests-section">
        {!user ? (
          <div className="guest-banner animate-in">
            <div className="gb-content">
              <span>🔒</span>
              <div>
                <h3>Sign in to view care requests</h3>
                <p>Join ServeHub to browse elder care needs in your community or submit a care request for your loved ones.</p>
              </div>
            </div>
            <button className="btn btn-primary" onClick={() => navigate('/login')}>Sign In</button>
          </div>
        ) : (
          <>
            <div className="requests-header">
              <div>
                <h2>{user.role === 'volunteer' ? 'Open Care Requests' : 'Your Care Requests'}</h2>
                <p className="text-muted">
                  {user.role === 'volunteer'
                    ? 'Paid requests appear only after payment is confirmed.'
                    : 'Track status and complete any pending payments below.'}
                </p>
              </div>
              {!loading && requests.length > 0 && (
                <span className="req-count">{requests.length} request{requests.length !== 1 ? 's' : ''}</span>
              )}
            </div>

            {loading ? (
              <div className="loading-grid">
                {[1, 2, 3].map(i => <div key={i} className="skeleton-card" />)}
              </div>
            ) : requests.length === 0 ? (
              <div className="empty-state animate-in">
                <div className="icon">❤️</div>
                <h3>No requests found</h3>
                <p>{user.role === 'volunteer' ? 'No open requests in your area yet. Check back soon!' : 'You have no care requests yet. Start by requesting help for an elder.'}</p>
                {user.role !== 'volunteer' && (
                  <button className="btn btn-accent mt-16" onClick={() => { resetForm(); setShowForm(true); }}>
                    ❤️ Request Care
                  </button>
                )}
              </div>
            ) : (
              <div className="requests-grid">
                {requests.map(req => {
                  const stype = SERVICE_TYPES.find(s => s.id === req.serviceType);
                  const unpaid = isUnpaid(req);
                  const owner = isOwner(req);

                  return (
                    <div key={req._id}
                      className={`request-card animate-in ${unpaid ? 'unpaid-card' : ''}`}
                      style={{ '--rc-bg': stype?.color || '#F9FAFB' }}>

                      {unpaid && owner && (
                        <div className="unpaid-banner">
                          <span>💳</span> Payment required — not visible to volunteers yet
                        </div>
                      )}

                      <div className="rc-top">
                        <div className="rc-icon-wrap" style={{ background: stype?.color }}>
                          <span>{stype?.icon || '❤️'}</span>
                        </div>
                        <div className="rc-badges">
                          <PaymentBadge req={req} />
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
                        {owner && unpaid && (
                          <button className="btn btn-accent btn-sm" onClick={() => handlePay(req)} disabled={payingId === req._id}>
                            {payingId === req._id ? 'Processing...' : `💳 Pay ₹${req.budget}`}
                          </button>
                        )}
                        {user.role === 'volunteer' && req.status === 'pending' && !unpaid && (
                          <button className="btn btn-accent btn-sm" onClick={() => setAccepting(req._id)}>
                            🤝 Accept
                          </button>
                        )}
                        {(req.status === 'accepted' || req.status === 'in-progress') &&
                          (req.assignedVolunteer?._id === user.id || owner || user.role === 'admin') && (
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
          </>
        )}
      </div>

      <style>{`
        .elder-page { padding-top: 80px; }
        .elder-header { background: linear-gradient(135deg, #1B4332, #40916C, #F4A261) !important; }
        .header-actions-row { display: flex; gap: 16px; margin-top: 28px; flex-wrap: wrap; }
        .payment-alert-bar { background: linear-gradient(90deg, #FEF3C7, #FDDCB5); border-bottom: 1px solid #F4A261; padding: 14px 0; }
        .payment-alert-inner { display: flex; align-items: center; gap: 14px; }
        .pa-icon { font-size: 1.5rem; }
        .payment-alert-inner strong { display: block; color: #92400E; font-size: 0.9rem; }
        .payment-alert-inner p { color: #B45309; font-size: 0.8rem; margin: 0; }
        .service-types-bar { background: white; border-bottom: 1px solid var(--border); padding: 16px 0; position: sticky; top: 80px; z-index: 100; }
        .st-scroll { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none; }
        .st-scroll::-webkit-scrollbar { display: none; }
        .st-pill { display: flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 100px; border: 1.5px solid var(--border); background: white; font-size: 0.8rem; font-weight: 500; cursor: pointer; white-space: nowrap; transition: all 0.2s; }
        .st-pill:hover { border-color: var(--primary); }
        .st-pill.active { background: var(--primary); color: white; border-color: var(--primary); }
        .requests-section { padding-top: 48px; padding-bottom: 80px; }
        .requests-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 28px; gap: 16px; }
        .requests-header h2 { font-size: 1.6rem; margin-bottom: 4px; }
        .req-count { background: rgba(45,106,79,0.1); color: var(--primary); padding: 6px 16px; border-radius: 100px; font-size: 0.85rem; font-weight: 600; white-space: nowrap; }
        .guest-banner { background: var(--warm-card); border: 2px dashed var(--border); border-radius: var(--radius-lg); padding: 40px; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
        .gb-content { display: flex; align-items: flex-start; gap: 20px; }
        .gb-content span { font-size: 2.5rem; }
        .gb-content h3 { margin-bottom: 6px; }
        .gb-content p { color: var(--text-muted); font-size: 0.9rem; }
        .loading-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .skeleton-card { height: 280px; border-radius: var(--radius-lg); background: linear-gradient(90deg, var(--surface) 25%, var(--warm-card) 50%, var(--surface) 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; border: 1px solid var(--border); }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        .requests-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .request-card { background: var(--rc-bg, white); border-radius: var(--radius-lg); padding: 24px; border: 1px solid var(--border); transition: var(--transition); }
        .request-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
        .request-card.unpaid-card { border: 2px dashed #F4A261; background: #FFFBF5; }
        .unpaid-banner { background: #FEF3C7; color: #92400E; font-size: 0.78rem; font-weight: 600; padding: 8px 12px; border-radius: 8px; margin-bottom: 14px; display: flex; align-items: center; gap: 8px; }
        .rc-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; gap: 12px; }
        .rc-icon-wrap { width: 52px; height: 52px; border-radius: 14px; background: white; display: flex; align-items: center; justify-content: center; font-size: 1.6rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1); flex-shrink: 0; }
        .rc-badges { display: flex; gap: 6px; flex-wrap: wrap; justify-content: flex-end; }
        .payment-badge { font-size: 0.68rem !important; }
        .rc-title { font-size: 1.15rem; margin-bottom: 4px; }
        .rc-beneficiary { font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 10px; }
        .rc-desc { font-size: 0.875rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 14px; }
        .rc-meta { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 14px; }
        .rc-meta span { font-size: 0.78rem; color: var(--text-secondary); }
        .rc-volunteer { background: rgba(45,106,79,0.08); border-radius: 8px; padding: 8px 12px; display: flex; gap: 12px; margin-bottom: 14px; font-size: 0.8rem; color: var(--primary-dark); font-weight: 500; }
        .rc-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .budget-tag { font-size: 0.875rem; font-weight: 600; color: var(--primary); background: rgba(45,106,79,0.1); padding: 4px 12px; border-radius: 100px; margin-left: auto; }
        .help-type-toggle { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
        .htt-option { display: flex; align-items: center; gap: 12px; padding: 16px; border-radius: 12px; border: 2px solid var(--border); background: white; cursor: pointer; transition: all 0.2s; text-align: left; }
        .htt-option:hover { border-color: var(--primary-light); }
        .htt-option.active { border-color: var(--primary); background: rgba(45,106,79,0.06); }
        .htt-icon { font-size: 1.6rem; }
        .htt-option strong { display: block; font-size: 0.9rem; color: var(--primary-dark); }
        .htt-option small { color: var(--text-muted); font-size: 0.78rem; }
        .payment-info-banner { display: flex; gap: 12px; align-items: flex-start; background: rgba(45,106,79,0.08); border: 1px solid rgba(45,106,79,0.2); border-radius: 12px; padding: 14px 16px; margin-bottom: 8px; }
        .payment-info-banner span { font-size: 1.2rem; }
        .payment-info-banner strong { display: block; font-size: 0.9rem; color: var(--primary-dark); margin-bottom: 2px; }
        .payment-info-banner p { font-size: 0.8rem; color: var(--text-muted); margin: 0; }
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
        @media (max-width: 1024px) { .requests-grid, .loading-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 768px) {
          .requests-grid, .loading-grid { grid-template-columns: 1fr; }
          .service-type-grid { grid-template-columns: repeat(3, 1fr); }
          .header-actions-row { flex-direction: column; }
          .form-row-2, .form-row-3 { grid-template-columns: 1fr; }
          .guest-banner { flex-direction: column; }
          .help-type-toggle { grid-template-columns: 1fr; }
          .requests-header { flex-direction: column; }
        }
      `}</style>
    </div>
  );
};

export default ElderCarePage;
