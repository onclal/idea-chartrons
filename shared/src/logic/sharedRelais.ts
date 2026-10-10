import { LocalRelaisRetraitStatus } from '../types/enums.js';
import type { LocalRelais } from '../types/models.js';

/**
 * Local Relais partagé (voir docs/sql/007_local_relais_partage.sql).
 * La version publique d'un dépôt n'a ni nom ni code de retrait : le code n'est connu que du
 * déposant, de la personne qui réserve le retrait (gardé sur leur appareil) et de l'administrateur.
 */

const STATUSES = new Set<string>(Object.values(LocalRelaisRetraitStatus));
const SLOT_ID = /^creneau-\d{4}-\d{2}-\d{2}-\d{2}:\d{2}-(Depot|Retrait)$/;

function str(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function date(value: unknown): string | null {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value)) ? value : null;
}

function slot(value: unknown): string | null {
  return typeof value === 'string' && SLOT_ID.test(value) ? value : null;
}

/** Valide un dépôt reçu de Supabase (colonnes de la table) ; null s'il est douteux. */
export function parseSharedRelais(raw: unknown): LocalRelais | null {
  if (!raw || typeof raw !== 'object') return null;
  const row = raw as Record<string, unknown>;
  const id = str(row.id, 80);
  const postId = str(row.post_id, 80);
  if (!id || !postId) return null;
  if (typeof row.statut !== 'string' || !STATUSES.has(row.statut)) return null;
  const now = new Date().toISOString();
  const created = date(row.created_at) ?? now;
  return {
    id,
    postId,
    deposantNom: str(row.deposant_nom, 80) || null,
    codeQrValidation: str(row.code, 40),
    dateDepot: date(row.date_depot) ?? created,
    statutRetrait: row.statut as LocalRelaisRetraitStatus,
    creneauDepotId: slot(row.creneau_depot),
    creneauRetraitId: slot(row.creneau_retrait),
    createdAt: created,
    updatedAt: date(row.updated_at) ?? created,
  };
}

/**
 * Fusion : l'état partagé (statut, créneaux) fait foi ; le nom et le code gardés sur cet appareil
 * complètent la version publique. Les dépôts seulement locaux restent visibles.
 */
export function mergeSharedRelais(local: LocalRelais[], shared: LocalRelais[]): LocalRelais[] {
  if (shared.length === 0) return local;
  const localById = new Map(local.map((relais) => [relais.id, relais]));
  const sharedIds = new Set(shared.map((relais) => relais.id));
  const view = shared.map((relais) => {
    const mine = localById.get(relais.id);
    return {
      ...relais,
      deposantNom: relais.deposantNom ?? mine?.deposantNom ?? null,
      codeQrValidation: relais.codeQrValidation || mine?.codeQrValidation || '',
    };
  });
  return [...view, ...local.filter((relais) => !sharedIds.has(relais.id))];
}
