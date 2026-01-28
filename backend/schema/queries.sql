-- Analytical queries for Enterprise Gym Management System

-- 1) peak_hours_analysis
-- Uses GROUPING SETS to return busiest hours and busiest days (and optionally combos)
-- Results: bucket ('hour' or 'day'), day, hour, checkin_count
SELECT
  CASE
    WHEN GROUPING(to_char(check_in_time,'Day')) = 0 AND GROUPING(date_trunc('hour', check_in_time)) = 0 THEN 'day_hour'
    WHEN GROUPING(to_char(check_in_time,'Day')) = 0 THEN 'day'
    WHEN GROUPING(date_trunc('hour', check_in_time)) = 0 THEN 'hour'
    ELSE 'total'
  END AS bucket,
  trim(to_char(check_in_time,'Day')) AS day_of_week,
  date_trunc('hour', check_in_time) AS hour_slot,
  count(*) AS checkin_count
FROM attendance_logs
GROUP BY GROUPING SETS (
  (to_char(check_in_time,'Day')),
  (date_trunc('hour', check_in_time))
)
ORDER BY checkin_count DESC
LIMIT 200;

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

-- 3) top_trainers_ranking
-- Uses DENSE_RANK to rank trainers by student retention rate.
-- Retention metric: fraction of trainer's distinct students with more than one subscription.
WITH trainer_students AS (
  SELECT DISTINCT t.trainer_id, cb.member_id
  FROM class_schedules cs
  JOIN trainers t ON cs.trainer_id = t.trainer_id
  JOIN class_bookings cb ON cb.schedule_id = cs.schedule_id
),
member_subscription_counts AS (
  SELECT member_id, COUNT(*) AS subs_count
  FROM subscriptions
  GROUP BY member_id
),
trainer_metrics AS (
  SELECT
    ts.trainer_id,
    COUNT(DISTINCT ts.member_id) AS total_students,
    SUM(CASE WHEN coalesce(msc.subs_count,0) > 1 THEN 1 ELSE 0 END) AS retained_students
  FROM trainer_students ts
  LEFT JOIN member_subscription_counts msc ON ts.member_id = msc.member_id
  GROUP BY ts.trainer_id
)
SELECT
  t.trainer_id,
  s.first_name || ' ' || s.last_name AS trainer_name,
  tm.total_students,
  tm.retained_students,
  CASE WHEN tm.total_students = 0 THEN 0
       ELSE (tm.retained_students::numeric / tm.total_students)::numeric(8,4)
  END AS retention_rate,
  DENSE_RANK() OVER (ORDER BY (CASE WHEN tm.total_students=0 THEN 0 ELSE (tm.retained_students::numeric / tm.total_students) END) DESC) AS trainer_rank
FROM trainer_metrics tm
JOIN trainers t ON tm.trainer_id = t.trainer_id
LEFT JOIN staff s ON t.staff_id = s.staff_id
ORDER BY trainer_rank, retention_rate DESC;

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
