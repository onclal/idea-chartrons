import type { ProCampaign, ProContent, ProContentDraft, ProContentStatus } from '@idea-chartrons/shared';
import { requireSupabase } from './supabaseClient';

const CONTENTS_TABLE = 'pro_contents';
const CAMPAIGNS_TABLE = 'pro_campaigns';

interface ProContentRow {
  id: string;
  shop_id: string;
  campaign_id: string | null;
  channel: string;
  title: string | null;
  body: string;
  status: ProContentStatus;
  scheduled_at: string | null;
  published_at: string | null;
  media_url: string | null;
  created_at: string;
  updated_at: string;
}

interface ProCampaignRow {
  id: string;
  shop_id: string;
  name: string;
  created_at: string;
}

function fromContentRow(row: ProContentRow): ProContent {
  return {
    id: row.id,
    shopId: row.shop_id,
    campaignId: row.campaign_id,
    channel: row.channel,
    title: row.title,
    body: row.body,
    status: row.status,
    scheduledAt: row.scheduled_at,
    publishedAt: row.published_at,
    mediaUrl: row.media_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function fromCampaignRow(row: ProCampaignRow): ProCampaign {
  return { id: row.id, shopId: row.shop_id, name: row.name, createdAt: row.created_at };
}

/**
 * Toutes les lectures et écritures passent par des fonctions de la base qui vérifient
 * le code du commerce (ou le code administrateur) : voir
 * `docs/sql/003a_securite_espace_pro_gardiennes.sql`. Les tables ne sont plus
 * accessibles directement depuis le site.
 */
export async function getShopContents(shopId: string, code: string): Promise<ProContent[]> {
  const client = requireSupabase();
  const { data, error } = await client.rpc('pro_list_contents', { p_shop_id: shopId, p_code: code });
  if (error) throw new Error(error.message);
  return ((data as ProContentRow[] | null) ?? []).map(fromContentRow);
}

export async function createProContent(draft: ProContentDraft, code: string): Promise<ProContent> {
  const client = requireSupabase();
  const body = draft.body.trim();
  if (!body) throw new Error('Le contenu ne peut pas être vide.');
  const { data, error } = await client.rpc('pro_create_content', {
    p_shop_id: draft.shopId,
    p_code: code,
    p_campaign_id: draft.campaignId ?? null,
    p_channel: draft.channel ?? 'idea',
    p_title: draft.title ?? null,
    p_body: body,
    p_status: draft.status ?? 'draft',
    p_scheduled_at: draft.scheduledAt ?? null,
    p_media_url: draft.mediaUrl ?? null,
  });
  if (error) throw new Error(error.message);
  return fromContentRow(data as ProContentRow);
}

export async function updateProContentStatus(
  shopId: string,
  code: string,
  id: string,
  status: ProContentStatus,
): Promise<ProContent> {
  const client = requireSupabase();
  const { data, error } = await client.rpc('pro_update_content_status', {
    p_shop_id: shopId,
    p_code: code,
    p_id: id,
    p_status: status,
  });
  if (error) throw new Error(error.message);
  return fromContentRow(data as ProContentRow);
}

export async function getShopCampaigns(shopId: string, code: string): Promise<ProCampaign[]> {
  const client = requireSupabase();
  const { data, error } = await client.rpc('pro_list_campaigns', { p_shop_id: shopId, p_code: code });
  if (error) throw new Error(error.message);
  return ((data as ProCampaignRow[] | null) ?? []).map(fromCampaignRow);
}

export async function createProCampaign(shopId: string, code: string, name: string): Promise<ProCampaign> {
  const client = requireSupabase();
  const trimmed = name.trim();
  if (!trimmed) throw new Error('Le nom de la campagne ne peut pas être vide.');
  const { data, error } = await client.rpc('pro_create_campaign', { p_shop_id: shopId, p_code: code, p_name: trimmed });
  if (error) throw new Error(error.message);
  return fromCampaignRow(data as ProCampaignRow);
}
