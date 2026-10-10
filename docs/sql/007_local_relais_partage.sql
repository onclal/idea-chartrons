-- Local Relais partagé : dépôts, créneaux et retraits vus par tous les visiteurs.
--
-- Règles :
--   * L'auteur d'une publication (clé gardée sur son appareil, voir 006) réserve un créneau de dépôt.
--   * Les places des créneaux sont comptées ici, pour tout le monde (capacité et créneaux bloqués
--     fixés par l'administrateur dans le contenu partagé « relais »).
--   * Un visiteur réserve un créneau de retrait pour un objet arrivé au Local.
--   * Le code de retrait n'est jamais lisible publiquement : seuls le déposant, la personne qui
--     réserve le retrait et l'administrateur le reçoivent.
--   * L'administrateur fait avancer le statut (arrivé au Local, puis récupéré).
--
-- Ne touche ni aux tables ideeprod_*, ni à l'Espace Pro. Nécessite 004 et 006.

alter table public.idea_shared_content drop constraint if exists idea_shared_content_kind_check;
alter table public.idea_shared_content
  add constraint idea_shared_content_kind_check
  check (kind in ('agenda', 'banners', 'hero', 'pricing', 'settings', 'relais'));

create or replace function public.idea_admin_save_content(p_code text, p_kind text, p_items jsonb)
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  if not public.idea_verify_admin(p_code) then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  if p_kind not in ('agenda', 'banners', 'hero', 'pricing', 'settings', 'relais') then
    raise exception 'invalid kind' using errcode = '22023';
  end if;
  if jsonb_typeof(p_items) <> 'array' then
    raise exception 'items must be an array' using errcode = '22023';
  end if;
  insert into public.idea_shared_content (kind, items, updated_at)
  values (p_kind, p_items, now())
  on conflict (kind) do update set items = excluded.items, updated_at = now();
end;
$$;

create table if not exists public.idea_shared_relais (
  id text primary key,
  post_id text not null unique,
  deposant_nom text,
  code text not null,
  statut text not null default 'En_Attente',
  creneau_depot text,
  creneau_retrait text,
  date_depot timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.idea_shared_relais enable row level security;

drop policy if exists idea_shared_relais_lecture on public.idea_shared_relais;
create policy idea_shared_relais_lecture
  on public.idea_shared_relais for select
  using (true);

-- Lecture publique sans le nom du déposant ni le code de retrait.
revoke all on public.idea_shared_relais from anon, authenticated;
grant select (id, post_id, statut, creneau_depot, creneau_retrait, date_depot, created_at, updated_at)
  on public.idea_shared_relais to anon, authenticated;

-- Vrai si le créneau peut encore être réservé (non bloqué, places restantes).
create or replace function public.idea_relais_slot_free(p_creneau text)
returns boolean
language plpgsql
stable
security definer
set search_path = public, extensions
as $$
declare
  v_config jsonb := (select items -> 0 from public.idea_shared_content where kind = 'relais');
  v_capacite int := coalesce((v_config -> 'settings' ->> 'defaultCapacite')::int, 3);
  v_reserves int;
begin
  if p_creneau is null or p_creneau !~ '^creneau-\d{4}-\d{2}-\d{2}-\d{2}:\d{2}-(Depot|Retrait)$' then
    return false;
  end if;
  if coalesce(v_config -> 'blocked', '[]'::jsonb) ? p_creneau then
    return false;
  end if;
  select count(*) into v_reserves
    from public.idea_shared_relais
   where statut <> 'Récupéré' and (creneau_depot = p_creneau or creneau_retrait = p_creneau);
  return v_reserves < greatest(1, least(30, v_capacite));
end;
$$;

create or replace function public.idea_relais_propose(
  p_id text, p_post_id text, p_deposant text, p_creneau text, p_owner_token text
)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_code text := 'QR-CHARTRONS-' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 8));
  v_row public.idea_shared_relais;
