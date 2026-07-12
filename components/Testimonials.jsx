import { dbConnect } from "@/service/mongo";
import { Review } from "@/models/review-model";
import "@/models/user-model";
import "@/models/product-model";

async function getTopReviews() {
  try {
    await dbConnect();
    const reviews = await Review.find({ rating: { $gte: 4 } })
      .sort({ rating: -1, createdAt: -1 })
      .limit(6)
      .populate("userId", "name")
      .populate("productId", "title")
      .lean();
    return JSON.parse(JSON.stringify(reviews));
  } catch {
    return [];
  }
}

function Stars({ rating }) {
  return (
    <div className="flex gap-0.5 text-primary" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          fill={i < rating ? "currentColor" : "none"}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6L1.3 7.7l6.1-.6L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

const Testimonials = async () => {
  const reviews = await getTopReviews();

  if (reviews.length === 0) {
    return null;
  }

  return (
    <div className="container pb-16">
      <h2 className="text-2xl font-medium text-gray-800 uppercase mb-6 text-center">
        What Our Customers Say
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="bg-white border border-gray-100 shadow-sm rounded-lg p-6 flex flex-col gap-3"
          >
            <Stars rating={review.rating} />
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
              &quot;{review.review}&quot;
            </p>
            <div className="mt-auto pt-2 border-t border-gray-100">
              <p className="font-medium text-gray-800">
                {review.userId?.name || "SwiftCart Customer"}
              </p>
              {review.productId?.title && (
                <p className="text-xs text-gray-400">
                  on {review.productId.title}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
