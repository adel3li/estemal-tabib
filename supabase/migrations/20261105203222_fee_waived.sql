-- No seriousness fee when the device stays with the platform (client, 5 Nov 2026):
-- a seller who sends the device to us and leaves it at least 7 days pays no fee
-- («waived», amount 0). Kept with the seller → at least 300 EGP (set by the admin).
alter type public.fee_status add value if not exists 'waived';
alter table public.seller_submissions drop constraint if exists seller_submissions_fee_amount_check;
alter table public.seller_submissions add constraint seller_submissions_fee_amount_check check (fee_amount is null or fee_amount >= 0);
