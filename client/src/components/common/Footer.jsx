import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Phone, Mail, Globe, MapPin, Clock, ShieldCheck } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '40px', marginBottom: '40px' }}>
          {/* Brand info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <GraduationCap size={22} />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>VM EDUVERA</span>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '20px', lineHeight: '1.6' }}>
              VM Eduvera Online Academy is committed to academic distinction, concept mastery, and individualized student mentoring across School, Commerce, and Higher Education streams.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f97316', fontSize: '0.88rem' }}>
              <ShieldCheck size={18} />
              <span>Verified Safe & Secure Learning Portal</span>
            </div>
          </div>

          {/* Academic Programs */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '18px' }}>Academic Programs</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <li>
                <Link to="/programs" style={{ color: '#94a3b8' }}>School Level (Classes 6–10)</Link>
              </li>
              <li>
                <Link to="/programs" style={{ color: '#94a3b8' }}>Commerce Stream (Classes 11–12)</Link>
              </li>
              <li>
                <Link to="/programs" style={{ color: '#94a3b8' }}>Accountancy & Business Mathematics</Link>
              </li>
              <li>
                <Link to="/programs" style={{ color: '#94a3b8' }}>Higher Education (BBA, BCom, MBA)</Link>
              </li>
            </ul>
          </div>

          {/* Brochure Schedule & Timings */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '18px' }}>Tuition Timings</h4>
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f97316', marginBottom: '8px', fontWeight: 600 }}>
                <Clock size={16} />
                <span>Evening Sessions</span>
              </div>
              <p style={{ color: '#ffffff', fontSize: '1.1rem', fontWeight: 700, margin: '4px 0' }}>
                5:00 PM – 8:00 PM
              </p>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Actual sessions configurable by day, course, and tutor. Live interactive video classes.
              </p>
            </div>
          </div>

          {/* Contact Information per Brochure */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '18px' }}>Academy Admissions</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
              <a href="tel:8056717286" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#f97316', fontWeight: 600 }}>
                <Phone size={18} />
                <span>+91 80567 17286</span>
              </a>
              <a href="mailto:info@vmeduvera.com" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#94a3b8' }}>
                <Mail size={18} />
                <span>info@vmeduvera.com</span>
              </a>
              <a href="https://www.vmeduvera.com" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#94a3b8' }}>
                <Globe size={18} />
                <span>www.vmeduvera.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', fontSize: '0.85rem', color: '#64748b' }}>
          <div>
            © {new Date().getFullYear()} VM Eduvera Online Academy. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>MERN Stack Architecture v1.0</span>
            <span>Privacy Notice</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
