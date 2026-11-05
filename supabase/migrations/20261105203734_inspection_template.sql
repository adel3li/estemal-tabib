-- Inspection checklist (client, 5 Nov 2026): one default template for every
-- device, editable from «الإعدادات»; each inspection can add / remove items.
-- null = the built-in 4 items (التشغيل، الحالة الظاهرية، الأجزاء المتغيرة، الصيانة السابقة).
alter table public.site_settings add column inspection_template jsonb
  check (inspection_template is null or (jsonb_typeof(inspection_template) = 'array' and jsonb_array_length(inspection_template) between 1 and 30));
comment on column public.site_settings.inspection_template is 'Default inspection checklist: array of item labels (text). null = built-in 4 items';
