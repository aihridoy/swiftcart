import React from 'react';
import Image from 'next/image';

const CategoryItem = ({ imageSrc, altText, categoryName }) => {
  return (
    <div className="relative rounded-sm overflow-hidden group">
      <Image 
        src={imageSrc} 
        alt={altText} 
        layout="responsive" 
        width={500} 
        height={300} 
        className="w-full"
      />
      <a
        href="#"
        className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-xl text-white font-roboto font-medium group-hover:bg-opacity-60 transition"
      >
        {categoryName}
      </a>
    </div>
  );
};

const ShopByCategory = () => {
  const categories = [
    { imageSrc: "/images/category/category-1.jpg", altText: "category 1", categoryName: "Bedroom" },
    { imageSrc: "/images/category/category-2.jpg", altText: "category 2", categoryName: "Mattress" },
    { imageSrc: "/images/category/category-3.jpg", altText: "category 3", categoryName: "Outdoor" },
    { imageSrc: "/images/category/category-4.jpg", altText: "category 4", categoryName: "Sofa" },
    { imageSrc: "/images/category/category-5.jpg", altText: "category 5", categoryName: "Living Room" },
    { imageSrc: "/images/category/category-6.jpg", altText: "category 6", categoryName: "Kitchen" },
  ];

  return (
    <div className="container py-16">
      <h2 className="text-2xl font-medium text-gray-800 uppercase mb-6">Shop by Category</h2>
      <div className="grid grid-cols-3 gap-3">
        {categories.map(({ imageSrc, altText, categoryName }, index) => (
          <CategoryItem
            key={index}
            imageSrc={imageSrc}
            altText={altText}
            categoryName={categoryName}
          />
        ))}
      </div>
    </div>
  );
};

export default ShopByCategory;