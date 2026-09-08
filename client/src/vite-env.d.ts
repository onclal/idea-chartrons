/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Code d'accès du panneau d'administration (mode invité : seule identité de la plateforme). */
  readonly VITE_ADMIN_PASSCODE?: string;
  /** URL du projet Supabase (base partagée, volet Réseau Pro / B2B). */
  readonly VITE_SUPABASE_URL?: string;
  /** Clé publique ("anon"/"publishable") du projet Supabase. */
  readonly VITE_SUPABASE_ANON_KEY?: string;
  /** Backend concierge IA ; absent sur GitHub Pages, le moteur local prend alors le relais. */
  readonly VITE_CONCIERGE_API_URL?: string;
  /**
   * Inclure les commerces `isDemo` dans l’annuaire et le concierge IA.
   * Staging / démo onboarding : `true`. Production : absent ou `false`.
   */
  readonly VITE_INCLUDE_DEMO_DATA?: string;
}

declare module 'virtual:pwa-register' {
  export interface RegisterSWOptions {
    immediate?: boolean;
    onNeedRefresh?: () => void;
    onOfflineReady?: () => void;
    onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void;
  }

  export function registerSW(options?: RegisterSWOptions): (reloadPage?: boolean) => Promise<void>;
}
