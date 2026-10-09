-- Réglages partagés : autorise le contenu « settings » (interrupteur « Likes sur les vidéos »).
-- Ne touche ni aux tables ideeprod_*, ni à l'Espace Pro. Nécessite 004_contenus_partages.sql.

alter table public.idea_shared_content drop constraint if exists idea_shared_content_kind_check;
alter table public.idea_shared_content
  add constraint idea_shared_content_kind_check
  check (kind in ('agenda', 'banners', 'hero', 'pricing', 'settings'));

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
  if p_kind not in ('agenda', 'banners', 'hero', 'pricing', 'settings') then
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

-- Contrôle : résultat attendu = 0 (aucun réglage enregistré pour l'instant).
select count(*) as reglages_actuels from public.idea_shared_content where kind = 'settings';
