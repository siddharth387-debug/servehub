import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth, API } from '../context/AuthContext';
import toast from 'react-hot-toast';

const TYPE_COLOR = { 'full-time': 'badge-green', 'part-time': 'badge-blue', 'contract': 'badge-orange', 'internship': 'badge-purple', 'remote': 'badge-gray' };
const TYPE_LABEL = { 'full-time': 'Full-Time', 'part-time': 'Part-Time', 'contract': 'Contract', 'internship': 'Internship', 'remote': 'Remote' };
const EXP_COLOR = { entry: 'badge-green', mid: 'badge-blue', senior: 'badge-orange', executive: 'badge-red' };
const CAT_ICON = { technology: '💻', healthcare: '🏥', education: '📚', finance: '💰', marketing: '📣', design: '🎨', other: '⚡' };

const fmtSalary = (min, max) => {
  if (!min && !max) return 'Salary not disclosed';
  const fmt = v => v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : `₹${(v).toLocaleString()}`;
  if (min && max) return `${fmt(min)} – ${fmt(max)} / yr`;
  if (min) return `From ${fmt(min)} / yr`;
  return `Up to ${fmt(max)} / yr`;
};

const logoColor = name => `hsl(${(name?.charCodeAt(0) || 65) * 7 % 360}, 45%, 35%)`;

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch job details
  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await API.get(`/careers/${id}`);
        setJob(res.data.career);
      } catch (e) {
        setError(e.response?.data?.message || 'Failed to load job details');
        toast.error('Job not found');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  // Apply to job
  const handleApply = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setSubmitting(true);
    try {
      await API.post(`/careers/${id}/apply`, { coverLetter });
      toast.success('🎉 Application submitted successfully!');
      setShowApplyModal(false);
      setCoverLetter('');
      // Refresh job data to update applicants
      const res = await API.get(`/careers/${id}`);
      setJob(res.data.career);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete job
  const handleDelete = async () => {
    if (!window.confirm('Remove this job listing? This cannot be undone.')) return;
    try {
      await API.delete(`/careers/${id}`);
      toast.success('Job listing removed');
      navigate('/careers');
    } catch (e) {
      toast.error('Failed to remove job listing');
    }
  };

  const isOwner = job && user && (user.id === job.postedBy?._id || user.id === job.postedBy || user.role === 'admin');
  const hasApplied = job && user && (job.applicants || []).some(a => (a.user?._id || a.user) === user.id);

  if (loading) {
    return (
      <div className="job-detail-page">
        <div className="container">
          <div className="loading-state">
            <div className="spinner" />
            <p>Loading job details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="job-detail-page">
        <div className="container">
          <div className="error-state">
            <div className="es-icon">😕</div>
            <h2>Job Not Found</h2>
            <p>This job listing may have been removed or doesn't exist.</p>
            <Link to="/careers" className="btn btn-primary">← Back to All Jobs</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="job-detail-page">
      <div className="container">
        
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/careers">← Back to All Jobs</Link>
        </div>

        {/* Job Header */}
        <div className="job-header">
          <div className="jh-left">
            <div className="company-logo-large" style={{ background: logoColor(job.company) }}>
              {job.company[0].toUpperCase()}
            </div>
            <div className="jh-info">
              <h1 className="job-title">{job.title}</h1>
              <p className="company-name">{job.company}</p>
              <div className="job-meta">
                <span>📍 {job.location}</span>
                <span>💰 {fmtSalary(job.salary?.min, job.salary?.max)}</span>
                <span>{CAT_ICON[job.category]} {job.category.charAt(0).toUpperCase() + job.category.slice(1)}</span>
                <span>👁️ {job.views} views</span>
                <span>👤 {job.applicants?.length || 0} applicants</span>
              </div>
              <div className="job-badges">
                <span className={`badge ${TYPE_COLOR[job.jobType]}`}>{TYPE_LABEL[job.jobType]}</span>
                <span className={`badge ${EXP_COLOR[job.experienceLevel]}`}>
                  {job.experienceLevel.charAt(0).toUpperCase() + job.experienceLevel.slice(1)} Level
                </span>
                {hasApplied && <span className="badge applied-badge">✓ Applied</span>}
              </div>
            </div>
          </div>

          <div className="jh-actions">
            {isOwner ? (
              <>
                <button className="btn btn-outline" onClick={() => navigate(`/careers/${id}/edit`)}>
                  ✏️ Edit
                </button>
                <button className="btn btn-outline delete-btn" onClick={handleDelete}>
                  🗑 Remove
                </button>
              </>
            ) : hasApplied ? (
              <button className="btn btn-lg applied-btn" disabled>
                ✓ Application Submitted
              </button>
            ) : (
              <button className="btn btn-primary btn-lg" onClick={() => setShowApplyModal(true)}>
                🚀 Apply Now
              </button>
            )}
          </div>
        </div>

        {/* Job Content */}
        <div className="job-content">
          
          {/* Main Column */}
          <div className="jc-main">
            
            <div className="content-section">
              <h3>Job Description</h3>
              <p className="job-description">{job.description}</p>
            </div>

            {job.requirements && job.requirements.length > 0 && (
              <div className="content-section">
                <h3>Requirements</h3>
                <ul className="requirements-list">
                  {job.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {job.skills && job.skills.length > 0 && (
              <div className="content-section">
                <h3>Required Skills</h3>
                <div className="skills-grid">
                  {job.skills.map((skill, i) => (
                    <span key={i} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            )}

            {job.deadline && (
              <div className="deadline-banner">
                <span className="db-icon">⏰</span>
                <div>
                  <strong>Application Deadline</strong>
                  <p>{new Date(job.deadline).toLocaleDateString('en-IN', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}</p>
                </div>
              </div>
            )}

          </div>

          {/* Sidebar */}
          <div className="jc-sidebar">
            
            <div className="sidebar-card">
              <h4>Job Overview</h4>
              <div className="overview-grid">
                <div className="overview-item">
                  <span className="oi-icon">📍</span>
                  <div>
                    <p className="oi-label">Location</p>
                    <p className="oi-value">{job.location}</p>
                  </div>
                </div>
                <div className="overview-item">
                  <span className="oi-icon">💼</span>
                  <div>
                    <p className="oi-label">Job Type</p>
                    <p className="oi-value">{TYPE_LABEL[job.jobType]}</p>
                  </div>
                </div>
                <div className="overview-item">
                  <span className="oi-icon">📊</span>
                  <div>
                    <p className="oi-label">Experience</p>
                    <p className="oi-value">{job.experienceLevel.charAt(0).toUpperCase() + job.experienceLevel.slice(1)}</p>
                  </div>
                </div>
                <div className="overview-item">
                  <span className="oi-icon">💰</span>
                  <div>
                    <p className="oi-label">Salary</p>
                    <p className="oi-value">{fmtSalary(job.salary?.min, job.salary?.max)}</p>
                  </div>
                </div>
                <div className="overview-item">
                  <span className="oi-icon">{CAT_ICON[job.category]}</span>
                  <div>
                    <p className="oi-label">Category</p>
                    <p className="oi-value">{job.category.charAt(0).toUpperCase() + job.category.slice(1)}</p>
                  </div>
                </div>
                <div className="overview-item">
                  <span className="oi-icon">📅</span>
                  <div>
                    <p className="oi-label">Posted</p>
                    <p className="oi-value">
                      {new Date(job.createdAt).toLocaleDateString('en-IN', { 
                        day: 'numeric', 
                        month: 'short' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {job.postedBy && (
              <div className="sidebar-card">
                <h4>Posted By</h4>
                <div className="posted-by">
                  <div className="pb-avatar">
                    {job.postedBy.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <p className="pb-name">{job.postedBy.name || 'Anonymous'}</p>
                    {job.postedBy.email && (
                      <p className="pb-email">{job.postedBy.email}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="modal-overlay" onClick={() => setShowApplyModal(false)}>
          <div className="modal-box modal-sm" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Apply for {job.title}</h2>
                <p className="modal-sub">at {job.company}</p>
              </div>
              <button className="modal-close" onClick={() => setShowApplyModal(false)}>✕</button>
            </div>
            <div className="form-group">
              <label className="form-label">
                Cover Letter <span className="hint-text">— optional but recommended</span>
              </label>
              <textarea 
                className="form-textarea" 
                style={{ minHeight: 180 }}
                placeholder={`Dear ${job.company} team,\n\nI'm excited to apply for the ${job.title} position because...`}
                value={coverLetter}
                onChange={e => setCoverLetter(e.target.value)}
              />
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setShowApplyModal(false)}>
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleApply} 
                disabled={submitting}
              >
                {submitting 
                  ? <><span className="btn-spinner" /> Submitting...</>
                  : '🚀 Submit Application'
                }
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .job-detail-page { 
          padding: 100px 0 80px; 
          min-height: 100vh; 
          background: var(--warm-bg); 
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
        
        /* Loading/Error States */
        .loading-state, .error-state { 
          text-align: center; 
          padding: 80px 24px; 
          background: white; 
          border-radius: var(--radius-lg); 
          max-width: 500px; 
          margin: 0 auto; 
        }
        .spinner { 
          width: 48px; 
          height: 48px; 
          border: 4px solid var(--border); 
          border-top-color: var(--primary); 
          border-radius: 50%; 
          animation: spin 0.8s linear infinite; 
          margin: 0 auto 20px; 
        }
        .es-icon { font-size: 4rem; margin-bottom: 20px; }
        .error-state h2 { margin-bottom: 12px; color: var(--text-primary); }
        .error-state p { color: var(--text-muted); margin-bottom: 28px; }
        
        /* Breadcrumb */
        .breadcrumb { margin-bottom: 28px; }
        .breadcrumb a { 
          color: var(--primary); 
          font-size: 0.9rem; 
          text-decoration: none; 
          font-weight: 500; 
        }
        .breadcrumb a:hover { text-decoration: underline; }
        
        /* Job Header */
        .job-header { 
          background: white; 
          border-radius: var(--radius-lg); 
          padding: 40px; 
          margin-bottom: 28px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 32px;
          border: 1px solid var(--border);
        }
        .jh-left { display: flex; gap: 24px; flex: 1; }
        .company-logo-large { 
          width: 80px; 
          height: 80px; 
          border-radius: 18px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-size: 2rem; 
          font-weight: 800; 
          color: white; 
          flex-shrink: 0;
          font-family: 'Playfair Display', serif;
        }
        .jh-info { flex: 1; }
        .job-title { 
          font-size: 2rem; 
          margin-bottom: 8px; 
          color: var(--primary-dark); 
        }
        .company-name { 
          font-size: 1.1rem; 
          color: var(--text-secondary); 
          margin-bottom: 16px; 
        }
        .job-meta { 
          display: flex; 
          gap: 16px; 
          flex-wrap: wrap; 
          margin-bottom: 16px; 
        }
        .job-meta span { 
          font-size: 0.875rem; 
          color: var(--text-secondary); 
        }
        .job-badges { display: flex; gap: 8px; flex-wrap: wrap; }
        .applied-badge { 
          background: #D1FAE5 !important; 
          color: #065F46 !important; 
          border: none !important; 
        }
        
        .jh-actions { 
          display: flex; 
          flex-direction: column; 
          gap: 10px; 
          flex-shrink: 0; 
        }
        .delete-btn { 
          color: var(--danger) !important; 
          border-color: var(--danger) !important; 
        }
        .delete-btn:hover { background: #FEE2E2 !important; }
        .applied-btn { 
          background: #D1FAE5 !important; 
          color: #065F46 !important; 
          border: 1.5px solid #A7F3D0 !important; 
          cursor: not-allowed !important; 
        }
        
        /* Job Content */
        .job-content { 
          display: grid; 
          grid-template-columns: 1fr 360px; 
          gap: 28px; 
          align-items: start; 
        }
        
        /* Main Column */
        .jc-main { display: flex; flex-direction: column; gap: 28px; }
        .content-section { 
          background: white; 
          border-radius: var(--radius-lg); 
          padding: 32px; 
          border: 1px solid var(--border); 
        }
        .content-section h3 { 
          font-size: 1.3rem; 
          margin-bottom: 20px; 
          color: var(--primary-dark); 
        }
        .job-description { 
          font-size: 1rem; 
          line-height: 1.8; 
          color: var(--text-secondary); 
          white-space: pre-line; 
        }
        
        .requirements-list { 
          padding-left: 24px; 
          display: flex; 
          flex-direction: column; 
          gap: 12px; 
        }
        .requirements-list li { 
          font-size: 0.95rem; 
          line-height: 1.7; 
          color: var(--text-secondary); 
        }
        
        .skills-grid { 
          display: flex; 
          gap: 10px; 
          flex-wrap: wrap; 
        }
        .skill-tag { 
          background: var(--surface); 
          color: var(--text-secondary); 
          padding: 8px 16px; 
          border-radius: 8px; 
          font-size: 0.875rem; 
          font-weight: 500; 
        }
        
        .deadline-banner { 
          background: #FEF3C7; 
          border: 1px solid #FCD34D; 
          border-radius: var(--radius-md); 
          padding: 20px 24px; 
          display: flex; 
          align-items: center; 
          gap: 16px; 
        }
        .db-icon { font-size: 2rem; flex-shrink: 0; }
        .deadline-banner strong { 
          display: block; 
          color: #92400E; 
          margin-bottom: 4px; 
          font-size: 0.95rem; 
        }
        .deadline-banner p { 
          color: #78350F; 
          font-size: 0.875rem; 
          margin: 0; 
        }
        
        /* Sidebar */
        .jc-sidebar { 
          position: sticky; 
          top: 100px; 
          display: flex; 
          flex-direction: column; 
          gap: 20px; 
        }
        .sidebar-card { 
          background: white; 
          border-radius: var(--radius-lg); 
          padding: 28px; 
          border: 1px solid var(--border); 
        }
        .sidebar-card h4 { 
          font-size: 1rem; 
          margin-bottom: 20px; 
          color: var(--primary-dark); 
        }
        
        .overview-grid { 
          display: flex; 
          flex-direction: column; 
          gap: 18px; 
        }
        .overview-item { display: flex; gap: 12px; align-items: flex-start; }
        .oi-icon { font-size: 1.3rem; flex-shrink: 0; }
        .oi-label { 
          font-size: 0.75rem; 
          color: var(--text-muted); 
          text-transform: uppercase; 
          letter-spacing: 0.04em; 
          margin-bottom: 3px; 
        }
        .oi-value { 
          font-size: 0.9rem; 
          color: var(--text-primary); 
          font-weight: 500; 
        }
        
        .posted-by { display: flex; gap: 12px; align-items: center; }
        .pb-avatar { 
          width: 48px; 
          height: 48px; 
          border-radius: 50%; 
          background: var(--primary); 
          color: white; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-size: 1.2rem; 
          font-weight: 700; 
          flex-shrink: 0; 
        }
        .pb-name { 
          font-size: 0.95rem; 
          font-weight: 600; 
          color: var(--text-primary); 
          margin-bottom: 2px; 
        }
        .pb-email { 
          font-size: 0.8rem; 
          color: var(--text-muted); 
        }
        
        /* Modal */
        .modal-overlay { 
          position: fixed; 
          inset: 0; 
          background: rgba(0,0,0,0.5); 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          z-index: 2000; 
          padding: 20px; 
          backdrop-filter: blur(4px); 
        }
        .modal-box { 
          background: white; 
          border-radius: var(--radius-xl); 
          padding: 40px; 
          width: 100%; 
          max-width: 600px; 
          max-height: 90vh; 
          overflow-y: auto; 
        }
        .modal-sm { max-width: 550px; }
        .modal-header { 
          display: flex; 
          justify-content: space-between; 
          align-items: flex-start; 
          margin-bottom: 24px; 
          gap: 16px; 
        }
        .modal-header h2 { font-size: 1.5rem; margin-bottom: 4px; }
        .modal-sub { color: var(--text-muted); font-size: 0.9rem; }
        .modal-close { 
          background: var(--surface); 
          border: none; 
          width: 36px; 
          height: 36px; 
          border-radius: 50%; 
          font-size: 1rem; 
          cursor: pointer; 
          flex-shrink: 0; 
        }
        .modal-close:hover { background: var(--border); }
        .modal-actions { 
          display: flex; 
          justify-content: flex-end; 
          gap: 12px; 
          margin-top: 28px; 
        }
        .hint-text { 
          font-weight: 400; 
          color: var(--text-muted); 
          font-size: 0.85rem; 
        }
        .btn-spinner { 
          width: 16px; 
          height: 16px; 
          border: 2px solid rgba(255,255,255,0.3); 
          border-top-color: white; 
          border-radius: 50%; 
          animation: spin 0.7s linear infinite; 
          display: inline-block; 
          vertical-align: middle; 
          margin-right: 6px; 
        }
        
        @media (max-width: 1024px) {
          .job-content { grid-template-columns: 1fr; }
          .jc-sidebar { position: static; }
        }
        @media (max-width: 768px) {
          .job-header { flex-direction: column; padding: 28px; }
          .jh-left { flex-direction: column; }
          .jh-actions { flex-direction: row; width: 100%; }
          .job-title { font-size: 1.5rem; }
          .company-logo-large { width: 64px; height: 64px; font-size: 1.6rem; }
        }
      `}</style>
    </div>
  );
};

export default JobDetail;
