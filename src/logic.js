// Pure functions — no DOM, no global state, safe to unit-test

export function boardGroup(groups, boardGroupId) {
  if (!boardGroupId) return null;
  return groups.find(g => g.id === boardGroupId) ?? null;
}

export function isBoard(member, groups, boardGroupId) {
  if (!member) return false;
  const g = boardGroup(groups, boardGroupId);
  if (!g) return false;
  return Array.isArray(g.memberIds) && g.memberIds.includes(member.id);
}

export function canEditVehicle(vehicle, me) {
  if (!me) return false;
  return vehicle.owner_id === me.id;
}

export function canDeleteVehicle(me, groups, boardGroupId) {
  return isBoard(me, groups, boardGroupId);
}

export function canFlagVehicle(me, groups, boardGroupId) {
  return isBoard(me, groups, boardGroupId);
}

export function canResolveFlag(flag, me, groups, boardGroupId) {
  if (!isBoard(me, groups, boardGroupId)) return false;
  return flag.status === "open";
}

export function canManageSpots(me, groups, boardGroupId) {
  return isBoard(me, groups, boardGroupId);
}

export function vehicleStatusLabel(status) {
  return {
    active:  "Active",
    flagged: "Flagged",
    expired: "Expired",
  }[status] ?? "Unknown";
}

export function vehicleStatusColor(status) {
  return {
    active:  "#22c55e",
    flagged: "#ef4444",
    expired: "#6b7280",
  }[status] ?? "#6b7280";
}

export function flagStatusLabel(status) {
  return {
    open:     "Open",
    resolved: "Resolved",
  }[status] ?? "Unknown";
}

export function spotTypeLabel(type) {
  return {
    assigned:  "Assigned",
    visitor:   "Visitor",
    unassigned: "Unassigned",
  }[type] ?? "Unknown";
}

export function spotIsAvailable(spot) {
  return !spot.assigned_vehicle_id;
}

export function buildViolationDescription(vehicle, reason) {
  const parts = [vehicle.make, vehicle.model].filter(Boolean).join(" ");
  const plate = vehicle.license_plate ? ` (${vehicle.license_plate})` : "";
  const vehicleLabel = parts || "Vehicle";
  return `${vehicleLabel}${plate}: ${reason}`.trim();
}

/**
 * Fields the in-app search matches against (see hub-sdk `searchMatch`).
 * The plate is the point: the question this registry answers is
 * "whose car is this", asked from the plate on the bumper. Make, model,
 * colour and permit number are the fallbacks when the plate is partial.
 */
export function searchableFields(item) {
  return [item.license_plate, item.make, item.model, item.color, item.permit_number, item.notes];
}

/**
 * Whether a failed write may nonetheless have been stored ("retry after a lost
 * response"). No status: the request threw before any answer. A 400: the hub's
 * answer for a write that timed out after it may have been stored, and for a
 * retry that met the first try's row under its pinned id (UNIQUE_CONSTRAINT).
 * A 5xx other than 507: the hub failing on its side, possibly after the write.
 * Anything else (403, 404, 409, 413, 415, 429, 507) is a refusal that stored
 * nothing — the only case in which an upload made for the row may be deleted.
 */
export function outcomeUnknown(e) {
  if (e?.code === "UNIQUE_CONSTRAINT" || /UNIQUE constraint failed/i.test(String(e?.message ?? ""))) return true;
  const status = Number(e?.status) || 0;
  return status === 0 || status === 400 || (status >= 500 && status !== 507);
}

/**
 * Whether a stored row differs from what the form holds now, over the form's
 * own fields only, compared as text with a missing value as empty.
 */
export function storedDiffers(row, fields) {
  return Object.keys(fields).some((k) => String(row?.[k] ?? "") !== String(fields[k] ?? ""));
}

export const SAVED_AS_FIRST = "Saved as first entered — check it and update what changed.";
