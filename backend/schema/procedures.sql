-- Procedures for Enterprise Gym Management System
-- 1) register_new_member: transactionally creates Member, Credentials, and initial "Pending" Subscription
-- 2) process_daily_renewals: bulk cursor to find expiring subscriptions and generate renewal invoices
-- 3) book_class_slot: checks room capacity and user schedule before committing a booking
-- 4) assign_trainer: updates class schedule and returns recalculated trainer commission based on hours

-- 1) register_new_member
CREATE OR REPLACE FUNCTION register_new_member(
    p_first_name TEXT,
    p_last_name TEXT,
    p_email TEXT,
    p_phone TEXT,
    p_dob DATE,
    p_user_email TEXT,
    p_password_hash TEXT,
    p_plan_id BIGINT,
    p_start_date DATE,
    p_end_date DATE
) RETURNS TABLE(member_id UUID, user_id UUID, sub_id BIGINT) 
LANGUAGE plpgsql
AS $$
BEGIN
    -- Insert member
    INSERT INTO members(first_name, last_name, email, phone, dob, current_status)
    VALUES (p_first_name, p_last_name, p_email, p_phone, p_dob, 'Pending')
    RETURNING member_id INTO member_id;

    -- Insert credentials (user_id)
    INSERT INTO user_credentials(user_type, user_email, password_hash)
    VALUES ('member', p_user_email, p_password_hash)
    RETURNING user_id INTO user_id;

    -- Create initial subscription in Pending state
    INSERT INTO subscriptions(member_id, plan_id, start_date, end_date, status)
    VALUES (member_id, p_plan_id, p_start_date, p_end_date, 'Pending')
    RETURNING sub_id INTO sub_id;

    RETURN NEXT;
EXCEPTION WHEN OTHERS THEN
    RAISE;
END;
$$;

-- 2) process_daily_renewals
CREATE OR REPLACE PROCEDURE process_daily_renewals(p_days_before INT DEFAULT 7)
LANGUAGE plpgsql
AS $$
DECLARE
    cur_rec RECORD;
    v_amount NUMERIC;
BEGIN
    FOR cur_rec IN
        SELECT s.sub_id, s.member_id, s.plan_id, s.end_date, mp.base_fee
        FROM subscriptions s
        JOIN membership_plans mp ON mp.plan_id = s.plan_id
        WHERE s.status = 'Active'
          AND s.end_date <= (current_date + (p_days_before || ' days')::interval)
    LOOP
        -- Avoid duplicate unpaid invoices for same subscription
        IF NOT EXISTS (SELECT 1 FROM invoices i WHERE i.sub_id = cur_rec.sub_id AND i.status <> 'Paid') THEN
            v_amount := cur_rec.base_fee;
            INSERT INTO invoices(sub_id, amount, due_date, status)
            VALUES (cur_rec.sub_id, v_amount, cur_rec.end_date + INTERVAL '1 day', 'Due');
        END IF;
    END LOOP;
END;
$$;

-- 3) book_class_slot
CREATE OR REPLACE FUNCTION book_class_slot(p_member_id UUID, p_schedule_id BIGINT)
RETURNS BIGINT
LANGUAGE plpgsql
AS $$
DECLARE
    v_room_id BIGINT;
    v_capacity INT;
    v_count INT;
    v_day TEXT;
    v_start TIME;
    v_end TIME;
    v_booking_id BIGINT;
BEGIN
    -- Lock the schedule row to avoid race against concurrent bookings
    SELECT room_id, day_of_week, start_time, end_time
    INTO v_room_id, v_day, v_start, v_end
    FROM class_schedules
    WHERE schedule_id = p_schedule_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Schedule % not found', p_schedule_id;
    END IF;

    SELECT capacity INTO v_capacity FROM facility_rooms WHERE room_id = v_room_id FOR SHARE;
    IF v_capacity IS NULL THEN
        RAISE EXCEPTION 'Room % not found', v_room_id;
    END IF;

    SELECT COUNT(*) INTO v_count FROM class_bookings WHERE schedule_id = p_schedule_id;
    IF v_count >= v_capacity THEN
        RAISE EXCEPTION 'Room capacity reached (%/%).', v_count, v_capacity;
    END IF;

    -- Check member for overlapping bookings
    IF EXISTS (
        SELECT 1
        FROM class_bookings cb
        JOIN class_schedules cs ON cb.schedule_id = cs.schedule_id
        WHERE cb.member_id = p_member_id
          AND cs.day_of_week = v_day
          AND (cs.start_time, cs.end_time) OVERLAPS (v_start, v_end)
    ) THEN
        RAISE EXCEPTION 'Member % has an overlapping booking at % % - %', p_member_id, v_day, v_start, v_end;
    END IF;

    -- Insert booking
    INSERT INTO class_bookings(member_id, schedule_id, booking_time, status)
    VALUES (p_member_id, p_schedule_id, now(), 'Booked')
    RETURNING booking_id INTO v_booking_id;

    RETURN v_booking_id;
END;
$$;

-- 4) assign_trainer
CREATE OR REPLACE FUNCTION assign_trainer(p_schedule_id BIGINT, p_trainer_id UUID)
RETURNS NUMERIC
LANGUAGE plpgsql
AS $$
DECLARE
    v_old_trainer UUID;
    v_start TIME;
    v_end TIME;
    v_hours NUMERIC;
    v_commission_rate NUMERIC;
    v_commission_due NUMERIC;
BEGIN
    SELECT trainer_id, start_time, end_time INTO v_old_trainer, v_start, v_end
    FROM class_schedules
    WHERE schedule_id = p_schedule_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Schedule % not found', p_schedule_id;
    END IF;

    UPDATE class_schedules SET trainer_id = p_trainer_id WHERE schedule_id = p_schedule_id;

    SELECT commission_rate INTO v_commission_rate FROM trainers WHERE trainer_id = p_trainer_id;
    IF v_commission_rate IS NULL THEN
        v_commission_rate := 0;
    END IF;

    v_hours := EXTRACT(EPOCH FROM (v_end - v_start)) / 3600.0;
    v_commission_due := COALESCE(v_commission_rate,0) * v_hours;

    RETURN v_commission_due;
END;
$$;

-- End of procedures
