import React, { useState } from 'react';
import { diaISO, moeda, serieEvolucao, variacaoSemana } from '../lib/score';
import type { ModoPeriodo } from '../lib/score';
import type { AppData } from '../types';

interface Props {
  data: AppData;
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

const MODOS: { id: ModoPeriodo; nome: string }[] = [
  { id: 'semana', nome: 'Semana' },
  { id: 'mes', nome: 'Mês' },
  { id: 'ano', nome: 'Ano' },
];

export const EvolutionBlock: React.FC<Props> = ({ data }) => {
  const [modo, setModo] = useState<ModoPeriodo>('semana');
  const serie = serieEvolucao(data, modo);
  const delta = variacaoSemana(data);

  const W = 320;
  const H = 120;
  const PAD = 8;
  const max = 10;
  const passo = serie.length > 1 ? (W - PAD * 2) / (serie.length - 1) : 0;
  const pts = serie.map((p, i) => ({
    x: PAD + i * passo,
    y: H - PAD - (p.valor / max) * (H - PAD * 2),
  }));
  const linha = pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const area = pts.length
    ? `${PAD},${H - PAD} ${linha} ${pts[pts.length - 1].x.toFixed(1)},${H - PAD}`
    : '';
  const temDados = serie.some(p => p.valor > 0);

  // Resumo dos últimos 7 dias, calculado só com registros reais
  const dias7 = new Set<string>();
  for (let i = 0; i < 7; i++) dias7.add(diaISO(i));
  const na7 = (d: string) => dias7.has(d);
  const diasTreino = new Set(data.workoutRecords.filter(r => na7(r.date)).map(r => r.date)).size;
  const minFoco = data.focusRecords.filter(r => na7(r.date)).reduce((a, r) => a + r.durationMinutes, 0);
  const saldo = data.incomeRecords
    .filter(r => na7(r.date))
    .reduce((a, r) => a + (r.type === 'entrada' ? r.amount : -r.amount), 0);
  const vendas = data.saleRecords.filter(r => na7(r.date)).length;
  const resumo = [
    { t: 'Treino', v: `${diasTreino}/7 dias` },
    { t: 'Foco', v: `${minFoco} min` },
    { t: 'Finanças', v: moeda(saldo) },
    { t: 'Vendas', v: String(vendas) },
  ];

  return (
    <div style={{ padding: '16px 20px 0' }}>
      <div
        role="tablist"
        style={{ display: 'flex', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 999, padding: 3 }}
      >
        {MODOS.map(m => (
          <button
            key={m.id}
            role="tab"
            aria-selected={modo === m.id}
            onClick={() => setModo(m.id)}
            style={{
              flex: 1,
              minHeight: 36,
              borderRadius: 999,
              border: 'none',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
              background: modo === m.id ? 'var(--surface-2)' : 'transparent',
              color: modo === m.id ? 'var(--text)' : 'var(--text-muted)',
            }}
          >
            {m.nome}
          </button>
        ))}
      </div>

      <section style={{ ...card, marginTop: 12, padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <p style={{ fontSize: 14, fontWeight: 600 }}>Sua evolução</p>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {delta === null ? 'sem comparação ainda' : `${delta > 0 ? '+' : ''}${delta}% vs. semana anterior`}
          </span>
        </div>
        {temDados ? (
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Gráfico da evolução" style={{ marginTop: 12 }}>
            <defs>
              <linearGradient id="evo" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F2F2F3" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#F2F2F3" stopOpacity="0" />
              </linearGradient>
            </defs>
            <polygon points={area} fill="url(#evo)" />
            <polyline points={linha} fill="none" stroke="#F2F2F3" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
            {pts.map((p, i) => (i === pts.length - 1 ? <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#F2F2F3" /> : null))}
          </svg>
        ) : (
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '20px 0 8px' }}>
            Registre treino, foco, leitura, sono, finanças ou vendas para ver sua evolução aqui.
          </p>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          {serie
            .filter((_, i) => modo === 'semana' || i % (modo === 'mes' ? 7 : 3) === 0)
            .map((p, i) => (
              <span key={i} style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>
                {p.rotulo}
              </span>
            ))}
        </div>
      </section>

      <p style={{ ...label, margin: '16px 0 8px' }}>Resumo da semana</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {resumo.map(r => (
          <div key={r.t} style={{ ...card, padding: '14px 16px' }}>
            <p style={label}>{r.t}</p>
            <p style={{ fontSize: 20, fontWeight: 600, marginTop: 6, letterSpacing: '-0.02em' }}>{r.v}</p>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 10 }}>
        Índice de evolução = áreas registradas no dia (de 7) na escala 0 a 10. Só conta o que você registrou.
      </p>
    </div>
  );
};
