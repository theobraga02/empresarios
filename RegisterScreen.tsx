import React, { useState } from 'react';
import { ArrowLeft, Check, Plus, Trash2 } from 'lucide-react';
import type { AppData, WorkoutRecord, BibleRecord, FocusRecord, ReadingRecord, SleepRecord, IncomeRecord, SaleRecord } from '../types';

interface Props {
  data: AppData;
  update: (fn: (prev: AppData) => AppData) => void;
  onDone: () => void;
}

type RegisterType = 'treino' | 'caixa' | 'venda' | 'biblia' | 'foco' | 'leitura' | 'sono';

const REGISTER_TYPES = [
  { id: 'treino' as RegisterType, icon: '💪', label: 'Treino', desc: 'Exercícios, séries e carga' },
  { id: 'caixa' as RegisterType, icon: '💰', label: 'Renda e Gastos', desc: 'Entradas e saídas de caixa' },
  { id: 'venda' as RegisterType, icon: '🛍️', label: 'Venda Realizada', desc: 'Registrar produto, cliente e valor' },
  { id: 'biblia' as RegisterType, icon: '📖', label: 'Bíblia & Oração', desc: 'Leitura, reflexão e gratidão' },
  { id: 'foco' as RegisterType, icon: '🎯', label: 'Sessão de Foco', desc: 'Tempo dedicado à prioridade' },
  { id: 'leitura' as RegisterType, icon: '📚', label: 'Leitura', desc: 'Livros e páginas lidas' },
  { id: 'sono' as RegisterType, icon: '🌙', label: 'Sono & Descanso', desc: 'Horários e qualidade do sono' },
];

