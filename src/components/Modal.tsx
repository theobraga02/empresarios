import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<Props> = ({ isOpen, title, onClose, children }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(59,42,32,0.4)',
          backdropFilter: 'blur(4px)',
        }}
        onClick={onClose}
      />
      <div
        style={{
          position: 'relative',
          background: 'var(--creme)',
          borderRadius: '20px 20px 0 0',
          padding: '20px 20px 40px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 -4px 24px rgba(59,42,32,0.15)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--espresso)' }}>{title}</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 8,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Fechar"
          >
            <X size={20} color="var(--espresso)" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
