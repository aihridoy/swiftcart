import { describe, expect, it, vi } from "vitest";
import { refreshSessionAndNavigate } from "./login-session";

describe("refreshSessionAndNavigate", () => {
  it("refreshes the client session before navigating", async () => {
    const calls = [];
    const update = vi.fn(async () => calls.push("update"));
    const router = {
      push: vi.fn(() => calls.push("push")),
      refresh: vi.fn(() => calls.push("refresh")),
    };

    await refreshSessionAndNavigate({ update, router, target: "/dashboard" });

    expect(calls).toEqual(["update", "push", "refresh"]);
    expect(router.push).toHaveBeenCalledWith("/dashboard");
  });
});
