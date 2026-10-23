import React, { useState } from 'react';
import { BookOpen, ChevronRight, Plus, CheckCircle2, Users, Target } from 'lucide-react';
import { ProgressRing } from '../components/ProgressRing';
import { HabitItem } from '../components/HabitItem';
import { SectionDivider } from '../components/SectionDivider';
import { BIBLE_VERSES } from '../data/initialData';
import { diaISO, moeda, notaDeHoje } from '../lib/score';
import type { AppData } from '../types';

interface Props {
  data: AppData;
  onToggleHabit: (id: string) => void;
  onNavigate: (tab: any) => void;
  onOpenNewHabit?: () => void;
}

const card: React.CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid var(--line)',
  borderRadius: 16,
};

const label: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
};

export const TodayScreen: React.FC<Props> = ({ data, onToggleHabit, onNavigate, onOpenNewHabit }) => {
  const [bibleRead, setBibleRead] = useState(false);
  const today = new Date();
  const hoje = diaISO();
  const dayOfYear = Math.floor((Date.now() - new Date(today.getFullYear(), 0, 0).getTime()) / 86_400_000);
  const verse = BIBLE_VERSES[dayOfYear % BIBLE_VERSES.length];
  const dateStr = today.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

  const doneCount = data.habits.filter(h => h.completed).length;
  const totalCount = data.habits.length;
  const metaDia = Math.min(3, totalCount);
  const progressoDesafio = Math.min(doneCount, metaDia);
  const pctDesafio = metaDia > 0 ? (progressoDesafio / metaDia) * 100 : 0;

  const treinoHoje = data.workoutRecords.filter(r => r.date === hoje).length > 0 ? 1 : 0;
  const saldoHoje = data.incomeRecords
    .filter(r => r.date === hoje)
    .reduce((acc, r) => acc + (r.type === 'entrada' ? r.amount : -r.amount), 0);
  const vendasHoje = data.saleRecords.filter(r => r.date === hoje).length;
  const nota = notaDeHoje(data);

  const mensagem =
    nota >= 8
      ? 'Você está no caminho certo! Continue mantendo o foco e a disciplina.'
      : nota >= 5
        ? 'Bom ritmo. Falta pouco para fechar o dia forte.'
        : 'Comece com um passo pequeno. Um dia imperfeito também conta.';

  const nextAppointment = data.appointments
    .filter(a => a.date === hoje)
    .sort((a, b) => a.time.localeCompare(b.time))[0];

  const stats = [
    { titulo: 'Hábitos', valor: `${doneCount}/${totalCount}` },
    { titulo: 'Treino', valor: `${treinoHoje}/1` },
    { titulo: 'Finanças', valor: moeda(saldoHoje) },
    { titulo: 'Vendas', valor: String(vendasHoje) },
  ];

  return (
    <div style={{ paddingBottom: 24 }}>
      <header
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: 'calc(28px + env(safe-area-inset-top, 0px)) 20px 0',
        }}
      >
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 600, lineHeight: 1.2 }}>Hoje</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 2 }}>
            {dateStr.charAt(0).toUpperCase() + dateStr.slice(1)}
          </p>
        </div>
        <button
          onClick={() => onNavigate('mais')}
          aria-label="Perfil e configurações"
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            color: 'var(--text)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Users size={17} />
        </button>
      </header>

      {/* Desafio do dia */}
      <section style={{ ...card, margin: '20px 20px 0', padding: 16 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: 'var(--surface-2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Target size={16} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 600 }}>Desafio do dia</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
              {metaDia === 0
                ? 'Crie seu primeiro hábito para começar.'
                : `Conclua ${metaDia} ${metaDia === 1 ? 'hábito' : 'hábitos'} hoje.`}
            </p>
          </div>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {progressoDesafio}/{metaDia}
          </span>
        </div>
        <div style={{ height: 4, borderRadius: 4, background: 'var(--surface-2)', marginTop: 14 }}>
          <div
            style={{
              width: `${pctDesafio}%`,
              height: '100%',
              borderRadius: 4,
              background: 'var(--accent)',
              transition: 'width 600ms cubic-bezier(0.4,0,0.2,1)',
            }}
          />
        </div>
      </section>

      {/* Indicadores */}
      <section
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, margin: '12px 20px 0' }}
      >
        {stats.map(s => (
          <div key={s.titulo} style={{ ...card, padding: '14px 16px' }}>
            <p style={label}>{s.titulo}</p>
            <p style={{ fontSize: 22, fontWeight: 600, marginTop: 6, letterSpacing: '-0.02em' }}>{s.valor}</p>
          </div>
        ))}
      </section>

      {/* Nota de hoje */}
      <section style={{ ...card, margin: '12px 20px 0', padding: 16 }}>
        <p style={label}>Sua nota de hoje</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 12 }}>
          <ProgressRing percent={nota * 10} size={84} strokeWidth={6}>
            <span style={{ fontSize: 24, fontWeight: 600 }}>{nota.toFixed(1).replace('.', ',')}</span>
          </ProgressRing>
          <p style={{ flex: 1, fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.5 }}>{mensagem}</p>
        </div>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 12, opacity: 0.8 }}>
          Metade vem dos hábitos concluídos, metade das áreas que você registrou hoje.
        </p>
      </section>

      {/* Hábitos */}
      <section style={{ ...card, margin: '12px 20px 0', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px 8px' }}>
          <p style={label}>Hábitos de hoje</p>
          {onOpenNewHabit && (
            <button
              onClick={onOpenNewHabit}
              aria-label="Adicionar novo hábito"
              style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                background: 'var(--surface-2)',
                border: 'none',
                color: 'var(--text)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Plus size={16} />
            </button>
          )}
        </div>
        {data.habits.length === 0 ? (
          <p style={{ padding: '8px 16px 20px', fontSize: 14, color: 'var(--text-muted)' }}>
            Nenhum hábito cadastrado ainda.
          </p>
        ) : (
          data.habits.map((habit, i) => (
            <React.Fragment key={habit.id}>
              <SectionDivider />
              <HabitItem habit={habit} onToggle={onToggleHabit} />
            </React.Fragment>
          ))
        )}
      </section>

      {/* Versículo */}
      <section style={{ ...card, margin: '12px 20px 0', padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <BookOpen size={15} color="var(--mid)" />
          <p style={label}>Bíblia do dia</p>
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.6, fontStyle: 'italic' }}>"{verse.text}"</p>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
          {verse.reference} · {verse.translation}
        </p>
        <button
          onClick={() => setBibleRead(true)}
          disabled={bibleRead}
          style={{
            marginTop: 12,
            padding: '8px 16px',
            background: bibleRead ? 'var(--surface-2)' : 'var(--accent)',
            color: bibleRead ? 'var(--text-muted)' : 'var(--on-accent)',
            border: 'none',
            borderRadius: 999,
            fontSize: 13,
            fontWeight: 600,
            cursor: bibleRead ? 'default' : 'pointer',
            minHeight: 36,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <CheckCircle2 size={15} /> {bibleRead ? 'Lida hoje' : 'Marcar como lida'}
        </button>
      </section>

      {nextAppointment && (
        <button
          onClick={() => onNavigate('agenda')}
          style={{
            ...card,
            margin: '12px 20px 0',
            padding: '14px 16px',
            width: 'calc(100% - 40px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            textAlign: 'left',
            cursor: 'pointer',
            color: 'var(--text)',
          }}
        >
          <div>
            <p style={label}>Próximo compromisso</p>
            <p style={{ fontSize: 15, fontWeight: 500, marginTop: 6 }}>{nextAppointment.title}</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
              {nextAppointment.time}
              {nextAppointment.location ? ` · ${nextAppointment.location}` : ''}
            </p>
          </div>
          <ChevronRight size={18} color="var(--text-muted)" />
        </button>
      )}
    </div>
  );
};
