import api from "@/lib/axios";

// Add a review
export async function addReview({ productId, review, rating }) {
  try {
    const response = await api.post(`/reviews`, {
      productId,
      review,
      rating,
    }, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error || "Failed to add review");
  }
}

// Get reviews by product ID
export async function getReviewsByProductId(productId) {
  try {
    const response = await api.get(`/reviews/${productId}`, {
        headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
    });
    return response.data.reviews;
  } catch (error) {
    throw new Error(error || "Failed to fetch reviews");
  }
}