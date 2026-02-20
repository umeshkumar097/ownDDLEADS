"use client";

export default function FounderImage() {
    return (
        <img
            src="/founder.png"
            alt="Umesh Kumar, Founder"
            className="w-full h-full object-cover z-20"
            onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Umesh+Kumar&background=4f46e5&color=fff&size=512';
            }}
        />
    );
}
