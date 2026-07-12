import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/service/mongo", () => ({
  dbConnect: vi.fn(),
}));

vi.mock("@/models/newsletter-model", () => ({
  Newsletter: {
    findOne: vi.fn(),
    findOneAndDelete: vi.fn(),
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
    const res = await DELETE(req({ email: "bad" }));
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
  });

  it("404s when the email isn't subscribed", async () => {
    Newsletter.findOneAndDelete.mockResolvedValue(null);
    const res = await DELETE(req({ email: "a@b.com" }));
    const data = await res.json();
    expect(res.status).toBe(404);
    expect(data.success).toBe(false);
  });

  it("unsubscribes an existing email", async () => {
    Newsletter.findOneAndDelete.mockResolvedValue({ email: "a@b.com" });
    const res = await DELETE(req({ email: "a@b.com" }));
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
  });
});
