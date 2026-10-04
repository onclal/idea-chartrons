-- Lot 0 — Sécurité de l'Espace Pro, étape B : fermeture des accès directs.
--
-- À exécuter SEULEMENT APRÈS la mise en ligne du site qui passe par les fonctions
-- gardiennes de 003a. Avant, l'onglet Communication et « Dispo maintenant » du site
-- en ligne cesseraient de fonctionner.
--
-- Après ce script :
--   - pro_contents / pro_campaigns : plus aucun accès direct depuis le site ;
--     tout passe par pro_list_* / pro_create_* / pro_update_content_status.
--   - dispo_signals : la lecture publique des signaux actifs est conservée ;
--     toute autre règle (ajout, modification, suppression) est retirée, la
--     publication passe par pro_create_dispo_signal.
-- RLS reste activée sur ces trois tables : sans règle, l'accès direct est refusé.

drop policy if exists pro_campaigns_all on public.pro_campaigns;
drop policy if exists pro_contents_all on public.pro_contents;

do $$
declare
  r record;
begin
  for r in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'dispo_signals' and cmd <> 'SELECT'
  loop
    execute format('drop policy %I on public.dispo_signals', r.policyname);
  end loop;
end;
$$;

-- Contrôle : doit afficher uniquement la règle de lecture de dispo_signals.
select tablename, policyname, cmd
from pg_policies
where schemaname = 'public' and tablename in ('pro_contents', 'pro_campaigns', 'dispo_signals')
order by 1, 2;
