export type TabType = 'hoje' | 'agenda' | 'registrar' | 'painel' | 'aprender' | 'mais';
export type DashboardTab = 'geral' | 'negocio' | 'pessoal';
export type RegisterType = 'treino' | 'caixa' | 'venda' | 'biblia' | 'foco' | 'leitura' | 'sono';

export interface Habit {
  id: string;
  title: string;
  area: 'corpo' | 'fe' | 'foco' | 'financas' | 'vendas' | 'aprender' | 'sono' | 'networking';
  icon: string;
  completed: boolean;
  target?: number;
  unit?: string;
}

export interface Appointment {
  id: string;
  title: string;
  date: string;
  time: string;
  location?: string;
  type: 'compromisso' | 'networking' | 'habito';
}

export interface IncomeRecord {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
  type: 'entrada' | 'saida';
  status: 'recebido' | 'a_receber';
  isRecurring?: boolean;
}

export interface SaleRecord {
  id: string;
  date: string;
  product: string;
  quantity: number;
  unitPrice: number;
  total: number;
  clientName?: string;
  channel?: string;
}

export interface WorkoutRecord {
  id: string;
  date: string;
  exercises: Array<{ name: string; sets: number; reps: number; load: number }>;
  effort: number;
  notes?: string;
}

export interface BibleRecord {
  id: string;
  date: string;
  plan: string;
  book: string;
  chapter: number;
  highlightVerse?: string;
  learned?: string;
  gratitude?: string;
}

export interface FocusRecord {
  id: string;
  date: string;
  durationMinutes: number;
}

export interface ReadingRecord {
  id: string;
  date: string;
  bookTitle: string;
  pagesRead: number;
  notes?: string;
}

export interface SleepRecord {
  id: string;
  date: string;
  bedtime: string;
  wakeTime: string;
  quality: number;
}

export interface BusinessProfile {
  productName: string;
  area: string;
  price: string;
  targetClientTags: string[];
  clientPain: string;
  city: string;
}

export interface Client {
  id: string;
  name: string;
  stage: 'conheci' | 'conversei' | 'proposta' | 'fechou';
  notes?: string;
  createdAt: string;
  followUpAt?: string;
}

export interface NetworkingContact {
  id: string;
  name: string;
  eventName: string;
  metAt: string;
  notes?: string;
  followUpDone: boolean;
}

export interface CuratedVideo {
  id: string;
  title: string;
  channel: string;
  url: string;
  thumbnail?: string;
  category: 'vendas' | 'habitos' | 'financas';
  action5min: string;
  checkedAt: string;
}

export interface FreeCourse {
  id: string;
  title: string;
  platform: string;
  url: string;
  category: string;
  checkedAt: string;
  saved?: boolean;
}

export interface NetworkingEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  isOnline: boolean;
  priceType: 'gratuito' | 'pago';
  price?: string;
  location: string;
  city: string;
  matchReason: string;
  sourceName: string;
  sourceUrl: string;
  isExample?: boolean;
}

export interface ApproachScript {
  openingPhrase: string;
  questions: string[];
  followUpRequest: string;
}

export interface Track {
  id: string;
  title: string;
  category: 'vendas' | 'habitos' | 'financas';
  totalWeeks: number;
  currentWeek: number;
  practiceOfTheWeek: string;
  progressPercent: number;
}

export interface AppData {
  habits: Habit[];
  appointments: Appointment[];
  incomeRecords: IncomeRecord[];
  saleRecords: SaleRecord[];
  workoutRecords: WorkoutRecord[];
  bibleRecords: BibleRecord[];
  focusRecords: FocusRecord[];
  readingRecords: ReadingRecord[];
  sleepRecords: SleepRecord[];
  businessProfile: BusinessProfile;
  clients: Client[];
  networkingContacts: NetworkingContact[];
  savedCourses: string[];
  streak: number;
  lastActiveDate: string;
}
