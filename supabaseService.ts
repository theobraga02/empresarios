import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface DbHabito {
  id: string;
  user_id: string;
  nome: string;
  data: string;
  feito: boolean;
  created_at?: string;
}

export interface DbTreino {
  id: string;
  user_id: string;
  data: string;
  tipo: string;
  duracao_min?: number;
  notas?: string;
}

export interface DbFinanceiro {
  id: string;
  user_id: string;
  data: string;
  tipo: 'renda' | 'gasto';
  valor: number;
  categoria: string;
}

export interface DbVenda {
  id: string;
  user_id: string;
  data: string;
  produto: string;
  cliente?: string;
  valor: number;
}

export interface DbBiblia {
  id: string;
  user_id: string;
  data: string;
  leitura: string;
  reflexao?: string;
}

export interface DbSono {
  id: string;
  user_id: string;
  data: string;
  horas: number;
  qualidade: number;
}

export interface DbFoco {
  id: string;
  user_id: string;
  data: string;
  minutos: number;
  tarefa?: string;
}

export interface DbAvaliacaoIA {
  id: string;
  user_id: string;
  data: string;
  nota: number;
  resumo: string;
  pontos_fortes: string[];
  pontos_fracos: string[];
  created_at?: string;
}

export interface DbRecomendacao {
  id: string;
  user_id: string;
  avaliacao_id: string;
  tipo: 'curso' | 'livro' | 'video';
  titulo: string;
  link?: string | null;
  motivo: string;
}

export const supabaseService = {
  // 1. HÁBITOS
  async getHabitosDoDia(dateStr?: string): Promise<DbHabito[]> {
    if (!isSupabaseConfigured || !supabase) return [];
    const targetDate = dateStr || new Date().toISOString().slice(0, 10);
    const { data, error } = await supabase
      .from('habitos')
      .select('*')
      .eq('data', targetDate)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Erro ao buscar hábitos:', error);
      return [];
    }
    return data || [];
  },

  async toggleHabito(id: string, feito: boolean): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    const { error } = await supabase
      .from('habitos')
      .update({ feito })
      .eq('id', id);

    if (error) {
      console.error('Erro ao alternar hábito:', error);
      return false;
    }
    return true;
  },

  async createHabito(nome: string, dataStr?: string): Promise<DbHabito | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const targetDate = dataStr || new Date().toISOString().slice(0, 10);
    const { data, error } = await supabase
      .from('habitos')
      .insert({
        user_id: user.id,
        nome,
        data: targetDate,
        feito: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar hábito no Supabase:', error);
      return null;
    }
    return data;
  },

  // 2. TREINO
  async addTreino(tipo: string, duracao_min: number, notas?: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase.from('treinos').insert({
      user_id: user.id,
      data: new Date().toISOString().slice(0, 10),
      tipo,
      duracao_min,
      notas: notas || null,
    });
    return !error;
  },

  // 3. FINANCEIRO
  async addFinanceiro(tipo: 'renda' | 'gasto', valor: number, categoria: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase.from('financeiro').insert({
      user_id: user.id,
      data: new Date().toISOString().slice(0, 10),
      tipo,
      valor,
      categoria,
    });
    return !error;
  },

  // 4. VENDA (automaticamente grava renda no financeiro)
  async addVenda(produto: string, cliente: string, valor: number): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const today = new Date().toISOString().slice(0, 10);
    const { error: vendaErr } = await supabase.from('vendas').insert({
      user_id: user.id,
      data: today,
      produto,
      cliente: cliente || null,
      valor,
    });

    if (vendaErr) {
      console.error('Erro ao registrar venda:', vendaErr);
      return false;
    }

    // A venda vira renda no financeiro automaticamente
    await supabase.from('financeiro').insert({
      user_id: user.id,
      data: today,
      tipo: 'renda',
      valor,
      categoria: 'Vendas',
    });

    return true;
  },

  // 5. BÍBLIA
  async addBiblia(leitura: string, reflexao?: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase.from('biblia').insert({
      user_id: user.id,
      data: new Date().toISOString().slice(0, 10),
      leitura,
      reflexao: reflexao || null,
    });
    return !error;
  },

  // 6. SONO
  async addSono(horas: number, qualidade: number): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase.from('sono').insert({
      user_id: user.id,
      data: new Date().toISOString().slice(0, 10),
      horas,
      qualidade,
    });
    return !error;
  },

  // 7. FOCO
  async addFoco(minutos: number, tarefa?: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase.from('foco').insert({
      user_id: user.id,
      data: new Date().toISOString().slice(0, 10),
      minutos,
      tarefa: tarefa || null,
    });
    return !error;
  },

  // 8. COACH DE IA: Buscar avaliação mais recente do dia
  async getAvaliacaoDoDia(): Promise<{ avaliacao: DbAvaliacaoIA | null; recomendacoes: DbRecomendacao[] }> {
    if (!isSupabaseConfigured || !supabase) return { avaliacao: null, recomendacoes: [] };
    const today = new Date().toISOString().slice(0, 10);

    const { data: avaliacao, error } = await supabase
      .from('avaliacoes_ia')
      .select('*')
      .eq('data', today)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !avaliacao) {
      return { avaliacao: null, recomendacoes: [] };
    }

    const { data: recomendacoes } = await supabase
      .from('recomendacoes')
      .select('*')
      .eq('avaliacao_id', avaliacao.id);

    return {
      avaliacao,
      recomendacoes: recomendacoes || [],
    };
  },

  // 9. DISPARAR O COACH DE IA (Edge Function)
  async runCoachDiario(): Promise<{ avaliacao: DbAvaliacaoIA; recomendacoes: DbRecomendacao[] }> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase não configurado. Adicione as chaves no arquivo .env.');
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('Você precisa estar conectado com e-mail e senha para usar o Coach de IA.');
    }

    // Chamada à Edge Function "coach-diario"
    const { data, error } = await supabase.functions.invoke('coach-diario', {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) {
      // Se a Edge Function ainda não foi deployed ou retornou erro, tratamos de forma amigável
      throw new Error(error.message || 'Erro ao comunicar com o Coach de IA.');
    }

    if (data?.error) {
      throw new Error(data.error);
    }

    return data;
  },

  // 10. MÉTRICAS PARA O PAINEL
  async getPainelMetrics(days = 30) {
    if (!isSupabaseConfigured || !supabase) return null;
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - days);
    const sinceDateStr = sinceDate.toISOString().slice(0, 10);

    const [
      { data: financeiro },
      { data: vendas },
      { data: treinos },
      { data: sono },
      { data: biblia },
      { data: foco },
    ] = await Promise.all([
      supabase.from('financeiro').select('*').gte('data', sinceDateStr),
      supabase.from('vendas').select('*').gte('data', sinceDateStr),
      supabase.from('treinos').select('*').gte('data', sinceDateStr),
      supabase.from('sono').select('*').gte('data', sinceDateStr),
      supabase.from('biblia').select('*').gte('data', sinceDateStr),
      supabase.from('foco').select('*').gte('data', sinceDateStr),
    ]);

    return {
      financeiro: financeiro || [],
      vendas: vendas || [],
      treinos: treinos || [],
      sono: sono || [],
      biblia: biblia || [],
      foco: foco || [],
    };
  },
};