begin
  if p_id is null or p_id !~ '^relais-[0-9a-z-]{1,70}$' then
    raise exception 'invalid id' using errcode = '22023';
  end if;
  if p_creneau !~ '-Depot$' then
    raise exception 'Invalid or full depot slot' using errcode = 'P0001';
  end if;
  if not exists (
    select 1 from public.idea_shared_posts
     where id = p_post_id
       and owner_hash = encode(extensions.digest(coalesce(p_owner_token, ''), 'sha256'), 'hex')
  ) then
    raise exception 'post not found' using errcode = '42501';
  end if;
  if exists (select 1 from public.idea_shared_relais where post_id = p_post_id) then
    raise exception 'Depot already exists' using errcode = 'P0001';
  end if;
  perform pg_advisory_xact_lock(hashtext(p_creneau));
  if not public.idea_relais_slot_free(p_creneau) then
    raise exception 'Invalid or full depot slot' using errcode = 'P0001';
  end if;

  insert into public.idea_shared_relais (id, post_id, deposant_nom, code, creneau_depot)
  values (p_id, p_post_id, nullif(left(trim(coalesce(p_deposant, '')), 80), ''), v_code, p_creneau)
  returning * into v_row;

  update public.idea_shared_posts
     set statut = 'Dépôt_Local',
         payload = payload || jsonb_build_object('statut', 'Dépôt_Local'),
         updated_at = now()
   where id = p_post_id and statut <> 'En_attente';

  return jsonb_build_object('id', v_row.id, 'code', v_row.code, 'dateDepot', v_row.date_depot);
end;
$$;

create or replace function public.idea_relais_reserve(p_id text, p_creneau text)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_row public.idea_shared_relais;
begin
  if p_creneau !~ '-Retrait$' then
    raise exception 'Invalid or full pickup slot' using errcode = 'P0001';
  end if;
  perform pg_advisory_xact_lock(hashtext(p_creneau));
  select * into v_row from public.idea_shared_relais where id = p_id for update;
  if not found then
    raise exception 'Relais not found' using errcode = 'P0001';
  end if;
  if v_row.statut <> 'Disponible_Au_Local' or v_row.creneau_retrait is not null then
    raise exception 'Item not ready for pickup' using errcode = 'P0001';
  end if;
  if not public.idea_relais_slot_free(p_creneau) then
    raise exception 'Invalid or full pickup slot' using errcode = 'P0001';
  end if;
  update public.idea_shared_relais
     set creneau_retrait = p_creneau, updated_at = now()
   where id = p_id;
  return jsonb_build_object('id', v_row.id, 'code', v_row.code);
end;
$$;

create or replace function public.idea_admin_relais_list(p_code text)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  if not public.idea_verify_admin(p_code) then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  return coalesce((select jsonb_agg(to_jsonb(r) order by r.created_at desc) from public.idea_shared_relais r), '[]'::jsonb);
end;
$$;

create or replace function public.idea_admin_relais_advance(p_code text, p_id text)
returns text
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_row public.idea_shared_relais;
  v_next text;
begin
  if not public.idea_verify_admin(p_code) then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  select * into v_row from public.idea_shared_relais where id = p_id for update;
  if not found then
    raise exception 'Relais not found' using errcode = 'P0001';
  end if;
  v_next := case v_row.statut
    when 'En_Attente' then 'Disponible_Au_Local'
    when 'Disponible_Au_Local' then 'Récupéré'
    else null end;
  if v_next is null then
    raise exception 'No next status available' using errcode = 'P0001';
  end if;
  update public.idea_shared_relais set statut = v_next, updated_at = now() where id = p_id;
  if v_next = 'Récupéré' then
    update public.idea_shared_posts
       set statut = 'Clôturé', payload = payload || jsonb_build_object('statut', 'Clôturé'), updated_at = now()
     where id = v_row.post_id;
  end if;
  return v_next;
end;
$$;

revoke all on function public.idea_relais_slot_free(text) from public;
revoke all on function public.idea_relais_propose(text, text, text, text, text) from public;
revoke all on function public.idea_relais_reserve(text, text) from public;
revoke all on function public.idea_admin_relais_list(text) from public;
revoke all on function public.idea_admin_relais_advance(text, text) from public;
grant execute on function public.idea_relais_propose(text, text, text, text, text) to anon, authenticated;
grant execute on function public.idea_relais_reserve(text, text) to anon, authenticated;
grant execute on function public.idea_admin_relais_list(text) to anon, authenticated;
grant execute on function public.idea_admin_relais_advance(text, text) to anon, authenticated;

-- Contrôle : résultat attendu = 0 (aucun dépôt partagé pour l'instant).
select count(*) as depots_actuels from public.idea_shared_relais;
