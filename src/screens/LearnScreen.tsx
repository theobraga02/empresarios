import React from 'react';
import { ArrowLeft, ExternalLink, Bookmark, Play, BookOpen, Sparkles, Plus } from 'lucide-react';
import { TopPhoto } from '../components/TopPhoto';
import { CURATED_VIDEOS, FREE_COURSES, INITIAL_TRACKS } from '../data/initialData';
import type { AppData, Habit } from '../types';

interface Props {
  data: AppData;
  update: (fn: (prev: AppData) => AppData) => void;
  onBack?: () => void;
}

export const LearnScreen: React.FC<Props> = ({ data, update, onBack }) => {
  const handleToggleSaveCourse = (courseId: string) => {
    update(prev => {
      const isSaved = prev.savedCourses.includes(courseId);
      const nextSaved = isSaved
        ? prev.savedCourses.filter(id => id !== courseId)
        : [...prev.savedCourses, courseId];
      return { ...prev, savedCourses: nextSaved };
    });
  };

  const handleAddTrackPracticeToHabits = (practice: string, category: string) => {
    const newHabit: Habit = {
      id: `h-tr-${Date.now()}`,
      title: practice,
      area: category === 'vendas' ? 'vendas' : 'foco',
      icon: category === 'vendas' ? '📞' : '🎯',
      completed: false,
      target: 1,
    };
    update(prev => ({
      ...prev,
      habits: [...prev.habits, newHabit],
    }));
    alert('Hábito adicionado com sucesso aos seus hábitos de hoje! 🚀');
  };

  return (
    <div>
      <TopPhoto screen="aprender" title="Aprender & Evoluir" subtitle="Conteúdos práticos para o empresário" />

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

      {/* TRILHAS DE DESENVOLVIMENTO */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Sparkles size={18} color="var(--caramelo)" />
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--espresso)' }}>Trilhas Práticas</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {INITIAL_TRACKS.map(track => (
            <div
              key={track.id}
              style={{
                background: 'var(--creme-escuro)',
                borderRadius: 16,
                padding: 16,
                border: '1px solid rgba(59,42,32,0.06)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--espresso)' }}>{track.title}</h3>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--caramelo)' }}>
                  Semana {track.currentWeek} de {track.totalWeeks}
                </span>
              </div>

              {/* Barra de progresso */}
              <div style={{ height: 6, background: 'rgba(255,255,255,0.7)', borderRadius: 3, margin: '10px 0', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${track.progressPercent}%`,
                    background: 'var(--caramelo)',
                    borderRadius: 3,
                  }}
                />
              </div>

              <div style={{ background: 'rgba(255,255,255,0.6)', padding: 12, borderRadius: 10, marginTop: 8 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Prática da semana:
                </p>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--espresso)', marginTop: 2 }}>
                  "{track.practiceOfTheWeek}"
                </p>
                <button
                  onClick={() => handleAddTrackPracticeToHabits(track.practiceOfTheWeek, track.category)}
                  style={{
                    marginTop: 8,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 12px',
                    borderRadius: 14,
                    border: 'none',
                    background: 'var(--caramelo)',
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <Plus size={14} /> Adicionar aos hábitos de hoje
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* VÍDEOS COM AÇÃO DE 5 MINUTOS */}
      <div style={{ padding: '24px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Play size={18} color="var(--caramelo)" />
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--espresso)' }}>Vídeos com Ação Rápida</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {CURATED_VIDEOS.map(video => (
            <div
              key={video.id}
              style={{
                background: 'var(--creme-escuro)',
                borderRadius: 16,
                overflow: 'hidden',
                border: '1px solid rgba(59,42,32,0.06)',
              }}
            >
              <div style={{ position: 'relative', height: 120 }}>
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.9)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--caramelo)',
                      textDecoration: 'none',
                    }}
                  >
                    <Play size={20} fill="var(--caramelo)" />
                  </a>
                </div>
              </div>

              <div style={{ padding: 14 }}>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'var(--caramelo)',
                    letterSpacing: '0.04em',
                  }}
                >
                  {video.category} · {video.channel}
                </span>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--espresso)', marginTop: 2 }}>
                  {video.title}
                </h3>

                <div
                  style={{
                    marginTop: 10,
                    background: 'rgba(255,255,255,0.7)',
                    padding: 10,
                    borderRadius: 10,
                    borderLeft: '3px solid var(--oliva)',
                  }}
                >
                  <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--oliva)', textTransform: 'uppercase' }}>
                    ⚡ Ação de 5 minutos:
                  </p>
                  <p style={{ fontSize: 13, color: 'var(--espresso)', marginTop: 2 }}>{video.action5min}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CURSOS GRATUITOS */}
      <div style={{ padding: '24px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <BookOpen size={18} color="var(--oliva)" />
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--espresso)' }}>Cursos Gratuitos</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {FREE_COURSES.map(course => {
            const isSaved = data.savedCourses.includes(course.id);
            return (
              <div
                key={course.id}
                style={{
                  background: 'var(--creme-escuro)',
                  borderRadius: 14,
                  padding: 14,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  border: '1px solid rgba(59,42,32,0.06)',
                }}
              >
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--oliva)', textTransform: 'uppercase' }}>
                    {course.platform} · {course.category}
                  </span>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--espresso)', marginTop: 2 }}>
                    {course.title}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    onClick={() => handleToggleSaveCourse(course.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 6,
                      color: isSaved ? 'var(--caramelo)' : 'var(--text-muted)',
                    }}
                    title={isSaved ? 'Remover dos salvos' : 'Salvar curso'}
                  >
                    <Bookmark size={18} fill={isSaved ? 'var(--caramelo)' : 'none'} />
                  </button>

                  <a
                    href={course.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '8px 12px',
                      borderRadius: 14,
                      background: 'var(--oliva)',
                      color: '#fff',
                      fontSize: 12,
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    Acessar <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ height: 28 }} />
    </div>
  );
};
