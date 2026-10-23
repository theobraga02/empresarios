import type { AppData } from '../types';

const KEY = 'reluz_empresario_v1';

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as AppData;
  } catch {}
  return getDefaultData();
}

export function saveData(data: AppData): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {}
}

export function exportData(data: AppData): void {
  const blob = new Blob(
    [JSON.stringify({ version: '1.0', exportedAt: new Date().toISOString(), data }, null, 2)],
    { type: 'application/json' }
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `reluz-dados-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function clearData(): void {
  localStorage.removeItem(KEY);
}

export function getDefaultData(): AppData {
  const today = new Date().toISOString().slice(0, 10);
  return {
    habits: [
      { id: 'h1', title: 'Bíblia e oração matinal', area: 'fe', icon: '📖', completed: false, target: 1 },
      { id: 'h2', title: 'Treino físico funcional', area: 'corpo', icon: '💪', completed: false, target: 1 },
      { id: 'h3', title: 'Bloco de foco profundo 25 min', area: 'foco', icon: '🎯', completed: false, target: 25, unit: 'min' },
      { id: 'h4', title: 'Prospecção / Ligar para 3 clientes', area: 'vendas', icon: '📞', completed: false, target: 3, unit: 'clientes' },
      { id: 'h5', title: 'Leitura de negócios 10 min', area: 'aprender', icon: '📚', completed: false, target: 10, unit: 'min' },
    ],
    appointments: [
      { id: 'a1', title: 'Reunião com cliente estratégico', date: today, time: '14:00', location: 'Cafeteria Central', type: 'compromisso' },
      { id: 'a2', title: 'Evento Sebrae Empreendedorismo', date: today, time: '19:00', location: 'Online', type: 'networking' },
    ],
    incomeRecords: [
      { id: 'r1', date: today, amount: 1500, category: 'Serviços', description: 'Consultoria Estratégica', type: 'entrada', status: 'recebido' },
      { id: 'r2', date: today, amount: 250, category: 'Fornecedores', description: 'Material e Insumos', type: 'saida', status: 'recebido' },
    ],
    saleRecords: [
      { id: 's1', date: today, product: 'Consultoria de Processos', quantity: 1, unitPrice: 1500, total: 1500, clientName: 'Ana Costa', channel: 'Indicação' }
    ],
    workoutRecords: [
      { id: 'w1', date: today, exercises: [{ name: 'Supino', sets: 4, reps: 10, load: 30 }, { name: 'Agachamento', sets: 4, reps: 12, load: 40 }], effort: 8, notes: 'Bom treino de força' }
    ],
    bibleRecords: [
      { id: 'b1', date: today, plan: 'Geral', book: 'Provérbios', chapter: 16, highlightVerse: 'Provérbios 16:3', learned: 'Consagrar os planos a Deus traz clareza', gratitude: 'Pela saúde e nova oportunidade' }
    ],
    focusRecords: [
      { id: 'f1', date: today, durationMinutes: 50 }
    ],
    readingRecords: [
      { id: 'rd1', date: today, bookTitle: 'Hábitos Atômicos', pagesRead: 15, notes: 'Melhoria de 1% a cada dia' }
    ],
    sleepRecords: [
      { id: 'sl1', date: today, bedtime: '22:30', wakeTime: '06:30', quality: 4 }
    ],
    businessProfile: {
      productName: 'Consultoria Empresarial & Soluções',
      area: 'Gestão e Tecnologia',
      price: 'R$ 1.500/mês',
      targetClientTags: ['PME', 'Varejo', 'Serviços'],
      clientPain: 'Falta de organização financeira e processos de vendas desestruturados',
      city: 'São Paulo, SP'
    },
    clients: [
      { id: 'c1', name: 'Maria Silva', stage: 'conversei', notes: 'Interessada no plano mensal', createdAt: today },
      { id: 'c2', name: 'João Souza', stage: 'proposta', notes: 'Aguardando aprovação de diretoria', createdAt: today },
      { id: 'c3', name: 'Ana Costa', stage: 'fechou', notes: 'Contrato fechado com sucesso', createdAt: today },
    ],
    networkingContacts: [
      { id: 'nc1', name: 'Carlos Mendes', eventName: 'Rodada de Negócios Sebrae', metAt: today, notes: 'Diretor de distribuidora local. Combinar café.', followUpDone: false },
      { id: 'nc2', name: 'Fernanda Rocha', eventName: 'Meetup Empreendedores', metAt: today, notes: 'Especialista em marketing digital', followUpDone: true }
    ],
    savedCourses: ['fc1'],
    streak: 3,
    lastActiveDate: today,
  };
}
