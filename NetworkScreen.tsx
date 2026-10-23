import React, { useState } from 'react';
import {
  Users,
  Plus,
  CheckCircle2,
  Clock,
  Trash2,
  ArrowLeft,
  MessageSquare,
  Lightbulb,
  MapPin,
  Calendar,
  ExternalLink,
  Sparkles,
  Copy,
  Check,
  AlertTriangle,
  Globe,
} from 'lucide-react';
import { TopPhoto } from '../components/TopPhoto';
import { Modal } from '../components/Modal';
import { NETWORKING_TIPS, CURATED_EVENTS, generateApproachScript } from '../data/initialData';
import type { AppData, NetworkingContact, NetworkingEvent, Appointment, ApproachScript } from '../types';

interface Props {
  data: AppData;
  update: (fn: (prev: AppData) => AppData) => void;
  onBack?: () => void;
}

export const NetworkScreen: React.FC<Props> = ({ data, update, onBack }) => {
  const [activeTab, setActiveTab] = useState<'eventos' | 'contatos'>('eventos');
  const [eventFilter, setEventFilter] = useState<'semana' | 'mes' | 'online'>('semana');
  const [contactFilter, setContactFilter] = useState<'todos' | 'pendentes' | 'concluidos'>('todos');

  // Cidade editável
  const [isEditingCity, setIsEditingCity] = useState(false);
  const [cityInput, setCityInput] = useState(data.businessProfile.city || 'São Paulo');

  // Modal Novo Contato
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    eventName: '',
    notes: '',
    followUpDone: false,
  });

  // Modal IA Abordagem
  const [selectedEventForAI, setSelectedEventForAI] = useState<NetworkingEvent | null>(null);
  const [aiScript, setAiScript] = useState<ApproachScript | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Estado para feedback ao salvar na agenda
  const [savedEventIds, setSavedEventIds] = useState<Set<string>>(new Set());

  // Dica do dia
  const tipIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % NETWORKING_TIPS.length;
  const tipOfTheDay = NETWORKING_TIPS[tipIndex];

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

  const handleSaveEventToAgenda = (event: NetworkingEvent) => {
    const appointment: Appointment = {
      id: `a-event-${event.id}-${Date.now()}`,
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.isOnline ? 'Online' : event.location,
      type: 'networking',
    };

    update(prev => ({
      ...prev,
      appointments: [...prev.appointments, appointment],
    }));

    setSavedEventIds(prev => new Set(prev).add(event.id));
  };

  const handleOpenAiModal = (event: NetworkingEvent) => {
    const script = generateApproachScript(event, data.businessProfile);
    setSelectedEventForAI(event);
    setAiScript(script);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleAddContact = () => {
    if (!contactForm.name.trim()) return;
    const todayStr = new Date().toISOString().slice(0, 10);
    const newContact: NetworkingContact = {
      id: `nc-${Date.now()}`,
      name: contactForm.name.trim(),
      eventName: contactForm.eventName.trim() || 'Encontro de Networking',
      metAt: todayStr,
      notes: contactForm.notes.trim() || undefined,
      followUpDone: contactForm.followUpDone,
    };

    // Gera lembrete de follow-up na agenda para dali a 48h (2 dias)
    const followUpDate = new Date();
    followUpDate.setDate(followUpDate.getDate() + 2);
    const followUpAppointment: Appointment = {
      id: `a-fu-${Date.now()}`,
      title: `Follow-up 48h: ${newContact.name} (${newContact.eventName})`,
      date: followUpDate.toISOString().slice(0, 10),
      time: '09:30',
      location: 'WhatsApp / Ligação',
      type: 'networking',
    };

    update(prev => ({
      ...prev,
      networkingContacts: [newContact, ...prev.networkingContacts],
      appointments: [...prev.appointments, followUpAppointment],
    }));

    setShowContactModal(false);
    setContactForm({ name: '', eventName: '', notes: '', followUpDone: false });
  };

  const toggleFollowUp = (id: string) => {
    update(prev => ({
      ...prev,
      networkingContacts: prev.networkingContacts.map(c =>
        c.id === id ? { ...c, followUpDone: !c.followUpDone } : c
      ),
    }));
  };

  const deleteContact = (id: string) => {
    update(prev => ({
      ...prev,
      networkingContacts: prev.networkingContacts.filter(c => c.id !== id),
    }));
  };

  // Filtragem dos eventos
  const now = new Date();
  const next7Days = new Date();
  next7Days.setDate(now.getDate() + 7);
  const next30Days = new Date();
  next30Days.setDate(now.getDate() + 30);

  const filteredEvents = CURATED_EVENTS.filter(event => {
    // Filtro online
    if (eventFilter === 'online') {
      return event.isOnline;
    }
    // Filtro por data
    const evDate = new Date(event.date + 'T12:00:00');
    if (eventFilter === 'semana') {
      return evDate >= now && evDate <= next7Days;
    }
    if (eventFilter === 'mes') {
      return evDate >= now && evDate <= next30Days;
    }
    return true;
  });

  const filteredContacts = data.networkingContacts.filter(c => {
    if (contactFilter === 'pendentes') return !c.followUpDone;
    if (contactFilter === 'concluidos') return c.followUpDone;
    return true;
  });

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

  return (
    <div>
      <TopPhoto screen="rede" title="Rede" subtitle="Eventos e conexões para seu negócio" />

      {onBack && (
        <div style={{ padding: '16px 20px 0' }}>
          <button
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--caramelo)',
              fontSize: 15,
              fontWeight: 600,
              padding: 0,
            }}
          >
            <ArrowLeft size={18} /> Voltar ao menu
          </button>
        </div>
      )}

      {/* SELETOR SUA CIDADE */}
      <div
        style={{
          padding: '16px 20px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <MapPin size={18} color="var(--caramelo)" />
          {isEditingCity ? (
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <input
                type="text"
                value={cityInput}
                onChange={e => setCityInput(e.target.value)}
                placeholder="Ex: São Paulo"
                style={{
                  padding: '6px 10px',
                  borderRadius: 16,
                  border: '1px solid var(--caramelo)',
                  background: 'var(--surface-2)',
                  fontSize: 14,
                  outline: 'none',
                  color: 'var(--espresso)',
                }}
                autoFocus
              />
              <button
                onClick={handleSaveCity}
                style={{
                  padding: '6px 12px',
                  borderRadius: 16,
                  background: 'var(--caramelo)',
                  color: 'var(--on-accent)',
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Salvar
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Sua cidade:</span>
              <button
                onClick={() => {
                  setCityInput(data.businessProfile.city || 'São Paulo');
                  setIsEditingCity(true);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'var(--caramelo)',
                  textDecoration: 'underline',
                  padding: 0,
                }}
              >
                {data.businessProfile.city || 'São Paulo'} (alterar)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* DICA DE NETWORKING DO DIA */}
      <div
        style={{
          margin: '16px 20px 0',
          padding: 16,
          background: 'var(--creme-escuro)',
          borderRadius: 14,
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, color: 'var(--caramelo)' }}>
          <Lightbulb size={16} />
          <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Dica de Networking do Dia
          </span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--espresso)', lineHeight: 1.5, fontStyle: 'italic' }}>
          "{tipOfTheDay}"
        </p>
      </div>

      {/* ABAS: EVENTOS x QUEM EU CONHECI */}
      <div style={{ display: 'flex', padding: '16px 20px 0', gap: 8 }}>
        <button
          onClick={() => setActiveTab('eventos')}
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: 20,
            border: 'none',
            cursor: 'pointer',
            background: activeTab === 'eventos' ? 'var(--caramelo)' : 'var(--creme-escuro)',
            color: activeTab === 'eventos' ? 'var(--on-accent)' : 'var(--espresso)',
            fontSize: 14,
            fontWeight: 600,
            transition: 'all 200ms',
          }}
        >
          Eventos para você
        </button>
        <button
          onClick={() => setActiveTab('contatos')}
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: 20,
            border: 'none',
            cursor: 'pointer',
            background: activeTab === 'contatos' ? 'var(--caramelo)' : 'var(--creme-escuro)',
            color: activeTab === 'contatos' ? 'var(--on-accent)' : 'var(--espresso)',
            fontSize: 14,
            fontWeight: 600,
            transition: 'all 200ms',
          }}
        >
          Quem eu conheci ({data.networkingContacts.length})
        </button>
      </div>

      {/* ABA 1: EVENTOS */}
      {activeTab === 'eventos' && (
        <div style={{ padding: '16px 20px 0' }}>
          {/* FILTROS DE EVENTOS */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            {(
              [
                { id: 'semana', label: 'Esta semana' },
                { id: 'mes', label: 'Este mês' },
                { id: 'online', label: 'Online' },
              ] as const
            ).map(f => (
              <button
                key={f.id}
                onClick={() => setEventFilter(f.id)}
                style={{
                  padding: '7px 16px',
                  borderRadius: 18,
                  border: 'none',
                  cursor: 'pointer',
                  background: eventFilter === f.id ? 'var(--espresso)' : 'var(--creme-escuro)',
                  color: eventFilter === f.id ? 'var(--on-accent)' : 'var(--text-muted)',
                  fontSize: 13,
                  fontWeight: 600,
                  transition: 'all 200ms',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* AVISO LEGAL FIXO DE EVENTOS */}
          <div
            style={{
              padding: '10px 14px',
              background: '#1C1C1E',
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.12)',
              display: 'flex',
              gap: 8,
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <AlertTriangle size={15} color="var(--caramelo)" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: 11, color: 'var(--espresso)', lineHeight: 1.4 }}>
              <strong>Aviso:</strong> A IA só lista eventos com link de fonte oficial. Confira data e local antes de ir.
            </p>
          </div>

          {/* LISTA DE EVENTOS OU ESTADO VAZIO */}
          {filteredEvents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--text-muted)' }}>
              <Globe size={40} style={{ margin: '0 auto 12px', opacity: 0.35 }} />
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--espresso)' }}>Não achei eventos agora</p>
              <p style={{ fontSize: 13, marginTop: 6, lineHeight: 1.5 }}>
                Tente ampliar o filtro para "Este mês" ou "Online" para encontrar mais opções para sua região.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {filteredEvents.map(event => {
                const isSaved = savedEventIds.has(event.id);
                return (
                  <div
                    key={event.id}
                    style={{
                      background: 'var(--creme-escuro)',
                      borderRadius: 14,
                      padding: 16,
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--espresso)', lineHeight: 1.3 }}>
                        {event.title}
                      </h3>
                      {event.isExample && (
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: 'var(--caramelo)',
                            background: '#1C1C1E',
                            padding: '2px 8px',
                            borderRadius: 10,
                            border: '1px solid var(--caramelo-claro)',
                            textTransform: 'uppercase',
                            flexShrink: 0,
                          }}
                        >
                          exemplo
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                      <span
                        style={{
                          fontSize: 12,
                          color: 'var(--espresso)',
                          background: 'var(--surface)',
                          padding: '3px 8px',
                          borderRadius: 6,
                          fontWeight: 500,
                        }}
                      >
                        📅 {new Date(event.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} às {event.time}
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          color: event.isOnline ? 'var(--caramelo)' : 'var(--oliva)',
                          background: 'var(--surface)',
                          padding: '3px 8px',
                          borderRadius: 6,
                          fontWeight: 600,
                        }}
                      >
                        {event.isOnline ? '🌐 Online' : `📍 ${event.location}`}
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          color: event.priceType === 'gratuito' ? 'var(--oliva)' : 'var(--espresso)',
                          background: 'var(--surface)',
                          padding: '3px 8px',
                          borderRadius: 6,
                          fontWeight: 600,
                        }}
                      >
                        {event.priceType === 'gratuito' ? 'Entrada gratuita' : event.price || 'Pago'}
                      </span>
                    </div>

                    {/* MOTIVO DE COMBINAR */}
                    <div
                      style={{
                        marginTop: 10,
                        padding: '10px 12px',
                        background: '#1C1C1E',
                        borderRadius: 8,
                        borderLeft: '3px solid var(--caramelo)',
                      }}
                    >
                      <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--caramelo)', textTransform: 'uppercase' }}>
                        Por que combina com seu negócio
                      </p>
                      <p style={{ fontSize: 12, color: 'var(--espresso)', marginTop: 2, lineHeight: 1.4 }}>
                        {event.matchReason}
                      </p>
                    </div>

                    {/* FONTE REAL VERIFICADA */}
                    <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <a
                        href={event.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: 12,
                          color: 'var(--caramelo)',
                          fontWeight: 600,
                          textDecoration: 'none',
                        }}
                      >
                        <ExternalLink size={13} /> Fonte: {event.sourceName}
                      </a>
                    </div>

                    {/* BOTÕES DE AÇÃO: SALVAR NA AGENDA E PREPARAR ABORDAGEM IA */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 14 }}>
                      <button
                        onClick={() => handleSaveEventToAgenda(event)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 6,
                          padding: '10px 8px',
                          borderRadius: 20,
                          border: isSaved ? '1px solid var(--oliva)' : '1px solid var(--caramelo-claro)',
                          cursor: 'pointer',
                          background: isSaved ? 'var(--oliva)' : 'transparent',
                          color: isSaved ? 'var(--on-accent)' : 'var(--espresso)',
                          fontSize: 12,
                          fontWeight: 600,
                          minHeight: 44,
                          transition: 'all 200ms',
                        }}
                      >
                        {isSaved ? <Check size={14} /> : <Calendar size={14} />}
                        {isSaved ? 'Salvo na agenda ✓' : 'Salvar na agenda'}
                      </button>

                      <button
                        onClick={() => handleOpenAiModal(event)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 6,
                          padding: '10px 8px',
                          borderRadius: 20,
                          border: 'none',
                          cursor: 'pointer',
                          background: 'var(--espresso)',
                          color: 'var(--on-accent)',
                          fontSize: 12,
                          fontWeight: 600,
                          minHeight: 44,
                          boxShadow: '0 2px 6px rgba(255,255,255,0.08)',
                        }}
                      >
                        <Sparkles size={14} color="#6B6B70" />
                        Abordagem com IA
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ABA 2: CONTATOS CONHECIDOS */}
      {activeTab === 'contatos' && (
        <div style={{ padding: '16px 20px 0' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16 }}>
            <button
              onClick={() => setShowContactModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '10px 16px',
                borderRadius: 20,
                border: 'none',
                cursor: 'pointer',
                background: 'var(--caramelo)',
                color: 'var(--on-accent)',
                fontSize: 13,
                fontWeight: 600,
                boxShadow: '0 2px 8px rgba(255,255,255,0.12)',
                minHeight: 44,
              }}
            >
              <Plus size={16} /> Quem eu conheci
            </button>

            <div style={{ flex: 1 }} />

            <div style={{ display: 'flex', background: 'var(--creme-escuro)', borderRadius: 20, padding: 3 }}>
              {(['todos', 'pendentes', 'concluidos'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setContactFilter(f)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 16,
                    border: 'none',
                    cursor: 'pointer',
                    background: contactFilter === f ? 'var(--espresso)' : 'transparent',
                    color: contactFilter === f ? 'var(--on-accent)' : 'var(--text-muted)',
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  {f === 'todos' ? 'Todos' : f === 'pendentes' ? 'Pendentes' : 'Feitos'}
                </button>
              ))}
            </div>
          </div>

          {filteredContacts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              <Users size={40} style={{ margin: '0 auto 12px', opacity: 0.35 }} />
              <p style={{ fontSize: 15, fontWeight: 500 }}>Nenhum contato encontrado.</p>
              <p style={{ fontSize: 13, marginTop: 4 }}>
                Ao conhecer alguém em eventos, anote o contato para o app lembrar do follow-up em 48h!
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filteredContacts.map(c => (
                <div
                  key={c.id}
                  style={{
                    background: 'var(--creme-escuro)',
                    borderRadius: 14,
                    padding: 16,
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--espresso)' }}>{c.name}</h3>
                      <p style={{ fontSize: 12, color: 'var(--caramelo)', fontWeight: 600, marginTop: 2 }}>
                        {c.eventName} · {new Date(c.metAt + 'T12:00:00').toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteContact(c.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}
                      title="Excluir contato"
                      aria-label="Excluir contato"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {c.notes && (
                    <div style={{ display: 'flex', gap: 6, marginTop: 8, alignItems: 'flex-start' }}>
                      <MessageSquare size={13} color="var(--text-muted)" style={{ marginTop: 2, flexShrink: 0 }} />
                      <p style={{ fontSize: 13, color: 'var(--espresso)', flex: 1 }}>{c.notes}</p>
                    </div>
                  )}

                  <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => toggleFollowUp(c.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '8px 14px',
                        borderRadius: 18,
                        border: 'none',
                        cursor: 'pointer',
                        background: c.followUpDone ? 'var(--oliva)' : 'var(--surface)',
                        color: c.followUpDone ? 'var(--on-accent)' : 'var(--espresso)',
                        fontSize: 12,
                        fontWeight: 600,
                        minHeight: 44,
                      }}
                    >
                      {c.followUpDone ? (
                        <>
                          <CheckCircle2 size={14} /> Follow-up em 48h feito ✓
                        </>
                      ) : (
                        <>
                          <Clock size={14} /> Fazer follow-up em 48h
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL IA: PREPARAR MINHA ABORDAGEM */}
      <Modal
        isOpen={Boolean(selectedEventForAI && aiScript)}
        title="Preparar Minha Abordagem com a IA"
        onClose={() => {
          setSelectedEventForAI(null);
          setAiScript(null);
        }}
      >
        {selectedEventForAI && aiScript && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ padding: '10px 12px', background: 'var(--creme-escuro)', borderRadius: 10 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--caramelo)', textTransform: 'uppercase' }}>
                Evento Selecionado
              </p>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--espresso)', marginTop: 2 }}>
                {selectedEventForAI.title}
              </p>
            </div>

            {/* 1. FRASE DE ABERTURA */}
            <div style={{ background: 'var(--surface-2)', borderRadius: 12, padding: 14, border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--caramelo)', textTransform: 'uppercase' }}>
                  1. Frase de abertura gentil
                </span>
                <button
                  onClick={() => copyToClipboard(aiScript.openingPhrase, 'abertura')}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--caramelo)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  {copiedKey === 'abertura' ? <Check size={12} /> : <Copy size={12} />}
                  {copiedKey === 'abertura' ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
              <p style={{ fontSize: 14, color: 'var(--espresso)', lineHeight: 1.5, fontStyle: 'italic' }}>
                "{aiScript.openingPhrase}"
              </p>
            </div>

            {/* 2. TRÊS PERGUNTAS INVESTIGATIVAS */}
            <div style={{ background: 'var(--surface-2)', borderRadius: 12, padding: 14, border: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--caramelo)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
                2. Três perguntas para puxar conversa
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {aiScript.questions.map((q, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <span
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        background: 'var(--creme-escuro)',
                        color: 'var(--caramelo)',
                        fontSize: 11,
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: 2,
                      }}
                    >
                      {idx + 1}
                    </span>
                    <p style={{ fontSize: 13, color: 'var(--espresso)', lineHeight: 1.4, flex: 1 }}>
                      {q}
                    </p>
                    <button
                      onClick={() => copyToClipboard(q, `q-${idx}`)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                      title="Copiar pergunta"
                    >
                      {copiedKey === `q-${idx}` ? <Check size={12} color="var(--oliva)" /> : <Copy size={12} />}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. PEDIDO DE FOLLOW-UP */}
            <div style={{ background: 'var(--surface-2)', borderRadius: 12, padding: 14, border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--oliva)', textTransform: 'uppercase' }}>
                  3. Pedido claro para o follow-up em 48h
                </span>
                <button
                  onClick={() => copyToClipboard(aiScript.followUpRequest, 'followup')}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--caramelo)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  {copiedKey === 'followup' ? <Check size={12} /> : <Copy size={12} />}
                  {copiedKey === 'followup' ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
              <p style={{ fontSize: 13, color: 'var(--espresso)', lineHeight: 1.5, fontStyle: 'italic' }}>
                "{aiScript.followUpRequest}"
              </p>
            </div>

            <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.4 }}>
              Dica: Seja você mesmo e ouça com atenção genuína. O networking é sobre construir pontes e ajudar primeiro!
            </p>
          </div>
        )}
      </Modal>

      {/* MODAL NOVO CONTATO */}
      <Modal isOpen={showContactModal} title="Quem eu conheci" onClose={() => setShowContactModal(false)}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4 }}>
            💡 Ao salvar este contato, o app automaticamente agenda um lembrete de follow-up em 48 horas na sua Agenda!
          </p>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, display: 'block' }}>
              Nome da pessoa *
            </label>
            <input
              type="text"
              value={contactForm.name}
              onChange={e => setContactForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Ana Clara"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, display: 'block' }}>
              Evento / Onde se conheceram
            </label>
            <input
              type="text"
              value={contactForm.eventName}
              onChange={e => setContactForm(prev => ({ ...prev, eventName: e.target.value }))}
              placeholder="Ex: Rodada de Negócios Sebrae"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, display: 'block' }}>
              Anotações sobre a conversa
            </label>
            <textarea
              value={contactForm.notes}
              onChange={e => setContactForm(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Ex: Tem interesse em consultoria, tem 3 funcionários e quer melhorar o caixa..."
              rows={3}
              style={{ ...inputStyle, resize: 'none' }}
            />
          </div>

          <button
            onClick={handleAddContact}
            style={{
              padding: '14px',
              borderRadius: 12,
              border: 'none',
              cursor: 'pointer',
              background: 'var(--caramelo)',
              color: 'var(--on-accent)',
              fontSize: 16,
              fontWeight: 600,
              minHeight: 44,
              boxShadow: '0 2px 8px rgba(255,255,255,0.12)',
            }}
          >
            Salvar e agendar follow-up (48h)
          </button>
        </div>
      </Modal>

      <div style={{ height: 32 }} />
    </div>
  );
};
