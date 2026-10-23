import type { CuratedVideo, FreeCourse, Track } from '../types';

export const BIBLE_VERSES = [
  { reference: 'Provérbios 16:3', text: 'Entrega ao Senhor tudo o que você faz; confie nele, e ele o ajudará.', theme: 'confiança', translation: 'Almeida Revista e Corrigida' },
  { reference: 'Filipenses 4:13', text: 'Tudo posso naquele que me fortalece.', theme: 'força', translation: 'Almeida Revista e Corrigida' },
  { reference: 'Jeremias 29:11', text: 'Porque sei os planos que tenho para você, diz o Senhor, planos de fazê-lo prosperar.', theme: 'esperança', translation: 'Almeida Revista e Corrigida' },
  { reference: 'Tiago 1:5', text: 'Se algum de vocês tem falta de sabedoria, peça-a a Deus, que a todos dá livremente.', theme: 'sabedoria', translation: 'Almeida Revista e Corrigida' },
  { reference: 'Josué 1:9', text: 'Seja forte e corajoso! Não se apavore nem desanime, pois o Senhor, o seu Deus, estará com você.', theme: 'coragem', translation: 'Almeida Revista e Corrigida' },
  { reference: 'Mateus 6:33', text: 'Busque em primeiro lugar o reino de Deus e a sua justiça, e todas essas coisas serão acrescentadas a você.', theme: 'prioridade', translation: 'Almeida Revista e Corrigida' },
  { reference: 'Gálatas 6:9', text: 'Não nos cansemos de fazer o bem, pois no tempo certo colheremos, se não desanimarmos.', theme: 'perseverança', translation: 'Almeida Revista e Corrigida' },
];

export const INITIAL_VERSES = BIBLE_VERSES;

export const NETWORKING_TIPS = [
  'Chegue cedo aos eventos: os primeiros 15 minutos são os melhores para conversar com quem ainda está relaxado.',
  'Prepare uma frase curta sobre o que você faz e para quem. Menos de 15 palavras.',
  'Pergunte mais do que fale. Quem ouve bem é lembrado como interessante.',
  'Anote o nome e um detalhe de cada pessoa que conhecer. Ajuda no follow-up.',
  'Follow-up em 48h: uma mensagem curta e personalizada faz toda a diferença.',
  'Prefira conexões profundas a muitas rascunhadas. 3 conversas reais > 20 cartões trocados.',
  'Leve cartão ou QR code do seu contato. Facilita para a outra pessoa.',
];

export const CURATED_VIDEOS: CuratedVideo[] = [
  {
    id: 'v1',
    title: 'Como fazer prospecção ativa eficiente',
    channel: 'Thiago Concer',
    url: 'https://www.youtube.com/watch?v=h-4kZYmJtJQ',
    thumbnail: 'https://images.unsplash.com/photo-1552581234-26160f608093?w=500&q=80',
    category: 'vendas',
    action5min: 'Escreva 3 nomes de clientes potenciais para ligar amanhã',
    checkedAt: '2024-01-15',
  },
  {
    id: 'v2',
    title: 'O poder dos hábitos pequenos para empreendedores',
    channel: 'Me Poupe!',
    url: 'https://www.youtube.com/watch?v=PZ7lDrwYdZc',
    thumbnail: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=500&q=80',
    category: 'habitos',
    action5min: 'Identifique um hábito pequeno que você quer criar esta semana',
    checkedAt: '2024-01-15',
  },
  {
    id: 'v3',
    title: 'Fluxo de caixa para pequenos negócios — Sebrae',
    channel: 'Sebrae Talks',
    url: 'https://www.youtube.com/@sebrae',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&q=80',
    category: 'financas',
    action5min: 'Abra uma planilha e registre as entradas desta semana',
    checkedAt: '2024-01-15',
  },
];

export const FREE_COURSES: FreeCourse[] = [
  { id: 'fc1', title: 'Técnicas de Negociação e Vendas', platform: 'Sebrae', url: 'https://www.sebrae.com.br/sites/PortalSebrae/cursosonline', category: 'vendas', checkedAt: '2024-01-15' },
  { id: 'fc2', title: 'Gestão Financeira para Micro Empresas', platform: 'Sebrae', url: 'https://www.sebrae.com.br/sites/PortalSebrae/cursosonline', category: 'financas', checkedAt: '2024-01-15' },
  { id: 'fc3', title: 'Marketing Digital para Pequenos Negócios', platform: 'Senac EAD', url: 'https://www.ead.senac.br', category: 'vendas', checkedAt: '2024-01-15' },
];

