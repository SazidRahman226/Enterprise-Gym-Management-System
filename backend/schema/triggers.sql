-- Triggers for Enterprise Gym Management System
-- Implements:
-- 1) prevent_double_booking BEFORE INSERT: stops overlapping class bookings for a member
-- 2) auto_activate_sub AFTER UPDATE: sets subscription to "Active" when invoice is paid
-- 3) sync_member_status AFTER INSERT/UPDATE/DELETE: keeps members.current_status in sync
-- 4) validate_trainer_shift BEFORE INSERT: ensures class is scheduled within trainer's shift

-- 1) Prevent double booking
CREATE OR REPLACE FUNCTION prevent_double_booking_fn()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
    v_day TEXT;
    v_start TIME;
    v_end TIME;
BEGIN
    SELECT day_of_week, start_time, end_time
    INTO v_day, v_start, v_end
    FROM class_schedules
    WHERE schedule_id = NEW.schedule_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Referenced schedule % not found', NEW.schedule_id;
    END IF;

    IF EXISTS (
        SELECT 1
        FROM class_bookings cb
        JOIN class_schedules cs ON cb.schedule_id = cs.schedule_id
        WHERE cb.member_id = NEW.member_id
          AND cs.day_of_week = v_day
          AND (cs.start_time, cs.end_time) OVERLAPS (v_start, v_end)
    ) THEN
        RAISE EXCEPTION 'Member % has an overlapping booking at % % - %', NEW.member_id, v_day, v_start, v_end;
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER prevent_double_booking
BEFORE INSERT ON class_bookings
FOR EACH ROW
EXECUTE FUNCTION prevent_double_booking_fn();

-- 2) Auto-activate subscription when invoice becomes Paid
CREATE OR REPLACE FUNCTION auto_activate_sub_fn()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        IF NEW.status IS DISTINCT FROM OLD.status AND NEW.status ILIKE 'paid' THEN
            UPDATE subscriptions
            SET status = 'Active'
            WHERE sub_id = NEW.sub_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER auto_activate_sub
AFTER UPDATE ON invoices
FOR EACH ROW
WHEN (OLD IS DISTINCT FROM NEW)
EXECUTE FUNCTION auto_activate_sub_fn();

-- 3) Sync member.current_status when subscriptions change
CREATE OR REPLACE FUNCTION sync_member_status_fn()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
    v_status TEXT;
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        v_status := NEW.status;
        UPDATE members SET current_status = v_status WHERE member_id = NEW.member_id;
        RETURN NEW;

    ELSIF TG_OP = 'DELETE' THEN
        -- After a subscription is removed, recompute the member's most-recent subscription status
        SELECT status INTO v_status
        FROM subscriptions
        WHERE member_id = OLD.member_id
        ORDER BY end_date DESC NULLS LAST
        LIMIT 1;

        IF v_status IS NULL THEN
            v_status := 'Inactive';
        END IF;

        UPDATE members SET current_status = v_status WHERE member_id = OLD.member_id;
        RETURN OLD;
    END IF;
    RETURN NULL; -- should not reach
END;
$$;

CREATE TRIGGER sync_member_status
AFTER INSERT OR UPDATE OR DELETE ON subscriptions
FOR EACH ROW
EXECUTE FUNCTION sync_member_status_fn();

-- 4) Validate trainer shift when scheduling a class
CREATE OR REPLACE FUNCTION validate_trainer_shift_fn()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
    v_shift TEXT;
    v_start TIME;
    v_end TIME;
    v_staff_id UUID;
BEGIN
    SELECT staff_id INTO v_staff_id FROM trainers WHERE trainer_id = NEW.trainer_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Trainer % not found', NEW.trainer_id;
    END IF;

    SELECT shift_details INTO v_shift FROM staff WHERE staff_id = v_staff_id;

    IF v_shift IS NULL OR trim(v_shift) = '' THEN
        RAISE EXCEPTION 'No shift details defined for trainer''s staff record %', v_staff_id;
    END IF;

    -- Expect shift_details in format 'HH:MI-HH:MI' (24-hour). Use split_part to parse.
    v_start := split_part(v_shift, '-', 1)::time;
    v_end   := split_part(v_shift, '-', 2)::time;

    IF NEW.start_time < v_start OR NEW.end_time > v_end THEN
        RAISE EXCEPTION 'Class time % - % is outside trainer shift % - %', NEW.start_time, NEW.end_time, v_start, v_end;
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER validate_trainer_shift
BEFORE INSERT ON class_schedules
FOR EACH ROW
EXECUTE FUNCTION validate_trainer_shift_fn();

-- End of triggers
