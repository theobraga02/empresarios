import React, { useState } from 'react';
import {
  Users,
  Calendar,
  Briefcase,
  BookOpen,
  PlusCircle,
  Download,
  Trash2,
  ShieldCheck,
  ChevronRight,
  Info,
  Bell,
  MapPin,
  ExternalLink,
  Phone,
  Image,
} from 'lucide-react';
import { TopPhoto } from '../components/TopPhoto';
import { SectionDivider } from '../components/SectionDivider';
import { exportData, clearData, getDefaultData } from '../data/db';
import { SCREEN_IMAGES } from '../data/imagens';
import type { AppData } from '../types';

interface Props {
  data: AppData;
  update: (fn: (prev: AppData) => AppData) => void;
  onNavigate: (tab: any) => void;
  onOpenNewHabit: () => void;
}

export const MoreScreen: React.FC<Props> = ({ data, update, onNavigate, onOpenNewHabit }) => {
  const [showCredits, setShowCredits] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    return 'Notification' in window && Notification.permission === 'granted';
  });
  const [isEditingCity, setIsEditingCity] = useState(false);
  const [cityInput, setCityInput] = useState(data.businessProfile.city || 'São Paulo');

  const handleExport = () => {
    exportData(data);
  };

  const handleClear = () => {
    if (window.confirm('Tem certeza de que deseja apagar todos os seus dados? Esta ação não pode ser desfeita.')) {
      clearData();
      update(() => getDefaultData());
      alert('Dados apagados e redefinidos com sucesso.');
    }
  };

  const handleToggleNotifications = async () => {
    if (!('Notification' in window)) {
      alert('Seu navegador atual não suporta notificações web.');
      return;
    }

    if (Notification.permission === 'granted') {
      new Notification('Reluz Empresário ☕', {
        body: 'Notificações estão ativas! Você receberá lembretes gentis de hábitos e follow-up.',
        icon: '/favicon.svg',
      });
      setNotificationsEnabled(true);
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification('Reluz Empresário ☕', {
          body: 'Notificações ativadas com sucesso! Vamos juntos cuidar dos seus hábitos e negócios.',
          icon: '/favicon.svg',
        });
        setNotificationsEnabled(true);
      } else {
        setNotificationsEnabled(false);
      }
    } else {
      alert('As notificações foram bloqueadas no navegador. Para ativar, permita nas configurações do seu navegador.');
    }
  };

  const handleSaveCity = () => {
    const trimmed = cityInput.trim() || 'São Paulo';
    update(prev => ({
      ...prev,
      businessProfile: {
        ...prev.businessProfile,
        city: trimmed,
      },
    }));
    setIsEditingCity(false);
  };

  const menuItems = [
    {
      id: 'agenda',
      icon: Calendar,
      label: 'Agenda',
      desc: 'Compromissos e eventos do mês',
      action: () => onNavigate('agenda'),
    },
    {
      id: 'rede',
      icon: Users,
      label: 'Rede',
      desc: 'Eventos da sua cidade e preparação de abordagem com IA',
      action: () => onNavigate('rede'),
    },
    {
      id: 'negocio',
      icon: Briefcase,
      label: 'Meu Negócio',
      desc: 'Produto, cliente buscado e funil de vendas',
      action: () => onNavigate('negocio'),
    },
    {
      id: 'aprender',
      icon: BookOpen,
      label: 'Aprender',
      desc: 'Trilhas, ações de 5 min e cursos gratuitos',
      action: () => onNavigate('aprender'),
    },
  ];

  return (
    <div>
      <TopPhoto screen="rede" title="Mais" subtitle="Ferramentas, configurações e dados" />

      {/* MÓDULOS ESPECÍFICOS */}
      <div style={{ padding: '20px 20px 0' }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
          Módulos
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={item.action}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '14px 16px',
                background: 'var(--creme-escuro)',
                borderRadius: 14,
                border: '1px solid rgba(255,255,255,0.08)',
                cursor: 'pointer',
                textAlign: 'left',
                minHeight: 44,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: 'var(--surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--caramelo)',
                  flexShrink: 0,
                }}
              >
                <item.icon size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--espresso)' }}>{item.label}</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{item.desc}</p>
              </div>
              <ChevronRight size={18} color="var(--text-muted)" />
            </button>
          ))}
        </div>
      </div>

      {/* NOVO HÁBITO */}
      <div style={{ padding: '20px 20px 0' }}>
        <button
          onClick={onOpenNewHabit}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            padding: '14px',
            background: 'var(--caramelo)',
            color: 'var(--on-accent)',
            borderRadius: 14,
            border: 'none',
            cursor: 'pointer',
            fontSize: 15,
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(255,255,255,0.12)',
            minHeight: 44,
          }}
        >
          <PlusCircle size={18} /> Criar Novo Hábito Personalizado
        </button>
      </div>

      <div style={{ margin: '24px 0 16px' }}>
        <SectionDivider />
      </div>

      {/* CONFIGURAÇÕES: CIDADE E NOTIFICAÇÕES */}
      <div style={{ padding: '0 20px' }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
          Configurações
        </p>

        <div style={{ background: 'var(--creme-escuro)', borderRadius: 16, padding: 16, border: '1px solid rgba(255,255,255,0.08)' }}>
          {/* CIDADE */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <MapPin size={18} color="var(--caramelo)" />
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--espresso)' }}>Sua cidade</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Usada para buscar eventos</p>
              </div>
            </div>

            {isEditingCity ? (
              <div style={{ display: 'flex', gap: 6 }}>
                <input
                  type="text"
                  value={cityInput}
                  onChange={e => setCityInput(e.target.value)}
                  style={{
                    padding: '6px 8px',
                    borderRadius: 8,
                    border: '1px solid var(--caramelo)',
                    background: 'var(--surface-2)',
                    fontSize: 13,
                    width: 120,
                  }}
                  autoFocus
                />
                <button
                  onClick={handleSaveCity}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 8,
                    background: 'var(--caramelo)',
                    color: 'var(--on-accent)',
                    border: 'none',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  OK
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setCityInput(data.businessProfile.city || 'São Paulo');
                  setIsEditingCity(true);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--caramelo)',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                {data.businessProfile.city || 'São Paulo'}
              </button>
            )}
          </div>

          {/* NOTIFICAÇÕES */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Bell size={18} color="var(--caramelo)" />
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--espresso)' }}>Lembretes & Notificações</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Follow-up de 48h e hábitos diários</p>
              </div>
            </div>

            <button
              onClick={handleToggleNotifications}
              style={{
                padding: '8px 14px',
                borderRadius: 20,
                border: 'none',
                cursor: 'pointer',
                background: notificationsEnabled ? 'var(--oliva)' : 'rgba(255,255,255,0.08)',
                color: notificationsEnabled ? 'var(--on-accent)' : 'var(--espresso)',
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {notificationsEnabled ? 'Ativadas ✓' : 'Ativar'}
            </button>
          </div>
        </div>
      </div>

      <div style={{ margin: '24px 0 16px' }}>
        <SectionDivider />
      </div>

      {/* APOIO EMOCIONAL CVV 188 (REGRA DE SEGURANÇA E CONTEÚDO) */}
      <div style={{ padding: '0 20px' }}>
        <div style={{ background: '#1C1C1E', borderRadius: 16, padding: 16, border: '1px solid var(--caramelo-claro)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--caramelo)', marginBottom: 6 }}>
            <Phone size={18} />
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--espresso)' }}>Apoio Emocional & Escuta</h3>
          </div>
          <p style={{ fontSize: 12, color: 'var(--espresso)', lineHeight: 1.5 }}>
            Empreender tem momentos desafiadores. Se estiver sentindo sobrecarga, ansiedade ou tristeza profunda, lembre-se de que você não está só.
          </p>
          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
            <a
              href="tel:188"
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                background: 'var(--caramelo)',
                color: 'var(--on-accent)',
                fontSize: 12,
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              Ligue 188 (CVV Gratuito 24h)
            </a>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Ligação gratuita e confidencial</span>
          </div>
        </div>
      </div>

      <div style={{ margin: '24px 0 16px' }}>
        <SectionDivider />
      </div>

      {/* PRIVACIDADE & LGPD */}
      <div style={{ padding: '0 20px' }}>
        <div style={{ background: 'var(--creme-escuro)', borderRadius: 16, padding: 16, border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--oliva)', marginBottom: 8 }}>
            <ShieldCheck size={18} />
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--espresso)' }}>Privacidade & Seus Direitos (LGPD)</h3>
          </div>
          <p style={{ fontSize: 13, color: 'var(--espresso)', lineHeight: 1.5 }}>
            Seus dados ficam 100% com você neste aparelho (armazenamento local). Não vendemos seus dados nem enviamos para terceiros.
          </p>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.4 }}>
            * Contatos de clientes são mantidos sob sua guarda responsável. Salve apenas nome e anotações necessárias.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14 }}>
            <button
              onClick={handleExport}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '10px',
                borderRadius: 10,
                border: 'none',
                background: 'var(--surface)',
                color: 'var(--espresso)',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                minHeight: 44,
              }}
            >
              <Download size={14} /> Exportar JSON
            </button>

            <button
              onClick={handleClear}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '10px',
                borderRadius: 10,
                border: 'none',
                background: 'rgba(194,77,56,0.12)',
                color: '#E5604A',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                minHeight: 44,
              }}
            >
              <Trash2 size={14} /> Apagar tudo
            </button>
          </div>
        </div>
      </div>

      <div style={{ margin: '24px 0 16px' }}>
        <SectionDivider />
      </div>

      {/* CRÉDITOS DAS IMAGENS */}
      <div style={{ padding: '0 20px' }}>
        <button
          onClick={() => setShowCredits(!showCredits)}
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            background: 'var(--creme-escuro)',
            borderRadius: 12,
            border: 'none',
            cursor: 'pointer',
            minHeight: 44,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--espresso)' }}>
            <Image size={18} color="var(--caramelo)" />
            <span style={{ fontSize: 14, fontWeight: 600 }}>Créditos das fotos (Unsplash)</span>
          </div>
          <ChevronRight
            size={18}
            color="var(--text-muted)"
            style={{ transform: showCredits ? 'rotate(90deg)' : 'none', transition: 'transform 200ms' }}
          />
        </button>

        {showCredits && (
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {SCREEN_IMAGES.map(img => (
              <div
                key={img.screen}
                style={{
                  padding: '10px 14px',
                  background: 'var(--surface-2)',
                  borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--espresso)', textTransform: 'uppercase' }}>
                    Tela: {img.screen}
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{img.alt}</p>
                </div>
                <a
                  href={img.photographerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: 11,
                    color: 'var(--caramelo)',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  {img.photographer} <ExternalLink size={11} />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SOBRE O APP */}
      <div style={{ padding: '24px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'var(--text-muted)' }}>
          <Info size={16} />
          <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Sobre o Reluz Empresário
          </span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
          App web e PWA gratuito de hábitos e gestão para pequenos empreendedores. Um lugar só para manter fé, disciplina, finanças, rede e aprendizado sem sobrecarga.
        </p>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
          Versão 1.0 · PWA instalável · Feito para o Brasil 🇧🇷
        </p>
      </div>

      <div style={{ height: 40 }} />
    </div>
  );
};
