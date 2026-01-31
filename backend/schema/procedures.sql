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
