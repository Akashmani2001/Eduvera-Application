import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, color = 'orange', trend }) => {
  const colorMap = {
    orange: { bg: '#fff7ed', text: '#ea580c', border: '#ffedd5' },
    navy: { bg: '#0a142f', text: '#ffffff', border: '#14224c' },
    green: { bg: '#ecfdf5', text: '#10b981', border: '#d1fae5' },
    blue: { bg: '#f0f9ff', text: '#0284c7', border: '#e0f2fe' }
  };

  const scheme = colorMap[color] || colorMap.orange;

  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px' }}>
      <div>
        <p style={{ fontSize: '0.84rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
          {title}
        </p>
        <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
          {value}
        </div>
        {subtitle && (
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '6px' }}>
            {subtitle}
          </p>
        )}
      </div>

      {Icon && (
        <div style={{
          width: '54px',
          height: '54px',
          borderRadius: '12px',
          backgroundColor: scheme.bg,
          color: scheme.text,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: `1px solid ${scheme.border}`
        }}>
          <Icon size={26} />
        </div>
      )}
    </div>
  );
};
