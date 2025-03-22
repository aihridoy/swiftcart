'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const AboutUs = () => {
  // Team members data (you can replace with real data)
  const teamMembers = [
    {
      name: 'John Doe',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=500&fit=crop',
    },
    {
      name: 'Jane Smith',
      role: 'Head of Marketing',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop',
    },
    {
      name: 'Mike Johnson',
      role: 'Lead Designer',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&h=500&fit=crop',
    },
  ];

  return (
    <>
        <Header />
        <Navbar />
        <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-white">
        <div className="container py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl font-semibold text-gray-800 uppercase mb-4">
                About LWSkart
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                At LWSkart, we’re passionate about bringing you the best in home decor, fashion, electronics, and more. Our mission is to make shopping effortless, affordable, and enjoyable for everyone.
              </p>
              <Link href="/products">
                <button className="bg-red-500 text-white px-6 py-3 rounded-lg font-medium uppercase hover:bg-red-600 transition">
                  Shop Now
                </button>
              </Link>
            </div>
            <div className="relative h-96">
              <Image
                src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="About LWSkart"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="bg-white">
        <div className="container py-16">
          <h2 className="text-2xl font-medium text-gray-800 uppercase mb-6 text-center">
            Our Story
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="relative h-64">
              <Image
                src="https://images.unsplash.com/photo-1603201667141-5a2d4c673378?q=80&w=2096&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Our Story"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
            <div>
              <p className="text-gray-600 mb-4">
                LWSkart was founded in 2020 with a simple vision: to provide high-quality products that inspire and delight. What started as a small online store has grown into a trusted destination for shoppers worldwide.
              </p>
              <p className="text-gray-600">
                We pride ourselves on curating a diverse range of products, from stylish furniture to cutting-edge electronics, all while maintaining a commitment to exceptional customer service. Join us on our journey to redefine online shopping!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="bg-gray-100">
        <div className="container py-16">
          <h2 className="text-2xl font-medium text-gray-800 uppercase mb-6 text-center">
            Our Mission
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mb-4">
                <Image
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=100&fit=crop"
                  alt="Quality Products"
                  width={100}
                  height={100}
                  className="mx-auto rounded-full"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Quality Products
              </h3>
              <p className="text-gray-600">
                We source the best products to ensure you get quality and value with every purchase.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4">
                <Image
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&h=100&fit=crop"
                  alt="Customer Satisfaction"
                  width={100}
                  height={100}
                  className="mx-auto rounded-full"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Customer Satisfaction
              </h3>
              <p className="text-gray-600">
                Your happiness is our priority. We’re here to support you every step of the way.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4">
                <Image
                  src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=100&h=100&fit=crop"
                  alt="Affordable Prices"
                  width={100}
                  height={100}
                  className="mx-auto rounded-full"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Affordable Prices
              </h3>
              <p className="text-gray-600">
                We believe great products shouldn’t break the bank. Shop with confidence!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team Section */}
      <section className="bg-white">
        <div className="container py-16">
          <h2 className="text-2xl font-medium text-gray-800 uppercase mb-6 text-center">
            Meet the Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center">
                <div className="relative h-48 w-48 mx-auto mb-4">
                  <Image
                    src={member.image}
                    alt={member.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {member.name}
                </h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gray-100">
        <div className="container py-16 text-center">
          <h2 className="text-2xl font-medium text-gray-800 uppercase mb-4">
            Ready to Shop with LWSkart?
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Discover our wide range of products and start shopping today!
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/products">
              <button className="bg-red-500 text-white px-6 py-3 rounded-lg font-medium uppercase hover:bg-red-600 transition">
                Explore Products
              </button>
            </Link>
            <Link href="/contact">
              <button className="border border-red-500 text-red-500 px-6 py-3 rounded-lg font-medium uppercase hover:bg-red-500 hover:text-white transition">
                Contact Us
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
    <Footer />
    </>
  );
};

export default AboutUs;