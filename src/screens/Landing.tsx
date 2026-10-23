import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Dumbbell,
  Moon,
  DollarSign,
  Target,
  TrendingUp,
  CheckCircle2,
  ShieldCheck,
  Check,
  ChevronRight,
} from 'lucide-react';
import { AuthModal } from '../components/AuthModal';
import './landing.css';

interface Props {
  onEnter: () => void;
}

const Logo: React.FC = () => (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true">
    <rect x="3" y="3" width="24" height="5" fill="#F2F2F3" />
    <rect x="3" y="12.5" width="18" height="5" fill="#F2F2F3" />
    <rect x="3" y="22" width="24" height="5" fill="#F2F2F3" />
    <rect x="3" y="3" width="5" height="24" fill="#F2F2F3" />
  </svg>
);

const VALORES = [
  { icon: TrendingUp, t: 'Desenvolvimento pessoal' },
  { icon: Sparkles, t: 'Acompanhamento com IA' },
  { icon: ShieldCheck, t: 'Dados reais e organizados' },
  { icon: Target, t: 'Para uma vida com propósito' },
];

const RECURSOS = [
  { icon: CheckCircle2, t: 'Hábitos', d: 'Construa disciplina e veja seu progresso dia após dia.' },
  { icon: BookOpen, t: 'Bíblia', d: 'Leia, reflita e aplique a Palavra no seu dia a dia.' },
  { icon: Dumbbell, t: 'Treino', d: 'Registre seus treinos e acompanhe a evolução.' },
  { icon: Moon, t: 'Sono', d: 'Entenda seu descanso e melhore sua energia.' },
  { icon: DollarSign, t: 'Financeiro', d: 'Controle seus gastos, receitas e metas.' },
  { icon: Target, t: 'Foco', d: 'Elimine distrações e mantenha o que realmente importa.' },
  { icon: TrendingUp, t: 'Vendas', d: 'Organize suas oportunidades e acompanhe resultados.' },
  { icon: Sparkles, t: 'Coach de IA', d: 'Avaliação diária e recomendações baseadas nos seus registros.' },
];

const EM_BREVE = [
  'Modo escuro/claro automático',
  'Notificações inteligentes',
  'Metas personalizadas',
  'Comunidade (opcional)',
  'Integração com calendário',
  'Gamificação (conquistas)',
  'Versão web e app (PWA)',
];

const BARRAS = [
  ['Hábitos', 90],
  ['Treino', 85],
  ['Finanças', 75],
  ['Vendas', 80],
  ['Bíblia', 90],
  ['Sono', 80],
  ['Foco', 85],
] as const;

