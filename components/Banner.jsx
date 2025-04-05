import React from "react";
import Link from "next/link";

const Banner = () => {
  return (
    <div
      className="bg-cover bg-no-repeat bg-center py-36 px-4"
      style={{ backgroundImage: "url('/images/banner-bg.jpg')" }}
    >
      <div className="container">
        <h1 className="text-4xl md:text-6xl text-gray-800 font-medium mb-4 capitalize">
          Best collection for <br /> home decoration
        </h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam <br />
          accusantium perspiciatis, sapiente magni eos dolorum ex quos dolores odio.
        </p>
        <div className="mt-8">
          <Link
            href="/products"
            className="bg-primary border border-primary text-white px-6 py-3 font-medium rounded-md hover:bg-transparent hover:text-primary transition duration-300"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Banner;