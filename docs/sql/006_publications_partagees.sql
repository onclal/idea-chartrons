-- Publications partagées : annonces des habitants et offres Anti-Gaspi.
--
-- Règles :
--   * Une annonce envoyée par un visiteur est « En_attente » : invisible des autres tant que
--     l'administrateur ne l'a pas validée.
--   * Une offre Anti-Gaspi est publiée tout de suite (pas de validation), avec téléphone et fin de validité.
--   * Lecture publique : seulement ce qui n'est pas en attente.
--   * L'auteur peut retirer ou clore sa publication grâce à une clé gardée sur son appareil (stockée ici sous forme chiffrée).
--   * L'administrateur voit tout, valide, modifie et supprime avec le code administrateur (vérifié par la base).
--
-- Ne touche ni aux tables ideeprod_*, ni à l'Espace Pro, ni au contenu partagé existant.
-- Nécessite 003a (idea_verify_admin).

create table if not exists public.idea_shared_posts (
  id text primary key,
  payload jsonb not null,
  statut text not null,
  owner_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.idea_shared_posts enable row level security;

drop policy if exists idea_shared_posts_lecture on public.idea_shared_posts;
create policy idea_shared_posts_lecture
  on public.idea_shared_posts for select
  using (statut <> 'En_attente');

-- Aucune écriture directe : tout passe par les fonctions ci-dessous.
revoke all on public.idea_shared_posts from anon, authenticated;
grant select (id, payload, statut, created_at) on public.idea_shared_posts to anon, authenticated;

create or replace function public.idea_submit_post(p_post jsonb, p_owner_token text)
returns text
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_id text := p_post ->> 'id';
  v_type text := p_post ->> 'type';
  v_statut text;
begin
  if jsonb_typeof(p_post) <> 'object' or length(p_post::text) > 400000 then
    raise exception 'invalid post' using errcode = '22023';
  end if;
  if v_id is null or v_id !~ '^post-[0-9a-z-]{1,70}$' then
    raise exception 'invalid id' using errcode = '22023';
  end if;
  if coalesce(length(p_post ->> 'titre'), 0) not between 1 and 200 then
    raise exception 'invalid title' using errcode = '22023';
  end if;
  if v_type not in ('Don', 'Vente', 'Service_Aide', 'Petit_Boulot', 'Offre_Pro', 'Anti_Gaspi') then
    raise exception 'invalid type' using errcode = '22023';
  end if;
  if coalesce(length(p_owner_token), 0) < 16 then
    raise exception 'invalid token' using errcode = '22023';
  end if;
  if (select count(*) from public.idea_shared_posts where statut = 'En_attente') >= 500 then
    raise exception 'queue full' using errcode = '53400';
  end if;

  -- Anti-Gaspi : publié tout de suite si téléphone et fin de validité sont renseignés.
  if v_type = 'Anti_Gaspi'
     and coalesce(p_post ->> 'telephone', '') <> ''
     and coalesce(p_post ->> 'expiresAt', '') <> '' then
    v_statut := 'Disponible';
  else
    v_statut := 'En_attente';
  end if;

  insert into public.idea_shared_posts (id, payload, statut, owner_hash)
  values (
    v_id,
    p_post || jsonb_build_object('statut', v_statut),
    v_statut,
    encode(extensions.digest(p_owner_token, 'sha256'), 'hex')
  )
  on conflict (id) do nothing;
  return v_statut;
end;
$$;

create or replace function public.idea_owner_set_status(p_id text, p_owner_token text, p_statut text)
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  if p_statut not in ('Disponible', 'Réservé', 'Clôturé') then
    raise exception 'invalid status' using errcode = '22023';
  end if;
  update public.idea_shared_posts
     set statut = case when statut = 'En_attente' then statut else p_statut end,
         payload = payload || jsonb_build_object('statut', case when statut = 'En_attente' then statut else p_statut end),
         updated_at = now()
   where id = p_id
     and owner_hash = encode(extensions.digest(coalesce(p_owner_token, ''), 'sha256'), 'hex');
end;
$$;

create or replace function public.idea_owner_delete_post(p_id text, p_owner_token text)
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  delete from public.idea_shared_posts
   where id = p_id
     and owner_hash = encode(extensions.digest(coalesce(p_owner_token, ''), 'sha256'), 'hex');
end;
$$;

create or replace function public.idea_admin_list_posts(p_code text)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  if not public.idea_verify_admin(p_code) then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  return coalesce(
    (select jsonb_agg(payload || jsonb_build_object('statut', statut) order by created_at desc)
       from public.idea_shared_posts),
    '[]'::jsonb
  );
end;
$$;

create or replace function public.idea_admin_upsert_post(p_code text, p_post jsonb)
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_id text := p_post ->> 'id';
  v_statut text := p_post ->> 'statut';
begin
  if not public.idea_verify_admin(p_code) then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  if jsonb_typeof(p_post) <> 'object' or length(p_post::text) > 400000 or v_id is null
     or v_statut not in ('En_attente', 'Disponible', 'Réservé', 'Dépôt_Local', 'Clôturé') then
    raise exception 'invalid post' using errcode = '22023';
  end if;
  insert into public.idea_shared_posts (id, payload, statut)
  values (v_id, p_post, v_statut)
  on conflict (id) do update
    set payload = excluded.payload, statut = excluded.statut, updated_at = now();
end;
$$;

create or replace function public.idea_admin_delete_post(p_code text, p_id text)
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  if not public.idea_verify_admin(p_code) then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  delete from public.idea_shared_posts where id = p_id;
end;
$$;

revoke all on function public.idea_submit_post(jsonb, text) from public;
revoke all on function public.idea_owner_set_status(text, text, text) from public;
revoke all on function public.idea_owner_delete_post(text, text) from public;
revoke all on function public.idea_admin_list_posts(text) from public;
revoke all on function public.idea_admin_upsert_post(text, jsonb) from public;
revoke all on function public.idea_admin_delete_post(text, text) from public;
grant execute on function public.idea_submit_post(jsonb, text) to anon, authenticated;
grant execute on function public.idea_owner_set_status(text, text, text) to anon, authenticated;
grant execute on function public.idea_owner_delete_post(text, text) to anon, authenticated;
grant execute on function public.idea_admin_list_posts(text) to anon, authenticated;
grant execute on function public.idea_admin_upsert_post(text, jsonb) to anon, authenticated;
grant execute on function public.idea_admin_delete_post(text, text) to anon, authenticated;

-- Contrôle : résultat attendu = 0 (aucune publication partagée pour l'instant).
select count(*) as publications_actuelles from public.idea_shared_posts;
