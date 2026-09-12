-- Fondation de données pour la fonction "Communication PRO" (nouvel onglet
-- de l'Espace Pro : calendrier, bibliothèque de contenus, campagnes).
--
-- Modèle de confiance : identique à dispo_signals (voir 001 si un jour formalisé) —
-- il n'y a pas de Supabase Auth dans cette application (mode invité intégral,
-- accès Espace Pro par code de commerce vérifié côté fonction RPC). Le shop_id
-- est donc fourni par le client et non vérifié cryptographiquement au niveau de
-- la base. C'est une limite déjà présente ailleurs dans l'app, pas introduite ici.
--
-- Le champ "channel" est volontairement une chaîne libre plutôt qu'une énumération
-- fermée : 'idea' est la seule valeur réelle aujourd'hui, mais une future connexion
-- externe (Google Business Profile, Meta) pourra ajouter ses propres valeurs sans
-- migration de schéma ni changement du calendrier/bibliothèque qui consomment ces
-- lignes de façon générique.

create table if not exists pro_campaigns (
  id uuid primary key default gen_random_uuid(),
  shop_id text not null,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists pro_contents (
  id uuid primary key default gen_random_uuid(),
  shop_id text not null,
  campaign_id uuid references pro_campaigns(id) on delete set null,
  channel text not null default 'idea',
  title text,
  body text not null,
  status text not null default 'draft'
    check (status in ('draft', 'ready', 'scheduled', 'published', 'error')),
  scheduled_at timestamptz,
  published_at timestamptz,
  media_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists pro_contents_shop_id_idx on pro_contents (shop_id);
create index if not exists pro_contents_campaign_id_idx on pro_contents (campaign_id);

alter table pro_campaigns enable row level security;
alter table pro_contents enable row level security;

-- Même politique que dispo_signals : accès via la clé anon, restriction par
-- commerce gérée côté application (shop_id transmis par le client connecté
-- à l'Espace Pro), pas au niveau de la base.
do $$
begin
  if not exists (
    select 1 from pg_policies where tablename = 'pro_campaigns' and policyname = 'pro_campaigns_all'
  ) then
    create policy pro_campaigns_all on pro_campaigns for all using (true) with check (true);
  end if;
  if not exists (
    select 1 from pg_policies where tablename = 'pro_contents' and policyname = 'pro_contents_all'
  ) then
    create policy pro_contents_all on pro_contents for all using (true) with check (true);
  end if;
end $$;
