import React from "react";
import Link from "next/link";

const Banner = () => {
  return (
    <div
      className="bg-cover bg-no-repeat bg-center py-16 md:py-36 px-4"
      style={{ backgroundImage: "url('/images/banner-bg.jpg')" }}
    >
      <div className="container">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-800 font-medium mb-4 capitalize leading-tight">
          Best collection for <br /> home decoration
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-6 leading-relaxed max-w-xl">
          Transform your living space with our curated collection of home decor essentials! From elegant furniture to stylish accents, our handpicked pieces blend functionality and aesthetics to elevate every corner of your home. Discover the perfect items to reflect your unique style and create a warm, inviting atmosphere today.
        </p>
        <div className="mt-6 md:mt-8">
          <Link
            href="/products"
            className="bg-primary border border-primary text-white px-4 py-2 sm:px-6 sm:py-3 font-medium rounded-md hover:bg-transparent hover:text-primary transition duration-300"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Banner;