export const INITIAL_TRACKS: Track[] = [
  { id: 'tr1', title: 'Vendas na Prática', category: 'vendas', totalWeeks: 8, currentWeek: 2, practiceOfTheWeek: 'Ligar para 3 clientes antigos esta semana', progressPercent: 25 },
  { id: 'tr2', title: 'Hábitos do Empreendedor', category: 'habitos', totalWeeks: 6, currentWeek: 1, practiceOfTheWeek: 'Acordar 30 min mais cedo e planejar o dia', progressPercent: 15 },
];

export const CURATED_EVENTS: import('../types').NetworkingEvent[] = [
  {
    id: 'ev-1',
    title: 'Encontro de Empreendedores Locais e Parcerias',
    date: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
    time: '19:00',
    isOnline: false,
    priceType: 'gratuito',
    location: 'Hub de Inovação & Coworking Central',
    city: 'São Paulo',
    matchReason: 'Reúne donos de pequenos negócios que buscam fornecedores e prestadores de serviços de confiança.',
    sourceName: 'Sympla',
    sourceUrl: 'https://www.sympla.com.br/eventos/sao-paulo-sp/empreendedorismo',
    isExample: true,
  },
  {
    id: 'ev-2',
    title: 'Rodada de Negócios e Vendas B2B Sebrae',
    date: new Date(Date.now() + 86400000 * 5).toISOString().slice(0, 10),
    time: '14:00',
    isOnline: true,
    priceType: 'gratuito',
    location: 'Transmissão Online ao Vivo',
    city: 'Online',
    matchReason: 'Excelente oportunidade para apresentar soluções diretas para dores de empresas da região.',
    sourceName: 'Sebrae',
    sourceUrl: 'https://www.sebrae.com.br/sites/PortalSebrae/cursosonline',
    isExample: true,
  },
  {
    id: 'ev-3',
    title: 'Café & Conexões: Mulheres Empreendedoras',
    date: new Date(Date.now() + 86400000 * 9).toISOString().slice(0, 10),
    time: '08:30',
    isOnline: false,
    priceType: 'pago',
    price: 'R$ 35,00 (café incluso)',
    location: 'Café Origami - Rua Augusta, 1200',
    city: 'São Paulo',
    matchReason: 'Ambiente acolhedor e seguro para troca de indicações e parcerias estratégicas de longo prazo.',
    sourceName: 'Eventbrite',
    sourceUrl: 'https://www.eventbrite.com.br/d/brazil/networking/',
    isExample: true,
  },
  {
    id: 'ev-4',
    title: 'Meetup: Gestão, Vendas e Finanças na Prática',
    date: new Date(Date.now() + 86400000 * 14).toISOString().slice(0, 10),
    time: '19:30',
    isOnline: true,
    priceType: 'gratuito',
    location: 'Google Meet / Plataforma Meetup',
    city: 'Online',
    matchReason: 'Espaço aberto de perguntas, networking ativo em salas e grupos de acompanhamento mútuo.',
    sourceName: 'Meetup',
    sourceUrl: 'https://www.meetup.com/find/?keywords=empreendedorismo',
    isExample: true,
  },
];

export function generateApproachScript(
  event: import('../types').NetworkingEvent,
  profile: import('../types').BusinessProfile
): import('../types').ApproachScript {
  const produto = profile.productName || 'meu trabalho/serviço';
  const area = profile.area || 'nosso segmento';
  const clienteBuscado = profile.targetClientTags.length > 0 
    ? profile.targetClientTags.join(', ')
    : 'pequenas empresas e pessoas que buscam qualidade';
  const dor = profile.clientPain || 'otimizar tempo e ter mais resultados';

  return {
    openingPhrase: `Olá! Prazer, meu nome é ${profile.city ? `aqui de ${profile.city}` : ''}. O que te trouxe hoje ao ${event.title}? Também vim para conhecer quem está empreendendo na área!`,
    questions: [
      `Hoje, qual tem sido o maior desafio no seu negócio para ${dor}?`,
      `Você costuma atender clientes no perfil de ${clienteBuscado}? Como tem sido o fluxo de indicações por aí?`,
      `Trabalho com ${produto} na área de ${area}. Se você pudesse resolver um gargalo nessa parte esta semana, qual seria?`,
    ],
    followUpRequest: `Gostei muito da nossa conversa! Posso te mandar uma mensagem no WhatsApp amanhã ou depois para te conectar com uma indicação ou tomar um café virtual de 15 minutos?`,
  };
}
