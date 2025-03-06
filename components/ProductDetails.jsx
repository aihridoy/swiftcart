import React from 'react';
import Image from 'next/image';
import RelatedProducts from './RelatedProducts';

const ProductDetails = () => {
    return (
        <>
            <div className="container grid grid-cols-2 gap-6">
            <div>
                <Image 
                    src="/images/products/product1.jpg" 
                    alt="product" 
                    width={500} 
                    height={500} 
                    className="w-full"
                />
                <div className="grid grid-cols-5 gap-4 mt-4">
                    {Array.from({ length: 5 }, (_, index) => (
                        <Image 
                            key={index}
                            src={`/images/products/product${index + 2}.jpg`}
                            alt={`product${index + 2}`}
                            width={100}
                            height={100}
                            className="w-full cursor-pointer border"
                        />
                    ))}
                </div>
            </div>

            <div>
                <h2 className="text-3xl font-medium uppercase mb-2">Italian L Shape Sofa</h2>
                <div className="flex items-center mb-4">
                    <div className="flex gap-1 text-sm text-yellow-400">
                        {Array.from({ length: 5 }, (_, index) => (
                            <span key={index}><i className="fa-solid fa-star"></i></span>
                        ))}
                    </div>
                    <div className="text-xs text-gray-500 ml-3">(150 Reviews)</div>
                </div>
                <div className="space-y-2">
                    <p className="text-gray-800 font-semibold space-x-2">
                        <span>Availability: </span>
                        <span className="text-green-600">In Stock</span>
                    </p>
                    <p className="space-x-2">
                        <span className="text-gray-800 font-semibold">Brand: </span>
                        <span className="text-gray-600">Apex</span>
                    </p>
                    <p className="space-x-2">
                        <span className="text-gray-800 font-semibold">Category: </span>
                        <span className="text-gray-600">Sofa</span>
                    </p>
                    <p className="space-x-2">
                        <span className="text-gray-800 font-semibold">SKU: </span>
                        <span className="text-gray-600">BE45VGRT</span>
                    </p>
                </div>
                <div className="flex items-baseline mb-1 space-x-2 font-roboto mt-4">
                    <p className="text-xl text-primary font-semibold">$45.00</p>
                    <p className="text-base text-gray-400 line-through">$55.00</p>
                </div>

                <p className="mt-4 text-gray-600">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos eius eum reprehenderit dolore vel mollitia...
                </p>

                <div className="mt-4">
                    <h3 className="text-sm text-gray-800 uppercase mb-1">Quantity</h3>
                    <div className="flex border border-gray-300 text-gray-600 divide-x divide-gray-300 w-max">
                        <div className="h-8 w-8 text-xl flex items-center justify-center cursor-pointer select-none">-</div>
                        <div className="h-8 w-8 text-base flex items-center justify-center">4</div>
                        <div className="h-8 w-8 text-xl flex items-center justify-center cursor-pointer select-none">+</div>
                    </div>
                </div>

                <div className="mt-6 flex gap-3 border-b border-gray-200 pb-5 pt-5">
                    <a href="#" className="bg-primary border border-primary text-white px-8 py-2 font-medium rounded uppercase flex items-center gap-2 hover:bg-transparent hover:text-primary transition">
                        <i className="fa-solid fa-bag-shopping"></i> Add to cart
                    </a>
                    <a href="#" className="border border-gray-300 text-gray-600 px-8 py-2 font-medium rounded uppercase flex items-center gap-2 hover:text-primary transition">
                        <i className="fa-solid fa-heart"></i> Wishlist
                    </a>
                </div>

                <div className="flex gap-3 mt-4">
                    {["facebook-f", "twitter", "instagram"].map((icon, index) => (
                        <a key={index} href="#" className="text-gray-400 hover:text-gray-500 h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center">
                            <i className={`fa-brands fa-${icon}`}></i>
                        </a>
                    ))}
                </div>
            </div>

            <div className="container pb-16">
                <h3 className="border-b border-gray-200 font-roboto text-gray-800 pb-3 font-medium">Product details</h3>
                <div className="w-3/5 pt-6 text-gray-600">
                    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit...</p>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit...</p>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit...</p>
                </div>
            </div>
        </div>
        <RelatedProducts />
        </>
    );
};

export default ProductDetails;
