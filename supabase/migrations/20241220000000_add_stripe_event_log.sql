-- Add idempotency table for Stripe webhooks
CREATE TABLE IF NOT EXISTS stripe_event_log (
  id BIGSERIAL PRIMARY KEY,
  event_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  processed_at TIMESTAMPTZ DEFAULT NOW(),
  data JSONB
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_stripe_event_log_event_id ON stripe_event_log(event_id);

-- Add RLS policy
ALTER TABLE stripe_event_log ENABLE ROW LEVEL SECURITY;

-- Note: This table is for system use, so we don't need user-specific RLS
-- The webhook handler will manage this table directly 