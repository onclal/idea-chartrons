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

export async function getShopContents(shopId: string): Promise<ProContent[]> {
  const client = requireSupabase();
  const { data, error } = await client
    .from(CONTENTS_TABLE)
    .select('*')
    .eq('shop_id', shopId)
    .order('created_at', { ascending: false })
    .limit(200);
  if (error) throw new Error(error.message);
  return (data ?? []).map(fromContentRow);
}

export async function createProContent(draft: ProContentDraft): Promise<ProContent> {
  const client = requireSupabase();
  const body = draft.body.trim();
  if (!body) throw new Error('Le contenu ne peut pas être vide.');
  const now = new Date().toISOString();
  const { data, error } = await client
    .from(CONTENTS_TABLE)
    .insert({
      shop_id: draft.shopId,
      campaign_id: draft.campaignId ?? null,
      channel: draft.channel ?? 'idea',
      title: draft.title ?? null,
      body,
      status: draft.status ?? 'draft',
      scheduled_at: draft.scheduledAt ?? null,
      media_url: draft.mediaUrl ?? null,
      created_at: now,
      updated_at: now,
    })
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  return fromContentRow(data as ProContentRow);
}

export async function updateProContentStatus(id: string, status: ProContentStatus): Promise<ProContent> {
  const client = requireSupabase();
  const { data, error } = await client
    .from(CONTENTS_TABLE)
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  return fromContentRow(data as ProContentRow);
}

export async function getShopCampaigns(shopId: string): Promise<ProCampaign[]> {
  const client = requireSupabase();
  const { data, error } = await client
    .from(CAMPAIGNS_TABLE)
    .select('*')
    .eq('shop_id', shopId)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(fromCampaignRow);
}

export async function createProCampaign(shopId: string, name: string): Promise<ProCampaign> {
  const client = requireSupabase();
  const trimmed = name.trim();
  if (!trimmed) throw new Error('Le nom de la campagne ne peut pas être vide.');
  const { data, error } = await client
    .from(CAMPAIGNS_TABLE)
    .insert({ shop_id: shopId, name: trimmed, created_at: new Date().toISOString() })
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  return fromCampaignRow(data as ProCampaignRow);
}
