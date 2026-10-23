export interface ScreenImage {
  screen: string;
  url: string;
  alt: string;
  photographer: string;
  photographerUrl: string;
  source: 'unsplash' | 'pexels';
}

export const SCREEN_IMAGES: ScreenImage[] = [
  { screen: 'hoje', url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80', alt: 'Mesa de café da manhã com xícara e luz suave', photographer: 'Nathan Dumlao', photographerUrl: 'https://unsplash.com/@nate_dumlao', source: 'unsplash' },
  { screen: 'agenda', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', alt: 'Caderno com xícara de café e luz suave', photographer: 'Thought Catalog', photographerUrl: 'https://unsplash.com/@thoughtcatalog', source: 'unsplash' },
  { screen: 'painel-geral', url: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80', alt: 'Grãos de café, tom caramelo', photographer: 'Mike Kenneally', photographerUrl: 'https://unsplash.com/@asthetik', source: 'unsplash' },
  { screen: 'painel-negocio', url: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&q=80', alt: 'Interior de cafeteria aconchegante', photographer: 'Mel Poole', photographerUrl: 'https://unsplash.com/@melipoole', source: 'unsplash' },
  { screen: 'painel-pessoal', url: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80', alt: 'Folhas verdes e grãos, tom oliva', photographer: 'Jason Leung', photographerUrl: 'https://unsplash.com/@ninjason', source: 'unsplash' },
  { screen: 'rede', url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80', alt: 'Ambiente de trabalho colaborativo', photographer: 'Annie Spratt', photographerUrl: 'https://unsplash.com/@anniespratt', source: 'unsplash' },
  { screen: 'negocio', url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80', alt: 'Balcão de pequeno negócio', photographer: 'Blake Wisz', photographerUrl: 'https://unsplash.com/@blakewisz', source: 'unsplash' },
  { screen: 'aprender', url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80', alt: 'Livro aberto ao lado de uma xícara de café', photographer: 'Patrick Tomasso', photographerUrl: 'https://unsplash.com/@impatrickt', source: 'unsplash' },
];
