import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, ArrowLeft } from 'lucide-react';
import { INITIAL_VERSES } from '../data/initialData';

interface BibleReaderScreenProps {
  onBack: () => void;
}

export const BibleReaderScreen: React.FC<BibleReaderScreenProps> = ({ onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedVerses, setCompletedVerses] = useState<number[]>([]);
  const current = INITIAL_VERSES[currentIndex];

  const handleNext = () => {
    if (currentIndex < INITIAL_VERSES.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const toggleComplete = (idx: number) => {
    setCompletedVerses((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const isCurrentCompleted = completedVerses.includes(currentIndex);

  return (
    <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Barra superior de navegação */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={onBack}
          aria-label="Voltar para a tela Hoje"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#F0AE45',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '14px',
            fontWeight: 500,
            padding: '8px 0',
            minHeight: '44px'
          }}
        >
          <ArrowLeft size={18} /> Voltar
        </button>

        <span style={{ fontSize: '13px', color: '#A9B7AD' }}>
          Plano de Sabedoria ({currentIndex + 1} de {INITIAL_VERSES.length})
        </span>
      </header>

      {/* Card Principal de Leitura */}
      <article
        style={{
          background: 'linear-gradient(180deg, #16241E 0%, #101915 100%)',
          border: '1px solid #22312A',
          borderRadius: '26px',
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span
            style={{
              backgroundColor: 'rgba(240, 174, 69, 0.15)',
              color: '#F0AE45',
              padding: '4px 10px',
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: 600
            }}
          >
            {current.theme}
          </span>

          <span style={{ fontSize: '11px', color: '#A9B7AD' }}>
            ✓ Tradução de Domínio Público
          </span>
        </div>

        <blockquote
          style={{
            margin: 0,
            fontFamily: 'Fraunces, Georgia, serif',
            fontSize: '21px',
            color: '#F3ECDD',
            lineHeight: 1.45,
            fontWeight: 500
          }}
        >
          "{current.text}"
        </blockquote>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', borderTop: '1px solid #22312A', paddingTop: '12px' }}>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#F0AE45' }}>
            {current.reference}
          </span>
          <span style={{ fontSize: '12px', color: '#A9B7AD' }}>
            {current.translation}
          </span>
        </div>
      </article>

      {/* Ações do Leitor */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => toggleComplete(currentIndex)}
          style={{
            flex: 1,
            backgroundColor: isCurrentCompleted ? '#1C4635' : '#F0AE45',
            color: isCurrentCompleted ? '#4CC2B0' : '#0A100D',
            border: 'none',
            borderRadius: '9999px',
            padding: '12px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            minHeight: '44px'
          }}
        >
          <CheckCircle2 size={16} />
          {isCurrentCompleted ? 'Leitura Concluída ✓' : 'Marcar como Lido'}
        </button>
      </div>

      {/* Navegação entre versículos */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          style={{
            backgroundColor: '#121C17',
            border: '1px solid #22312A',
            color: currentIndex === 0 ? '#44564E' : '#F3ECDD',
            borderRadius: '9999px',
            padding: '10px 18px',
            fontSize: '13px',
            cursor: currentIndex === 0 ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            minHeight: '44px'
          }}
        >
          <ChevronLeft size={16} /> Anterior
        </button>

        <button
          onClick={handleNext}
          disabled={currentIndex === INITIAL_VERSES.length - 1}
          style={{
            backgroundColor: '#121C17',
            border: '1px solid #22312A',
            color: currentIndex === INITIAL_VERSES.length - 1 ? '#44564E' : '#F3ECDD',
            borderRadius: '9999px',
            padding: '10px 18px',
            fontSize: '13px',
            cursor: currentIndex === INITIAL_VERSES.length - 1 ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            minHeight: '44px'
          }}
        >
          Próximo <ChevronRight size={16} />
        </button>
      </div>

      {/* Nota de Integridade do Texto */}
      <div
        style={{
          backgroundColor: '#121C17',
          borderRadius: '16px',
          border: '1px solid #22312A',
          padding: '14px',
          fontSize: '11px',
          color: '#A9B7AD',
          lineHeight: 1.4
        }}
      >
        📖 <strong>Regra de integridade:</strong> Textos bíblicos sempre mantidos fiéis à tradução de domínio público original, sem cortes e sem alterações de palavras.
      </div>
    </div>
  );
};
