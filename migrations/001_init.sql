CREATE TABLE IF NOT EXISTS settings (
  household_id UUID NOT NULL DEFAULT current_setting('app.household_id', true)::uuid,
  key          TEXT NOT NULL,
  value        TEXT NOT NULL DEFAULT '',
  PRIMARY KEY (household_id, key)
);

CREATE TABLE IF NOT EXISTS vehicles (
  household_id   UUID NOT NULL DEFAULT current_setting('app.household_id', true)::uuid,
  id             TEXT NOT NULL,
  owner_id       TEXT NOT NULL,
  make           TEXT NOT NULL DEFAULT '',
  model          TEXT NOT NULL DEFAULT '',
  color          TEXT NOT NULL DEFAULT '',
  license_plate  TEXT NOT NULL DEFAULT '',
  permit_number  TEXT NOT NULL DEFAULT '',
  status         TEXT NOT NULL DEFAULT 'active',
  notes          TEXT NOT NULL DEFAULT '',
  created_at     TEXT NOT NULL,
  updated_at     TEXT NOT NULL,
  PRIMARY KEY (household_id, id)
);

CREATE TABLE IF NOT EXISTS parking_spots (
  household_id        UUID NOT NULL DEFAULT current_setting('app.household_id', true)::uuid,
  id                  TEXT NOT NULL,
  label               TEXT NOT NULL,
  spot_type           TEXT NOT NULL DEFAULT 'unassigned',
  assigned_unit_id    TEXT,
  assigned_vehicle_id TEXT,
  notes               TEXT NOT NULL DEFAULT '',
  created_at          TEXT NOT NULL,
  updated_at          TEXT NOT NULL,
  PRIMARY KEY (household_id, id)
);

CREATE TABLE IF NOT EXISTS flags (
  household_id  UUID NOT NULL DEFAULT current_setting('app.household_id', true)::uuid,
  id            TEXT NOT NULL,
  vehicle_id    TEXT NOT NULL,
  flagged_by    TEXT NOT NULL,
  reason        TEXT NOT NULL DEFAULT '',
  violation_id  TEXT,
  status        TEXT NOT NULL DEFAULT 'open',
  created_at    TEXT NOT NULL,
  resolved_at   TEXT,
  PRIMARY KEY (household_id, id)
);

CREATE TABLE IF NOT EXISTS activity (
  household_id  UUID NOT NULL DEFAULT current_setting('app.household_id', true)::uuid,
  id            TEXT NOT NULL,
  record_id     TEXT NOT NULL,
  actor_id      TEXT NOT NULL,
  action        TEXT NOT NULL,
  detail        TEXT NOT NULL DEFAULT '',
  created_at    TEXT NOT NULL,
  PRIMARY KEY (household_id, id)
);

CREATE INDEX IF NOT EXISTS idx_vpr_vehicles_owner
  ON vehicles (household_id, owner_id);

CREATE INDEX IF NOT EXISTS idx_vpr_vehicles_status
  ON vehicles (household_id, status);

CREATE INDEX IF NOT EXISTS idx_vpr_spots_assigned_vehicle
  ON parking_spots (household_id, assigned_vehicle_id);

CREATE INDEX IF NOT EXISTS idx_vpr_flags_vehicle
  ON flags (household_id, vehicle_id);

CREATE INDEX IF NOT EXISTS idx_vpr_flags_status
  ON flags (household_id, status);

CREATE INDEX IF NOT EXISTS idx_vpr_activity_record
  ON activity (household_id, record_id);
