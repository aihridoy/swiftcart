export const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse rounded bg-gray-200 ${className}`} />
);

export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-md p-4">
    <Skeleton className="w-full h-48 rounded-lg mb-4" />
    <Skeleton className="h-5 w-3/4 mb-2" />
    <Skeleton className="h-4 w-1/2 mb-2" />
    <Skeleton className="h-4 w-1/3 mb-4" />
    <Skeleton className="h-10 w-full rounded-lg" />
  </div>
);

export const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

export const ProductDetailSkeleton = () => (
  <div className="container grid grid-cols-1 md:grid-cols-2 gap-6 py-5">
    <Skeleton className="w-full h-96 rounded-xl" />
    <div className="space-y-4">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/6" />
      <Skeleton className="h-10 w-32" />
      <div className="flex gap-4 pt-4">
        <Skeleton className="h-12 w-32 rounded-lg" />
        <Skeleton className="h-12 w-28 rounded-lg" />
      </div>
    </div>
  </div>
);

export const FormSkeleton = ({ fields = 6 }) => (
  <div className="space-y-6">
    {Array.from({ length: fields }).map((_, i) => (
      <div key={i}>
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-11 w-full rounded-lg" />
      </div>
    ))}
  </div>
);

export const DetailSkeleton = () => (
  <div className="container py-10 space-y-6">
    <Skeleton className="h-8 w-64" />
    <Skeleton className="h-32 w-full rounded-xl" />
    <Skeleton className="h-32 w-full rounded-xl" />
    <Skeleton className="h-6 w-40" />
  </div>
);
