import React from 'react';

export const Badge = ({ status = 'default', text, children }) => {
  const normalized = (status || '').toLowerCase();

  let className = 'badge';

  if (['approved', 'published', 'graded', 'present', 'active', 'completed'].includes(normalized)) {
    className += ' badge-success';
  } else if (['pending', 'upcoming', 'late'].includes(normalized)) {
    className += ' badge-warning';
  } else if (['rejected', 'absent', 'cancelled', 'closed', 'inactive'].includes(normalized)) {
    className += ' badge-danger';
  } else if (['live'].includes(normalized)) {
    className += ' badge-orange';
  } else {
    className += ' badge-info';
  }

  return (
    <span className={className}>
      {children || text || status}
    </span>
  );
};
