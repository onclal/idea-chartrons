/**
 * Types du "Réseau Pro" — volet B2B de l'application, backé par la base partagée
 * Supabase (contrairement au reste des données, qui vit encore dans le localStorage
 * par appareil). Voir le document de synthèse du brainstorming B2B pour le contexte.
 */

/** Un signal "je suis dispo là maintenant" publié par un commerçant. */
export interface DispoSignal {
  id: string;
  shopId: string;
  shopName: string;
  message: string;
  createdAt: string;
  expiresAt: string;
}

/** Données nécessaires pour publier un nouveau signal de disponibilité. */
export interface DispoSignalDraft {
  shopId: string;
  shopName: string;
  message: string;
  /** Durée de validité du signal, en minutes (bornée côté base à 6h max). */
  durationMinutes: number;
}
