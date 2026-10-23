import React, { useState } from 'react';
import { BookOpen, ChevronRight, Target, Plus, CheckCircle2 } from 'lucide-react';
import { TopPhoto } from '../components/TopPhoto';
import { ProgressRing } from '../components/ProgressRing';
import { HabitItem } from '../components/HabitItem';
import { SectionDivider } from '../components/SectionDivider';
import { BIBLE_VERSES } from '../data/initialData';
import type { AppData } from '../types';

interface Props {
  data: AppData;
  onToggleHabit: (id: string) => void;
  onNavigate: (tab: any) => void;
  onOpenNewHabit?: () => void;
}

export const TodayScreen: React.FC<Props> = ({ data, onToggleHabit, onNavigate, onOpenNewHabit }) => {
  const [bibleRead, setBibleRead] = useState(false);
  const today = new Date();
  const dayOfYear = Math.floor((Date.now() - new Date(today.getFullYear(), 0, 0).getTime()) / 86_400_000);
  const verse = BIBLE_VERSES[dayOfYear % BIBLE_VERSES.length];
  const hour = today.getHours();
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';
  const dateStr = today.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  const doneCount = data.habits.filter(h => h.completed).length;
  const totalCount = data.habits.length;
  const percent = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
  const todayStr = today.toISOString().slice(0, 10);
  const nextAppointment = data.appointments
    .filter(a => a.date === todayStr)
    .sort((a, b) => a.time.localeCompare(b.time))[0];

  return (
    <div>
      <TopPhoto
        screen="hoje"
        title={greeting + '!'}
        subtitle={dateStr.charAt(0).toUpperCase() + dateStr.slice(1)}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 20px 0' }}>
        <ProgressRing percent={percent} size={76}>
          <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--caramelo)' }}>{percent}%</span>
        </ProgressRing>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--espresso)' }}>
            {doneCount} de {totalCount} hábitos concluídos
          </p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
            {data.streak > 0 ? `🔥 ${data.streak} dias seguidos com foco` : 'Comece hoje com um passo pequeno'}
          </p>
        </div>
        {onOpenNewHabit && (
          <button
            onClick={onOpenNewHabit}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'var(--creme-escuro)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--espresso)',
            }}
            title="Adicionar novo hábito"
          >
            <Plus size={18} />
          </button>
        )}
      </div>

      <div
        style={{
          margin: '20px 20px 0',
          padding: 16,
          background: 'var(--creme-escuro)',
          borderRadius: 14,
          border: '1px solid rgba(59,42,32,0.06)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <BookOpen size={16} color="var(--oliva)" />
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--oliva)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Bíblia do dia
          </span>
        </div>
        <p style={{ fontSize: 14, color: 'var(--espresso)', lineHeight: 1.6, fontStyle: 'italic' }}>
          "{verse.text}"
        </p>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6, fontWeight: 500 }}>
          {verse.reference}
        </p>
        {!bibleRead ? (
          <button
            onClick={() => setBibleRead(true)}
            style={{
              marginTop: 12,
              padding: '8px 16px',
              background: 'var(--oliva)',
              color: '#fff',
              border: 'none',
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              minHeight: 36,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <CheckCircle2 size={15} /> Marcar como lida
          </button>
        ) : (
          <p style={{ marginTop: 10, fontSize: 13, color: 'var(--oliva)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            <CheckCircle2 size={16} /> Lida hoje! Que a Palavra ilumine seu dia.
          </p>
        )}
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px 12px' }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Hábitos de hoje
          </p>
          <span style={{ fontSize: 12, color: 'var(--caramelo)', fontWeight: 600 }}>
            {doneCount}/{totalCount}
          </span>
        </div>
        <SectionDivider />
        {data.habits.length === 0 ? (
          <div style={{ padding: '24px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: 14 }}>Nenhum hábito cadastrado ainda.</p>
            {onOpenNewHabit && (
              <button
                onClick={onOpenNewHabit}
                style={{
                  marginTop: 10,
                  padding: '8px 16px',
                  borderRadius: 16,
                  border: 'none',
                  background: 'var(--caramelo)',
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                + Criar primeiro hábito
              </button>
            )}
          </div>
        ) : (
          data.habits.map((habit, i) => (
            <React.Fragment key={habit.id}>
              <HabitItem habit={habit} onToggle={onToggleHabit} />
              {i < data.habits.length - 1 && <SectionDivider />}
            </React.Fragment>
          ))
        )}
      </div>

      {nextAppointment && (
        <div style={{ marginTop: 20 }}>
          <SectionDivider />
          <div
            onClick={() => onNavigate('agenda')}
            style={{
              padding: '16px 20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                Próximo compromisso
              </p>
              <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--espresso)' }}>{nextAppointment.title}</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
                {nextAppointment.time}{nextAppointment.location ? ` · ${nextAppointment.location}` : ''}
              </p>
            </div>
            <ChevronRight size={18} color="var(--text-muted)" />
          </div>
        </div>
      )}

      {data.businessProfile.productName && (
        <div style={{ marginTop: 12 }}>
          <SectionDivider />
          <div
            onClick={() => onNavigate('negocio')}
            style={{ padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <Target size={14} color="var(--caramelo)" />
                <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Foco do Negócio
                </p>
              </div>
              <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--espresso)' }}>
                {data.businessProfile.productName}
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
                {data.businessProfile.clientPain || 'Organizar processos e prospectar novos clientes'}
              </p>
            </div>
            <ChevronRight size={18} color="var(--text-muted)" />
          </div>
        </div>
      )}

      <div style={{ height: 32 }} />
    </div>
  );
};
