export function buildOrderItems(cartItems) {
  return cartItems.map((item) => ({
    product: item.product._id,
    quantity: item.quantity,
    price: item.product.price,
  }));
}
export function stockReservation(productId, quantity) {
  return {
    filter: {
      _id: productId,
      availability: "In Stock",
      quantity: { $gte: quantity },
    },
    update: { $inc: { quantity: -quantity } },
  };
}
