-- Lot 0 — Sécurité de l'Espace Pro, étape A : fonctions « gardiennes ».
--
-- Constat : pro_contents et pro_campaigns avaient une règle « for all using (true) »,
-- donc n'importe qui disposant de la clé publique du site pouvait lire, modifier ou
-- effacer les contenus de tous les commerçants. Le code du commerce n'était vérifié
-- qu'à l'entrée de l'Espace Pro, dans le navigateur.
--
-- Correction : chaque lecture ou écriture de l'Espace Pro passe par une fonction
-- SECURITY DEFINER qui vérifie, côté base, le code du commerce (via la fonction
-- existante verify_shop_access) ou le code administrateur (haché avec bcrypt).
--
-- Ce script ne ferme encore rien : il ajoute seulement les fonctions. Il peut être
-- exécuté avant la mise en ligne du site qui les utilise, sans rien casser.
-- La fermeture des anciennes règles est dans 003b, à exécuter APRÈS la mise en ligne.

create extension if not exists pgcrypto with schema extensions;

-- Code administrateur : une seule ligne, jamais lisible depuis le site (RLS sans règle).
create table if not exists public.idea_admin_access (
  id int primary key default 1 check (id = 1),
  passcode_hash text not null,
  updated_at timestamptz not null default now()
);
alter table public.idea_admin_access enable row level security;

create or replace function public.idea_verify_admin(p_code text)
returns boolean
language sql
stable
security definer
set search_path = public, extensions
as $$
  select exists (
    select 1 from public.idea_admin_access a
    where coalesce(p_code, '') <> ''
      and a.passcode_hash = extensions.crypt(p_code, a.passcode_hash)
  );
$$;

-- Vrai si le code donné ouvre ce commerce : code du commerce, ou code administrateur.
create or replace function public.idea_can_manage_shop(p_shop_id text, p_code text)
returns boolean
language plpgsql
stable
security definer
set search_path = public, extensions
as $$
begin
  if coalesce(p_shop_id, '') = '' or coalesce(p_code, '') = '' then
    return false;
  end if;
  if public.idea_verify_admin(p_code) then
    return true;
  end if;
  return exists (select 1 from public.verify_shop_access(p_code) v where v.shop_id = p_shop_id);
end;
$$;

create or replace function public.idea_require_shop(p_shop_id text, p_code text)
returns void
language plpgsql
stable
security definer
set search_path = public, extensions
as $$
begin
  if not public.idea_can_manage_shop(p_shop_id, p_code) then
    raise exception 'Accès refusé : code du commerce invalide.' using errcode = '42501';
  end if;
end;
$$;

-- Communication PRO : contenus.
create or replace function public.pro_list_contents(p_shop_id text, p_code text)
returns setof public.pro_contents
language plpgsql
stable
security definer
set search_path = public, extensions
as $$
begin
  perform public.idea_require_shop(p_shop_id, p_code);
  return query
    select * from public.pro_contents
    where shop_id = p_shop_id
    order by created_at desc
    limit 200;
end;
$$;

create or replace function public.pro_create_content(
  p_shop_id text,
  p_code text,
  p_campaign_id uuid,
  p_channel text,
  p_title text,
  p_body text,
  p_status text,
  p_scheduled_at timestamptz,
  p_media_url text
)
returns public.pro_contents
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_row public.pro_contents;
begin
  perform public.idea_require_shop(p_shop_id, p_code);
  if coalesce(btrim(p_body), '') = '' then
    raise exception 'Le contenu ne peut pas être vide.';
  end if;
  if p_campaign_id is not null
     and not exists (select 1 from public.pro_campaigns c where c.id = p_campaign_id and c.shop_id = p_shop_id) then
    raise exception 'Campagne inconnue pour ce commerce.';
  end if;
  insert into public.pro_contents (shop_id, campaign_id, channel, title, body, status, scheduled_at, media_url)
  values (
    p_shop_id,
    p_campaign_id,
    coalesce(nullif(btrim(p_channel), ''), 'idea'),
    p_title,
    btrim(p_body),
    coalesce(p_status, 'draft'),
    p_scheduled_at,
    p_media_url
  )
  returning * into v_row;
  return v_row;
end;
$$;

create or replace function public.pro_update_content_status(
  p_shop_id text,
  p_code text,
  p_id uuid,
  p_status text
)
returns public.pro_contents
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_row public.pro_contents;
begin
  perform public.idea_require_shop(p_shop_id, p_code);
  update public.pro_contents
     set status = p_status,
         updated_at = now()
   where id = p_id and shop_id = p_shop_id
  returning * into v_row;
  if v_row.id is null then
    raise exception 'Contenu introuvable pour ce commerce.';
  end if;
  return v_row;
end;
$$;

-- Communication PRO : campagnes.
create or replace function public.pro_list_campaigns(p_shop_id text, p_code text)
returns setof public.pro_campaigns
language plpgsql
stable
security definer
set search_path = public, extensions
as $$
begin
  perform public.idea_require_shop(p_shop_id, p_code);
  return query
    select * from public.pro_campaigns
    where shop_id = p_shop_id
    order by created_at desc;
end;
$$;

create or replace function public.pro_create_campaign(p_shop_id text, p_code text, p_name text)
returns public.pro_campaigns
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_row public.pro_campaigns;
begin
  perform public.idea_require_shop(p_shop_id, p_code);
  if coalesce(btrim(p_name), '') = '' then
    raise exception 'Le nom de la campagne ne peut pas être vide.';
  end if;
  insert into public.pro_campaigns (shop_id, name) values (p_shop_id, btrim(p_name))
  returning * into v_row;
  return v_row;
end;
$$;

-- « Dispo maintenant » : la lecture reste publique, la publication passe par le code.
create or replace function public.pro_create_dispo_signal(
  p_shop_id text,
  p_code text,
  p_shop_name text,
  p_message text,
  p_duration_minutes int
)
returns public.dispo_signals
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_row public.dispo_signals;
  v_minutes int := least(greatest(coalesce(p_duration_minutes, 60), 5), 360);
begin
  perform public.idea_require_shop(p_shop_id, p_code);
  if coalesce(btrim(p_message), '') = '' then
    raise exception 'Le message ne peut pas être vide.';
  end if;
  insert into public.dispo_signals (shop_id, shop_name, message, created_at, expires_at)
  values (p_shop_id, p_shop_name, left(btrim(p_message), 140), now(), now() + make_interval(mins => v_minutes))
  returning * into v_row;
  return v_row;
end;
$$;

-- Les fonctions internes ne sont pas appelables depuis le site.
revoke all on function public.idea_can_manage_shop(text, text) from public, anon, authenticated;
revoke all on function public.idea_require_shop(text, text) from public, anon, authenticated;

-- Les fonctions publiques de l'Espace Pro et de l'admin sont appelables depuis le site.
grant execute on function public.idea_verify_admin(text) to anon, authenticated;
grant execute on function public.pro_list_contents(text, text) to anon, authenticated;
grant execute on function public.pro_create_content(text, text, uuid, text, text, text, text, timestamptz, text) to anon, authenticated;
grant execute on function public.pro_update_content_status(text, text, uuid, text) to anon, authenticated;
grant execute on function public.pro_list_campaigns(text, text) to anon, authenticated;
grant execute on function public.pro_create_campaign(text, text, text) to anon, authenticated;
grant execute on function public.pro_create_dispo_signal(text, text, text, text, int) to anon, authenticated;

-- Contrôle : doit afficher « false » sans erreur (un faux code n'ouvre aucun commerce).
select public.idea_can_manage_shop('commerce-de-test', 'code-bidon') as doit_etre_false;
