import React, { useState } from 'react';
import { Modal } from './Modal';
import type { Habit } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSaveHabit: (habit: Habit) => void;
}

const HABIT_AREAS: Array<{ id: Habit['area']; label: string; icon: string }> = [
  { id: 'fe', label: 'Fé & Oração', icon: '📖' },
  { id: 'corpo', label: 'Corpo & Saúde', icon: '💪' },
  { id: 'foco', label: 'Foco & Trabalho', icon: '🎯' },
  { id: 'vendas', label: 'Vendas & Clientes', icon: '📞' },
  { id: 'financas', label: 'Finanças & Caixa', icon: '💰' },
  { id: 'aprender', label: 'Leitura & Estudo', icon: '📚' },
  { id: 'sono', label: 'Sono & Descanso', icon: '🌙' },
  { id: 'networking', label: 'Networking & Pessoas', icon: '🤝' },
];

export const NewHabitModal: React.FC<Props> = ({ isOpen, onClose, onSaveHabit }) => {
  const [title, setTitle] = useState('');
  const [area, setArea] = useState<Habit['area']>('foco');
  const [icon, setIcon] = useState('🎯');
  const [target, setTarget] = useState('1');
  const [unit, setUnit] = useState('');

  const handleSelectArea = (selectedArea: Habit['area']) => {
    setArea(selectedArea);
    const found = HABIT_AREAS.find(a => a.id === selectedArea);
    if (found) setIcon(found.icon);
  };

  const handleSave = () => {
    if (!title.trim()) return;
    const newHabit: Habit = {
      id: `h-${Date.now()}`,
      title: title.trim(),
      area,
      icon: icon.trim() || '⭐',
      completed: false,
      target: parseInt(target) || 1,
      unit: unit.trim() || undefined,
    };
    onSaveHabit(newHabit);
    setTitle('');
    setUnit('');
    onClose();
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    background: 'var(--creme-escuro)',
    border: 'none',
    borderRadius: 10,
    fontSize: 15,
    color: 'var(--espresso)',
    outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--text-muted)',
    marginBottom: 6,
    display: 'block',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  return (
    <Modal isOpen={isOpen} title="Criar Novo Hábito" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={labelStyle}>Nome do Hábito</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Ex: Ler 10 páginas, Beber 2L de água, Ligar p/ 5 clientes"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Área</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            {HABIT_AREAS.map(a => (
              <button
                key={a.id}
                type="button"
                onClick={() => handleSelectArea(a.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 12px',
                  borderRadius: 10,
                  border: 'none',
                  cursor: 'pointer',
                  background: area === a.id ? 'var(--caramelo)' : 'var(--creme-escuro)',
                  color: area === a.id ? '#fff' : 'var(--espresso)',
                  fontSize: 13,
                  fontWeight: 600,
                  textAlign: 'left',
                }}
              >
                <span>{a.icon}</span>
                <span>{a.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={labelStyle}>Meta Diária</label>
            <input
              type="number"
              value={target}
              onChange={e => setTarget(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Unidade (opcional)</label>
            <input
              value={unit}
              onChange={e => setUnit(e.target.value)}
              placeholder="Ex: min, páginas, ligações"
              style={inputStyle}
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          style={{
            marginTop: 10,
            padding: '14px',
            background: 'var(--caramelo)',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer',
            minHeight: 46,
          }}
        >
          Salvar Hábito
        </button>
      </div>
    </Modal>
  );
};
