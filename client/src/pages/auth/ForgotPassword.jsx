import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 180px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', backgroundColor: '#f8fafc' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'linear-gradient(135deg, #ea580c, #f97316)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginBottom: '12px' }}>
            <GraduationCap size={28} />
          </div>
          <h1 style={{ fontSize: '1.8rem', color: '#0a142f' }}>Reset Password</h1>
          <p style={{ color: '#64748b', fontSize: '0.92rem', marginTop: '4px' }}>
            Enter your registered email to receive access credentials recovery
          </p>
        </div>

        <div className="card" style={{ padding: '32px' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <CheckCircle size={48} color="#10b981" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Recovery Link Sent</h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '24px' }}>
                If an account exists for <strong>{email}</strong>, a recovery link has been dispatched.
              </p>
              <Link to="/login" className="btn btn-primary btn-block">
                Return to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Registered Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="email"
                    required
                    className="form-input"
                    style={{ paddingLeft: '38px' }}
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                Send Recovery Instructions
              </button>

              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.88rem' }}>
                  <ArrowLeft size={16} />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
