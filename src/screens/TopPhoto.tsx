import React from 'react';

interface Props {
  screen?: string;
  title: string;
  subtitle?: string;
  height?: number;
}

/** Cabeçalho limpo das telas (sem foto), como no modelo de design. */
export const TopPhoto: React.FC<Props> = ({ title, subtitle }) => (
  <header style={{ padding: 'calc(28px + env(safe-area-inset-top, 0px)) 20px 4px' }}>
    <h1 style={{ fontSize: 26, fontWeight: 600, lineHeight: 1.2, color: 'var(--text)' }}>{title}</h1>
    {subtitle && (
      <p style={{ fontSize: 14, marginTop: 4, color: 'var(--text-muted)' }}>{subtitle}</p>
    )}
  </header>
);
