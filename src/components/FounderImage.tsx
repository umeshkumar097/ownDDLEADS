import Image from 'next/image';

export default function FounderImage() {
    return (
        <Image
            src="/umesh.jpg"
            alt="Umesh Kumar, Founder"
            width={512}
            height={512}
            className="w-full h-full object-cover z-20"
            priority
        />
    );
}
