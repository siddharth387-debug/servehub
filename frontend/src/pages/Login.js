import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API } from "../context/AuthContext";


const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);
    if (result.success) navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-art">
          <div className="art-circles">
            <div className="circle c1"></div>
            <div className="circle c2"></div>
            <div className="circle c3"></div>
          </div>
          <div className="art-content">
            <div className="art-logo">🌿</div>
            <h2>Welcome Back</h2>
            <p>Sign in to continue serving your community and making a difference.</p>
            <div className="art-stats">
              <div className="stat-pill"><span>👥</span> 12,000+ Members</div>
              <div className="stat-pill"><span>💼</span> 3,400+ Jobs Posted</div>
              <div className="stat-pill"><span>❤️</span> 8,000+ Elders Helped</div>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-wrap">
          <div className="auth-header">
            <Link to="/" className="back-home">← Back to home</Link>
            <div className="logo-small">
              <div className="logo-dot">🌿</div>
              <span>ServeHub</span>
            </div>
          </div>

          <div className="auth-form-box animate-in">
            <div className="form-title">
              <h1>Sign In</h1>
              <p>Access your ServeHub account</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="input-icon-wrap">
                  <span className="input-icon">✉️</span>
                  <input
                    type="email"
                    name="email"
                    className="form-input with-icon"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-icon-wrap">
                  <span className="input-icon">🔒</span>
                  <input
                    type={showPass ? 'text' : 'password'}
                    name="password"
                    className="form-input with-icon with-toggle"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                  />
                  <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div className="forgot-row">
                <a href="#" className="forgot-link">Forgot password?</a>
              </div>

              <button type="submit" className="btn btn-primary btn-lg submit-btn" disabled={loading}>
                {loading ? (
                  <><span className="btn-spinner"></span> Signing in...</>
                ) : (
                  <><span>🌿</span> Sign In to ServeHub</>
                )}
              </button>
            </form>

            <p className="switch-auth">
              Don't have an account? <Link to="/register">Create one free</Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .auth-page {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
        .auth-left {
          background: linear-gradient(160deg, var(--primary-dark) 0%, var(--primary) 50%, var(--primary-light) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }
        .art-circles { position: absolute; inset: 0; }
        .circle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
        }
        .c1 { width: 500px; height: 500px; top: -100px; left: -100px; }
        .c2 { width: 300px; height: 300px; bottom: -50px; right: -50px; }
        .c3 { width: 200px; height: 200px; top: 40%; left: 60%; background: rgba(244,162,97,0.15); }
        .art-content {
          position: relative; z-index: 1;
          color: white;
          padding: 48px;
          max-width: 440px;
          text-align: center;
        }
        .art-logo {
          font-size: 4rem; margin-bottom: 24px;
          display: inline-block;
          background: rgba(255,255,255,0.15);
          width: 90px; height: 90px; border-radius: 28px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 28px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        }
        .art-content h2 {
          color: white;
          font-size: 2.4rem;
          margin-bottom: 16px;
        }
        .art-content p {
          color: rgba(255,255,255,0.75);
          font-size: 1.05rem;
          line-height: 1.7;
          margin-bottom: 36px;
        }
        .art-stats { display: flex; flex-direction: column; gap: 12px; align-items: center; }
        .stat-pill {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 100px;
          padding: 8px 20px;
          font-size: 0.875rem;
          color: rgba(255,255,255,0.9);
          backdrop-filter: blur(8px);
        }
        .auth-right {
          background: var(--warm-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
        }
        .auth-form-wrap { width: 100%; max-width: 440px; }
        .auth-header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 48px;
        }
        .back-home {
          font-size: 0.875rem;
          color: var(--text-muted);
          text-decoration: none;
          transition: color 0.2s;
        }
        .back-home:hover { color: var(--primary); }
        .logo-small {
          display: flex; align-items: center; gap: 8px;
          font-family: 'Playfair Display', serif;
          font-weight: 700; font-size: 1.1rem;
          color: var(--primary-dark);
        }
        .logo-dot { font-size: 1.2rem; }
        .auth-form-box {
          background: white;
          border-radius: var(--radius-xl);
          padding: 48px 40px;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border);
        }
        .form-title { margin-bottom: 36px; }
        .form-title h1 { font-size: 2rem; margin-bottom: 6px; }
        .form-title p { color: var(--text-muted); }
        .auth-form { display: flex; flex-direction: column; gap: 4px; }
        .input-icon-wrap { position: relative; }
        .input-icon {
          position: absolute; left: 14px; top: 50%;
          transform: translateY(-50%);
          font-size: 1rem; pointer-events: none;
          z-index: 1;
        }
        .form-input.with-icon { padding-left: 44px; }
        .form-input.with-toggle { padding-right: 44px; }
        .pass-toggle {
          position: absolute; right: 12px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          font-size: 1rem; padding: 4px;
        }
        .forgot-row {
          text-align: right;
          margin-top: -8px;
          margin-bottom: 8px;
        }
        .forgot-link {
          font-size: 0.85rem;
          color: var(--primary);
          text-decoration: none;
          font-weight: 500;
        }
        .forgot-link:hover { text-decoration: underline; }
        .submit-btn {
          width: 100%;
          justify-content: center;
          margin-top: 8px;
          padding: 14px;
          font-size: 1rem;
        }
        .btn-spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }
        .switch-auth {
          text-align: center;
          margin-top: 24px;
          font-size: 0.9rem;
          color: var(--text-muted);
        }
        .switch-auth a { color: var(--primary); font-weight: 600; }
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

export default Login;
