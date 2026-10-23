import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/globals.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Registra o Service Worker do PWA se suportado
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(reg => {
        console.log('ServiceWorker registrado com sucesso:', reg.scope);
      })
      .catch(err => {
        console.error('Falha ao registrar ServiceWorker:', err);
      });
  });
}
