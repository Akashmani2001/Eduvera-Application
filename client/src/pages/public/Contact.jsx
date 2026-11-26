import React, { useState } from 'react';
import { contactApi } from '../../api/contactApi';
import { Phone, Mail, Globe, MapPin, Clock, MessageSquare, Send, CheckCircle, HelpCircle } from 'lucide-react';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    educationLevel: 'School Level (Classes 6-10)',
    message: '',
    honeypot: '' // spam protection
  });
  const [status, setStatus] = useState({ loading: false, success: null, error: null });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: null, error: null });

    try {
      const res = await contactApi.submitContact(formData);
      setStatus({ loading: false, success: res.message, error: null });
      setFormData({ name: '', email: '', phone: '', educationLevel: 'School Level (Classes 6-10)', message: '', honeypot: '' });
    } catch (err) {
      setStatus({ loading: false, success: null, error: err.message });
    }
  };

  const faqs = [
    {
      q: 'What are the tuition class timings?',
      a: 'As indicated in the brochure, our core tuition hours run between 5:00 PM and 8:00 PM in the evening. Individual batches are scheduled within this window to ensure no conflict with daytime school hours.'
    },
    {
      q: 'Which programs and grades are covered?',
      a: 'We provide specialized coaching for School Level (Classes 6–10 for Maths & Science), Commerce Stream (Classes 11–12 for Accountancy, Business Studies, Economics, and Maths), and Higher Education (BBA, BCom, MBA management subjects).'
    },
    {
      q: 'How do students attend live classes?',
      a: 'Enrolled students log into their student workspace where upcoming classes are listed. A "Join Class" button activates prior to class time, directing the student directly into the verified Google Meet or video session.'
    },
    {
      q: 'How do I enrol in a course?',
      a: 'You can register an account, browse the Programs page, and click "Request Enrolment". The faculty lead reviews and approves your request, after which class materials and timetable become active.'
    }
  ];

  return (
    <div style={{ padding: '60px 0 90px', backgroundColor: '#f8fafc' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 50px' }}>
          <span style={{ color: '#ea580c', fontWeight: 700, fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Get In Touch
          </span>
          <h1 style={{ fontSize: '2.6rem', color: '#0a142f', marginTop: '6px', marginBottom: '12px' }}>
            Contact & Academic Helpdesk
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.05rem' }}>
            Have questions about tuition batches, subjects, or enrolment? Connect with VM Eduvera counselors directly.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', marginBottom: '60px' }}>
          {/* Contact Details Column */}
          <div>
            <h3 style={{ fontSize: '1.5rem', color: '#0a142f', marginBottom: '20px' }}>Academy Admissions Office</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 24px' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '10px', background: '#fff7ed', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Phone size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Hotline Phone</div>
                  <a href="tel:8056717286" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                    +91 80567 17286
                  </a>
                </div>
              </div>

              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 24px' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '10px', background: '#eff6ff', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mail size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Email Address</div>
                  <a href="mailto:info@vmeduvera.com" style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                    info@vmeduvera.com
                  </a>
                </div>
              </div>

              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 24px' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '10px', background: '#f0fdf4', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Clock size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Evening Tuition Schedule</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                    5:00 PM – 8:00 PM (IST)
                  </div>
                </div>
              </div>

              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 24px' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '10px', background: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Globe size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Official Website</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                    www.vmeduvera.com
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="card" style={{ padding: '36px', border: '1.5px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.4rem', color: '#0a142f', marginBottom: '8px' }}>Send an Admission Enquiry</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '24px' }}>
              Fill in your details and our faculty counselor will respond with curriculum syllabus and batch schedule.
            </p>

            {status.success && (
              <div style={{ padding: '14px', borderRadius: '8px', backgroundColor: '#ecfdf5', color: '#065f46', fontSize: '0.92rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle size={20} color="#10b981" />
                <span>{status.success}</span>
              </div>
            )}

            {status.error && (
              <div style={{ padding: '14px', borderRadius: '8px', backgroundColor: '#fef2f2', color: '#991b1b', fontSize: '0.92rem', marginBottom: '20px' }}>
                {status.error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Spam Honeypot (hidden) */}
              <input
                type="text"
                name="honeypot"
                value={formData.honeypot}
                onChange={e => setFormData({ ...formData, honeypot: e.target.value })}
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="form-group">
                <label className="form-label">Student or Parent Full Name *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Suresh Sharma"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Mobile Contact Number *</label>
                  <input
                    type="tel"
                    required
                    className="form-input"
                    placeholder="e.g. 80567 17286"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    required
                    className="form-input"
                    placeholder="name@domain.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Education Stream *</label>
                <select
                  className="form-select"
                  value={formData.educationLevel}
                  onChange={e => setFormData({ ...formData, educationLevel: e.target.value })}
                >
                  <option value="School Level (Classes 6-10)">School Level (Classes 6–10)</option>
                  <option value="Commerce Stream (Classes 11-12)">Commerce Stream (Classes 11–12)</option>
                  <option value="Higher Education (BBA, BCom, MBA)">Higher Education (BBA, BCom, MBA)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Detailed Message / Question *</label>
                <textarea
                  rows={4}
                  required
                  className="form-textarea"
                  placeholder="Please mention target grade, subject preferences, or questions..."
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={status.loading}
                className="btn btn-primary btn-block"
              >
                <Send size={16} />
                <span>{status.loading ? 'Transmitting Enquiry...' : 'Submit Message'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* FAQs */}
        <div style={{ maxWidth: '840px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '1.6rem', color: '#0a142f', textAlign: 'center', marginBottom: '28px' }}>
            Frequently Asked Questions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {faqs.map((faq, i) => (
              <div key={i} className="card" style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <HelpCircle size={20} color="#ea580c" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h4 style={{ fontSize: '1.05rem', color: '#0a142f', marginBottom: '6px' }}>{faq.q}</h4>
                    <p style={{ fontSize: '0.92rem', color: '#64748b', lineHeight: 1.6 }}>{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
