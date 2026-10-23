import React, { useState } from 'react';
import { Briefcase, Users, Plus, ArrowRight, ArrowLeft, Trash2, Edit3, Check, MapPin } from 'lucide-react';
import { TopPhoto } from '../components/TopPhoto';
import { Modal } from '../components/Modal';
import type { AppData, BusinessProfile, Client } from '../types';

interface Props {
  data: AppData;
  update: (fn: (prev: AppData) => AppData) => void;
  onBack?: () => void;
}

const STAGES: Array<{ id: Client['stage']; label: string; color: string }> = [
  { id: 'conheci', label: 'Conheci', color: '#93A5C2' },
  { id: 'conversei', label: 'Conversei', color: '#7BA4FF' },
  { id: 'proposta', label: 'Proposta', color: '#B8652B' },
  { id: 'fechou', label: 'Fechou!', color: '#5B6B3A' },
];

export const BusinessScreen: React.FC<Props> = ({ data, update, onBack }) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState<BusinessProfile>(data.businessProfile);
  const [newTag, setNewTag] = useState('');
  const [showClientModal, setShowClientModal] = useState(false);
  const [clientForm, setClientForm] = useState<{
    name: string;
    stage: Client['stage'];
    notes: string;
  }>({
    name: '',
    stage: 'conheci',
    notes: '',
  });

  const [activeStageFilter, setActiveStageFilter] = useState<Client['stage'] | 'todos'>('todos');

  const handleSaveProfile = () => {
    update(prev => ({
      ...prev,
      businessProfile: profileForm,
    }));
    setIsEditingProfile(false);
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    if (!profileForm.targetClientTags.includes(newTag.trim())) {
      setProfileForm(p => ({
        ...p,
        targetClientTags: [...p.targetClientTags, newTag.trim()],
      }));
    }
    setNewTag('');
  };

  const handleRemoveTag = (tag: string) => {
    setProfileForm(p => ({
      ...p,
      targetClientTags: p.targetClientTags.filter(t => t !== tag),
    }));
  };

  const handleAddClient = () => {
    if (!clientForm.name.trim()) return;
    const newClient: Client = {
      id: `c-${Date.now()}`,
      name: clientForm.name.trim(),
      stage: clientForm.stage,
      notes: clientForm.notes.trim() || undefined,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    update(prev => ({
      ...prev,
      clients: [newClient, ...prev.clients],
    }));
    setShowClientModal(false);
    setClientForm({ name: '', stage: 'conheci', notes: '' });
  };

  const handleAdvanceStage = (clientId: string, currentStage: Client['stage']) => {
    const stageOrder: Client['stage'][] = ['conheci', 'conversei', 'proposta', 'fechou'];
    const currentIndex = stageOrder.indexOf(currentStage);
    if (currentIndex < stageOrder.length - 1) {
      const nextStage = stageOrder[currentIndex + 1];
      update(prev => ({
        ...prev,
        clients: prev.clients.map(c => (c.id === clientId ? { ...c, stage: nextStage } : c)),
      }));
    }
  };

  const handleDeleteClient = (clientId: string) => {
    update(prev => ({
      ...prev,
      clients: prev.clients.filter(c => c.id !== clientId),
    }));
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

  const filteredClients = data.clients.filter(c => {
    if (activeStageFilter === 'todos') return true;
    return c.stage === activeStageFilter;
  });

  return (
    <div>
      <TopPhoto screen="negocio" title="Meu Negócio" subtitle="Clareza sobre produto e clientes" />

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

      {/* PERFIL DO NEGÓCIO */}
      <div style={{ padding: '20px 20px 0' }}>
        <div
          style={{
            background: 'var(--creme-escuro)',
            borderRadius: 16,
            padding: 18,
            border: '1px solid rgba(59,42,32,0.06)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--caramelo)' }}>
              <Briefcase size={18} />
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--espresso)' }}>Perfil do Negócio</h2>
            </div>
            <button
              onClick={() => {
                if (isEditingProfile) handleSaveProfile();
                else {
                  setProfileForm(data.businessProfile);
                  setIsEditingProfile(true);
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 16,
                border: 'none',
                cursor: 'pointer',
                background: isEditingProfile ? 'var(--oliva)' : 'var(--caramelo)',
                color: '#fff',
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {isEditingProfile ? (
                <>
                  <Check size={14} /> Salvar
                </>
              ) : (
                <>
                  <Edit3 size={14} /> Editar
                </>
              )}
            </button>
          </div>

          {!isEditingProfile ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--espresso)' }}>
                  {data.businessProfile.productName || 'Configure o nome do seu produto/serviço'}
                </p>
                <p style={{ fontSize: 13, color: 'var(--caramelo)', fontWeight: 600, marginTop: 2 }}>
                  {data.businessProfile.area || 'Área de atuação'} · {data.businessProfile.price || 'Preço/Preço médio'}
                </p>
              </div>

              {data.businessProfile.city && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 13 }}>
                  <MapPin size={14} />
                  <span>{data.businessProfile.city}</span>
                </div>
              )}

              {data.businessProfile.clientPain && (
                <div style={{ background: 'rgba(255,255,255,0.6)', padding: 10, borderRadius: 10 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Dor principal que resolve:
                  </p>
                  <p style={{ fontSize: 13, color: 'var(--espresso)', marginTop: 2 }}>
                    "{data.businessProfile.clientPain}"
                  </p>
                </div>
              )}

              {data.businessProfile.targetClientTags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                  {data.businessProfile.targetClientTags.map(tag => (
                    <span
                      key={tag}
                      style={{
                        background: 'rgba(255,255,255,0.7)',
                        padding: '4px 10px',
                        borderRadius: 12,
                        fontSize: 12,
                        color: 'var(--espresso)',
                        fontWeight: 500,
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={labelStyle}>Nome do Produto ou Serviço</label>
                <input
                  value={profileForm.productName}
                  onChange={e => setProfileForm(p => ({ ...p, productName: e.target.value }))}
                  placeholder="Ex: Consultoria de Vendas"
                  style={{ ...inputStyle, background: 'rgba(255,255,255,0.8)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={labelStyle}>Área / Nicho</label>
                  <input
                    value={profileForm.area}
                    onChange={e => setProfileForm(p => ({ ...p, area: e.target.value }))}
                    placeholder="Ex: Consultoria B2B"
                    style={{ ...inputStyle, background: 'rgba(255,255,255,0.8)' }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Preço Médio</label>
                  <input
                    value={profileForm.price}
                    onChange={e => setProfileForm(p => ({ ...p, price: e.target.value }))}
                    placeholder="Ex: R$ 1.500"
                    style={{ ...inputStyle, background: 'rgba(255,255,255,0.8)' }}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Cidade / Região</label>
                <input
                  value={profileForm.city}
                  onChange={e => setProfileForm(p => ({ ...p, city: e.target.value }))}
                  placeholder="Ex: São Paulo, SP"
                  style={{ ...inputStyle, background: 'rgba(255,255,255,0.8)' }}
                />
              </div>

              <div>
                <label style={labelStyle}>Dor que resolve para o cliente</label>
                <input
                  value={profileForm.clientPain}
                  onChange={e => setProfileForm(p => ({ ...p, clientPain: e.target.value }))}
                  placeholder="Ex: Falta de tempo e desorganização nas vendas"
                  style={{ ...inputStyle, background: 'rgba(255,255,255,0.8)' }}
                />
              </div>

              <div>
                <label style={labelStyle}>Público-alvo / Tags</label>
                <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                  <input
                    value={newTag}
                    onChange={e => setNewTag(e.target.value)}
                    placeholder="Adicionar tag (ex: Varejo, PME)"
                    style={{ ...inputStyle, background: 'rgba(255,255,255,0.8)' }}
                  />
                  <button
                    onClick={handleAddTag}
                    style={{
                      padding: '0 16px',
                      background: 'var(--caramelo)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 10,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    +
                  </button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {profileForm.targetClientTags.map(t => (
                    <span
                      key={t}
                      onClick={() => handleRemoveTag(t)}
                      style={{
                        background: 'rgba(184,101,43,0.15)',
                        color: 'var(--caramelo)',
                        padding: '4px 10px',
                        borderRadius: 12,
                        fontSize: 12,
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                      title="Clique para remover"
                    >
                      #{t} ×
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PIPELINE DE CLIENTES (CRM) */}
      <div style={{ padding: '24px 20px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users size={18} color="var(--caramelo)" />
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--espresso)' }}>Funil de Clientes</h2>
          </div>
          <button
            onClick={() => setShowClientModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              borderRadius: 16,
              border: 'none',
              cursor: 'pointer',
              background: 'var(--caramelo)',
              color: '#fff',
              fontSize: 13,
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(184,101,43,0.3)',
            }}
          >
            <Plus size={15} /> Novo Cliente
          </button>
        </div>

        {/* BOTOES DE FILTRO POR ESTÁGIO */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8 }}>
          <button
            onClick={() => setActiveStageFilter('todos')}
            style={{
              padding: '6px 12px',
              borderRadius: 16,
              border: 'none',
              cursor: 'pointer',
              background: activeStageFilter === 'todos' ? 'var(--espresso)' : 'var(--creme-escuro)',
              color: activeStageFilter === 'todos' ? '#fff' : 'var(--text-muted)',
              fontSize: 12,
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            Todos ({data.clients.length})
          </button>
          {STAGES.map(s => {
            const count = data.clients.filter(c => c.stage === s.id).length;
            const isSelected = activeStageFilter === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActiveStageFilter(s.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 16,
                  border: 'none',
                  cursor: 'pointer',
                  background: isSelected ? s.color : 'var(--creme-escuro)',
                  color: isSelected ? '#fff' : 'var(--espresso)',
                  fontSize: 12,
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
              >
                {s.label} ({count})
              </button>
            );
          })}
        </div>

        {/* LISTA DE CLIENTES NO PIPELINE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
          {filteredClients.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: 14 }}>Nenhum cliente cadastrado nesta etapa.</p>
            </div>
          ) : (
            filteredClients.map(client => {
              const stageMeta = STAGES.find(s => s.id === client.stage);
              const isFinal = client.stage === 'fechou';
              return (
                <div
                  key={client.id}
                  style={{
                    background: 'var(--creme-escuro)',
                    borderRadius: 14,
                    padding: 16,
                    border: '1px solid rgba(59,42,32,0.06)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--espresso)' }}>{client.name}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: 10,
                            background: stageMeta?.color,
                            color: '#fff',
                            textTransform: 'uppercase',
                          }}
                        >
                          {stageMeta?.label}
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                          Desde {new Date(client.createdAt + 'T12:00:00').toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteClient(client.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
                      title="Excluir cliente"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {client.notes && (
                    <p style={{ fontSize: 13, color: 'var(--espresso)', marginTop: 8, fontStyle: 'italic' }}>
                      "{client.notes}"
                    </p>
                  )}

                  {!isFinal && (
                    <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => handleAdvanceStage(client.id, client.stage)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '6px 14px',
                          borderRadius: 14,
                          border: 'none',
                          cursor: 'pointer',
                          background: 'rgba(255,255,255,0.7)',
                          color: 'var(--espresso)',
                          fontSize: 13,
                          fontWeight: 600,
                        }}
                      >
                        Avançar etapa <ArrowRight size={14} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* MODAL NOVO CLIENTE */}
      <Modal isOpen={showClientModal} title="Adicionar Cliente ao Funil" onClose={() => setShowClientModal(false)}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={labelStyle}>Nome do cliente ou empresa</label>
            <input
              value={clientForm.name}
              onChange={e => setClientForm(p => ({ ...p, name: e.target.value }))}
              placeholder="Ex: Padaria Bela Vista, Carla Souza"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Estágio inicial</label>
            <select
              value={clientForm.stage}
              onChange={e => setClientForm(p => ({ ...p, stage: e.target.value as any }))}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              <option value="conheci">Conheci (Lead)</option>
              <option value="conversei">Conversei (Qualificação)</option>
              <option value="proposta">Proposta (Negociação)</option>
              <option value="fechou">Fechou (Contrato)</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Anotações do cliente</label>
            <textarea
              value={clientForm.notes}
              onChange={e => setClientForm(p => ({ ...p, notes: e.target.value }))}
              placeholder="Ex: Pediu proposta para 3 lojas. Ligar na terça-feira."
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          <button
            onClick={handleAddClient}
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
            Adicionar cliente
          </button>
        </div>
      </Modal>

      <div style={{ height: 28 }} />
    </div>
  );
};
