-- Demo DEVICES only (no demo accounts, submissions or requests): the 15
-- listings from the design, their admin-only data and public inspection
-- reports, plus a few «السعر قبل الخصم» values so «فرصة متتفوتش» has deals.
-- Loaded into the live project on 2026-11-02 with Adel's OK. Idempotent.
--   set app.allow_demo_seed = 'on';  then run this file.

do $$
begin
  if coalesce(current_setting('app.allow_demo_seed', true), '') <> 'on' then
    raise exception 'Demo seed refused: set app.allow_demo_seed = ''on'' first.';
  end if;
end $$;

-- ── Devices ──────────────────────────────────────────────────────────────────
insert into public.devices (
  public_code, title, type, brand, model, origin, capacity, governorate, accessories,
  declared_defects, condition, inspection_state, maintenance_months, status, featured,
  views, source, has_box, repaired_before, sale_price, published_at, created_at
)
select v.code, v.title, v.type::public.device_type, '[الماركة]', '[الموديل]', '[البلد]', v.capacity,
       v.gov, v.acc, v.defects, v.cond::public.device_condition,
       v.insp::public.inspection_state, v.maint, v.status::public.device_status, v.featured,
       v.views, v.source::public.device_source, v.box, v.repaired::public.yes_no_unknown, v.price,
       case when v.status in ('published', 'reserved', 'sold') then v.created::timestamptz end,
       v.created::timestamptz
from (values
  ('L-201', 'يونيت أسنان كامل', 'unit', null, 'القاهرة', 'كرسي، لمبة، 3 خراطيم هاند بيس، فوت كنترول', 'جلد مسند الراس — تآكل بسيط في الطرف (صورة مرفقة)', 'a', 'inspected', 6, 'published', true, 412, 'company', null::boolean, null, 120000, '2026-10-12'),
  ('L-202', 'أوتوكلاف Class B', 'autoclave', '[السعة]', 'الإسكندرية', '', '', 'b', 'on_order', 3, 'published', false, 268, 'seller', true, 'no', 45000, '2026-10-15'),
  ('L-203', 'جهاز أشعة X-Ray حائطي', 'xray', null, 'الجيزة', '', '', 'b', 'on_order', 6, 'published', true, 190, 'company', false, 'unknown', 35000, '2026-10-09'),
  ('L-204', 'أبيكس لوكيتور', 'apex', null, 'القاهرة', '', '', 'a', 'inspected', 3, 'published', false, 141, 'seller', null, null, 9000, '2026-10-16'),
  ('L-205', 'كونترا أنجل', 'contra', null, 'الإسكندرية', '', '', 'b', 'inspected', 3, 'published', false, 88, 'seller', null, null, 6000, '2026-10-17'),
  ('L-206', 'موتور جراحة وزراعة', 'surg', null, 'القاهرة', 'هاند بيس جراحة، فوت كنترول، خراطيم ري', '', 'a', 'inspected', 6, 'published', true, 154, 'company', null, null, 40000, '2026-10-18'),
  ('L-207', 'لايت كيور LED', 'cure', null, 'الغربية', '', '', 'c', 'on_order', 3, 'published', false, 97, 'seller', false, 'yes', 3500, '2026-10-20'),
  ('L-208', 'روتاري لاسلكي', 'rotary', null, 'أسيوط', '', '', 'b', 'on_order', 3, 'published', false, 64, 'seller', true, 'no', 15000, '2026-10-21'),
  ('L-209', 'ميكرو موتور', 'micro', null, 'الجيزة', '', '', 'a', 'inspected', 3, 'published', false, 73, 'company', null, null, 12000, '2026-10-22'),
  ('L-210', 'كاميرا إنترا أورال', 'iocam', null, 'القاهرة', '', '', 'c', 'on_order', 6, 'published', false, 52, 'seller', false, 'unknown', 8000, '2026-10-23'),
  ('L-211', 'لوب تكبير بإضاءة LED', 'loupe', null, 'الدقهلية', '', '', 'a', 'inspected', 6, 'published', false, 45, 'seller', null, null, 7000, '2026-10-24'),
  ('L-212', 'جهاز أشعة X-Mind بالذراع', 'xray', null, 'الإسكندرية', '', '', 'b', 'on_order', 3, 'reserved', false, 190, 'company', true, 'no', 38000, '2026-10-09'),
  ('L-213', 'إندو موتور لاسلكي بالأبيكس', 'endo', null, 'الدقهلية', '', '', 'a', 'inspected', 3, 'sold', false, 335, 'seller', null, null, 9500, '2026-10-02'),
  ('L-214', 'أبيكس لوكيتور بشاشة ملونة', 'apex', null, 'القاهرة', '', '', 'b', 'on_order', 3, 'draft', false, 0, 'seller', null, null, 6000, '2026-10-24'),
  ('L-215', 'كاميرا إنترا أورال بالشاشة', 'iocam', null, 'الجيزة', '', '', 'a', 'on_order', 3, 'draft', false, 0, 'company', null, null, 14000, '2026-10-26')
) as v(code, title, type, capacity, gov, acc, defects, cond, insp, maint, status, featured, views, source, box, repaired, price, created)
on conflict (public_code) do nothing;

