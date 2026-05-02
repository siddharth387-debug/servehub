import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { API } from "../context/AuthContext";

import toast from 'react-hot-toast';

const CATEGORIES = ['All', 'technology', 'healthcare', 'education', 'finance', 'marketing', 'design', 'other'];
const JOB_TYPES = ['All', 'full-time', 'part-time', 'contract', 'internship', 'remote'];

const typeColor = { 'full-time': 'badge-green', 'part-time': 'badge-blue', 'contract': 'badge-orange', 'internship': 'badge-purple', 'remote': 'badge-gray' };
const expColor = { 'entry': 'badge-green', 'mid': 'badge-blue', 'senior': 'badge-orange', 'executive': 'badge-red' };

const CareersPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: '', jobType: '', search: '', page: 1 });
  const [showPostForm, setShowPostForm] = useState(false);
  const [total, setTotal] = useState(0);
  const [applying, setApplying] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [postForm, setPostForm] = useState({ title: '', company: '', description: '', location: '', jobType: 'full-time', category: 'technology', experienceLevel: 'entry', 'salary.min': '', 'salary.max': '', skills: '' });
  const [posting, setPosting] = useState(false);

  const fetchCareers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category && filters.category !== 'All') params.append('category', filters.category);
      if (filters.jobType && filters.jobType !== 'All') params.append('jobType', filters.jobType);
      if (filters.search) params.append('search', filters.search);
      params.append('page', filters.page);
      const res = await API.get(`/careers?${params}`);
      setCareers(res.data.careers);
      setTotal(res.data.total);
    } catch (e) {
      toast.error('Failed to load jobs');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchCareers(); }, [filters.category, filters.jobType, filters.page]);

  const handleSearch = (e) => { e.preventDefault(); fetchCareers(); };

  const handleApply = async (careerId) => {
    if (!user) { navigate('/login'); return; }
    try {
      await API.post(`/careers/${careerId}/apply`, { coverLetter });
      toast.success('Application submitted! 🎉');
      setApplying(null); setCoverLetter('');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Application failed');
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    setPosting(true);
    try {
      const data = {
        ...postForm,
        salary: { min: Number(postForm['salary.min']), max: Number(postForm['salary.max']), currency: 'INR' },
        skills: postForm.skills.split(',').map(s => s.trim()).filter(Boolean)
      };
      await API.post('/careers', data);
      toast.success('Job posted successfully! 🎉');
      setShowPostForm(false); fetchCareers();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to post job');
    } finally { setPosting(false); }
  };

  return (
    <div className="careers-page">
      <div className="page-header">
        <div className="container">
          <h1>Career Opportunities</h1>
          <p>Discover your next big opportunity from thousands of genuine job listings across India.</p>
          <div className="header-stats">
            <span>💼 {total} Active Jobs</span>
            <span>🏢 500+ Companies</span>
            <span>🌍 Pan India</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 48, paddingBottom: 80 }}>
        {/* CONTROLS */}
        <div className="careers-controls">
          <form className="search-row" onSubmit={handleSearch}>
            <div className="search-input-wrap">
              <span className="si-icon">🔍</span>
              <input
                type="text" className="form-input with-icon"
                placeholder="Search job title, company, or keyword..."
                value={filters.search}
                onChange={e => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
            <button type="submit" className="btn btn-primary">Search</button>
            {(user?.role === 'provider' || user?.role === 'admin') && (
              <button type="button" className="btn btn-accent" onClick={() => setShowPostForm(true)}>
                + Post Job
              </button>
            )}
          </form>

          <div className="filter-pills">
            <div className="filter-group">
              <span className="filter-label">Category:</span>
              {CATEGORIES.map(c => (
                <button key={c} className={`pill ${filters.category === (c === 'All' ? '' : c) ? 'active' : ''}`}
                  onClick={() => setFilters({ ...filters, category: c === 'All' ? '' : c, page: 1 })}>
                  {c}
                </button>
              ))}
            </div>
            <div className="filter-group">
              <span className="filter-label">Type:</span>
              {JOB_TYPES.map(t => (
                <button key={t} className={`pill ${filters.jobType === (t === 'All' ? '' : t) ? 'active' : ''}`}
                  onClick={() => setFilters({ ...filters, jobType: t === 'All' ? '' : t, page: 1 })}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* POST JOB MODAL */}
        {showPostForm && (
          <div className="modal-overlay" onClick={() => setShowPostForm(false)}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Post a New Job</h2>
                <button onClick={() => setShowPostForm(false)} className="modal-close">✕</button>
              </div>
              <form onSubmit={handlePost} className="post-form">
                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">Job Title *</label>
                    <input className="form-input" placeholder="e.g. Software Engineer" required value={postForm.title} onChange={e => setPostForm({ ...postForm, title: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Company *</label>
                    <input className="form-input" placeholder="Company name" required value={postForm.company} onChange={e => setPostForm({ ...postForm, company: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea className="form-textarea" placeholder="Job description, responsibilities, requirements..." required value={postForm.description} onChange={e => setPostForm({ ...postForm, description: e.target.value })} />
                </div>
                <div className="form-row-3">
                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input className="form-input" placeholder="City or Remote" value={postForm.location} onChange={e => setPostForm({ ...postForm, location: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Job Type</label>
                    <select className="form-select" value={postForm.jobType} onChange={e => setPostForm({ ...postForm, jobType: e.target.value })}>
                      {['full-time','part-time','contract','internship','remote'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-select" value={postForm.category} onChange={e => setPostForm({ ...postForm, category: e.target.value })}>
                      {['technology','healthcare','education','finance','marketing','design','other'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">Min Salary (INR)</label>
                    <input className="form-input" type="number" placeholder="e.g. 300000" value={postForm['salary.min']} onChange={e => setPostForm({ ...postForm, 'salary.min': e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Max Salary (INR)</label>
                    <input className="form-input" type="number" placeholder="e.g. 600000" value={postForm['salary.max']} onChange={e => setPostForm({ ...postForm, 'salary.max': e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Required Skills (comma-separated)</label>
                  <input className="form-input" placeholder="React, Node.js, MongoDB..." value={postForm.skills} onChange={e => setPostForm({ ...postForm, skills: e.target.value })} />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-outline" onClick={() => setShowPostForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={posting}>
                    {posting ? 'Posting...' : '💼 Post Job'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* APPLY MODAL */}
        {applying && (
          <div className="modal-overlay" onClick={() => setApplying(null)}>
            <div className="modal-box modal-sm" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Apply for this Job</h2>
                <button onClick={() => setApplying(null)} className="modal-close">✕</button>
              </div>
              <div className="form-group">
                <label className="form-label">Cover Letter (optional)</label>
                <textarea className="form-textarea" placeholder="Tell the employer why you're a great fit..."
                  value={coverLetter} onChange={e => setCoverLetter(e.target.value)} style={{ minHeight: 140 }} />
              </div>
              <div className="modal-actions">
                <button className="btn btn-outline" onClick={() => setApplying(null)}>Cancel</button>
                <button className="btn btn-primary" onClick={() => handleApply(applying)}>Submit Application 🚀</button>
              </div>
            </div>
          </div>
        )}

        {/* JOBS LIST */}
        {loading ? (
          <div className="spinner"></div>
        ) : careers.length === 0 ? (
          <div className="empty-state">
            <div className="icon">💼</div>
            <h3>No jobs found</h3>
            <p>Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div className="jobs-list">
            {careers.map(job => (
              <div key={job._id} className="job-card">
                <div className="jc-left">
                  <div className="company-logo">{job.company[0]}</div>
                  <div className="jc-info">
                    <h3 className="job-title">{job.title}</h3>
                    <p className="company-name">🏢 {job.company}</p>
                    <div className="job-meta">
                      <span>📍 {job.location}</span>
                      <span>💰 {job.salary?.min ? `₹${(job.salary.min/100000).toFixed(1)}L - ₹${(job.salary.max/100000).toFixed(1)}L` : 'Salary not disclosed'}</span>
                      <span>👁️ {job.views} views</span>
                    </div>
                    {job.skills?.length > 0 && (
                      <div className="job-skills">
                        {job.skills.slice(0, 4).map((s, i) => (
                          <span key={i} className="skill-tag">{s}</span>
                        ))}
                        {job.skills.length > 4 && <span className="skill-tag">+{job.skills.length - 4}</span>}
                      </div>
                    )}
                  </div>
                </div>
                <div className="jc-right">
                  <div className="jc-badges">
                    <span className={`badge ${typeColor[job.jobType] || 'badge-gray'}`}>{job.jobType}</span>
                    <span className={`badge ${expColor[job.experienceLevel] || 'badge-gray'}`}>{job.experienceLevel}</span>
                  </div>
                  <p className="posted-time">
                    {job.applicants?.length || 0} applicant{job.applicants?.length !== 1 ? 's' : ''}
                  </p>
                  <div className="jc-actions">
                    <Link to={`/careers/${job._id}`} className="btn btn-outline btn-sm">View Details</Link>
                    {user && user.role !== 'admin' && (
                      <button className="btn btn-primary btn-sm" onClick={() => setApplying(job._id)}>
                        Apply Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .careers-page { padding-top: 80px; }
        .page-header .header-stats { display: flex; gap: 24px; margin-top: 20px; flex-wrap: wrap; }
        .page-header .header-stats span { background: rgba(255,255,255,0.15); padding: 6px 16px; border-radius: 100px; font-size: 0.875rem; }
        .careers-controls { margin-bottom: 32px; }
        .search-row { display: flex; gap: 12px; margin-bottom: 20px; }
        .search-input-wrap { position: relative; flex: 1; }
        .si-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-size: 1rem; z-index: 1; }
        .form-input.with-icon { padding-left: 44px; }
        .filter-pills { display: flex; flex-direction: column; gap: 12px; }
        .filter-group { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .filter-label { font-size: 0.8rem; font-weight: 600; color: var(--text-muted); min-width: 70px; }
        .pill {
          padding: 6px 16px; border-radius: 100px;
          border: 1.5px solid var(--border); background: white;
          font-size: 0.8rem; font-weight: 500; cursor: pointer;
          transition: all 0.2s; text-transform: capitalize;
        }
        .pill:hover { border-color: var(--primary); color: var(--primary); }
        .pill.active { background: var(--primary); color: white; border-color: var(--primary); }
        .jobs-list { display: flex; flex-direction: column; gap: 16px; }
        .job-card {
          display: flex; align-items: flex-start; justify-content: space-between;
          gap: 24px; background: white; border-radius: var(--radius-md);
          padding: 24px 28px; border: 1px solid var(--border);
          transition: var(--transition);
        }
        .job-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); border-color: var(--primary-light); }
        .jc-left { display: flex; gap: 16px; flex: 1; }
        .company-logo {
          width: 52px; height: 52px; border-radius: 14px;
          background: linear-gradient(135deg, var(--primary), var(--primary-light));
          color: white; font-weight: 700; font-size: 1.4rem;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; font-family: 'Playfair Display', serif;
        }
        .jc-info { flex: 1; }
        .job-title { font-size: 1.1rem; margin-bottom: 4px; color: var(--primary-dark); }
        .company-name { font-size: 0.875rem; color: var(--text-muted); margin-bottom: 8px; }
        .job-meta { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 10px; }
        .job-meta span { font-size: 0.8rem; color: var(--text-secondary); }
        .job-skills { display: flex; gap: 6px; flex-wrap: wrap; }
        .skill-tag { background: var(--surface); color: var(--text-secondary); padding: 3px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 500; }
        .jc-right { display: flex; flex-direction: column; align-items: flex-end; gap: 10px; flex-shrink: 0; }
        .jc-badges { display: flex; gap: 6px; }
        .posted-time { font-size: 0.8rem; color: var(--text-muted); }
        .jc-actions { display: flex; gap: 8px; }
        /* MODAL */
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 20px; backdrop-filter: blur(4px); }
        .modal-box { background: white; border-radius: var(--radius-xl); padding: 40px; width: 100%; max-width: 680px; max-height: 90vh; overflow-y: auto; }
        .modal-sm { max-width: 480px; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; }
        .modal-header h2 { font-size: 1.5rem; }
        .modal-close { background: var(--surface); border: none; width: 36px; height: 36px; border-radius: 50%; font-size: 1rem; cursor: pointer; transition: background 0.2s; }
        .modal-close:hover { background: var(--border); }
        .post-form { display: flex; flex-direction: column; gap: 4px; }
        .form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
        .modal-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; }
        @media (max-width: 768px) {
          .job-card { flex-direction: column; }
          .jc-right { align-items: flex-start; }
          .search-row { flex-wrap: wrap; }
          .form-row-2, .form-row-3 { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default CareersPage;
