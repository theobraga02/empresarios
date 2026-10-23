import React, { useState } from 'react';
import { User, Briefcase, Heart, Info } from 'lucide-react';

type AppMode = 'equilibrio' | 'negocio';

interface ProfileScreenProps {
  onClose: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onClose }) => {
  const [appMode, setAppMode] = useState<AppMode>(() => {
    return (localStorage.getItem('reluz_mode') as AppMode) || 'negocio';
  });

  const [reminderEnabled, setReminderEnabled] = useState<boolean>(() => {
    return localStorage.getItem('reluz_reminder') === 'true';
  });

  const [reminderTime, setReminderTime] = useState<string>(() => {
    return localStorage.getItem('reluz_reminder_time') || '08:00';
  });

  const handleModeChange = (mode: AppMode) => {
    setAppMode(mode);
    localStorage.setItem('reluz_mode', mode);
  };

  const handleReminderToggle = () => {
    const next = !reminderEnabled;
    setReminderEnabled(next);
    localStorage.setItem('reluz_reminder', String(next));
  };

  const handleReminderTimeChange = (t: string) => {
    setReminderTime(t);
    localStorage.setItem('reluz_reminder_time', t);
  };

  return (
    <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '28px', color: '#F3ECDD' }}>Perfil</h1>
        <button
          onClick={onClose}
          style={{ background: 'transparent', border: 'none', color: '#F0AE45', fontSize: '14px', fontWeight: 600, cursor: 'pointer', padding: '8px', minHeight: '44px' }}
        >
          Fechar
        </button>
      </header>

      {/* Avatar placeholder */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#1A2822', border: '2px solid #F0AE45', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <User size={26} color="#F0AE45" />
        </div>
        <div>
          <p style={{ fontSize: '16px', fontWeight: 600, color: '#F3ECDD', margin: 0 }}>Empreendedor</p>
          <p style={{ fontSize: '12px', color: '#A9B7AD', margin: 0 }}>Conta local · dados privados no dispositivo</p>
        </div>
      </div>

      {/* Modo do app */}
      <section style={{ backgroundColor: '#121C17', border: '1px solid #22312A', borderRadius: '22px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <h2 style={{ fontSize: '17px', color: '#F3ECDD', margin: 0 }}>Modo do aplicativo</h2>
        <p style={{ fontSize: '12px', color: '#A9B7AD', margin: 0 }}>Escolha o foco principal. Você pode trocar a qualquer momento, a mesma conta e o mesmo anel do dia.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { id: 'negocio' as AppMode, icon: Briefcase, label: 'Construir meu negócio', sub: 'Foco em vendas, caixa, foco e aprendizado empresarial.' },
            { id: 'equilibrio' as AppMode, icon: Heart, label: 'Cuidar de mim', sub: 'Foco em sono, corpo, fé, paz e saúde emocional.' }
          ].map((m) => {
            const Icon = m.icon;
            const active = appMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => handleModeChange(m.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px',
                  backgroundColor: active ? 'rgba(240,174,69,0.1)' : '#1A2822',
                  border: active ? '1px solid #F0AE45' : '1px solid #22312A',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ width: '38px', height: '38px', borderRadius: '12px', backgroundColor: active ? 'rgba(240,174,69,0.15)' : '#121C17', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={20} color={active ? '#F0AE45' : '#A9B7AD'} />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: active ? '#F0AE45' : '#F3ECDD' }}>{m.label}</p>
                  <p style={{ margin: 0, fontSize: '11px', color: '#A9B7AD' }}>{m.sub}</p>
                </div>
                {active && <div style={{ marginLeft: 'auto', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F0AE45', flexShrink: 0 }} />}
              </button>
            );
          })}
        </div>
      </section>

      {/* Lembrete único diário */}
      <section style={{ backgroundColor: '#121C17', border: '1px solid #22312A', borderRadius: '22px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <h2 style={{ fontSize: '17px', color: '#F3ECDD', margin: 0 }}>Lembrete diário</h2>
        <p style={{ fontSize: '12px', color: '#A9B7AD', margin: 0 }}>
          Máximo de 1 notificação por dia, no horário que você escolher. Nunca texto de culpa.
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: '#F3ECDD' }}>Ativar lembrete</span>
          <button
            onClick={handleReminderToggle}
            aria-label={reminderEnabled ? 'Desativar lembrete' : 'Ativar lembrete'}
            style={{
              width: '48px',
              height: '28px',
              borderRadius: '14px',
              backgroundColor: reminderEnabled ? '#F0AE45' : '#22312A',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              transition: 'background-color 0.2s'
            }}
          >
            <div style={{
              position: 'absolute',
              top: '3px',
              left: reminderEnabled ? '23px' : '3px',
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              backgroundColor: '#F3ECDD',
              transition: 'left 0.2s'
            }} />
          </button>
        </div>

        {reminderEnabled && (
          <div>
            <label htmlFor="reminder-time" style={{ display: 'block', fontSize: '12px', color: '#A9B7AD', marginBottom: '6px' }}>
              Horário do lembrete
            </label>
            <input
              id="reminder-time"
              type="time"
              value={reminderTime}
              onChange={(e) => handleReminderTimeChange(e.target.value)}
              style={{ backgroundColor: '#0A100D', border: '1px solid #22312A', borderRadius: '12px', padding: '10px 14px', color: '#F3ECDD', fontSize: '16px', width: '100%', outline: 'none' }}
            />
          </div>
        )}
      </section>

      {/* Avisos legais */}
      <section style={{ backgroundColor: '#121C17', border: '1px solid #22312A', borderRadius: '20px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Info size={16} color="#A9B7AD" />
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#F3ECDD' }}>Avisos Legais</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', color: '#A9B7AD', lineHeight: 1.4 }}>
          <p style={{ margin: 0 }}>• Este app não é serviço médico, psicológico nem consultoria financeira.</p>
          <p style={{ margin: 0 }}>• Conteúdo de investimentos é educativo: não é recomendação de compra ou venda (CVM).</p>
          <p style={{ margin: 0 }}>• Textos bíblicos de tradução de domínio público (Almeida), sempre com referência.</p>
          <p style={{ margin: 0 }}>• Apoio emocional: CVV 188 (gratuito, 24h).</p>
          <p style={{ margin: 0 }}>• Termos de Uso e Política de Privacidade em validação jurídica pré-lançamento.</p>
        </div>
      </section>

      <div style={{ textAlign: 'center', fontSize: '11px', color: '#44564E', paddingBottom: '20px' }}>
        Reluz Empresário v1.0 · Dados 100% locais · Sem anúncios
      </div>
    </div>
  );
};
