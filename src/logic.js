// Pure functions — no DOM, no global state, safe to unit-test

export function boardGroup(groups, boardGroupId) {
  if (!boardGroupId) return null;
  return groups.find(g => g.id === boardGroupId) ?? null;
}

export function isBoard(member, groups, boardGroupId) {
  if (!member) return false;
  if (member.isAdmin) return true;
  const g = boardGroup(groups, boardGroupId);
  if (!g) return member.role === "board";
  return Array.isArray(g.memberIds) && g.memberIds.includes(member.id);
}

export function canEditVehicle(vehicle, me) {
  if (!me) return false;
  return vehicle.owner_id === me.id;
}

export function canDeleteVehicle(vehicle, me) {
  return canEditVehicle(vehicle, me);
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
  }[status] ?? status;
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
  }[status] ?? status;
}

export function spotTypeLabel(type) {
  return {
    assigned:  "Assigned",
    visitor:   "Visitor",
    unassigned: "Unassigned",
  }[type] ?? type;
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
