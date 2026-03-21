-- ============================================
-- Bayaraja — Supabase Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT '',
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 2. QRIS Accounts
CREATE TABLE qris_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  label text NOT NULL,
  qris_string text NOT NULL,
  merchant_name text,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE qris_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own QRIS accounts"
  ON qris_accounts FOR ALL
  USING (auth.uid() = user_id);

-- 3. Payment Links
CREATE TABLE payment_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  qris_account_id uuid NOT NULL REFERENCES qris_accounts ON DELETE CASCADE,
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  amount integer NOT NULL CHECK (amount > 0),
  is_active boolean DEFAULT true,
  is_single_use boolean DEFAULT false,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_payment_links_slug ON payment_links(slug);

ALTER TABLE payment_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own payment links"
  ON payment_links FOR ALL
  USING (auth.uid() = user_id);

-- 4. Transactions
CREATE TABLE transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_link_id uuid NOT NULL REFERENCES payment_links ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  amount integer NOT NULL,
  payer_name text,
  payer_email text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected')),
  payment_proof text NOT NULL DEFAULT '',
  notes text,
  ip_address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions"
  ON transactions FOR UPDATE
  USING (auth.uid() = user_id);

-- 5. API Keys
CREATE TABLE api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  key_hash text NOT NULL,
  label text NOT NULL,
  last_used_at timestamptz,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own API keys"
  ON api_keys FOR ALL
  USING (auth.uid() = user_id);

-- 6. Rate Limiting
CREATE TABLE rate_limits (
  id bigserial PRIMARY KEY,
  ip text NOT NULL,
  endpoint text NOT NULL,
  hit_at timestamptz DEFAULT now()
);

CREATE INDEX idx_rate_limits_lookup ON rate_limits(ip, endpoint, hit_at);

-- Cleanup old entries periodically (optional cron job)
-- DELETE FROM rate_limits WHERE hit_at < now() - interval '1 hour';

CREATE OR REPLACE FUNCTION check_rate_limit(
  p_ip text,
  p_endpoint text,
  p_max integer,
  p_window_seconds integer
)
RETURNS boolean AS $$
DECLARE
  hit_count integer;
BEGIN
  -- Count recent hits
  SELECT COUNT(*) INTO hit_count
  FROM rate_limits
  WHERE ip = p_ip
    AND endpoint = p_endpoint
    AND hit_at > now() - (p_window_seconds || ' seconds')::interval;

  IF hit_count >= p_max THEN
    RETURN false;
  END IF;

  -- Record this hit
  INSERT INTO rate_limits (ip, endpoint) VALUES (p_ip, p_endpoint);

  -- Cleanup old entries for this ip/endpoint
  DELETE FROM rate_limits
  WHERE ip = p_ip
    AND endpoint = p_endpoint
    AND hit_at < now() - (p_window_seconds || ' seconds')::interval;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Storage bucket for payment proofs
-- Run this via Supabase Dashboard > Storage > New bucket
-- Name: payment-proofs
-- Public: false (private)
-- File size limit: 5MB
-- Allowed MIME types: image/jpeg, image/png, image/webp
