/**
 * Types de la fonction "Communication PRO" — nouvel onglet de l'Espace Pro,
 * backé par la base partagée Supabase (même principe que le Réseau Pro / Dispo
 * maintenant, voir reseauPro.ts). Une "campagne" regroupe simplement plusieurs
 * contenus liés. Un contenu porte une chaîne de diffusion ("channel") ouverte,
 * pour pouvoir accueillir plus tard une vraie connexion externe (Google,
 * Facebook) sans changer ce modèle ni le calendrier/la bibliothèque qui
 * l'utilisent.
 */

export type ProContentStatus = 'draft' | 'ready' | 'scheduled' | 'published' | 'error';

/** 'idea' est la seule chaîne réelle aujourd'hui ; toute autre valeur est réservée
 * pour une connexion externe future (non construite pour l'instant). */
export type ProContentChannel = 'idea' | (string & {});

export interface ProContent {
  id: string;
  shopId: string;
  campaignId: string | null;
  channel: ProContentChannel;
  title: string | null;
  body: string;
  status: ProContentStatus;
  scheduledAt: string | null;
  publishedAt: string | null;
  mediaUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProContentDraft {
  shopId: string;
  campaignId?: string | null;
  channel?: ProContentChannel;
  title?: string | null;
  body: string;
  status?: ProContentStatus;
  scheduledAt?: string | null;
  mediaUrl?: string | null;
}

export interface ProCampaign {
  id: string;
  shopId: string;
  name: string;
  createdAt: string;
}
