-- Administration partagée, tranche 1 : agenda, bannières, rectangle d'accueil.
--
-- Avant : ce que l'administrateur modifiait restait dans son navigateur.
-- Après : le contenu est enregistré ici, lisible par tous les visiteurs, et
-- modifiable uniquement avec le code administrateur (vérifié par la base).
--
-- Ne touche ni aux tables ideeprod_*, ni à l'Espace Pro. Peut être exécuté avant la
-- mise en ligne du site qui l'utilise, sans rien casser. Nécessite 003a (idea_verify_admin).

create table if not exists public.idea_shared_content (
  kind text primary key check (kind in ('agenda', 'banners', 'hero')),
  items jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.idea_shared_content enable row level security;

drop policy if exists idea_shared_content_lecture on public.idea_shared_content;
create policy idea_shared_content_lecture
  on public.idea_shared_content for select
  using (true);

-- Aucune règle d'écriture : toute modification passe par la fonction ci-dessous.
revoke insert, update, delete on public.idea_shared_content from anon, authenticated;

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
  if p_kind not in ('agenda', 'banners', 'hero') then
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

revoke all on function public.idea_admin_save_content(text, text, jsonb) from public;
grant execute on function public.idea_admin_save_content(text, text, jsonb) to anon, authenticated;

-- Contrôle : doit afficher 3 lignes vides une fois la table créée (résultat attendu : 0).
select count(*) as lignes_actuelles from public.idea_shared_content;
