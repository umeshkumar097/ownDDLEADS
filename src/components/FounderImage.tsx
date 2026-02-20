"use client";

import { useState } from 'react';

export default function FounderImage() {
    const [imgSrc, setImgSrc] = useState('/founder.png');

    return (
        <img
            src={imgSrc}
            alt="Umesh Kumar, Founder"
            className="w-full h-full object-cover z-20"
            onError={() => {
                setImgSrc('https://ui-avatars.com/api/?name=Umesh+Kumar&background=4f46e5&color=fff&size=512');
            }}
        />
    );
}
