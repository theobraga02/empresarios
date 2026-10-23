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
  return {
    // Hábitos iniciais são modelos editáveis, não registros do usuário.
    habits: [
      { id: 'h1', title: 'Bíblia e oração matinal', area: 'fe', icon: '📖', completed: false, target: 1 },
      { id: 'h2', title: 'Treino físico funcional', area: 'corpo', icon: '💪', completed: false, target: 1 },
      { id: 'h3', title: 'Bloco de foco profundo 25 min', area: 'foco', icon: '🎯', completed: false, target: 25, unit: 'min' },
      { id: 'h4', title: 'Prospecção / Ligar para 3 clientes', area: 'vendas', icon: '📞', completed: false, target: 3, unit: 'clientes' },
      { id: 'h5', title: 'Leitura de negócios 10 min', area: 'aprender', icon: '📚', completed: false, target: 10, unit: 'min' },
    ],
    appointments: [],
    incomeRecords: [],
    saleRecords: [],
    workoutRecords: [],
    bibleRecords: [],
    focusRecords: [],
    readingRecords: [],
    sleepRecords: [],
    businessProfile: {
      productName: '',
      area: '',
      price: '',
      targetClientTags: [],
      clientPain: '',
      city: '',
    },
    clients: [],
    networkingContacts: [],
    savedCourses: [],
    streak: 0,
    lastActiveDate: '',
  };
}
