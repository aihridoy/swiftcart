import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/service/mongo", () => ({
  dbConnect: vi.fn(),
}));

vi.mock("@/models/newsletter-model", () => ({
  Newsletter: {
    findOne: vi.fn(),
    deleteOne: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: vi.fn() };
  },
}));

const { Newsletter } = await import("@/models/newsletter-model");
const { POST, DELETE } = await import("./route");

const req = (body) => new Request("http://localhost/api/newsletter", {
  method: "POST",
  body: JSON.stringify(body),
});

describe("POST /api/newsletter", () => {
  beforeEach(() => vi.clearAllMocks());

  it("rejects an invalid email", async () => {
    const res = await POST(req({ email: "not-an-email" }));
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
  });

  it("rejects a duplicate subscriber", async () => {
    Newsletter.findOne.mockResolvedValue({ email: "a@b.com" });
    const res = await POST(req({ email: "a@b.com" }));
    const data = await res.json();
    expect(res.status).toBe(409);
    expect(data.success).toBe(false);
  });

  it("subscribes a new email", async () => {
    Newsletter.findOne.mockResolvedValue(null);
    Newsletter.create.mockResolvedValue({ email: "a@b.com" });
    const res = await POST(req({ email: "a@b.com" }));
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
  });
});

describe("DELETE /api/newsletter", () => {
  beforeEach(() => vi.clearAllMocks());

  it("rejects an invalid email", async () => {
    const res = await DELETE(req({ email: "bad", token: "token" }));
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
  });

  it("rejects a token that does not match a subscriber", async () => {
    Newsletter.findOne.mockResolvedValue({
      _id: "subscriber-id",
      email: "a@b.com",
      unsubscribeToken: "different-token",
    });
    const res = await DELETE(req({ email: "a@b.com", token: "wrong-token" }));
    const data = await res.json();
    expect(res.status).toBe(401);
    expect(data.success).toBe(false);
    expect(Newsletter.deleteOne).not.toHaveBeenCalled();
  });

  it("unsubscribes an existing email", async () => {
    Newsletter.findOne.mockResolvedValue({
      _id: "subscriber-id",
      email: "a@b.com",
      unsubscribeToken: "valid-token",
    });
    const res = await DELETE(req({ email: "a@b.com", token: "valid-token" }));
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(Newsletter.deleteOne).toHaveBeenCalledWith({ _id: "subscriber-id" });
  });
});
