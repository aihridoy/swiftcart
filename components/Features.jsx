import React from "react";
import Image from "next/image";

const features = [
  {
    imgSrc: "/images/icons/delivery-van.svg",
    title: "Free Shipping",
    description: "Order over $200",
  },
  {
    imgSrc: "/images/icons/money-back.svg",
    title: "Money Returns",
    description: "30 days money returns",
  },
  {
    imgSrc: "/images/icons/service-hours.svg",
    title: "24/7 Support",
    description: "Customer support",
  },
];

const Features = () => {
  return (
    <div className="container py-16">
      <div className="w-10/12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className="border border-primary rounded-sm px-5 py-6 flex justify-center items-center gap-5 bg-white shadow-sm"
          >
            <Image
              src={feature.imgSrc}
              alt={feature.title}
              width={48}
              height={48}
              className="object-contain"
            />
            <div>
              <h4 className="font-medium capitalize text-lg">{feature.title}</h4>
              <p className="text-gray-500 text-sm">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;