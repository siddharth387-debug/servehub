import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API } from "../context/AuthContext";


const ROLES = [
  { id: 'user', icon: '🙋', label: 'Job Seeker / User', desc: 'Find jobs, request elder care' },
  { id: 'volunteer', icon: '🤝', label: 'Volunteer', desc: 'Help elders in your community' },
  { id: 'provider', icon: '🏢', label: 'Service Provider', desc: 'Post jobs and hire talent' },
];

const Register = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'user' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return;
    setLoading(true);
    const result = await register(form);
    setLoading(false);
    if (result.success) navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="art-circles">
          <div className="circle c1"></div>
          <div className="circle c2"></div>
        </div>
        <div className="art-content">
          <div className="art-logo">🌿</div>
          <h2>Join Our Community</h2>
          <p>Whether you're seeking opportunities or giving back to elders — there's a place for you here.</p>
          <div className="role-previews">
            {ROLES.map(r => (
              <div key={r.id} className={`role-preview-card ${form.role === r.id ? 'active' : ''}`}>
                <span>{r.icon}</span>
                <div>
                  <p className="rpc-label">{r.label}</p>
                  <p className="rpc-desc">{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-wrap">
          <div className="auth-header">
            <Link to="/" className="back-home">← Back to home</Link>
            <div className="logo-small">
              <span>🌿</span>
              <span>ServeHub</span>
            </div>
          </div>

          <div className="auth-form-box animate-in">
            <div className="form-title">
              <h1>Create Account</h1>
              <p>Start making an impact today</p>
            </div>

            <div className="step-indicator">
              <div className={`step ${step >= 1 ? 'active' : ''}`}>1</div>
              <div className="step-line"></div>
              <div className={`step ${step >= 2 ? 'active' : ''}`}>2</div>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {step === 1 && (
                <>
                  <div className="role-selector">
                    <label className="form-label">I want to join as...</label>
                    <div className="role-cards">
                      {ROLES.map(r => (
                        <button
                          type="button"
                          key={r.id}
                          className={`role-card ${form.role === r.id ? 'selected' : ''}`}
                          onClick={() => setForm({ ...form, role: r.id })}
                        >
                          <span className="role-icon">{r.icon}</span>
                          <span className="role-label">{r.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <div className="input-icon-wrap">
                      <span className="input-icon">👤</span>
                      <input
                        type="text" name="name" className="form-input with-icon"
                        placeholder="Your full name"
                        value={form.name} onChange={handleChange} required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <div className="input-icon-wrap">
                      <span className="input-icon">📱</span>
                      <input
                        type="tel" name="phone" className="form-input with-icon"
                        placeholder="+91 XXXXX XXXXX"
                        value={form.phone} onChange={handleChange}
                      />
                    </div>
                  </div>

                  <button type="button" className="btn btn-primary btn-lg submit-btn"
                    onClick={() => setStep(2)} disabled={!form.name}>
                    Continue →
                  </button>
                </>
              )}

              {step === 2 && (
                <>
                  <button type="button" className="back-step" onClick={() => setStep(1)}>
                    ← Go back
                  </button>

                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <div className="input-icon-wrap">
                      <span className="input-icon">✉️</span>
                      <input
                        type="email" name="email" className="form-input with-icon"
                        placeholder="you@example.com"
                        value={form.email} onChange={handleChange} required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <div className="input-icon-wrap">
                      <span className="input-icon">🔒</span>
                      <input
                        type={showPass ? 'text' : 'password'} name="password"
                        className="form-input with-icon with-toggle"
                        placeholder="Min. 6 characters"
                        value={form.password} onChange={handleChange} required minLength={6}
                      />
                      <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                        {showPass ? '🙈' : '👁️'}
                      </button>
                    </div>
                    {form.password.length > 0 && (
                      <div className="pass-strength">
                        <div className={`strength-bar ${form.password.length >= 8 ? 'strong' : form.password.length >= 6 ? 'medium' : 'weak'}`}></div>
                        <span>{form.password.length >= 8 ? 'Strong' : form.password.length >= 6 ? 'Good' : 'Too short'}</span>
                      </div>
                    )}
                  </div>

                  <button type="submit" className="btn btn-primary btn-lg submit-btn" disabled={loading}>
                    {loading ? <><span className="btn-spinner"></span> Creating...</> : <><span>🌿</span> Create My Account</>}
                  </button>
                </>
              )}
            </form>

            <p className="switch-auth">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .auth-page { min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr; }
        .auth-left {
          background: linear-gradient(160deg, var(--primary-dark) 0%, var(--primary) 50%, var(--accent-dark) 100%);
          display: flex; align-items: center; justify-content: center;
          position: relative; overflow: hidden;
        }
        .art-circles { position: absolute; inset: 0; }
        .circle { position: absolute; border-radius: 50%; background: rgba(255,255,255,0.05); }
        .c1 { width: 500px; height: 500px; top: -100px; left: -100px; }
        .c2 { width: 300px; height: 300px; bottom: -50px; right: -50px; }
        .art-content { position: relative; z-index: 1; color: white; padding: 48px; max-width: 440px; }
        .art-logo {
          font-size: 3rem; background: rgba(255,255,255,0.15);
          width: 80px; height: 80px; border-radius: 24px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 28px;
        }
        .art-content h2 { color: white; font-size: 2.2rem; margin-bottom: 14px; }
        .art-content p { color: rgba(255,255,255,0.75); font-size: 1rem; line-height: 1.7; margin-bottom: 32px; }
        .role-previews { display: flex; flex-direction: column; gap: 10px; }
        .role-preview-card {
          display: flex; align-items: center; gap: 12px;
          background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15);
          border-radius: 12px; padding: 12px 16px;
          transition: all 0.2s;
        }
        .role-preview-card.active { background: rgba(255,255,255,0.18); border-color: rgba(255,255,255,0.4); }
        .rpc-label { font-weight: 600; font-size: 0.9rem; color: white; }
        .rpc-desc { font-size: 0.8rem; color: rgba(255,255,255,0.65); }
        .auth-right {
          background: var(--warm-bg);
          display: flex; align-items: center; justify-content: center;
          padding: 40px 24px;
        }
        .auth-form-wrap { width: 100%; max-width: 440px; }
        .auth-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
        .back-home { font-size: 0.875rem; color: var(--text-muted); text-decoration: none; }
        .back-home:hover { color: var(--primary); }
        .logo-small { display: flex; align-items: center; gap: 8px; font-family: 'Playfair Display', serif; font-weight: 700; font-size: 1.1rem; color: var(--primary-dark); }
        .auth-form-box { background: white; border-radius: var(--radius-xl); padding: 44px 40px; box-shadow: var(--shadow-lg); border: 1px solid var(--border); }
        .form-title { margin-bottom: 28px; }
        .form-title h1 { font-size: 1.9rem; margin-bottom: 6px; }
        .form-title p { color: var(--text-muted); }
        .step-indicator { display: flex; align-items: center; gap: 8px; margin-bottom: 28px; }
        .step {
          width: 32px; height: 32px; border-radius: 50%;
          background: var(--border); color: var(--text-muted);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.85rem; font-weight: 700;
          transition: all 0.3s;
        }
        .step.active { background: var(--primary); color: white; }
        .step-line { flex: 1; height: 2px; background: var(--border); border-radius: 1px; }
        .role-selector { margin-bottom: 20px; }
        .role-cards { display: flex; flex-direction: column; gap: 8px; margin-top: 8px; }
        .role-card {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 16px; border-radius: 12px;
          border: 2px solid var(--border); background: white;
          cursor: pointer; transition: all 0.2s; text-align: left;
        }
        .role-card:hover { border-color: var(--primary-light); background: rgba(45,106,79,0.04); }
        .role-card.selected { border-color: var(--primary); background: rgba(45,106,79,0.06); }
        .role-icon { font-size: 1.3rem; }
        .role-label { font-size: 0.875rem; font-weight: 600; color: var(--text-primary); }
        .auth-form { display: flex; flex-direction: column; gap: 4px; }
        .input-icon-wrap { position: relative; }
        .input-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-size: 1rem; pointer-events: none; z-index: 1; }
        .form-input.with-icon { padding-left: 44px; }
        .form-input.with-toggle { padding-right: 44px; }
        .pass-toggle { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; font-size: 1rem; padding: 4px; }
        .pass-strength { display: flex; align-items: center; gap: 8px; margin-top: 6px; }
        .strength-bar { height: 4px; border-radius: 2px; flex: 1; background: #FCA5A5; transition: all 0.3s; }
        .strength-bar.medium { background: var(--accent); }
        .strength-bar.strong { background: var(--primary); }
        .pass-strength span { font-size: 0.75rem; color: var(--text-muted); font-weight: 500; }
        .back-step { background: none; border: none; color: var(--primary); font-size: 0.875rem; font-weight: 600; cursor: pointer; padding: 0 0 16px; display: flex; align-items: center; gap: 4px; }
        .submit-btn { width: 100%; justify-content: center; margin-top: 8px; padding: 14px; font-size: 1rem; }
        .btn-spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
        .switch-auth { text-align: center; margin-top: 24px; font-size: 0.9rem; color: var(--text-muted); }
        .switch-auth a { color: var(--primary); font-weight: 600; text-decoration: none; }
        .switch-auth a:hover { text-decoration: underline; }
        @media (max-width: 768px) {
          .auth-page { grid-template-columns: 1fr; }
          .auth-left { display: none; }
          .auth-form-box { padding: 32px 24px; }
        }
      `}</style>
    </div>
  );
};

export default Register;
