import React, { useState } from 'react';
import { Mail, Lock, UserPlus, LogIn, AlertCircle, X, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { signIn, signUp, isConfigured } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Por favor, preencha o e-mail e a senha.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await signIn(email.trim(), password);
        if (error) {
          setErrorMsg(
            error.message.includes('Invalid login credentials')
              ? 'E-mail ou senha incorretos. Verifique e tente novamente.'
              : error.message
          );
        } else {
          setSuccessMsg('Login realizado com sucesso!');
          setTimeout(() => {
            onClose();
          }, 800);
        }
      } else {
        const { error } = await signUp(email.trim(), password);
        if (error) {
          setErrorMsg(error.message);
        } else {
          setSuccessMsg('Conta criada! Se a confirmação por e-mail estiver ativa, confira sua caixa de entrada.');
          setTimeout(() => {
            onClose();
          }, 1800);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro inesperado na autenticação.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px 12px 40px',
    background: 'var(--creme-escuro)',
    border: 'none',
    borderRadius: 12,
    fontSize: 15,
    color: 'var(--espresso)',
    outline: 'none',
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 250,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(5px)',
        }}
        onClick={onClose}
      />
      <div
        style={{
          position: 'relative',
          background: 'var(--creme)',
          borderRadius: '24px 24px 0 0',
          padding: '24px 20px 40px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 -4px 30px rgba(255,255,255,0.08)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--espresso)' }}>
              {mode === 'login' ? 'Entrar no Reluz' : 'Criar sua conta'}
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
              {mode === 'login'
                ? 'Sincronize seus hábitos, finanças e coach de IA'
                : 'Seus dados protegidos e acessíveis em qualquer lugar'}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}
            aria-label="Fechar"
          >
            <X size={20} color="var(--espresso)" />
          </button>
        </div>

        {!isConfigured && (
          <div
            style={{
              padding: '12px 14px',
              background: '#1C1C1E',
              borderRadius: 12,
              border: '1px solid var(--caramelo-claro)',
              marginBottom: 16,
              display: 'flex',
              gap: 10,
              alignItems: 'flex-start',
            }}
          >
            <AlertCircle size={18} color="var(--caramelo)" style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ fontSize: 12, color: 'var(--espresso)', lineHeight: 1.4 }}>
              <strong>Atenção:</strong> Chaves do Supabase ainda não foram adicionadas ao arquivo <code>.env</code>.
              Preencha <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code> para ativar a autenticação na nuvem.
            </div>
          </div>
        )}

        {errorMsg && (
          <div
            style={{
              padding: '10px 14px',
              background: 'rgba(194,77,56,0.1)',
              borderRadius: 10,
              border: '1px solid rgba(194,77,56,0.25)',
              marginBottom: 14,
              color: '#E5604A',
              fontSize: 13,
            }}
          >
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div
            style={{
              padding: '10px 14px',
              background: 'rgba(255,255,255,0.12)',
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.12)',
              marginBottom: 14,
              color: 'var(--oliva)',
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontWeight: 600,
            }}
          >
            <Check size={16} /> {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, display: 'block' }}>
              E-mail
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 14, pointerEvents: 'none' }} />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                required
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, display: 'block' }}>
              Senha
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 14, pointerEvents: 'none' }} />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="No mínimo 6 caracteres"
                required
                style={inputStyle}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !isConfigured}
            style={{
              marginTop: 6,
              padding: '14px',
              background: isConfigured ? 'var(--caramelo)' : 'var(--creme-escuro)',
              color: isConfigured ? 'var(--on-accent)' : 'var(--text-muted)',
              border: 'none',
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 600,
              cursor: isConfigured ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              minHeight: 44,
              boxShadow: isConfigured ? '0 4px 12px rgba(255,255,255,0.12)' : 'none',
            }}
          >
            {loading ? (
              <span>Carregando...</span>
            ) : mode === 'login' ? (
              <>
                <LogIn size={18} /> Entrar
              </>
            ) : (
              <>
                <UserPlus size={18} /> Criar Conta
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: 20, textAlign: 'center' }}>
          {mode === 'login' ? (
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              Ainda não tem conta?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--caramelo)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: 0,
                }}
              >
                Cadastre-se gratuitamente
              </button>
            </p>
          ) : (
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              Já possui cadastro?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--caramelo)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: 0,
                }}
              >
                Fazer login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
