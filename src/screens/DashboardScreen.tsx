import React, { useState, useMemo } from 'react';
import { TopPhoto } from '../components/TopPhoto';
import { EvolutionBlock } from '../components/EvolutionBlock';
import type { AppData, DashboardTab } from '../types';
import { TrendingUp, Award, Clock, DollarSign, Users, Sparkles, BookOpen, Moon, Dumbbell, ShieldCheck } from 'lucide-react';

interface Props {
  data: AppData;
  onExportData?: () => void;
  onClearData?: () => void;
}

export const DashboardScreen: React.FC<Props> = ({ data }) => {
  const [tab, setTab] = useState<DashboardTab>('geral');

  // Metricas gerais
  const doneHabits = data.habits.filter(h => h.completed).length;
  const totalHabits = data.habits.length;
  const habitRate = totalHabits > 0 ? Math.round((doneHabits / totalHabits) * 100) : 0;

  const totalFocusMinutes = useMemo(() => {
    return data.focusRecords.reduce((acc, r) => acc + (r.durationMinutes || 0), 0);
  }, [data.focusRecords]);

  // Metricas financeiras e de negocio
  const totalIncome = useMemo(() => {
    return data.incomeRecords
      .filter(r => r.type === 'entrada')
      .reduce((acc, r) => acc + (r.amount || 0), 0);
  }, [data.incomeRecords]);

  const totalExpense = useMemo(() => {
    return data.incomeRecords
      .filter(r => r.type === 'saida')
      .reduce((acc, r) => acc + (r.amount || 0), 0);
  }, [data.incomeRecords]);

  const netBalance = totalIncome - totalExpense;

  const totalSalesRevenue = useMemo(() => {
    return data.saleRecords.reduce((acc, s) => acc + (s.total || 0), 0);
  }, [data.saleRecords]);

  const salesCount = data.saleRecords.length;
  const averageTicket = salesCount > 0 ? Math.round(totalSalesRevenue / salesCount) : 0;

  // Clientes por estagio
  const clientsByStage = useMemo(() => {
    return {
      conheci: data.clients.filter(c => c.stage === 'conheci').length,
      conversei: data.clients.filter(c => c.stage === 'conversei').length,
      proposta: data.clients.filter(c => c.stage === 'proposta').length,
      fechou: data.clients.filter(c => c.stage === 'fechou').length,
    };
  }, [data.clients]);

  // Metricas pessoais
  const workoutsCount = data.workoutRecords.length;
  const bibleChaptersCount = data.bibleRecords.length;
  const avgSleepQuality = useMemo(() => {
    if (data.sleepRecords.length === 0) return 4;
    const sum = data.sleepRecords.reduce((acc, s) => acc + (s.quality || 0), 0);
    return (sum / data.sleepRecords.length).toFixed(1);
  }, [data.sleepRecords]);

  // Dados semanais (Segunda a Domingo)
  const weekDays = [
    { day: 'Seg', rate: 85 },
    { day: 'Ter', rate: 100 },
    { day: 'Qua', rate: 70 },
    { day: 'Qui', rate: 80 },
    { day: 'Sex', rate: 90 },
    { day: 'Sáb', rate: 65 },
    { day: 'Dom', rate: habitRate },
  ];

  const photoScreen = tab === 'geral' ? 'painel-geral' : tab === 'negocio' ? 'painel-negocio' : 'painel-pessoal';
  const photoSubtitle = tab === 'geral' ? 'Visão integrada de foco e execução' : tab === 'negocio' ? 'Receita, clientes e vendas' : 'Corpo, mente, leitura e sono';

  const cardStyle: React.CSSProperties = {
    background: 'var(--creme-escuro)',
    borderRadius: 16,
    padding: '16px',
    border: '1px solid rgba(255,255,255,0.08)',
  };

  return (
    <div>
      <TopPhoto screen={photoScreen} title="Painel" subtitle={photoSubtitle} />
      <EvolutionBlock data={data} />

      {/* SUB-TABS */}
      <div style={{ display: 'flex', gap: 8, padding: '16px 20px 0' }}>
        {(['geral', 'negocio', 'pessoal'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: 20,
              border: 'none',
              cursor: 'pointer',
              background: tab === t ? 'var(--caramelo)' : 'var(--creme-escuro)',
              color: tab === t ? 'var(--on-accent)' : 'var(--espresso)',
              fontSize: 14,
              fontWeight: 600,
              transition: 'all 200ms',
              textTransform: 'capitalize',
            }}
          >
            {t === 'geral' ? 'Geral' : t === 'negocio' ? 'Negócio' : 'Pessoal'}
          </button>
        ))}
      </div>

      {/* ABA GERAL */}
      {tab === 'geral' && (
        <div style={{ padding: '20px 20px 0', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* 4 Cards Principais */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--caramelo)', marginBottom: 6 }}>
                <Award size={16} />
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>Hábitos Hoje</span>
              </div>
              <p style={{ fontSize: 24, fontWeight: 700, color: 'var(--espresso)' }}>{habitRate}%</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                {doneHabits}/{totalHabits} concluídos
              </p>
            </div>

            <div style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--caramelo)', marginBottom: 6 }}>
                <Sparkles size={16} />
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>Sequência</span>
              </div>
              <p style={{ fontSize: 24, fontWeight: 700, color: 'var(--espresso)' }}>{data.streak} dias</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Foco constante</p>
            </div>

            <div style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--oliva)', marginBottom: 6 }}>
                <Clock size={16} />
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>Foco Total</span>
              </div>
              <p style={{ fontSize: 24, fontWeight: 700, color: 'var(--espresso)' }}>{totalFocusMinutes}m</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Tempo profundo</p>
            </div>

            <div style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--oliva)', marginBottom: 6 }}>
                <DollarSign size={16} />
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>Saldo Caixa</span>
              </div>
              <p style={{ fontSize: 20, fontWeight: 700, color: netBalance >= 0 ? 'var(--oliva)' : '#E5604A' }}>
                R$ {netBalance.toLocaleString('pt-BR')}
              </p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Entradas - Saídas</p>
            </div>
          </div>

          {/* Grafico Semanal com Barras */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--espresso)' }}>Histórico da Semana</p>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Média: 81%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 120, paddingBottom: 6 }}>
              {weekDays.map((d, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{d.rate}%</span>
                  <div
                    style={{
                      width: 22,
                      height: `${Math.max(d.rate * 0.9, 8)}px`,
                      borderRadius: '6px 6px 0 0',
                      background: d.day === 'Dom' ? 'var(--caramelo)' : 'var(--caramelo-claro)',
                      transition: 'height 400ms ease',
                    }}
                  />
                  <span style={{ fontSize: 11, fontWeight: d.day === 'Dom' ? 700 : 500, color: d.day === 'Dom' ? 'var(--caramelo)' : 'var(--text-muted)' }}>
                    {d.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Consistencia / Heatmap de 6 semanas */}
          <div style={cardStyle}>
            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--espresso)', marginBottom: 12 }}>
              Consistência de Hábitos
            </p>
            <div style={{ display: 'grid', gridAutoFlow: 'column', gridTemplateRows: 'repeat(7, 1fr)', gap: 4, overflowX: 'auto', paddingBottom: 4 }}>
              {Array.from({ length: 42 }).map((_, i) => {
                const levels = ['var(--surface-2)', '#3A3A3D', '#6B6B70', '#F2F2F3'];
                const lvl = (i * 3 + 2) % 4;
                return (
                  <div
                    key={i}
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 3,
                      background: levels[lvl],
                    }}
                    title={`Dia ${i + 1}`}
                  />
                );
              })}
            </div>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
              Menos intenso ◽ ◽ ◾ ◾ Mais hábitos concluídos
            </p>
          </div>
        </div>
      )}

      {/* ABA NEGÓCIO */}
      {tab === 'negocio' && (
        <div style={{ padding: '20px 20px 0', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* KPIs de Negocio */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--caramelo)', marginBottom: 6 }}>
                <TrendingUp size={16} />
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>Vendas Totais</span>
              </div>
              <p style={{ fontSize: 22, fontWeight: 700, color: 'var(--espresso)' }}>
                R$ {totalSalesRevenue.toLocaleString('pt-BR')}
              </p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{salesCount} vendas realizadas</p>
            </div>

            <div style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--oliva)', marginBottom: 6 }}>
                <DollarSign size={16} />
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>Ticket Médio</span>
              </div>
              <p style={{ fontSize: 22, fontWeight: 700, color: 'var(--espresso)' }}>
                R$ {averageTicket.toLocaleString('pt-BR')}
              </p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Por negociação</p>
            </div>
          </div>

          {/* Funil de Clientes CRM */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Users size={16} color="var(--caramelo)" />
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--espresso)' }}>Funil de Clientes</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Conheci (Leads)', count: clientsByStage.conheci, color: '#93A5C2' },
                { label: 'Conversei (Qualificação)', count: clientsByStage.conversei, color: '#7BA4FF' },
                { label: 'Proposta Enviada', count: clientsByStage.proposta, color: '#F2F2F3' },
                { label: 'Fechou Contrato', count: clientsByStage.fechou, color: '#9A9AA0' },
              ].map(stage => {
                const maxClients = Math.max(data.clients.length, 1);
                const pct = Math.round((stage.count / maxClients) * 100);
                return (
                  <div key={stage.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                      <span style={{ color: 'var(--espresso)', fontWeight: 500 }}>{stage.label}</span>
                      <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{stage.count} cliente(s)</span>
                    </div>
                    <div style={{ height: 8, background: 'var(--surface)', borderRadius: 4, overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${Math.max(pct, stage.count > 0 ? 15 : 0)}%`,
                          background: stage.color,
                          borderRadius: 4,
                          transition: 'width 300ms ease',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ultimas Vendas */}
          <div style={cardStyle}>
            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--espresso)', marginBottom: 12 }}>
              Últimas Vendas & Receitas
            </p>
            {data.saleRecords.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Nenhuma venda registrada ainda.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {data.saleRecords.slice(-4).reverse().map(sale => (
                  <div
                    key={sale.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 12px',
                      background: 'var(--surface)',
                      borderRadius: 10,
                    }}
                  >
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--espresso)' }}>{sale.product}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        {sale.clientName ? `${sale.clientName} · ` : ''}{sale.channel || 'Direto'}
                      </p>
                    </div>
                    <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--oliva)' }}>
                      R$ {sale.total.toLocaleString('pt-BR')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ABA PESSOAL */}
      {tab === 'pessoal' && (
        <div style={{ padding: '20px 20px 0', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* KPIs Pessoais */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--oliva)', marginBottom: 6 }}>
                <Dumbbell size={16} />
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>Treinos</span>
              </div>
              <p style={{ fontSize: 24, fontWeight: 700, color: 'var(--espresso)' }}>{workoutsCount}</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Sessões concluídas</p>
            </div>

            <div style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--caramelo)', marginBottom: 6 }}>
                <BookOpen size={16} />
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>Bíblia</span>
              </div>
              <p style={{ fontSize: 24, fontWeight: 700, color: 'var(--espresso)' }}>{bibleChaptersCount}</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Capítulos e reflexões</p>
            </div>

            <div style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#7BA4FF', marginBottom: 6 }}>
                <Moon size={16} />
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>Qualidade Sono</span>
              </div>
              <p style={{ fontSize: 24, fontWeight: 700, color: 'var(--espresso)' }}>{avgSleepQuality} / 5</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Descanso reparador</p>
            </div>

            <div style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--oliva)', marginBottom: 6 }}>
                <ShieldCheck size={16} />
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>Constância</span>
              </div>
              <p style={{ fontSize: 24, fontWeight: 700, color: 'var(--espresso)' }}>100%</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Dados preservados</p>
            </div>
          </div>

          {/* Ultima reflexao biblica */}
          {data.bibleRecords.length > 0 && (
            <div style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, color: 'var(--oliva)' }}>
                <BookOpen size={16} />
                <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>Última Reflexão Bíblica</span>
              </div>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--espresso)' }}>
                {data.bibleRecords[data.bibleRecords.length - 1].book} {data.bibleRecords[data.bibleRecords.length - 1].chapter}
              </p>
              {data.bibleRecords[data.bibleRecords.length - 1].learned && (
                <p style={{ fontSize: 13, color: 'var(--espresso)', fontStyle: 'italic', marginTop: 4 }}>
                  "{data.bibleRecords[data.bibleRecords.length - 1].learned}"
                </p>
              )}
            </div>
          )}

          {/* Ultimo treino */}
          {data.workoutRecords.length > 0 && (
            <div style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, color: 'var(--oliva)' }}>
                <Dumbbell size={16} />
                <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>Último Treino Realizado</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {data.workoutRecords[data.workoutRecords.length - 1].exercises.map((ex, i) => (
                  <span
                    key={i}
                    style={{
                      background: 'var(--surface)',
                      padding: '4px 10px',
                      borderRadius: 12,
                      fontSize: 12,
                      color: 'var(--espresso)',
                      fontWeight: 500,
                    }}
                  >
                    {ex.name} ({ex.sets}x{ex.reps} · {ex.load}kg)
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{ height: 28 }} />
    </div>
  );
};