export const RegisterScreen: React.FC<Props> = ({ update, onDone }) => {
  const [selected, setSelected] = useState<RegisterType | null>(null);
  const [saved, setSaved] = useState(false);
  const today = new Date().toISOString().slice(0, 10);

  // Treino state
  const [workoutNotes, setWorkoutNotes] = useState('');
  const [effort, setEffort] = useState(7);
  const [exercises, setExercises] = useState([
    { name: '', sets: 3, reps: 10, load: 20 },
  ]);

  // Caixa state
  const [cashAmount, setCashAmount] = useState('');
  const [cashType, setCashType] = useState<'entrada' | 'saida'>('entrada');
  const [cashCategory, setCashCategory] = useState('Serviços');
  const [cashDesc, setCashDesc] = useState('');

  // Venda state
  const [saleProduct, setSaleProduct] = useState('');
  const [saleQty, setSaleQty] = useState('1');
  const [salePrice, setSalePrice] = useState('');
  const [saleClient, setSaleClient] = useState('');
  const [saleChannel, setSaleChannel] = useState('WhatsApp');

  // Bíblia state
  const [bibleBook, setBibleBook] = useState('');
  const [bibleChapter, setBibleChapter] = useState('');
  const [bibleVerse, setBibleVerse] = useState('');
  const [bibleLearned, setBibleLearned] = useState('');
  const [bibleGratitude, setBibleGratitude] = useState('');

  // Foco state
  const [focusMins, setFocusMins] = useState('25');

  // Leitura state
  const [readBook, setReadBook] = useState('');
  const [readPages, setReadPages] = useState('');
  const [readNotes, setReadNotes] = useState('');

  // Sono state
  const [sleepBed, setSleepBed] = useState('22:30');
  const [sleepWake, setSleepWake] = useState('06:30');
  const [sleepQuality, setSleepQuality] = useState(4);

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

  const handleSave = () => {
    const id = `r-${Date.now()}`;
    if (selected === 'treino') {
      const record: WorkoutRecord = {
        id,
        date: today,
        exercises: exercises.filter(e => e.name.trim()),
        effort,
        notes: workoutNotes,
      };
      update(prev => ({
        ...prev,
        workoutRecords: [...prev.workoutRecords, record],
        habits: prev.habits.map(h => (h.area === 'corpo' ? { ...h, completed: true } : h)),
      }));
    } else if (selected === 'caixa') {
      const record: IncomeRecord = {
        id,
        date: today,
        amount: parseFloat(cashAmount) || 0,
        category: cashCategory,
        description: cashDesc,
        type: cashType,
        status: 'recebido',
      };
      update(prev => ({
        ...prev,
        incomeRecords: [...prev.incomeRecords, record],
        habits: prev.habits.map(h => (h.area === 'financas' ? { ...h, completed: true } : h)),
      }));
    } else if (selected === 'venda') {
      const total = (parseFloat(saleQty) || 1) * (parseFloat(salePrice) || 0);
      const sale: SaleRecord = {
        id,
        date: today,
        product: saleProduct,
        quantity: parseFloat(saleQty) || 1,
        unitPrice: parseFloat(salePrice) || 0,
        total,
        clientName: saleClient,
        channel: saleChannel,
      };
      const income: IncomeRecord = {
        id: `i-${Date.now()}`,
        date: today,
        amount: total,
        category: 'Vendas',
        description: `Venda: ${saleProduct || 'Produto'}`,
        type: 'entrada',
        status: 'recebido',
      };
      update(prev => ({
        ...prev,
        saleRecords: [...prev.saleRecords, sale],
        incomeRecords: [...prev.incomeRecords, income],
        habits: prev.habits.map(h => (h.area === 'vendas' ? { ...h, completed: true } : h)),
      }));
    } else if (selected === 'biblia') {
      const record: BibleRecord = {
        id,
        date: today,
        plan: 'Geral',
        book: bibleBook || 'Provérbios',
        chapter: parseInt(bibleChapter) || 1,
        highlightVerse: bibleVerse,
        learned: bibleLearned,
        gratitude: bibleGratitude,
      };
      update(prev => ({
        ...prev,
        bibleRecords: [...prev.bibleRecords, record],
        habits: prev.habits.map(h => (h.area === 'fe' ? { ...h, completed: true } : h)),
      }));
    } else if (selected === 'foco') {
      const record: FocusRecord = {
        id,
        date: today,
        durationMinutes: parseInt(focusMins) || 25,
      };
      update(prev => ({
        ...prev,
        focusRecords: [...prev.focusRecords, record],
        habits: prev.habits.map(h => (h.area === 'foco' ? { ...h, completed: true } : h)),
      }));
    } else if (selected === 'leitura') {
      const record: ReadingRecord = {
        id,
        date: today,
        bookTitle: readBook || 'Livro atual',
        pagesRead: parseInt(readPages) || 10,
        notes: readNotes,
      };
      update(prev => ({
        ...prev,
        readingRecords: [...prev.readingRecords, record],
        habits: prev.habits.map(h => (h.area === 'aprender' ? { ...h, completed: true } : h)),
      }));
    } else if (selected === 'sono') {
      const record: SleepRecord = {
        id,
        date: today,
        bedtime: sleepBed,
        wakeTime: sleepWake,
        quality: sleepQuality,
      };
      update(prev => ({
        ...prev,
        sleepRecords: [...prev.sleepRecords, record],
        habits: prev.habits.map(h => (h.area === 'sono' ? { ...h, completed: true } : h)),
      }));
    }

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setSelected(null);
      onDone();
    }, 1500);
  };

  if (saved) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '70vh',
          gap: 16,
          padding: 24,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'var(--oliva)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(255,255,255,0.12)',
          }}
        >
          <Check size={36} color="var(--on-accent)" strokeWidth={3} />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--espresso)', marginTop: 8 }}>
          Registro concluído!
        </h2>
        <p style={{ fontSize: 15, color: 'var(--text-muted)', maxWidth: 280 }}>
          Seus dados foram salvos com sucesso e refletidos no seu painel.
        </p>
      </div>
    );
  }

  if (selected) {
    const activeMeta = REGISTER_TYPES.find(t => t.id === selected);
    return (
      <div style={{ padding: '20px 20px 40px' }}>
        <button
          onClick={() => setSelected(null)}
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
            marginBottom: 20,
            padding: 0,
            minHeight: 40,
          }}
        >
          <ArrowLeft size={18} /> Voltar aos registros
        </button>

        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--espresso)', marginBottom: 20 }}>
          {activeMeta?.icon} {activeMeta?.label}
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* TREINO FORM */}
          {selected === 'treino' && (
            <>
              {exercises.map((ex, i) => (
                <div key={i} style={{ background: 'var(--creme-escuro)', borderRadius: 14, padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <label style={labelStyle}>Exercício {i + 1}</label>
                    {exercises.length > 1 && (
                      <button
                        onClick={() => setExercises(prev => prev.filter((_, j) => j !== i))}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                  <input
                    value={ex.name}
                    onChange={e =>
                      setExercises(prev => prev.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))
                    }
                    placeholder="Ex: Supino, Agachamento, Corrida"
                    style={{ ...inputStyle, marginBottom: 12, background: 'var(--surface)' }}
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                    <div>
                      <label style={{ ...labelStyle, fontSize: 10 }}>Séries</label>
                      <input
                        type="number"
                        value={ex.sets}
                        onChange={e =>
                          setExercises(prev =>
                            prev.map((x, j) => (j === i ? { ...x, sets: parseInt(e.target.value) || 0 } : x))
                          )
                        }
                        style={{ ...inputStyle, background: 'var(--surface)' }}
                      />
                    </div>
                    <div>
                      <label style={{ ...labelStyle, fontSize: 10 }}>Reps</label>
                      <input
                        type="number"
                        value={ex.reps}
                        onChange={e =>
                          setExercises(prev =>
                            prev.map((x, j) => (j === i ? { ...x, reps: parseInt(e.target.value) || 0 } : x))
                          )
                        }
                        style={{ ...inputStyle, background: 'var(--surface)' }}
                      />
                    </div>
                    <div>
                      <label style={{ ...labelStyle, fontSize: 10 }}>Carga (kg)</label>
                      <input
                        type="number"
                        value={ex.load}
                        onChange={e =>
                          setExercises(prev =>
                            prev.map((x, j) => (j === i ? { ...x, load: parseFloat(e.target.value) || 0 } : x))
                          )
                        }
                        style={{ ...inputStyle, background: 'var(--surface)' }}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={() => setExercises(prev => [...prev, { name: '', sets: 3, reps: 10, load: 0 }])}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '12px',
                  borderRadius: 12,
                  border: '1px dashed var(--caramelo)',
                  background: 'transparent',
                  color: 'var(--caramelo)',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <Plus size={16} /> Adicionar outro exercício
              </button>

              <div>
                <label style={labelStyle}>Percepção de esforço (1 a 10): {effort}</label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={effort}
                  onChange={e => setEffort(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--caramelo)' }}
                />
              </div>

              <div>
                <label style={labelStyle}>Observações do treino</label>
                <input
                  value={workoutNotes}
                  onChange={e => setWorkoutNotes(e.target.value)}
                  placeholder="Ex: Treino forte, boa recuperação"
                  style={inputStyle}
                />
              </div>
            </>
          )}

          {/* CAIXA FORM */}
          {selected === 'caixa' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <button
                  onClick={() => setCashType('entrada')}
                  style={{
                    padding: '12px',
                    borderRadius: 10,
                    border: 'none',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: cashType === 'entrada' ? 'var(--oliva)' : 'var(--creme-escuro)',
                    color: cashType === 'entrada' ? 'var(--on-accent)' : 'var(--espresso)',
                  }}
                >
                  ↑ Entrada
                </button>
                <button
                  onClick={() => setCashType('saida')}
                  style={{
                    padding: '12px',
                    borderRadius: 10,
                    border: 'none',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: cashType === 'saida' ? '#E5604A' : 'var(--creme-escuro)',
                    color: cashType === 'saida' ? 'var(--on-accent)' : 'var(--espresso)',
                  }}
                >
                  ↓ Saída
                </button>
              </div>

              <div>
                <label style={labelStyle}>Valor (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={cashAmount}
                  onChange={e => setCashAmount(e.target.value)}
                  placeholder="Ex: 500.00"
                  style={{ ...inputStyle, fontSize: 18, fontWeight: 600 }}
                />
              </div>

              <div>
                <label style={labelStyle}>Categoria</label>
                <select
                  value={cashCategory}
                  onChange={e => setCashCategory(e.target.value)}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  <option value="Serviços">Serviços</option>
                  <option value="Vendas">Vendas de Produtos</option>
                  <option value="Fornecedores">Fornecedores / Insumos</option>
                  <option value="Operacional">Custos Operacionais</option>
                  <option value="Marketing">Marketing & Anúncios</option>
                  <option value="Pessoal">Pró-labore / Pessoal</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Descrição</label>
                <input
                  value={cashDesc}
                  onChange={e => setCashDesc(e.target.value)}
                  placeholder="Ex: Pagamento consultoria cliente João"
                  style={inputStyle}
                />
              </div>
            </>
          )}

          {/* VENDA FORM */}
          {selected === 'venda' && (
            <>
              <div>
                <label style={labelStyle}>Produto ou Serviço</label>
                <input
                  value={saleProduct}
                  onChange={e => setSaleProduct(e.target.value)}
                  placeholder="Ex: Pacote de Consultoria Mensal"
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Quantidade</label>
                  <input
                    type="number"
                    value={saleQty}
                    onChange={e => setSaleQty(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Preço Unitário (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={salePrice}
                    onChange={e => setSalePrice(e.target.value)}
                    placeholder="Ex: 1500"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ background: 'var(--creme-escuro)', padding: 12, borderRadius: 10 }}>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Total calculado:</p>
                <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--caramelo)' }}>
                  R$ {((parseFloat(saleQty) || 1) * (parseFloat(salePrice) || 0)).toFixed(2)}
                </p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                  ✓ Esta venda também será lançada automaticamente no caixa como entrada.
                </p>
              </div>

              <div>
                <label style={labelStyle}>Nome do Cliente (opcional)</label>
                <input
                  value={saleClient}
                  onChange={e => setSaleClient(e.target.value)}
                  placeholder="Ex: Roberto Alencar"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Canal da Venda</label>
                <select
                  value={saleChannel}
                  onChange={e => setSaleChannel(e.target.value)}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Indicação">Indicação</option>
                  <option value="Instagram / Redes">Instagram / Redes Sociais</option>
                  <option value="Presencial">Presencial / Reunião</option>
                  <option value="Site / E-commerce">Site / E-commerce</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
            </>
          )}

          {/* BIBLIA FORM */}
          {selected === 'biblia' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Livro</label>
                  <input
                    value={bibleBook}
                    onChange={e => setBibleBook(e.target.value)}
                    placeholder="Ex: Provérbios, Tiago, Salmos"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Capítulo</label>
                  <input
                    type="number"
                    value={bibleChapter}
                    onChange={e => setBibleChapter(e.target.value)}
                    placeholder="16"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Versículo Destaque</label>
                <input
                  value={bibleVerse}
                  onChange={e => setBibleVerse(e.target.value)}
                  placeholder="Ex: Provérbios 16:3 — Consagre ao Senhor tudo o que faz"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>O que aprendi hoje para a vida / empresa?</label>
                <textarea
                  value={bibleLearned}
                  onChange={e => setBibleLearned(e.target.value)}
                  placeholder="Reflexão prática para minhas atitudes..."
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={labelStyle}>Motivo de Gratidão a Deus</label>
                <input
                  value={bibleGratitude}
                  onChange={e => setBibleGratitude(e.target.value)}
                  placeholder="Ex: Pela saúde da minha família e clareza no negócio"
                  style={inputStyle}
                />
              </div>
            </>
          )}

          {/* FOCO FORM */}
          {selected === 'foco' && (
            <>
              <div>
                <label style={labelStyle}>Duração da Sessão (minutos)</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 12 }}>
                  {['25', '45', '60', '90'].map(m => (
                    <button
                      key={m}
                      onClick={() => setFocusMins(m)}
                      style={{
                        padding: '10px 0',
                        borderRadius: 10,
                        border: 'none',
                        cursor: 'pointer',
                        background: focusMins === m ? 'var(--caramelo)' : 'var(--creme-escuro)',
                        color: focusMins === m ? 'var(--on-accent)' : 'var(--espresso)',
                        fontWeight: 600,
                      }}
                    >
                      {m} min
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={focusMins}
                  onChange={e => setFocusMins(e.target.value)}
                  style={inputStyle}
                  placeholder="Minutos customizados"
                />
              </div>

              <div style={{ background: 'var(--creme-escuro)', padding: 14, borderRadius: 12 }}>
                <p style={{ fontSize: 13, color: 'var(--espresso)', fontWeight: 600 }}>💡 Dica de Foco do Empreendedor</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                  Elimine abas extras e coloque o celular em modo silencioso antes de iniciar sua sessão.
                </p>
              </div>
            </>
          )}

          {/* LEITURA FORM */}
          {selected === 'leitura' && (
            <>
              <div>
                <label style={labelStyle}>Título do Livro</label>
                <input
                  value={readBook}
                  onChange={e => setReadBook(e.target.value)}
                  placeholder="Ex: Hábitos Atômicos, A Estratégia do Oceano Azul"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Páginas Lidas</label>
                <input
                  type="number"
                  value={readPages}
                  onChange={e => setReadPages(e.target.value)}
                  placeholder="Ex: 15"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Ideia principal ou anotação</label>
                <textarea
                  value={readNotes}
                  onChange={e => setReadNotes(e.target.value)}
                  placeholder="O que posso aplicar no meu negócio?"
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>
            </>
          )}

          {/* SONO FORM */}
          {selected === 'sono' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Horário que dormiu</label>
                  <input
                    type="time"
                    value={sleepBed}
                    onChange={e => setSleepBed(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Horário que acordou</label>
                  <input
                    type="time"
                    value={sleepWake}
                    onChange={e => setSleepWake(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Qualidade do descanso (1 a 5 estrelas)</label>
                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                  {[1, 2, 3, 4, 5].map(q => (
                    <button
                      key={q}
                      onClick={() => setSleepQuality(q)}
                      style={{
                        flex: 1,
                        padding: '12px 0',
                        borderRadius: 10,
                        border: 'none',
                        cursor: 'pointer',
                        background: sleepQuality >= q ? 'var(--caramelo)' : 'var(--creme-escuro)',
                        color: sleepQuality >= q ? 'var(--on-accent)' : 'var(--espresso)',
                        fontSize: 18,
                        fontWeight: 700,
                      }}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <button
            onClick={handleSave}
            style={{
              marginTop: 14,
              padding: '14px',
              background: 'var(--caramelo)',
              color: 'var(--on-accent)',
              border: 'none',
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
              minHeight: 46,
              boxShadow: '0 4px 12px rgba(255,255,255,0.12)',
            }}
          >
            Salvar registro
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px 20px 40px' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--espresso)' }}>Registrar</h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>
          Escolha uma área para registrar sua ação e atualizar seus hábitos de hoje.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {REGISTER_TYPES.map(type => (
          <button
            key={type.id}
            onClick={() => setSelected(type.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '16px',
              background: 'var(--creme-escuro)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'transform 150ms, box-shadow 150ms',
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: 'var(--surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                flexShrink: 0,
              }}
            >
              {type.icon}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--espresso)' }}>{type.label}</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{type.desc}</p>
            </div>
            <span style={{ fontSize: 18, color: 'var(--caramelo)', fontWeight: 600 }}>→</span>
          </button>
        ))}
      </div>
    </div>
  );
};
