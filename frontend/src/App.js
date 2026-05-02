import React from 'react';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

import CareersPage from './pages/Careers';
import JobDetail from './pages/JobDetail';
import ElderCarePage from './pages/ElderCare';
import JobApplication from './pages/JobApplication';
import ServicesPage from './pages/Services';
import Dashboard from './pages/Dashboard';
import AdminPage from './pages/Admin';
import './styles/global.css';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}><div className="spinner"></div></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
};

const Layout = ({ children, hideFooter = false }) => (
  <>
    <Navbar />
    <main>{children}</main>
    {!hideFooter && <Footer />}
  </>
);

const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<Layout><HomePage /></Layout>} />
      <Route path="/services" element={<Layout><ServicesPage /></Layout>} />
      <Route path="/careers" element={<Layout><CareersPage /></Layout>} />
       <Route path="/careers/:id" element={<Layout><JobDetail /></Layout>} />
      <Route path="/elder-care" element={<Layout><ElderCarePage /></Layout>} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
      <Route path="/careers/:id/apply" element={<JobApplication />} />

      <Route path="/dashboard/*" element={
        <ProtectedRoute>
          <Layout hideFooter={true}><Dashboard /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute roles={['admin']}>
          <Layout hideFooter={true}><AdminPage /></Layout>
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App = () => (
  <Router>
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#1B4332', color: 'white', borderRadius: '12px', fontSize: '0.9rem' },
          success: { style: { background: '#2D6A4F' }, iconTheme: { primary: '#52B788', secondary: 'white' } },
          error: { style: { background: '#9B1C1C' }, iconTheme: { primary: '#FCA5A5', secondary: 'white' } },
          duration: 3500,
        }}
      />
      <AppRoutes />
    </AuthProvider>
  </Router>
);

export default App;
