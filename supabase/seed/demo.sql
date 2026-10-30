-- Demo seed (PHASE1_PROMPT.md §7): the devices, sell submissions and «اطلب جهاز»
-- requests from the design screens, matching src/lib/demo/seed.ts.
--
-- Idempotent (safe to run twice). NEVER run against production unless Adel asks.
-- It refuses to run unless you opt in for the session:
--
--   psql "$DB_URL" -c "set app.allow_demo_seed = 'on'" -f supabase/seed/demo.sql
--   (or put  set app.allow_demo_seed = 'on';  at the top of an SQL-editor run)
--
-- The first admin is NOT created here — use scripts/set-admin.mjs (SEED_ADMIN_EMAIL).
-- Bracketed values are placeholders on purpose (§2): no real names or numbers.

do $$
begin
  if coalesce(current_setting('app.allow_demo_seed', true), '') <> 'on' then
    raise exception 'Demo seed refused: set app.allow_demo_seed = ''on'' first (never on production).';
  end if;
end $$;

-- ── Demo accounts (never sign in; they own the demo submissions/requests) ───
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, email_change, email_change_token_new, recovery_token
)
select '00000000-0000-0000-0000-000000000000', u.id, 'authenticated', 'authenticated', u.email, '',
       now(), '{"provider":"email","providers":["email"]}'::jsonb,
       jsonb_build_object('full_name', '[د. ...]'), now(), now(), '', '', '', ''
from (values
  ('d0000000-0000-4000-8000-000000000001'::uuid, 'demo-seller-1@example.com'),
  ('d0000000-0000-4000-8000-000000000002'::uuid, 'demo-seller-2@example.com'),
  ('d0000000-0000-4000-8000-000000000003'::uuid, 'demo-buyer-1@example.com')
) as u(id, email)
on conflict (id) do nothing;

update public.profiles
set full_name = '[د. ...]', phone = '[01xxxxxxxxx]', governorate = 'القاهرة',
    account_type = 'doctor', onboarded_at = coalesce(onboarded_at, now())
where id in ('d0000000-0000-4000-8000-000000000001', 'd0000000-0000-4000-8000-000000000002',
             'd0000000-0000-4000-8000-000000000003');

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

-- ── Sell submissions ─────────────────────────────────────────────────────────
insert into public.seller_submissions (
  public_code, seller_id, full_name, phone, governorate, pickup_address, device_type, brand,
  details, accessories, sale_reason, condition, has_box, repaired_before, defects,
  keep_location, sale_price, seller_net, fee_status, fee_reference, status, reject_reason,
  admin_log, created_at
)
select v.code, v.seller, '[د. ...]', '[01xxxxxxxxx]', v.gov, '[العنوان]', v.type::public.device_type,
       '[الماركة]', v.details, v.acc, v.reason, v.cond::public.device_condition, v.box, 'no',
       'لا يوجد', v.keep::public.keep_location, v.price, round(v.price * 0.85)::int,
       v.fee::public.fee_status, v.ref, v.status::public.submission_status, v.reject,
       v.log::jsonb, v.created::timestamptz
