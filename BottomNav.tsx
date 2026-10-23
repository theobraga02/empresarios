import React from 'react';
import { Home, BarChart2, PlusCircle, BookOpen } from 'lucide-react';
import type { TabType } from '../types';

interface Props {
  active: TabType;
  onSelect: (tab: TabType) => void;
}

const ITEMS = [
  { id: 'hoje' as TabType, icon: Home, label: 'Hoje' },
  { id: 'painel' as TabType, icon: BarChart2, label: 'Painel' },
  { id: 'registrar' as TabType, icon: PlusCircle, label: 'Registrar' },
  { id: 'aprender' as TabType, icon: BookOpen, label: 'Aprender' },
];

export const BottomNav: React.FC<Props> = ({ active, onSelect }) => (
  <nav
    aria-label="Navegação principal"
    style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 440,
      background: 'rgba(11,11,12,0.94)',
      backdropFilter: 'blur(14px)',
      borderTop: '1px solid var(--line)',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '8px 0 calc(10px + env(safe-area-inset-bottom, 0px))',
      zIndex: 100,
    }}
  >
    {ITEMS.map(item => {
      const on = active === item.id;
      return (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          aria-label={item.label}
          aria-current={on ? 'page' : undefined}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: on ? 'var(--text)' : 'var(--text-muted)',
            minWidth: 64,
            minHeight: 44,
            justifyContent: 'center',
            transition: 'color 200ms',
          }}
        >
          <item.icon size={22} strokeWidth={on ? 2.2 : 1.7} />
          <span style={{ fontSize: 10.5, fontWeight: on ? 600 : 400 }}>{item.label}</span>
          <span
            style={{
              width: 16,
              height: 2,
              borderRadius: 2,
              background: on ? 'var(--accent)' : 'transparent',
            }}
          />
        </button>
      );
    })}
  </nav>
);
