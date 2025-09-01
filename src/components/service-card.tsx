import React from 'react';
import PayloadImage from '@/components/ui/PayloadImage';
import Link from 'next/link';

interface ServiceCardProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
  href: string;
}

export function ServiceCard({ imageSrc, imageAlt, title, description, href }: ServiceCardProps) {
  return (
    <div className="relative w-full max-w-md h-[500px]">
      <div className="absolute inset-x-0 top-0 h-[270px] overflow-hidden">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="absolute right-0 top-[190px] w-[90%] p-6 flex flex-col gap-2 bg-[#F5F9FF] shadow-sm rounded-[20px_0_20px_20px] min-h-[280px]">
        <h3 className="font-bold text-2xl text-black">{title}</h3>
        <p className="font-light text-lg text-gray-800">{description}</p>
        <div className="mt-auto pt-4">
          <Link 
            href={href}
            className="bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-md inline-block text-center w-full transition-colors"
          >
            Več informacij
          </Link>
        </div>
      </div>
    </div>
  );
} 