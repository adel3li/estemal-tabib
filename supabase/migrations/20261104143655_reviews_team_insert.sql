-- The team adds past customers' reviews already published (status / source).
-- For everyone else the guard still forces pending / site.
grant insert (status, source) on public.reviews to authenticated;
