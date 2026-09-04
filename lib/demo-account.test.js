import { describe, it, expect } from "vitest";
import {
  maskEmail,
  maskName,
  redactUserForDemo,
  redactUsersForDemo,
  isDemoSession,
} from "./demo-account";

const demoSession = { user: { role: "admin", isDemo: true } };
const realSession = { user: { role: "admin", isDemo: false } };

describe("maskEmail", () => {
  it("keeps the first character and the top-level domain", () => {
    expect(maskEmail("alice@gmail.com")).toBe("a••••@•••••.com");
  });

  it("hides the whole local part except the first character", () => {
    const masked = maskEmail("verylongaddress@example.org");
    expect(masked.startsWith("v")).toBe(true);
    expect(masked).not.toContain("erylongaddress");
    expect(masked.endsWith(".org")).toBe(true);
  });

  it("never leaks the domain name itself", () => {
    expect(maskEmail("bob@swiftcart-secret-host.com")).not.toContain("swiftcart-secret-host");
  });

  it("handles a single-character local part", () => {
    expect(maskEmail("a@b.com")).toBe("a•@•.com");
  });

  it("handles a domain with no dot", () => {
    expect(maskEmail("dev@localhost")).toBe("d••@•••••••••");
  });

  it("degrades safely on malformed input", () => {
    expect(maskEmail("not-an-email")).toBe("•••••");
    expect(maskEmail("@nolocal.com")).toBe("•••••");
    expect(maskEmail(null)).toBe("•••••");
    expect(maskEmail(undefined)).toBe("•••••");
  });
});

describe("maskName", () => {
  it("reduces a full name to initials", () => {
    expect(maskName("Ada Lovelace")).toBe("A. L.");
  });

  it("handles a single name", () => {
    expect(maskName("Prince")).toBe("P.");
  });

  it("collapses extra whitespace", () => {
    expect(maskName("  Grace   Brewster  Hopper ")).toBe("G. B. H.");
  });

  it("falls back when there is no name", () => {
    expect(maskName("")).toBe("Demo user");
    expect(maskName(null)).toBe("Demo user");
  });
});

describe("isDemoSession", () => {
  it("is true only for an explicit isDemo flag", () => {
    expect(isDemoSession(demoSession)).toBe(true);
    expect(isDemoSession(realSession)).toBe(false);
    expect(isDemoSession({ user: {} })).toBe(false);
    expect(isDemoSession(null)).toBe(false);
  });

  it("is not fooled by a truthy non-boolean", () => {
    expect(isDemoSession({ user: { isDemo: "yes" } })).toBe(false);
  });
});

describe("redactUserForDemo", () => {
  it("masks name and email but keeps other fields", () => {
    const out = redactUserForDemo({
      _id: "abc",
      name: "Ada Lovelace",
      email: "ada@analytical.com",
      role: "user",
      createdAt: "2026-01-01",
    });

    expect(out.name).toBe("A. L.");
    expect(out.email).not.toContain("ada@analytical");
    expect(out._id).toBe("abc");
    expect(out.role).toBe("user");
    expect(out.createdAt).toBe("2026-01-01");
  });
});

describe("redactUsersForDemo", () => {
  const users = [
    { name: "Ada Lovelace", email: "ada@analytical.com" },
    { name: "Alan Turing", email: "alan@bletchley.uk" },
  ];

  it("redacts every record for a demo session", () => {
    const out = redactUsersForDemo(users, demoSession);
    expect(out).toHaveLength(2);
    for (const u of out) {
      expect(u.email).toContain("•");
      expect(u.name).toMatch(/^[A-Z]\./);
    }
    expect(JSON.stringify(out)).not.toContain("analytical.com");
    expect(JSON.stringify(out)).not.toContain("bletchley");
  });

  it("leaves records untouched for a real admin", () => {
    expect(redactUsersForDemo(users, realSession)).toEqual(users);
  });

  it("does not mutate the input array", () => {
    const input = [{ name: "Ada Lovelace", email: "ada@analytical.com" }];
    redactUsersForDemo(input, demoSession);
    expect(input[0].email).toBe("ada@analytical.com");
  });

  it("handles an empty or missing list", () => {
    expect(redactUsersForDemo([], demoSession)).toEqual([]);
    expect(redactUsersForDemo(undefined, demoSession)).toEqual([]);
  });
});
