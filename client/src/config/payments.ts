import { parseBooleanEnv } from '@idea-chartrons/shared';

/**
 * Paiement en ligne (carte bancaire, abonnement Premium Pro) : masqué par défaut.
 * Tout le code de paiement reste en place (CheckoutModal, PremiumProModal, reçus) :
 * pour le rebrancher, définir `VITE_PAYMENTS_ENABLED=true` au build.
 */
export const PAYMENTS_ENABLED = parseBooleanEnv(import.meta.env.VITE_PAYMENTS_ENABLED) ?? false;
