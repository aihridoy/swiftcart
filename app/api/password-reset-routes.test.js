import { beforeEach, describe, expect, it, vi } from "vitest";
import { hashResetToken } from "@/lib/password-reset-token";

const mocks = vi.hoisted(() => ({
  findOne: vi.fn(),
  randomBytes: vi.fn(),
  send: vi.fn(),
  bcryptHash: vi.fn(),
}));

vi.mock("@/service/mongo", () => ({ dbConnect: vi.fn() }));
vi.mock("@/models/user-model", () => ({ User: { findOne: mocks.findOne } }));
vi.mock("@/service/rate-limit", () => ({
  rateLimit: vi.fn(() => ({ allowed: true })),
  clientIp: vi.fn(() => "127.0.0.1"),
}));
vi.mock("resend", () => ({
  Resend: class { emails = { send: mocks.send }; },
}));
vi.mock("bcryptjs", () => ({ default: { hash: mocks.bcryptHash } }));
vi.mock("crypto", async (importOriginal) => {
  const original = await importOriginal();
  return { default: { ...original.default, randomBytes: mocks.randomBytes } };
});
const { POST: requestReset } = await import("./forgot-password/route");
const { POST: resetPassword } = await import("./reset-password/route");

describe("password reset routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.send.mockResolvedValue({ data: {} });
    mocks.randomBytes.mockReturnValue({ toString: () => "raw-token" });
  });

  it("stores a digest while emailing the raw reset token", async () => {
    const user = { save: vi.fn() };
    mocks.findOne.mockResolvedValue(user);

    const response = await requestReset(new Request("http://localhost/api/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email: "buyer@example.com" }),
    }));

    expect(response.status).toBe(200);
    expect(user.resetPasswordToken).toBe(hashResetToken("raw-token"));
    expect(user.resetPasswordToken).not.toBe("raw-token");
    expect(mocks.send.mock.calls[0][0].html).toContain("token=raw-token");
  });

  it("queries with the submitted token digest", async () => {
    mocks.findOne.mockResolvedValue(null);

    await resetPassword(new Request("http://localhost/api/reset-password", {
      method: "POST",
      body: JSON.stringify({ token: "raw-token", newPassword: "secure-password" }),
    }));

    expect(mocks.findOne).toHaveBeenCalledWith({
      resetPasswordToken: hashResetToken("raw-token"),
      resetPasswordExpires: { $gt: expect.any(Number) },
    });
  });
});