-- Admin-only data for a few devices.
insert into public.device_private (device_id, purchase_cost, seller_net, sale_reason, location_now)
select d.id, v.cost, v.net, v.reason, v.loc
from (values
  ('L-201', 95000, null::int, null, 'مقر الفحص'),
  ('L-202', null::int, 38250, 'بيجدد العيادة وجاب أوتوكلاف سعته أكبر.', null)
) as v(code, cost, net, reason, loc)
join public.devices d on d.public_code = v.code
on conflict (device_id) do nothing;

-- Public inspection reports for the inspected devices.
with core(ord, key, label) as (
  values (1, 'run', 'التشغيل'), (2, 'look', 'الحالة الظاهرية'),
         (3, 'parts', 'الأجزاء المتغيرة'), (4, 'maint', 'الصيانة السابقة')
),
reports(code, efficiency, appearance, look_note) as (
  values ('L-204', 'ممتاز', 'ممتاز', null),
         ('L-205', 'جيد جداً', 'جيد', 'خدوش خفيفة في الجسم'),
         ('L-206', 'ممتاز', 'ممتاز', null),
         ('L-209', 'ممتاز', 'جيد جداً', null),
         ('L-211', 'ممتاز', 'ممتاز', null),
         ('L-213', 'ممتاز', 'ممتاز', null)
)
insert into public.device_reports (
  device_id, report_code, technician_name, inspected_at, checklist,
  overall_efficiency, appearance, serial_no, replaced_parts, condition, defects
)
select d.id, '[###]', '[اسم الفني]', d.created_at,
       (select jsonb_agg(jsonb_build_object(
                 'key', c.key, 'label', c.label, 'group', 'core',
                 'ok', not (c.key = 'look' and r.look_note is not null),
                 'note', case when c.key = 'look' then r.look_note end) order by c.ord)
        from core c),
       r.efficiency, r.appearance, '[S/N]', '[القطع]', d.condition, r.look_note
from reports r
join public.devices d on d.public_code = r.code
on conflict (device_id) do nothing;

insert into public.device_reports (
  device_id, report_code, technician_name, inspected_at, checklist,
  overall_efficiency, appearance, serial_no, replaced_parts, condition, defects
)
select d.id, '[###]', '[اسم الفني]', d.created_at,
       '[
         {"key":"chair","label":"الكرسي والهيدروليك — طلوع ونزول وميل بدون صوت أو تسريب","group":"category","ok":true,"note":null},
         {"key":"lines","label":"خطوط التوربينة والميكروموتور — ضغط الهوا والمية","group":"category","ok":true,"note":null},
         {"key":"light","label":"كشاف الإضاءة","group":"category","ok":true,"note":null},
         {"key":"suction","label":"الشفاط والسبيتون","group":"category","ok":true,"note":null},
         {"key":"foot","label":"الفوت كنترول وكرسي الطبيب","group":"category","ok":true,"note":null},
         {"key":"look","label":"جلد مسند الراس — تآكل بسيط في الطرف (صورة مرفقة)","group":"core","ok":false,"note":"تآكل بسيط"}
       ]'::jsonb,
       'ممتاز', 'جيد جداً', '[S/N]', '[القطع]', 'a', 'جلد مسند الراس — تآكل بسيط في الطرف'
from public.devices d where d.public_code = 'L-201'
on conflict (device_id) do nothing;

-- Demo deals (old price above the sale price).
update public.devices d set compare_at_price = v.old
from (values ('L-201', 145000), ('L-206', 52000), ('L-209', 15500), ('L-211', 9000), ('L-204', 11500))
  as v(code, old)
where d.public_code = v.code and d.compare_at_price is null;

select setval('public.device_code_seq',
  greatest((select max(substring(public_code from '[0-9]+')::int) from public.devices), 200));
