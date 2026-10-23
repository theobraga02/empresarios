import React from 'react';
import { Check } from 'lucide-react';
import type { Habit } from '../types';

const AREA_COLORS: Record<string, string> = {
  corpo: '#5B6B3A',
  fe: '#B8652B',
  foco: '#7BA4FF',
  financas: '#F58A72',
  vendas: '#B79BFF',
  aprender: '#B8652B',
  sono: '#93A5C2',
  networking: '#F592B4',
};

interface Props {
  habit: Habit;
  onToggle: (id: string) => void;
}

export const HabitItem: React.FC<Props> = ({ habit, onToggle }) => {
  const color = AREA_COLORS[habit.area] || 'var(--caramelo)';
  return (
    <button
      onClick={() => onToggle(habit.id)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '14px 20px',
        width: '100%',
        textAlign: 'left',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        minHeight: 44,
      }}
      aria-label={`${habit.completed ? 'Desmarcar' : 'Marcar'} hábito: ${habit.title}`}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          flexShrink: 0,
          border: `2px solid ${habit.completed ? color : 'var(--creme-escuro)'}`,
          background: habit.completed ? color : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 200ms',
        }}
      >
        {habit.completed && <Check size={14} color="#fff" strokeWidth={3} />}
      </div>
      <div style={{ flex: 1 }}>
        <span
          style={{
            fontSize: 15,
            fontWeight: 500,
            color: habit.completed ? 'var(--text-muted)' : 'var(--espresso)',
            textDecoration: habit.completed ? 'line-through' : 'none',
            transition: 'all 200ms',
          }}
        >
          {habit.icon} {habit.title}
        </span>
        {habit.target && habit.unit && (
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            Meta: {habit.target} {habit.unit}
          </p>
        )}
      </div>
    </button>
  );
};
