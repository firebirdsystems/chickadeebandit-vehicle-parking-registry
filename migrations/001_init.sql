CREATE TABLE IF NOT EXISTS app_vehicle_parking_registry__settings (
  key          TEXT NOT NULL,
  value        TEXT NOT NULL DEFAULT '',
  PRIMARY KEY (key)
);

CREATE TABLE IF NOT EXISTS app_vehicle_parking_registry__vehicles (
  id             TEXT NOT NULL,
  owner_id       TEXT NOT NULL,
  make           TEXT NOT NULL DEFAULT '',
  model          TEXT NOT NULL DEFAULT '',
  color          TEXT NOT NULL DEFAULT '',
  license_plate  TEXT NOT NULL DEFAULT '',
  permit_number  TEXT NOT NULL DEFAULT '',
  notes          TEXT NOT NULL DEFAULT '',
  created_at     TEXT NOT NULL,
  updated_at     TEXT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS app_vehicle_parking_registry__parking_spots (
  id                  TEXT NOT NULL,
  label               TEXT NOT NULL,
  spot_type           TEXT NOT NULL DEFAULT 'unassigned',
  assigned_unit_id    TEXT,
  assigned_vehicle_id TEXT,
  created_by          TEXT NOT NULL,
  visibility          TEXT NOT NULL DEFAULT 'everyone',
  notes               TEXT NOT NULL DEFAULT '',
  created_at          TEXT NOT NULL,
  updated_at          TEXT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS app_vehicle_parking_registry__flags (
  id            TEXT NOT NULL,
  vehicle_id    TEXT NOT NULL,
  flagged_by    TEXT NOT NULL,
  reason        TEXT NOT NULL DEFAULT '',
  violation_id  TEXT,
  status        TEXT NOT NULL DEFAULT 'open',
  created_at    TEXT NOT NULL,
  resolved_at   TEXT,
  PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_vpr_vehicles_owner
  ON app_vehicle_parking_registry__vehicles (owner_id);

CREATE INDEX IF NOT EXISTS idx_vpr_spots_assigned_vehicle
  ON app_vehicle_parking_registry__parking_spots (assigned_vehicle_id);

CREATE INDEX IF NOT EXISTS idx_vpr_spots_label
  ON app_vehicle_parking_registry__parking_spots (label);

CREATE INDEX IF NOT EXISTS idx_vpr_flags_vehicle
  ON app_vehicle_parking_registry__flags (vehicle_id);

CREATE INDEX IF NOT EXISTS idx_vpr_flags_status
  ON app_vehicle_parking_registry__flags (status);

CREATE INDEX IF NOT EXISTS idx_vpr_flags_vehicle_created
  ON app_vehicle_parking_registry__flags (vehicle_id, created_at DESC);
