-- Copy Real Direct Store / D1 schema.
-- Apply to an isolated preview D1 first. Production requires a separate explicit step.
PRAGMA foreign_keys=ON;
CREATE TABLE IF NOT EXISTS store_orders(
  id TEXT PRIMARY KEY,
  sku TEXT NOT NULL,
  amount INTEGER NOT NULL CHECK(amount>0),
  currency TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN('pending','paid','cancelled')),
  created_at INTEGER NOT NULL,
  paid_at INTEGER,
  session_id TEXT UNIQUE
);
CREATE INDEX IF NOT EXISTS idx_store_orders_session ON store_orders(session_id);
CREATE INDEX IF NOT EXISTS idx_store_orders_status ON store_orders(status);
CREATE TABLE IF NOT EXISTS store_delivery_tokens(
  token_hash TEXT PRIMARY KEY,
  order_id TEXT NOT NULL UNIQUE REFERENCES store_orders(id),
  expires_at INTEGER NOT NULL,
  downloads INTEGER NOT NULL DEFAULT 0 CHECK(downloads>=0),
  max_downloads INTEGER NOT NULL DEFAULT 3 CHECK(max_downloads>0)
);
CREATE INDEX IF NOT EXISTS idx_store_tokens_expiry ON store_delivery_tokens(expires_at);
