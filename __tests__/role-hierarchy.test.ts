import { describe, it, expect } from "vitest";
import type { Role } from "@prisma/client";

// Extracted from withAuth for isolated testing
const ROLE_ORDER: Role[] = ["PARTNER", "DEV_TEAM", "HOD", "ADMIN"];

function hasRequiredRole(userRole: Role, requiredRole: Role): boolean {
  return ROLE_ORDER.indexOf(userRole) >= ROLE_ORDER.indexOf(requiredRole);
}

describe("Role hierarchy", () => {
  describe("ADMIN", () => {
    it("meets any role requirement", () => {
      expect(hasRequiredRole("ADMIN", "PARTNER")).toBe(true);
      expect(hasRequiredRole("ADMIN", "DEV_TEAM")).toBe(true);
      expect(hasRequiredRole("ADMIN", "HOD")).toBe(true);
      expect(hasRequiredRole("ADMIN", "ADMIN")).toBe(true);
    });
  });

  describe("HOD", () => {
    it("meets PARTNER, DEV_TEAM, HOD requirements", () => {
      expect(hasRequiredRole("HOD", "PARTNER")).toBe(true);
      expect(hasRequiredRole("HOD", "DEV_TEAM")).toBe(true);
      expect(hasRequiredRole("HOD", "HOD")).toBe(true);
    });

    it("does NOT meet ADMIN requirement", () => {
      expect(hasRequiredRole("HOD", "ADMIN")).toBe(false);
    });
  });

  describe("DEV_TEAM", () => {
    it("meets PARTNER and DEV_TEAM requirements", () => {
      expect(hasRequiredRole("DEV_TEAM", "PARTNER")).toBe(true);
      expect(hasRequiredRole("DEV_TEAM", "DEV_TEAM")).toBe(true);
    });

    it("does NOT meet HOD or ADMIN requirements", () => {
      expect(hasRequiredRole("DEV_TEAM", "HOD")).toBe(false);
      expect(hasRequiredRole("DEV_TEAM", "ADMIN")).toBe(false);
    });
  });

  describe("PARTNER", () => {
    it("only meets PARTNER requirement", () => {
      expect(hasRequiredRole("PARTNER", "PARTNER")).toBe(true);
    });

    it("does NOT meet DEV_TEAM, HOD, or ADMIN requirements", () => {
      expect(hasRequiredRole("PARTNER", "DEV_TEAM")).toBe(false);
      expect(hasRequiredRole("PARTNER", "HOD")).toBe(false);
      expect(hasRequiredRole("PARTNER", "ADMIN")).toBe(false);
    });
  });
});
