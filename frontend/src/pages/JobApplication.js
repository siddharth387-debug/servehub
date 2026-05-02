import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth, API } from '../context/AuthContext';
import toast from 'react-hot-toast';

const JobApplication = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: '',
    resumeFile: null,
    linkedinUrl: '',
    portfolioUrl: '',
    yearsOfExperience: '',
    currentCompany: '',
    currentRole: '',
    coverLetter: '',
    whyInterested: '',
    expectedSalary: '',
    availableFrom: '',
    willingToRelocate: 'yes',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchJob();
  }, [id, user]);

  const fetchJob = async () => {
    try {
      const res = await API.get(`/careers/${id}`);
      setJob(res.data.career);
      
      const hasApplied = res.data.career.applicants?.some(
        a => (a.user?._id || a.user) === user.id
      );
      if (hasApplied) {
        toast.error('You have already applied to this job');
        navigate(`/careers/${id}`);
      }
    } catch (e) {
      toast.error('Job not found');
      navigate('/careers');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const applicationData = {
        coverLetter: formData.coverLetter || `
Contact: ${formData.phone} | ${formData.location}
${formData.linkedinUrl ? `LinkedIn: ${formData.linkedinUrl}` : ''}
${formData.portfolioUrl ? `Portfolio: ${formData.portfolioUrl}` : ''}

Experience: ${formData.yearsOfExperience} years
${formData.currentCompany ? `Current: ${formData.currentRole} at ${formData.currentCompany}` : ''}

Why I'm interested:
${formData.whyInterested}

Expected Salary: ${formData.expectedSalary || 'Negotiable'}
Available from: ${formData.availableFrom || 'Immediately'}
Willing to relocate: ${formData.willingToRelocate}
        `.trim(),
      };

      await API.post(`/careers/${id}/apply`, applicationData);
      
      toast.success('🎉 Application submitted successfully!');
      navigate(`/careers/${id}`);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setFormData({ ...formData, resumeFile: file });
    }
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.fullName || !formData.email || !formData.phone) {
        toast.error('Please fill all required fields');
        return;
      }
    }
    if (step === 2) {
      if (!formData.yearsOfExperience) {
        toast.error('Please provide your years of experience');
        return;
      }
    }
    setStep(step + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className="application-page">
        <div className="container">
          <div className="loading-state">
            <div className="spinner" />
            <p>Loading application form...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="application-page">
      <div className="container">
        
        <div className="app-header">
          <Link to={`/careers/${id}`} className="back-link">← Back to job</Link>
          <h1>Apply to {job.company}</h1>
          <p className="job-title-sub">{job.title}</p>
        </div>

        <div className="app-layout">
          
          <div className="app-form-column">
            
            <div className="progress-steps">
              <div className={`progress-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                <div className="ps-circle">{step > 1 ? '✓' : '1'}</div>
                <span>Contact Info</span>
              </div>
              <div className="progress-line" />
              <div className={`progress-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
                <div className="ps-circle">{step > 2 ? '✓' : '2'}</div>
                <span>Resume & Experience</span>
              </div>
              <div className="progress-line" />
              <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
                <div className="ps-circle">3</div>
                <span>Final Details</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="application-form">
              
              {step === 1 && (
                <div className="form-step animate-in">
                  <h2>Contact Information</h2>
                  <p className="step-desc">Let's start with your basic details</p>

                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      className="form-input"
                      value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Email Address *</label>
                      <input
                        type="email"
                        className="form-input"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone Number *</label>
                      <input
                        type="tel"
                        className="form-input"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Current Location</label>
                    <input
                      className="form-input"
                      placeholder="e.g. Bangalore, Karnataka"
                      value={formData.location}
                      onChange={e => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>

                  <div className="form-actions">
                    <button type="button" className="btn btn-outline" onClick={() => navigate(`/careers/${id}`)}>
                      Cancel
                    </button>
                    <button type="button" className="btn btn-primary" onClick={nextStep}>
                      Next: Resume & Experience →
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="form-step animate-in">
                  <h2>Resume & Experience</h2>
                  <p className="step-desc">Share your professional background</p>

                  <div className="form-group">
                    <label className="form-label">Upload Resume (PDF, DOC, DOCX)</label>
                    <div className="file-upload-box">
                      <input
                        type="file"
                        id="resume"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="resume" className="file-upload-label">
                        {formData.resumeFile ? (
                          <>
                            <span className="file-icon">📄</span>
                            <span>{formData.resumeFile.name}</span>
                            <span className="file-size">({(formData.resumeFile.size / 1024).toFixed(0)} KB)</span>
                          </>
                        ) : (
                          <>
                            <span className="upload-icon">📤</span>
                            <span>Click to upload or drag and drop</span>
                            <small>Max file size: 5MB</small>
                          </>
                        )}
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">LinkedIn Profile URL</label>
                    <input
                      type="url"
                      className="form-input"
                      placeholder="https://linkedin.com/in/yourprofile"
                      value={formData.linkedinUrl}
                      onChange={e => setFormData({ ...formData, linkedinUrl: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Portfolio / Website</label>
                    <input
                      type="url"
                      className="form-input"
                      placeholder="https://yourportfolio.com"
                      value={formData.portfolioUrl}
                      onChange={e => setFormData({ ...formData, portfolioUrl: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Years of Experience *</label>
                    <select
                      className="form-select"
                      value={formData.yearsOfExperience}
                      onChange={e => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                      required
                    >
                      <option value="">Select experience</option>
                      <option value="0-1">0-1 years (Fresher)</option>
                      <option value="1-3">1-3 years</option>
                      <option value="3-5">3-5 years</option>
                      <option value="5-8">5-8 years</option>
                      <option value="8-12">8-12 years</option>
                      <option value="12+">12+ years</option>
                    </select>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Current Company</label>
                      <input
                        className="form-input"
                        placeholder="Your current employer"
                        value={formData.currentCompany}
                        onChange={e => setFormData({ ...formData, currentCompany: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Current Role</label>
                      <input
                        className="form-input"
                        placeholder="Your current job title"
                        value={formData.currentRole}
                        onChange={e => setFormData({ ...formData, currentRole: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="button" className="btn btn-outline" onClick={prevStep}>
                      ← Back
                    </button>
                    <button type="button" className="btn btn-primary" onClick={nextStep}>
                      Next: Final Details →
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="form-step animate-in">
                  <h2>Final Details</h2>
                  <p className="step-desc">Tell us why you're a great fit</p>

                  <div className="form-group">
                    <label className="form-label">Cover Letter (Optional but recommended)</label>
                    <textarea
                      className="form-textarea"
                      style={{ minHeight: 160 }}
                      placeholder={`Dear ${job.company} Hiring Team,\n\nI am excited to apply for the ${job.title} position because...`}
                      value={formData.coverLetter}
                      onChange={e => setFormData({ ...formData, coverLetter: e.target.value })}
                    />
                    <small className="char-count">{formData.coverLetter.length} characters</small>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Why are you interested in this role?</label>
                    <textarea
                      className="form-textarea"
                      rows={4}
                      placeholder="What excites you about this opportunity?"
                      value={formData.whyInterested}
                      onChange={e => setFormData({ ...formData, whyInterested: e.target.value })}
                    />
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Expected Salary (Annual)</label>
                      <input
                        className="form-input"
                        placeholder="e.g. ₹6,00,000 or Negotiable"
                        value={formData.expectedSalary}
                        onChange={e => setFormData({ ...formData, expectedSalary: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Available to Join From</label>
                      <input
                        type="date"
                        className="form-input"
                        min={new Date().toISOString().split('T')[0]}
                        value={formData.availableFrom}
                        onChange={e => setFormData({ ...formData, availableFrom: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Willing to Relocate to {job.location}?</label>
                    <div className="radio-group">
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="relocate"
                          value="yes"
                          checked={formData.willingToRelocate === 'yes'}
                          onChange={e => setFormData({ ...formData, willingToRelocate: e.target.value })}
                        />
                        <span>Yes</span>
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="relocate"
                          value="no"
                          checked={formData.willingToRelocate === 'no'}
                          onChange={e => setFormData({ ...formData, willingToRelocate: e.target.value })}
                        />
                        <span>No</span>
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="relocate"
                          value="maybe"
                          checked={formData.willingToRelocate === 'maybe'}
                          onChange={e => setFormData({ ...formData, willingToRelocate: e.target.value })}
                        />
                        <span>Open to discussion</span>
                      </label>
                    </div>
                  </div>

                  <div className="consent-box">
                    <label className="checkbox-label">
                      <input type="checkbox" required />
                      <span>
                        I confirm that the information provided is accurate. I understand that {job.company} will use this information to evaluate my application.
                      </span>
                    </label>
                  </div>

                  <div className="form-actions">
                    <button type="button" className="btn btn-outline" onClick={prevStep}>
                      ← Back
                    </button>
                    <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
                      {submitting ? (
                        <>
                          <span className="btn-spinner" />
                          Submitting Application...
                        </>
                      ) : (
                        '🚀 Submit Application'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          <div className="app-sidebar">
            <div className="sidebar-sticky">
              <div className="job-summary-card">
                <h3>Job Summary</h3>
                <div className="js-item">
                  <span className="js-label">Position</span>
                  <span className="js-value">{job.title}</span>
                </div>
                <div className="js-item">
                  <span className="js-label">Company</span>
                  <span className="js-value">{job.company}</span>
                </div>
                <div className="js-item">
                  <span className="js-label">Location</span>
                  <span className="js-value">{job.location}</span>
                </div>
                <div className="js-item">
                  <span className="js-label">Job Type</span>
                  <span className="js-value" style={{ textTransform: 'capitalize' }}>{job.jobType}</span>
                </div>
                {job.salary?.min && (
                  <div className="js-item">
                    <span className="js-label">Salary Range</span>
                    <span className="js-value">
                      ₹{(job.salary.min / 100000).toFixed(1)}L - ₹{(job.salary.max / 100000).toFixed(1)}L
                    </span>
                  </div>
                )}
                <div className="js-item">
                  <span className="js-label">Applicants</span>
                  <span className="js-value">{job.applicants?.length || 0} applied</span>
                </div>
              </div>

              <div className="tips-card">
                <h4>💡 Application Tips</h4>
                <ul className="tips-list">
                  <li>Tailor your resume to match the job requirements</li>
                  <li>Write a personalized cover letter</li>
                  <li>Highlight relevant skills and experience</li>
                  <li>Proofread everything before submitting</li>
                  <li>Follow up after 1 week if you don't hear back</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .application-page { padding: 100px 0 80px; min-height: 100vh; background: var(--warm-bg); }
        .container { max-width: 1300px; margin: 0 auto; padding: 0 24px; }
        .app-header { margin-bottom: 40px; text-align: center; }
        .back-link { color: var(--primary); font-size: 0.9rem; text-decoration: none; display: inline-block; margin-bottom: 16px; }
        .back-link:hover { text-decoration: underline; }
        .app-header h1 { font-size: 2rem; margin-bottom: 8px; }
        .job-title-sub { color: var(--text-muted); font-size: 1.05rem; }
        .app-layout { display: grid; grid-template-columns: 1fr 380px; gap: 40px; align-items: start; }
        .app-form-column { background: white; border-radius: var(--radius-xl); padding: 48px; border: 1px solid var(--border); }
        .progress-steps { display: flex; align-items: center; justify-content: space-between; margin-bottom: 48px; }
        .progress-step { display: flex; flex-direction: column; align-items: center; gap: 10px; flex: 1; }
        .ps-circle { width: 44px; height: 44px; border-radius: 50%; background: var(--surface); color: var(--text-muted); display: flex; align-items: center; justify-content: center; font-weight: 700; transition: all 0.3s; border: 2px solid var(--border); }
        .progress-step.active .ps-circle { background: var(--primary); color: white; border-color: var(--primary); }
        .progress-step.completed .ps-circle { background: #10B981; color: white; border-color: #10B981; }
        .progress-step span { font-size: 0.8rem; color: var(--text-muted); text-align: center; max-width: 140px; }
        .progress-step.active span { color: var(--primary); font-weight: 600; }
        .progress-line { flex: 1; height: 2px; background: var(--border); margin: 0 -10px; align-self: flex-start; margin-top: 22px; }
        .form-step { animation: fadeInUp 0.4s ease; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .form-step h2 { font-size: 1.8rem; margin-bottom: 8px; color: var(--primary-dark); }
        .step-desc { color: var(--text-muted); margin-bottom: 32px; font-size: 0.95rem; }
        .form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .form-actions { display: flex; justify-content: space-between; gap: 16px; margin-top: 40px; padding-top: 32px; border-top: 1px solid var(--border); }
        .file-upload-box { border: 2px dashed var(--border); border-radius: var(--radius-md); padding: 32px; text-align: center; transition: all 0.2s; cursor: pointer; }
        .file-upload-box:hover { border-color: var(--primary); background: var(--surface); }
        .file-upload-label { display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer; }
        .upload-icon { font-size: 2.5rem; }
        .file-icon { font-size: 2rem; }
        .file-size { font-size: 0.8rem; color: var(--text-muted); }
        .radio-group { display: flex; gap: 20px; flex-wrap: wrap; }
        .radio-label { display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 10px 16px; border: 1.5px solid var(--border); border-radius: 8px; transition: all 0.2s; }
        .radio-label:hover { border-color: var(--primary); background: var(--surface); }
        .radio-label input:checked + span { font-weight: 600; }
        .consent-box { background: var(--surface); border-radius: var(--radius-md); padding: 20px; margin-top: 32px; }
        .checkbox-label { display: flex; gap: 12px; cursor: pointer; font-size: 0.9rem; line-height: 1.6; }
        .checkbox-label input { flex-shrink: 0; margin-top: 2px; }
        .char-count { display: block; text-align: right; font-size: 0.75rem; color: var(--text-muted); margin-top: 6px; }
        .app-sidebar { position: sticky; top: 100px; }
        .sidebar-sticky { display: flex; flex-direction: column; gap: 20px; }
        .job-summary-card { background: white; border-radius: var(--radius-lg); padding: 28px; border: 1px solid var(--border); }
        .job-summary-card h3 { font-size: 1.1rem; margin-bottom: 20px; color: var(--primary-dark); }
        .js-item { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--surface); }
        .js-item:last-child { border-bottom: none; }
        .js-label { font-size: 0.85rem; color: var(--text-muted); }
        .js-value { font-size: 0.9rem; font-weight: 600; color: var(--text-primary); text-align: right; }
        .tips-card { background: linear-gradient(135deg, #FEF3C7, #FDE68A); border-radius: var(--radius-lg); padding: 24px; }
        .tips-card h4 { font-size: 1rem; margin-bottom: 16px; color: #92400E; }
        .tips-list { list-style: none; display: flex; flex-direction: column; gap: 10px; }
        .tips-list li { font-size: 0.85rem; color: #78350F; padding-left: 20px; position: relative; line-height: 1.5; }
        .tips-list li::before { content: '✓'; position: absolute; left: 0; font-weight: 700; color: #10B981; }
        .loading-state { text-align: center; padding: 80px 24px; background: white; border-radius: var(--radius-lg); }
        .spinner { width: 48px; height: 48px; border: 4px solid var(--border); border-top-color: var(--primary); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 20px; }
        .btn-spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; vertical-align: middle; margin-right: 6px; }
        @media (max-width: 1024px) { .app-layout { grid-template-columns: 1fr; } .app-sidebar { position: static; } }
        @media (max-width: 768px) { .app-form-column { padding: 28px 20px; } .form-row-2 { grid-template-columns: 1fr; } .progress-steps { flex-direction: column; align-items: stretch; } .progress-line { height: 30px; width: 2px; margin: -10px auto; } .radio-group { flex-direction: column; } }
      `}</style>
    </div>
  );
};

export default JobApplication;
