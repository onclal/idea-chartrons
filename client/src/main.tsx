import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './config/demo';
import './i18n';
import './index.css';
import { App } from './App';
import { registerPwa } from './lib/pwa';
import { hydrateSharedContent } from './lib/sharedContent';

registerPwa();

// Contenu d'administration partagé : chargé avant l'affichage (1,5 s maximum), sans jamais bloquer le site.
void hydrateSharedContent().finally(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
