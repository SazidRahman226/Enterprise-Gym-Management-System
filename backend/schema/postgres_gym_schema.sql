-- Postgres DDL generated from Hibernate models
-- Assumes `pgcrypto` extension for UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- User credentials (UUID)
CREATE TABLE user_credentials (
    user_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_type TEXT NOT NULL,
    user_email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    last_login TIMESTAMP DEFAULT now()
);

-- Staff (UUID)
CREATE TABLE staff (
    staff_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL,
    salary NUMERIC,
    shift_details TEXT
);

-- Trainers (one-to-one with staff)
CREATE TABLE trainers (
    trainer_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id uuid NOT NULL UNIQUE,
    specialization TEXT,
    commission_rate NUMERIC(5,2),
    CONSTRAINT fk_trainer_staff FOREIGN KEY (staff_id) REFERENCES staff(staff_id) ON DELETE CASCADE
);

-- Facility rooms
CREATE TABLE facility_rooms (
    room_id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    capacity INTEGER,
    room_type TEXT
);

-- Membership plans
CREATE TABLE membership_plans (
    plan_id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    duration_days INTEGER NOT NULL,
    base_fee NUMERIC NOT NULL,
    access_level TEXT
);

-- Members (UUID)
CREATE TABLE members (
    member_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL UNIQUE,
    emergency_contact TEXT UNIQUE,
    dob DATE NOT NULL,
    current_status TEXT NOT NULL
);
CREATE INDEX idx_member_email ON members(email);

-- Class schedules
CREATE TABLE class_schedules (
    schedule_id BIGSERIAL PRIMARY KEY,
    trainer_id uuid NOT NULL,
    room_id BIGINT NOT NULL,
    class_name TEXT NOT NULL,
    day_of_week TEXT NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    CONSTRAINT fk_schedule_trainer FOREIGN KEY (trainer_id) REFERENCES trainers(trainer_id) ON DELETE RESTRICT,
    CONSTRAINT fk_schedule_room FOREIGN KEY (room_id) REFERENCES facility_rooms(room_id) ON DELETE RESTRICT
);
CREATE INDEX idx_class_day_time ON class_schedules(day_of_week, start_time);

-- Class bookings
CREATE TABLE class_bookings (
    booking_id BIGSERIAL PRIMARY KEY,
    member_id uuid NOT NULL,
    schedule_id BIGINT NOT NULL,
    booking_time TIMESTAMP DEFAULT now(),
    status TEXT,
    CONSTRAINT fk_booking_member FOREIGN KEY (member_id) REFERENCES members(member_id) ON DELETE RESTRICT,
    CONSTRAINT fk_booking_schedule FOREIGN KEY (schedule_id) REFERENCES class_schedules(schedule_id) ON DELETE RESTRICT
);

-- Equipment
CREATE TABLE equipment (
    equip_id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    purchase_date DATE,
    warranty_expiry DATE,
    status TEXT
);

-- Maintenance logs
CREATE TABLE maintenance_logs (
    maint_id BIGSERIAL PRIMARY KEY,
    equip_id BIGINT NOT NULL,
    service_date DATE NOT NULL,
    cost NUMERIC,
    description TEXT,
    technician_name TEXT,
    CONSTRAINT fk_maint_equip FOREIGN KEY (equip_id) REFERENCES equipment(equip_id) ON DELETE RESTRICT
);

-- Subscriptions
CREATE TABLE subscriptions (
    sub_id BIGSERIAL PRIMARY KEY,
    member_id uuid NOT NULL,
    plan_id BIGINT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TEXT NOT NULL,
    CONSTRAINT fk_sub_member FOREIGN KEY (member_id) REFERENCES members(member_id) ON DELETE CASCADE,
    CONSTRAINT fk_sub_plan FOREIGN KEY (plan_id) REFERENCES membership_plans(plan_id) ON DELETE RESTRICT
);

-- Invoices
CREATE TABLE invoices (
    invoice_id BIGSERIAL PRIMARY KEY,
    sub_id BIGINT NOT NULL,
    amount NUMERIC NOT NULL,
    due_date DATE NOT NULL,
    status TEXT NOT NULL,
    CONSTRAINT fk_invoice_sub FOREIGN KEY (sub_id) REFERENCES subscriptions(sub_id) ON DELETE CASCADE
);

-- Payments
CREATE TABLE payments (
    payment_id BIGSERIAL PRIMARY KEY,
    invoice_id BIGINT NOT NULL,
    payment_date DATE NOT NULL,
    amount_paid NUMERIC NOT NULL,
    payment_method TEXT,
    transaction_ref TEXT,
    CONSTRAINT fk_payment_invoice FOREIGN KEY (invoice_id) REFERENCES invoices(invoice_id) ON DELETE CASCADE
);

-- Attendance logs
CREATE TABLE attendance_logs (
    log_id BIGSERIAL PRIMARY KEY,
    member_id uuid NOT NULL,
    check_in_time TIMESTAMP NOT NULL,
    check_out_time TIMESTAMP,
    CONSTRAINT fk_attendance_member FOREIGN KEY (member_id) REFERENCES members(member_id) ON DELETE RESTRICT
);

