import Image from "next/image";
import Link from "next/link";

const CategoryItem = ({ imageSrc, altText, categoryName, slug }) => {
  return (
    <div className="relative rounded-lg overflow-hidden group h-[200px]">
      <Image
        src={imageSrc}
        alt={altText}
        width={500}
        height={300}
        className="w-full h-full object-cover"
      />
      <Link
        href={`/category/${slug}`}
        className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-xl text-white font-roboto font-medium group-hover:bg-opacity-60 transition"
      >
        {categoryName}
      </Link>
    </div>
  );
};

export default CategoryItem;