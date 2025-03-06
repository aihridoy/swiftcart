import React from 'react';
import Image from 'next/image';

const Ads = () => {
    return (
        <div className="container pb-16">
            <a href="#" className="relative block group">
                <Image 
                    src="/images/offer.jpg" 
                    alt="ads" 
                    layout="responsive" 
                    width={1200} 
                    height={500} 
                    className="transition-transform duration-300 group-hover:scale-105"
                />
            </a>
        </div>
    );
};

export default Ads;