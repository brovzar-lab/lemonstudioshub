import { describe, it, expect } from "vitest";
import { sensitivityFilter } from "@/lib/db/project-filter";

describe("sensitivityFilter", () => {
  it("restricts PARTNER to VISIBLE_ALL projects only", () => {
    const filter = sensitivityFilter("PARTNER");
    expect(filter).toEqual({ sensitivity: "VISIBLE_ALL" });
  });

  it("returns empty filter for HOD (sees all projects)", () => {
    const filter = sensitivityFilter("HOD");
    expect(filter).toEqual({});
  });

  it("returns empty filter for DEV_TEAM (sees all projects)", () => {
    const filter = sensitivityFilter("DEV_TEAM");
    expect(filter).toEqual({});
  });

  it("returns empty filter for ADMIN (sees all projects)", () => {
    const filter = sensitivityFilter("ADMIN");
    expect(filter).toEqual({});
  });

  it("PARTNER filter excludes HIDDEN_ALL — simulated query check", () => {
    const filter = sensitivityFilter("PARTNER");
    // A HIDDEN_ALL project would NOT match this filter
    const hiddenProject = { sensitivity: "HIDDEN_ALL" };
    const visibleProject = { sensitivity: "VISIBLE_ALL" };
    if ("sensitivity" in filter) {
      expect(hiddenProject.sensitivity).not.toBe(filter.sensitivity);
      expect(visibleProject.sensitivity).toBe(filter.sensitivity);
    }
  });
});
