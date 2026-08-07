import { describe, expect, it } from "vitest";
import { hashResetToken } from "./password-reset-token";

describe("hashResetToken", () => {
  it("returns a deterministic digest without retaining the raw token", () => {
    const token = "raw-reset-token";
    const digest = hashResetToken(token);

    expect(digest).toHaveLength(64);
    expect(digest).toBe(hashResetToken(token));
    expect(digest).not.toContain(token);
  });
});
