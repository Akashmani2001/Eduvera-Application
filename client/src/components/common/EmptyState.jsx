import React from 'react';
import { BookOpen } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = BookOpen,
  title = 'No items found',
  description = 'There are currently no records to display.',
  actionLabel,
  onAction
}) => {
  return (
    <div style={{
      textAlign: 'center',
      padding: '48px 24px',
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      border: '1px dashed #cbd5e1'
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        backgroundColor: '#fff7ed',
        color: '#ea580c',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '16px'
      }}>
        <Icon size={30} />
      </div>
      <h4 style={{ fontSize: '1.15rem', color: '#0f172a', marginBottom: '8px' }}>{title}</h4>
      <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 20px' }}>
        {description}
      </p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn btn-primary btn-sm">
          {actionLabel}
        </button>
      )}
    </div>
  );
};
