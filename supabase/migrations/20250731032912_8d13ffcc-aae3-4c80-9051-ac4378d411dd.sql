-- Add delivery method and branch information to orders table
ALTER TABLE orders ADD COLUMN delivery_method TEXT DEFAULT 'pickup' CHECK (delivery_method IN ('pickup', 'shipping'));
ALTER TABLE orders ADD COLUMN pickup_branch_id TEXT REFERENCES branches(id);
ALTER TABLE orders ADD COLUMN shipping_fee NUMERIC DEFAULT 0;
ALTER TABLE orders ADD COLUMN delivery_address TEXT;