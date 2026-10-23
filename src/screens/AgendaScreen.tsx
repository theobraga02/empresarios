import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Plus, Users, Trash2 } from 'lucide-react';
import { TopPhoto } from '../components/TopPhoto';
import { Modal } from '../components/Modal';
import type { AppData, Appointment } from '../types';

interface Props {
  data: AppData;
  update: (fn: (prev: AppData) => AppData) => void;
}

export const AgendaScreen: React.FC<Props> = ({ data, update }) => {
  const [view, setView] = useState<'dia' | 'mes'>('dia');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<{
    title: string;
    date: string;
    time: string;
    location: string;
    type: 'compromisso' | 'networking' | 'habito';
  }>({
    title: '',
    date: new Date().toISOString().slice(0, 10),
    time: '09:00',
    location: '',
    type: 'compromisso',
  });

  const appointmentsForSelectedDate = data.appointments
    .filter(a => a.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  const handleAdd = () => {
    if (!form.title.trim()) return;
    const newApp: Appointment = {
      id: `a-${Date.now()}`,
      title: form.title.trim(),
      date: form.date,
      time: form.time,
      location: form.location.trim() || undefined,
      type: form.type,
    };
    update(prev => ({ ...prev, appointments: [...prev.appointments, newApp] }));
    setShowModal(false);
    setForm({
      title: '',
      date: new Date().toISOString().slice(0, 10),
      time: '09:00',
      location: '',
      type: 'compromisso',
    });
  };

  const handleDelete = (id: string) => {
    update(prev => ({
      ...prev,
      appointments: prev.appointments.filter(a => a.id !== id),
    }));
  };

  const selectedDateObj = new Date(selectedDate + 'T12:00:00');
  const monthStr = selectedDateObj.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  // Month calendar calculations
  const year = selectedDateObj.getFullYear();
  const month = selectedDateObj.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const datesWithEvents = new Set(data.appointments.map(a => a.date));

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
    <div>
      <TopPhoto screen="agenda" title="Agenda" subtitle={monthStr.charAt(0).toUpperCase() + monthStr.slice(1)} />

      <div style={{ display: 'flex', gap: 8, padding: '16px 20px 0', alignItems: 'center' }}>
        {(['dia', 'mes'] as const).map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            style={{
              padding: '8px 20px',
              borderRadius: 20,
              border: 'none',
              cursor: 'pointer',
              background: view === v ? 'var(--caramelo)' : 'var(--creme-escuro)',
              color: view === v ? '#fff' : 'var(--espresso)',
              fontSize: 14,
              fontWeight: 600,
              transition: 'all 200ms',
            }}
          >
            {v === 'dia' ? 'Dia' : 'Mês'}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button
          onClick={() => {
            setForm(p => ({ ...p, date: selectedDate }));
            setShowModal(true);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 16px',
            borderRadius: 20,
            border: 'none',
            cursor: 'pointer',
            background: 'var(--caramelo)',
            color: '#fff',
            fontSize: 14,
            fontWeight: 600,
            boxShadow: '0 2px 8px rgba(184,101,43,0.3)',
          }}
        >
          <Plus size={16} /> Novo
        </button>
      </div>

      {view === 'dia' && (
        <div style={{ padding: '20px 20px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-muted)' }}>
              {new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </p>
            {selectedDate !== new Date().toISOString().slice(0, 10) && (
              <button
                onClick={() => setSelectedDate(new Date().toISOString().slice(0, 10))}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--caramelo)',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Voltar para hoje
              </button>
            )}
          </div>

          {appointmentsForSelectedDate.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
              <Calendar size={40} style={{ margin: '0 auto 12px', opacity: 0.35 }} />
              <p style={{ fontSize: 15, fontWeight: 500 }}>Nenhum compromisso neste dia.</p>
              <p style={{ fontSize: 13, marginTop: 4 }}>Aproveite para um momento de foco e planejamento!</p>
            </div>
          ) : (
            appointmentsForSelectedDate.map((apt, i) => (
              <React.Fragment key={apt.id}>
                <div style={{ display: 'flex', gap: 14, padding: '12px 0' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 48 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--caramelo)' }}>{apt.time}</span>
                    {i < appointmentsForSelectedDate.length - 1 && (
                      <div style={{ flex: 1, width: 2, background: 'var(--creme-escuro)', marginTop: 6, minHeight: 28 }} />
                    )}
                  </div>
                  <div style={{ flex: 1, background: 'var(--creme-escuro)', padding: '12px 14px', borderRadius: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {apt.type === 'networking' ? (
                          <Users size={13} color="var(--caramelo)" />
                        ) : (
                          <Clock size={13} color="var(--oliva)" />
                        )}
                        <span
                          style={{
                            fontSize: 11,
                            color: apt.type === 'networking' ? 'var(--caramelo)' : 'var(--oliva)',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                          }}
                        >
                          {apt.type}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDelete(apt.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--text-muted)',
                          padding: 4,
                        }}
                        title="Remover compromisso"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--espresso)' }}>{apt.title}</p>
                    {apt.location && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
                        <MapPin size={12} color="var(--text-muted)" />
                        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{apt.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </React.Fragment>
            ))
          )}
        </div>
      )}

      {view === 'mes' && (
        <div style={{ padding: '20px 20px 0' }}>
          <div style={{ background: 'var(--creme-escuro)', borderRadius: 16, padding: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, textAlign: 'center', marginBottom: 8 }}>
              {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                <div key={i} style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', padding: '4px 0' }}>
                  {d}
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const d = i + 1;
                const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                const hasEvents = datesWithEvents.has(dateKey);
                const isSelected = dateKey === selectedDate;
                const isToday = dateKey === new Date().toISOString().slice(0, 10);
                return (
                  <button
                    key={d}
                    onClick={() => {
                      setSelectedDate(dateKey);
                      setView('dia');
                    }}
                    style={{
                      height: 40,
                      borderRadius: 10,
                      border: 'none',
                      cursor: 'pointer',
                      background: isSelected ? 'var(--caramelo)' : isToday ? 'rgba(184,101,43,0.15)' : 'rgba(255,255,255,0.5)',
                      color: isSelected ? '#fff' : isToday ? 'var(--caramelo)' : 'var(--espresso)',
                      fontWeight: isToday || isSelected ? 700 : 500,
                      fontSize: 14,
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span>{d}</span>
                    {hasEvents && !isSelected && (
                      <div
                        style={{
                          width: 4,
                          height: 4,
                          borderRadius: '50%',
                          background: 'var(--caramelo)',
                          marginTop: 1,
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center' }}>
              Toque em qualquer dia para ver os compromissos agendados.
            </p>
          </div>
        </div>
      )}

      <Modal isOpen={showModal} title="Novo compromisso" onClose={() => setShowModal(false)}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={labelStyle}>Título do compromisso</label>
            <input
              value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              placeholder="Ex: Reunião com cliente, Treino, Mentoria"
              style={inputStyle}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Data</label>
              <input
                type="date"
                value={form.date}
                onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Hora</label>
              <input
                type="time"
                value={form.time}
                onChange={e => setForm(p => ({ ...p, time: e.target.value }))}
                style={inputStyle}
              />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Tipo</label>
            <select
              value={form.type}
              onChange={e => setForm(p => ({ ...p, type: e.target.value as any }))}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              <option value="compromisso">Compromisso</option>
              <option value="networking">Networking</option>
              <option value="habito">Hábito / Treino</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Local (opcional)</label>
            <input
              value={form.location}
              onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
              placeholder="Ex: Google Meet, Cafeteria Central, Escritório"
              style={inputStyle}
            />
          </div>
          <button
            onClick={handleAdd}
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
            Salvar compromisso
          </button>
        </div>
      </Modal>

      <div style={{ height: 28 }} />
    </div>
  );
};
