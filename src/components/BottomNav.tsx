import React from 'react';
import { Home, Calendar, PlusCircle, BarChart2, MoreHorizontal } from 'lucide-react';
import type { TabType } from '../types';

interface Props {
  active: TabType;
  onSelect: (tab: TabType) => void;
}

export const BottomNav: React.FC<Props> = ({ active, onSelect }) => {
  const left = [
    { id: 'hoje' as TabType, icon: Home, label: 'Hoje' },
    { id: 'agenda' as TabType, icon: Calendar, label: 'Agenda' },
  ];
  const right = [
    { id: 'painel' as TabType, icon: BarChart2, label: 'Painel' },
    { id: 'mais' as TabType, icon: MoreHorizontal, label: 'Mais' },
  ];

  const btnStyle = (id: TabType) => ({
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: 2,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: active === id ? 'var(--caramelo)' : 'var(--text-muted)',
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    padding: '4px 8px',
    transition: 'color 200ms',
  });

  return (
    <nav
      role="navigation"
      aria-label="Navegação principal"
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 440,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid var(--separator)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '6px 0 10px',
        zIndex: 100,
      }}
    >
      {left.map(item => (
        <button key={item.id} onClick={() => onSelect(item.id)} aria-label={item.label} style={btnStyle(item.id)}>
          <item.icon size={22} />
          <span style={{ fontSize: 10, fontWeight: active === item.id ? 600 : 400 }}>{item.label}</span>
        </button>
      ))}

      <button
        onClick={() => onSelect('registrar')}
        aria-label="Registrar"
        style={{
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: 'var(--caramelo)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          marginBottom: 8,
          boxShadow: '0 4px 14px rgba(184,101,43,0.45)',
          transition: 'transform 200ms',
        }}
      >
        <PlusCircle size={26} />
      </button>

      {right.map(item => (
        <button key={item.id} onClick={() => onSelect(item.id)} aria-label={item.label} style={btnStyle(item.id)}>
          <item.icon size={22} />
          <span style={{ fontSize: 10, fontWeight: active === item.id ? 600 : 400 }}>{item.label}</span>
        </button>
      ))}
    </nav>
  );
};
