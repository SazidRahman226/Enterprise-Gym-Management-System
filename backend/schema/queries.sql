-- Analytical queries for Enterprise Gym Management System


-- 2) monthly_revenue_rollup
-- Uses ROLLUP to calculate monthly income by membership plan with grand totals
SELECT
  date_trunc('month', p.payment_date)::date AS month,
  mp.name AS plan_name,
  SUM(p.amount_paid) AS total_revenue
FROM payments p
JOIN invoices i ON p.invoice_id = i.invoice_id
JOIN subscriptions s ON i.sub_id = s.sub_id
JOIN membership_plans mp ON s.plan_id = mp.plan_id
GROUP BY ROLLUP (date_trunc('month', p.payment_date), mp.name)
ORDER BY month NULLS LAST, plan_name NULLS LAST;

-- 4) debtor_list_active
-- Members who have recent check-ins but have one or more Overdue invoices
SELECT
  m.member_id,
  m.first_name,
  m.last_name,
  m.email,
  MAX(al.check_in_time) AS last_checkin,
  COUNT(i.invoice_id) FILTER (WHERE i.status = 'Overdue') AS overdue_invoice_count,
  SUM(i.amount) FILTER (WHERE i.status = 'Overdue') AS total_overdue_amount
FROM members m
JOIN attendance_logs al ON al.member_id = m.member_id
JOIN subscriptions s ON s.member_id = m.member_id
JOIN invoices i ON i.sub_id = s.sub_id
WHERE al.check_in_time >= (current_date - INTERVAL '7 days')
  AND i.status = 'Overdue'
GROUP BY m.member_id, m.first_name, m.last_name, m.email
ORDER BY last_checkin DESC;
