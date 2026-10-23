import type { AppData } from '../types';

/** Áreas medidas pelo índice (uma por tipo de registro). */
export const TOTAL_AREAS = 7;

export const isoDe = (d: Date): string => d.toISOString().slice(0, 10);

export const diaISO = (offset = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() - offset);
  return isoDe(d);
};

/** Quantas das 7 áreas têm ao menos um registro no dia. */
export function areasRegistradas(data: AppData, dia: string): number {
  const flags = [
    data.workoutRecords.some(r => r.date === dia),
    data.focusRecords.some(r => r.date === dia),
    data.readingRecords.some(r => r.date === dia),
    data.bibleRecords.some(r => r.date === dia),
    data.sleepRecords.some(r => r.date === dia),
    data.incomeRecords.some(r => r.date === dia),
    data.saleRecords.some(r => r.date === dia),
  ];
  return flags.filter(Boolean).length;
}

/** Índice de consistência do dia (0 a 10): áreas registradas / 7. */
export function indiceDoDia(data: AppData, dia: string): number {
  return Math.round((areasRegistradas(data, dia) / TOTAL_AREAS) * 100) / 10;
}

/** Nota de hoje (0 a 10): 50% hábitos concluídos + 50% áreas registradas. */
export function notaDeHoje(data: AppData): number {
  const regs = areasRegistradas(data, diaISO()) / TOTAL_AREAS;
  const total = data.habits.length;
  const hab = total > 0 ? data.habits.filter(h => h.completed).length / total : null;
  const v = hab === null ? regs : 0.5 * hab + 0.5 * regs;
  return Math.round(v * 100) / 10;
}

export interface PontoEvolucao {
  rotulo: string;
  valor: number;
}

export type ModoPeriodo = 'semana' | 'mes' | 'ano';

const cap = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

export function serieEvolucao(data: AppData, modo: ModoPeriodo): PontoEvolucao[] {
  const pontos: PontoEvolucao[] = [];
  if (modo === 'semana' || modo === 'mes') {
    const n = modo === 'semana' ? 7 : 30;
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const rotulo =
        modo === 'semana'
          ? cap(d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''))
          : String(d.getDate());
      pontos.push({ rotulo, valor: indiceDoDia(data, isoDe(d)) });
    }
    return pontos;
  }
  for (let m = 11; m >= 0; m--) {
    const ref = new Date();
    ref.setDate(1);
    ref.setMonth(ref.getMonth() - m);
    const ano = ref.getFullYear();
    const mes = ref.getMonth();
    const ultimo = new Date(ano, mes + 1, 0).getDate();
    let soma = 0;
    for (let dia = 1; dia <= ultimo; dia++) {
      soma += indiceDoDia(data, isoDe(new Date(Date.UTC(ano, mes, dia))));
    }
    pontos.push({
      rotulo: cap(ref.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')),
      valor: Math.round((soma / ultimo) * 10) / 10,
    });
  }
  return pontos;
}

/** Média do índice em `dias` dias, começando `inicio` dias atrás. */
export function mediaPeriodo(data: AppData, inicio: number, dias: number): number {
  let soma = 0;
  for (let i = inicio; i < inicio + dias; i++) soma += indiceDoDia(data, diaISO(i));
  return soma / dias;
}

export function variacaoSemana(data: AppData): number | null {
  const atual = mediaPeriodo(data, 0, 7);
  const anterior = mediaPeriodo(data, 7, 7);
  if (anterior <= 0) return null;
  return Math.round(((atual - anterior) / anterior) * 100);
}

export const moeda = (v: number): string =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