export const Landing: React.FC<Props> = ({ onEnter }) => {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <div className="lp">
      <section className="lp-hero" id="inicio">
        <div className="lp-wrap">
          <header className="lp-head">
            <div className="lp-logo">
              <Logo /> EMPRESÁRIO
            </div>
            <nav className="lp-nav" aria-label="Seções">
              <a href="#inicio">Início</a>
              <a href="#recursos">Recursos</a>
              <a href="#telas">Telas</a>
              <a href="#sobre">Sobre</a>
            </nav>
            <button className="lp-pill" onClick={() => setAuthOpen(true)}>
              Entrar
            </button>
          </header>

          <div className="lp-grid">
            <div>
              <h1>
                Sua rotina
                <br />
                mais <em>produtiva,</em>
                <br />
                seu <em>futuro</em> maior.
              </h1>
              <p className="lp-sub">
                O app que ajuda você a evoluir todos os dias, com hábitos, foco, saúde, finanças, vendas e
                aprendizado, tudo em um só lugar.
              </p>
              <div className="lp-cta">
                <button className="lp-btn" onClick={onEnter}>
                  Comece agora
                </button>
                <a className="lp-ghost" href="#recursos">
                  <ChevronRight size={18} /> Saiba mais
                </a>
              </div>
            </div>

            <div>
              <div className="lp-phone" aria-hidden="true">
                <div className="lp-screen">
                  <p style={{ fontSize: 15, fontWeight: 600 }}>Bom dia</p>
                  <p style={{ fontSize: 10.5, color: 'rgba(242,242,243,.6)', marginTop: 2 }}>
                    Disciplina hoje, liberdade amanhã.
                  </p>
                  <div className="lp-card" style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: '50%',
                        border: '4px solid #F2F2F3',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 18,
                        fontWeight: 600,
                      }}
                    >
                      8,5
                    </div>
                    <small>Sua nota de hoje</small>
                  </div>
                  {BARRAS.map(([nome, v]) => (
                    <div className="lp-bar" key={nome}>
                      <span style={{ width: 52 }}>{nome}</span>
                      <i>
                        <b style={{ width: `${v}%` }} />
                      </i>
                    </div>
                  ))}
                </div>
              </div>
              <p className="lp-note">Exemplo ilustrativo</p>
            </div>
          </div>

          <div className="lp-values">
            {VALORES.map(v => (
              <div className="lp-value" key={v.t}>
                <v.icon size={22} strokeWidth={1.5} />
                {v.t}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-sec" id="recursos">
        <div className="lp-wrap">
          <h2>
            Tudo o que você precisa,
            <br />
            em um só app.
          </h2>
          <div className="lp-feats">
            {RECURSOS.map(r => (
              <div className="lp-feat" key={r.t}>
                <div className="lp-ico">
                  <r.icon size={18} strokeWidth={1.6} />
                </div>
                <div>
                  <b>{r.t}</b>
                  <span>{r.d}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="lp-box" id="sobre">
            <div>
              <h2 style={{ fontSize: 20 }}>Mais do que um app. Um parceiro na sua jornada.</h2>
              <p>
                O Empresário foi feito para quem quer evoluir de verdade, com tecnologia, propósito e um plano
                claro.
              </p>
            </div>
            <span className="lp-sign">Disciplina gera liberdade.</span>
          </div>
        </div>
      </section>

      <section className="lp-light" id="telas">
        <div className="lp-wrap">
          <h2 style={{ fontSize: 26, fontWeight: 500, letterSpacing: '-.02em' }}>Design moderno. Experiência única.</h2>
          <div className="lp-shots">
            <figure className="lp-shot">
              <div className="lp-mini">
                <h4>Hoje</h4>
                <div className="lp-card"><small>Desafio do dia</small><div style={{ height: 3, background: 'rgba(255,255,255,.12)', marginTop: 8 }}><div style={{ width: '66%', height: '100%', background: '#F2F2F3' }} /></div></div>
                <div className="lp-two">
                  <div className="lp-card"><small>Hábitos</small><strong>8/10</strong></div>
                  <div className="lp-card"><small>Treino</small><strong>1/1</strong></div>
                  <div className="lp-card"><small>Finanças</small><strong>R$ 1.250</strong></div>
                  <div className="lp-card"><small>Vendas</small><strong>3</strong></div>
                </div>
              </div>
              <figcaption><b>Tela Hoje</b><span>Veja seu progresso e mantenha o foco no que importa.</span></figcaption>
            </figure>
            <figure className="lp-shot">
              <div className="lp-mini">
                <h4>Painel</h4>
                <div className="lp-card" style={{ padding: 12 }}>
                  <small>Sua evolução</small>
                  <svg viewBox="0 0 120 60" width="100%" aria-hidden="true"><polyline points="0,50 20,42 40,44 60,30 80,32 100,16 120,8" fill="none" stroke="#F2F2F3" strokeWidth="2" /></svg>
                </div>
                <div className="lp-two">
                  <div className="lp-card"><small>Treino</small><strong>4/7</strong></div>
                  <div className="lp-card"><small>Foco</small><strong>180 min</strong></div>
                </div>
              </div>
              <figcaption><b>Tela Painel</b><span>Visualize seus dados e veja onde melhorar.</span></figcaption>
            </figure>
            <figure className="lp-shot">
              <div className="lp-mini">
                <h4>Registrar</h4>
                {['Hábitos', 'Treino', 'Finanças', 'Vendas', 'Bíblia', 'Sono'].map(n => (
                  <div className="lp-card" key={n} style={{ padding: 8 }}><small style={{ color: '#F2F2F3', fontSize: 11 }}>{n}</small></div>
                ))}
              </div>
              <figcaption><b>Tela Registrar</b><span>Registre sua rotina de forma simples e rápida.</span></figcaption>
            </figure>
            <figure className="lp-shot">
              <div className="lp-mini">
                <h4>Aprender</h4>
                {['Cursos', 'Livros', 'Vídeos'].map(n => (
                  <div className="lp-card" key={n}><small>Recomendado</small><strong style={{ fontSize: 12 }}>{n}</strong></div>
                ))}
              </div>
              <figcaption><b>Tela Aprender</b><span>Conteúdos selecionados para o seu momento.</span></figcaption>
            </figure>
            <figure className="lp-shot">
              <div className="lp-mini">
                <h4>Coach de IA</h4>
                <div style={{ textAlign: 'center', margin: '4px 0 10px' }}>
                  <div style={{ width: 64, height: 64, margin: '0 auto', borderRadius: '50%', border: '4px solid #F2F2F3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 600 }}>8,5</div>
                </div>
                <div className="lp-card"><small>Pontos fortes</small></div>
                <div className="lp-card"><small>Pontos a melhorar</small></div>
                <div className="lp-card"><small>Recomendações para amanhã</small></div>
              </div>
              <figcaption><b>Coach de IA</b><span>Avaliação diária e recomendações feitas para você.</span></figcaption>
            </figure>
          </div>
          <p style={{ fontSize: 11, color: '#6b6b70', marginTop: 18 }}>Telas ilustrativas (exemplo).</p>
        </div>
      </section>

      <section className="lp-sec">
        <div className="lp-wrap lp-final">
          <div>
            <h2>
              Grandes resultados
              <br />
              não acontecem por acaso.
            </h2>
            <p className="lp-sub">
              Eles são o resultado de hábitos, foco, disciplina e boas decisões todos os dias. O Empresário ajuda
              você a colocar isso em prática, de forma simples e eficiente.
            </p>
            <div className="lp-cta">
              <button className="lp-btn" onClick={onEnter}>Comece agora</button>
            </div>
          </div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 600 }}>Próximas ideias</p>
            <ul className="lp-check">
              {EM_BREVE.map(t => (
                <li key={t}><Check size={15} /> {t}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <footer className="lp-wrap lp-foot">
        <span>EMPRESÁRIO</span>
        <span>DISCIPLINA. FOCO. EVOLUÇÃO.</span>
        <span style={{ letterSpacing: 0 }}>Seu futuro começa com as escolhas de hoje.</span>
      </footer>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
};
