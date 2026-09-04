import { describe, it, expect } from "vitest";
import { guardAdmin, guardDemoWrite } from "./admin-guard";
import { DEMO_WRITE_BLOCKED, DEMO_REVIEW_BLOCKED } from "./demo-account";

const admin = { user: { role: "admin", isDemo: false } };
const demoAdmin = { user: { role: "admin", isDemo: true } };
const shopper = { user: { role: "user", isDemo: false } };
const demoShopper = { user: { role: "user", isDemo: true } };

const body = async (res) => JSON.parse(await res.text());

describe("guardAdmin — reads", () => {
  it("allows a real admin", async () => {
    expect(guardAdmin(admin, { write: false })).toBeNull();
  });

  it("allows a demo admin: the whole point is that it can look around", () => {
    expect(guardAdmin(demoAdmin, { write: false })).toBeNull();
  });

  it("rejects a signed-in shopper with 401", async () => {
    const res = guardAdmin(shopper, { write: false });
    expect(res.status).toBe(401);
    expect((await body(res)).error).toBe("Unauthorized");
  });

  it("rejects a signed-out visitor with 401", () => {
    expect(guardAdmin(null, { write: false }).status).toBe(401);
    expect(guardAdmin(undefined, { write: false }).status).toBe(401);
    expect(guardAdmin({}, { write: false }).status).toBe(401);
  });
});

describe("guardAdmin — writes", () => {
  it("allows a real admin to write", () => {
    expect(guardAdmin(admin, { write: true })).toBeNull();
  });

  it("refuses a demo admin with 403, not 401", async () => {
    const res = guardAdmin(demoAdmin, { write: true });
    expect(res.status).toBe(403);
    expect((await body(res)).error).toBe(DEMO_WRITE_BLOCKED);
  });

  it("still refuses a shopper with 401 before considering the demo flag", () => {
    expect(guardAdmin(shopper, { write: true }).status).toBe(401);
  });

  it("defaults to a read when no options are passed", () => {
    expect(guardAdmin(demoAdmin)).toBeNull();
  });
});

describe("guardDemoWrite", () => {
  it("lets a real shopper through", () => {
    expect(guardDemoWrite(shopper)).toBeNull();
  });

  it("blocks any demo account", async () => {
    const res = guardDemoWrite(demoShopper);
    expect(res.status).toBe(403);
    expect((await body(res)).error).toBe(DEMO_WRITE_BLOCKED);
  });

  it("blocks the demo admin too", () => {
    expect(guardDemoWrite(demoAdmin).status).toBe(403);
  });

  it("carries a caller-supplied message", async () => {
    const res = guardDemoWrite(demoShopper, DEMO_REVIEW_BLOCKED);
    expect((await body(res)).error).toBe(DEMO_REVIEW_BLOCKED);
  });

  it("ignores a signed-out visitor, leaving auth to the caller", () => {
    expect(guardDemoWrite(null)).toBeNull();
  });
});
