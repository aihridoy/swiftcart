import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  session: vi.fn(),
  dbConnect: vi.fn(),
  findCart: vi.fn(),
  reserveStock: vi.fn(),
  updateProduct: vi.fn(),
  orderSave: vi.fn(),
  orderPopulate: vi.fn(),
  Order: vi.fn(),
}));

vi.mock("@/actions/auth-utils", () => ({ session: mocks.session }));
vi.mock("@/service/mongo", () => ({ dbConnect: mocks.dbConnect }));
vi.mock("@/models/cart-model", () => ({
  Cart: { findById: mocks.findCart },
}));
vi.mock("@/models/product-model", () => ({
  Product: {
    findOneAndUpdate: mocks.reserveStock,
    updateOne: mocks.updateProduct,
  },
}));
vi.mock("@/models/order-model", () => ({ Order: mocks.Order }));
vi.mock("resend", () => ({
  Resend: class {
    emails = { send: vi.fn().mockResolvedValue({ data: {} }) };
  },
}));

const { POST } = await import("./route");

describe("POST /api/orders", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.session.mockResolvedValue({ user: { id: "u1", email: "buyer@example.com" } });
  });

  it("uses one transaction for stock, order, and cart writes and charges current prices", async () => {
    const transaction = {
      withTransaction: vi.fn(async (work) => work()),
      endSession: vi.fn(),
    };
    mocks.dbConnect.mockResolvedValue({ startSession: vi.fn().mockResolvedValue(transaction) });

    const cart = {
      user: { toString: () => "u1" },
      items: [{ product: { _id: "p1", title: "Chair", price: 125 }, quantity: 2, price: 80 }],
      save: vi.fn(),
    };
    const populate = vi.fn().mockResolvedValue(cart);
    const useSession = vi.fn(() => ({ populate }));
    mocks.findCart.mockReturnValue({ session: useSession });
    mocks.reserveStock.mockResolvedValue({ _id: "p1", quantity: 4 });

    let createdOrder;
    mocks.Order.mockImplementation(function MockOrder(data) {
      createdOrder = {
        ...data,
        _id: "o1",
        createdAt: new Date(),
        save: mocks.orderSave,
        populate: mocks.orderPopulate,
      };
      return createdOrder;
    });

    const request = new Request("http://localhost/api/orders", {
      method: "POST",
      body: JSON.stringify({
        cartId: "c1",
        shippingDetails: { firstName: "Buyer" },
        paymentDetails: { paymentMethod: "card", cardLast4: "1234" },
      }),
    });
    const response = await POST(request);

    expect(response.status).toBe(201);
    expect(transaction.withTransaction).toHaveBeenCalledOnce();
    expect(useSession).toHaveBeenCalledWith(transaction);
    expect(mocks.reserveStock).toHaveBeenCalledWith(
      { _id: "p1", availability: "In Stock", quantity: { $gte: 2 } },
      { $inc: { quantity: -2 } },
      { new: true, session: transaction }
    );
    expect(createdOrder.items[0].price).toBe(125);
    expect(createdOrder.subtotal).toBe(250);
    expect(mocks.orderSave).toHaveBeenCalledWith({ session: transaction });
    expect(cart.save).toHaveBeenCalledWith({ session: transaction });
    expect(cart.items).toEqual([]);
    expect(transaction.endSession).toHaveBeenCalledOnce();
  });
});
