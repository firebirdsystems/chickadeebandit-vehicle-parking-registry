import { describe, it, expect } from "vitest";
import {
  boardGroup, isBoard,
  canEditVehicle, canDeleteVehicle, canFlagVehicle, canResolveFlag, canManageSpots,
  vehicleStatusLabel, vehicleStatusColor, flagStatusLabel, spotTypeLabel,
  spotIsAvailable, buildViolationDescription,
} from "../src/logic.js";

const admin   = { id: "a1", name: "Admin",  isAdmin: true };
const boardM  = { id: "b1", name: "Board",  role: "board" };
const member1 = { id: "m1", name: "Alice",  role: "adult" };
const member2 = { id: "m2", name: "Bob",    role: "adult" };

const group = { id: "g1", name: "Board", memberIds: ["b1"] };
const groups = [group];

// --- boardGroup / isBoard ---
describe("boardGroup", () => {
  it("returns null when no boardGroupId", () => {
    expect(boardGroup(groups, null)).toBeNull();
  });
  it("returns the group when found", () => {
    expect(boardGroup(groups, "g1")).toBe(group);
  });
});

describe("isBoard", () => {
  it("admins still require membership in the configured Board group", () => {
    expect(isBoard(admin, groups, null)).toBe(false);
  });
  it("group member is board when group is configured", () => {
    expect(isBoard(boardM, groups, "g1")).toBe(true);
  });
  it("non-group member is not board when group is configured", () => {
    expect(isBoard(member1, groups, "g1")).toBe(false);
  });
  it("fails closed when no group is configured", () => {
    expect(isBoard(boardM, groups, null)).toBe(false);
    expect(isBoard(member1, groups, null)).toBe(false);
  });
  it("returns false for null member", () => {
    expect(isBoard(null, groups, "g1")).toBe(false);
  });
});

// --- canEditVehicle / canDeleteVehicle ---
describe("canEditVehicle", () => {
  const vehicle = { id: "v1", owner_id: "m1" };
  it("owner can edit their own vehicle", () => {
    expect(canEditVehicle(vehicle, member1)).toBe(true);
  });
  it("non-owner cannot edit", () => {
    expect(canEditVehicle(vehicle, member2)).toBe(false);
  });
  it("returns false for null member", () => {
    expect(canEditVehicle(vehicle, null)).toBe(false);
  });
  it("only configured Board members can delete vehicles", () => {
    expect(canDeleteVehicle(boardM, groups, "g1")).toBe(true);
    expect(canDeleteVehicle(member1, groups, "g1")).toBe(false);
  });
});

// --- canFlagVehicle / canResolveFlag / canManageSpots ---
describe("canFlagVehicle", () => {
  it("board member can flag", () => {
    expect(canFlagVehicle(boardM, groups, "g1")).toBe(true);
  });
  it("regular member cannot flag", () => {
    expect(canFlagVehicle(member1, groups, "g1")).toBe(false);
  });
});

describe("canResolveFlag", () => {
  it("board member can resolve an open flag", () => {
    expect(canResolveFlag({ status: "open" }, boardM, groups, "g1")).toBe(true);
  });
  it("cannot resolve an already-resolved flag", () => {
    expect(canResolveFlag({ status: "resolved" }, boardM, groups, "g1")).toBe(false);
  });
  it("regular member cannot resolve", () => {
    expect(canResolveFlag({ status: "open" }, member1, groups, "g1")).toBe(false);
  });
});

describe("canManageSpots", () => {
  it("board member can manage spots", () => {
    expect(canManageSpots(boardM, groups, "g1")).toBe(true);
  });
  it("regular member cannot manage spots", () => {
    expect(canManageSpots(member1, groups, "g1")).toBe(false);
  });
});

// --- labels / colors ---
describe("vehicleStatusLabel / vehicleStatusColor", () => {
  it("maps known statuses", () => {
    expect(vehicleStatusLabel("active")).toBe("Active");
    expect(vehicleStatusLabel("flagged")).toBe("Flagged");
    expect(vehicleStatusLabel("expired")).toBe("Expired");
  });
  it("falls back to raw value for unknown status", () => {
    expect(vehicleStatusLabel("weird")).toBe("Unknown");
  });
  it("returns a color string for known and unknown statuses", () => {
    expect(vehicleStatusColor("active")).toBe("#22c55e");
    expect(vehicleStatusColor("weird")).toBe("#6b7280");
  });
});

describe("flagStatusLabel", () => {
  it("maps known statuses", () => {
    expect(flagStatusLabel("open")).toBe("Open");
    expect(flagStatusLabel("resolved")).toBe("Resolved");
  });
  it("does not reflect unknown values", () => {
    expect(flagStatusLabel("<img onerror=alert(1)>")).toBe("Unknown");
  });
});

describe("spotTypeLabel", () => {
  it("maps known types", () => {
    expect(spotTypeLabel("assigned")).toBe("Assigned");
    expect(spotTypeLabel("visitor")).toBe("Visitor");
    expect(spotTypeLabel("unassigned")).toBe("Unassigned");
  });
  it("does not reflect unknown values", () => {
    expect(spotTypeLabel("<img onerror=alert(1)>")).toBe("Unknown");
  });
});

// --- spotIsAvailable ---
describe("spotIsAvailable", () => {
  it("is available when no vehicle assigned", () => {
    expect(spotIsAvailable({ assigned_vehicle_id: null })).toBe(true);
  });
  it("is not available when a vehicle is assigned", () => {
    expect(spotIsAvailable({ assigned_vehicle_id: "v1" })).toBe(false);
  });
});

// --- buildViolationDescription ---
describe("buildViolationDescription", () => {
  it("includes make, model, plate, and reason", () => {
    const vehicle = { make: "Honda", model: "Civic", license_plate: "ABC123" };
    expect(buildViolationDescription(vehicle, "Parked in fire lane"))
      .toBe("Honda Civic (ABC123): Parked in fire lane");
  });
  it("falls back to 'Vehicle' when make/model are missing", () => {
    const vehicle = { make: "", model: "", license_plate: "" };
    expect(buildViolationDescription(vehicle, "Blocking driveway"))
      .toBe("Vehicle: Blocking driveway");
  });
  it("omits plate when not provided", () => {
    const vehicle = { make: "Toyota", model: "Camry", license_plate: "" };
    expect(buildViolationDescription(vehicle, "Expired permit"))
      .toBe("Toyota Camry: Expired permit");
  });
});