from (values
  ('#1024', 'd0000000-0000-4000-8000-000000000001'::uuid, 'القاهرة', 'autoclave', 'أوتوكلاف Class B — 18 لتر', 'رف داخلي، خرطوم تصريف، كتالوج', 'بيجدد العيادة وجاب أوتوكلاف سعته أكبر.', 'a', true, 'send_to_platform', 40000, 'paid', '[IPN-xxxxxxxx]', 'new', null,
   '[{"text":"الطلب وصل من صفحة «اعرض جهازك»","tone":"info"},{"text":"رسوم الجدية 300 ج.م اتدفعت","tone":"ok"}]', '2026-10-30 10:40+02'),
  ('#1023', 'd0000000-0000-4000-8000-000000000002'::uuid, 'الجيزة', 'unit', 'يونيت أسنان كامل بالكرسي', 'كرسي، لمبة، 3 خراطيم هاند بيس، فوت كنترول', 'بيقفل الفرع التاني للعيادة.', 'b', false, 'with_seller', 120000, 'paid', '[IPN-xxxxxxxx]', 'new', null,
   '[{"text":"الطلب وصل من صفحة «اعرض جهازك»","tone":"info"},{"text":"رسوم الجدية 300 ج.م اتدفعت","tone":"ok"}]', '2026-10-29 18:15+02'),
  ('#1022', 'd0000000-0000-4000-8000-000000000001'::uuid, 'الدقهلية', 'endo', 'إندو موتور لاسلكي', 'شاحن، 2 كونترا', 'اشترى موديل أحدث.', 'a', false, 'with_seller', 11000, 'pending', null, 'new', null,
   '[{"text":"الطلب وصل من صفحة «اعرض جهازك»","tone":"info"}]', '2026-10-29 13:05+02'),
  ('#1021', 'd0000000-0000-4000-8000-000000000002'::uuid, 'الإسكندرية', 'cure', 'لايت كيور LED', 'قاعدة شحن', 'مش بيستخدمه كتير.', 'b', false, 'send_to_platform', 2800, 'paid', null, 'follow_up', null,
   '[{"text":"الطلب وصل من صفحة «اعرض جهازك»","tone":"info"},{"text":"اتطلب من البايع: صورة الطرف من قريب، فيديو وهو شغال","tone":"warn"}]', '2026-10-23 12:00+02'),
  ('#1020', 'd0000000-0000-4000-8000-000000000001'::uuid, 'الشرقية', 'surg', 'موتور جراحة وزراعة بالفوت كنترول', 'هاند بيس جراحة، فوت كنترول، خراطيم ري', 'بيسافر وبيصفّي العيادة.', 'a', false, 'send_to_platform', 55000, 'paid', null, 'accepted', null,
   '[{"text":"الطلب وصل من صفحة «اعرض جهازك»","tone":"info"},{"text":"اتقبل واتحول لإعلان مسودة","tone":"ok"}]', '2026-10-20 12:00+02'),
  ('#1019', 'd0000000-0000-4000-8000-000000000002'::uuid, 'أسيوط', 'xray', 'جهاز أشعة بالذراع', '—', 'الجهاز بقاله فترة مش شغال.', 'c', false, 'with_seller', 30000, 'pending', null, 'rejected', 'السعر بعيد عن السوق لحالة الجهاز',
   '[{"text":"الطلب وصل من صفحة «اعرض جهازك»","tone":"info"},{"text":"اترفض: السعر بعيد عن السوق لحالة الجهاز","tone":"bad"}]', '2026-10-18 12:00+02')
) as v(code, seller, gov, type, details, acc, reason, cond, box, keep, price, fee, ref, status, reject, log, created)
on conflict (public_code) do nothing;

-- ── «اطلب جهاز» requests ─────────────────────────────────────────────────────
insert into public.device_requests (
  public_code, user_id, full_name, phone, device_type, budget_min, budget_max, needed_by,
  governorate, inspection_pref, status, notified_at, created_at
)
select v.code, 'd0000000-0000-4000-8000-000000000003', '[د. ...]', '[01xxxxxxxxx]',
       v.type::public.device_type, v.lo, v.hi, 'في أسرع وقت', v.gov,
       v.pref::public.inspection_pref, v.status::public.request_status,
       v.notified::timestamptz, v.created::timestamptz
from (values
  ('R-118', 'autoclave', 35000, 50000, 'القاهرة', 'any', 'new', null, '2026-10-27'),
  ('R-117', 'unit', 70000, 130000, 'الجيزة', 'inspected_only', 'new', null, '2026-10-26'),
  ('R-116', 'endo', 8000, 16000, 'الإسكندرية', 'any', 'new', null, '2026-10-26'),
  ('R-115', 'loupe', 8000, 15000, 'المنوفية', 'any', 'new', null, '2026-10-25'),
  ('R-112', 'xray', 30000, 70000, 'الدقهلية', 'inspected_only', 'notified', '2026-10-24', '2026-10-23'),
  ('R-109', 'apex', 5000, 9000, 'الشرقية', 'any', 'closed', '2026-10-21', '2026-10-20')
) as v(code, type, lo, hi, gov, pref, status, notified, created)
on conflict (public_code) do nothing;

-- ── Keep the code sequences ahead of the seeded codes ────────────────────────
select setval('public.device_code_seq',
  greatest((select max(substring(public_code from '[0-9]+')::int) from public.devices), 200));
select setval('public.submission_code_seq',
  greatest((select max(substring(public_code from '[0-9]+')::int) from public.seller_submissions), 1000));
select setval('public.request_code_seq',
  greatest((select max(substring(public_code from '[0-9]+')::int) from public.device_requests), 100));
