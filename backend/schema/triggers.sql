-- Trigger to automatically activate usage subscription when invoice is paid
-- Generated based on backend schema

CREATE OR REPLACE FUNCTION auto_activate_sub_fn()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    -- Check if the invoice status has changed to 'Paid' (case-insensitive)
    IF TG_OP = 'UPDATE' THEN
        IF NEW.status IS DISTINCT FROM OLD.status AND NEW.status ILIKE 'paid' THEN
            -- Update the corresponding subscription status to 'Active'
            UPDATE subscriptions
            SET status = 'Active'
            WHERE sub_id = NEW.sub_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

-- Drop the trigger if it exists to avoid errors on re-run
DROP TRIGGER IF EXISTS auto_activate_sub ON invoices;

CREATE TRIGGER auto_activate_sub
AFTER UPDATE ON invoices
FOR EACH ROW
WHEN (OLD IS DISTINCT FROM NEW)
EXECUTE FUNCTION auto_activate_sub_fn();
