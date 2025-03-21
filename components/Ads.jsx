import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Ads = () => {
    return (
        <div className="container pb-16">
            <Link href="/products" className="relative block group">
                <Image 
                    src="/images/offer.jpg" 
                    alt="ads" 
                    layout="responsive" 
                    width={1200} 
                    height={500} 
                    className="transition-transform duration-300 group-hover:scale-105"
                />
            </Link>
        </div>
    );
};

export default Ads;