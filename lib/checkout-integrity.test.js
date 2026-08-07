import { describe, expect, it } from "vitest";
import { buildOrderItems, stockReservation } from "./checkout-integrity";

describe("checkout integrity", () => {
  it("uses the current catalog price instead of the cart snapshot", () => {
    const items = buildOrderItems([
      { product: { _id: "p1", price: 125 }, quantity: 2, price: 80 },
    ]);

    expect(items).toEqual([{ product: "p1", quantity: 2, price: 125 }]);
  });

  it("reserves stock only when enough inventory remains", () => {
    expect(stockReservation("p1", 3)).toEqual({
      filter: { _id: "p1", availability: "In Stock", quantity: { $gte: 3 } },
      update: { $inc: { quantity: -3 } },
    });
  });
});
