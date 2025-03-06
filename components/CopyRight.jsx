import React from 'react';
import Image from 'next/image';

const CopyRight = () => {
    return (
        <div className="bg-gray-800 py-4">
            <div className="container flex items-center justify-between">
                <p className="text-white">&copy; TailCommerce - All Rights Reserved</p>
                <div>
                    <Image 
                        src="/images/methods.png" 
                        alt="Payment Methods" 
                        width={250} 
                        height={300} 
                        className="h-5"
                    />
                </div>
            </div>
        </div>
    );
};

export default CopyRight;
