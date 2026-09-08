import type { DispoSignal, DispoSignalDraft } from '@idea-chartrons/shared';
import { requireSupabase } from './supabaseClient';

const TABLE = 'dispo_signals';
const MIN_DURATION_MINUTES = 5;
const MAX_DURATION_MINUTES = 6 * 60;

interface DispoSignalRow {
  id: string;
  shop_id: string;
  shop_name: string;
  message: string;
  created_at: string;
  expires_at: string;
}

function fromRow(row: DispoSignalRow): DispoSignal {
  return {
    id: row.id,
    shopId: row.shop_id,
    shopName: row.shop_name,
    message: row.message,
    createdAt: row.created_at,
    expiresAt: row.expires_at,
  };
}

export async function getActiveDispoSignals(): Promise<DispoSignal[]> {
  const client = requireSupabase();
  const { data, error } = await client
    .from(TABLE)
    .select('*')
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw new Error(error.message);
  return (data ?? []).map(fromRow);
}

export async function getShopDispoSignals(shopId: string): Promise<DispoSignal[]> {
  const client = requireSupabase();
  const { data, error } = await client
    .from(TABLE)
    .select('*')
    .eq('shop_id', shopId)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(fromRow);
}

export async function createDispoSignal(draft: DispoSignalDraft): Promise<DispoSignal> {
  const client = requireSupabase();
  const message = draft.message.trim().slice(0, 140);
  if (!message) throw new Error('Le message ne peut pas être vide.');
  const duration = Math.min(
    Math.max(Math.round(draft.durationMinutes), MIN_DURATION_MINUTES),
    MAX_DURATION_MINUTES,
  );
  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + duration * 60_000);
  const { data, error } = await client
    .from(TABLE)
    .insert({
      shop_id: draft.shopId,
      shop_name: draft.shopName,
      message,
      created_at: createdAt.toISOString(),
      expires_at: expiresAt.toISOString(),
    })
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  return fromRow(data as DispoSignalRow);
}
